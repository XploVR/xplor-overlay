// server/api/fairseas/crew-sign.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promises as fs } from 'node:fs'

export default defineEventHandler(async (event) => {
  // 1) Require a valid stored token from /api/docusign/callback
  const storage = useStorage('data')
  const token = await storage.getItem<any>('docusign/token')
  if (!token?.access_token || !token?.base_uri || !token?.account_id) {
    throw createError({ statusCode: 401, statusMessage: 'No stored token. Hit /api/docusign/login first.' })
  }
  if (token.expires_at && Date.now() >= token.expires_at) {
    throw createError({ statusCode: 401, statusMessage: 'Stored token expired. Hit /api/docusign/login again.' })
  }

  // 2) Read + normalize request body
  const body = await readBody<any>(event)
  // Your UI sends these keys (as per your logs)
  const name  = body.name       || body.crewFullName || ''
  const email = body.email      || body.crewEmail    || ''
  const crewId = body.crewId    || body.crew_id      || `guest_${Date.now()}`
  const role  = body.role       || body.crewRole     || ''
  const yacht = body.yachtName  || body.yacht        || ''
  const passport = body.passportNumber || body.passport || ''
  const iban  = body.bankIban   || body.payout?.iban || ''
  const swift = body.bankSwift  || body.payout?.swift || ''

  if (!name || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name, email' })
  }

  // 3) Build DocuSign REST base
  const baseRest = token.base_uri.endsWith('/restapi')
    ? token.base_uri
    : (token.base_uri.replace(/\/+$/, '') + '/restapi')
  const accountId = token.account_id

  // 4) Prefer a template if configured, else fall back to static PDF
  const cfg = useRuntimeConfig()
  const templateId = cfg.docusign.fsaTemplateId as string | undefined
  const templateRoleName = (cfg.docusign.fsaRoleName as string) || 'Crew'

  // Create envelope payload
  let envelopeDef: any

  if (templateId) {
    // --- Create from Template ---
    const tabs: any = {
      // Optional: prefill a few visible fields if your template has matching tab labels
      textTabs: [
        { tabLabel: 'CrewName', value: name },
        { tabLabel: 'CrewEmail', value: email },
        { tabLabel: 'CrewRole', value: role },
        { tabLabel: 'YachtName', value: yacht },
        { tabLabel: 'PassportNumber', value: passport },
        { tabLabel: 'IBAN', value: iban },
        { tabLabel: 'SWIFT', value: swift },
      ]
    }

    envelopeDef = {
      templateId,
      templateRoles: [
        {
          roleName: templateRoleName,
          name,
          email,
          clientUserId: crewId,       // enables embedded signing
          tabs
        }
      ],
      status: 'sent'
    }
  } else {
    // --- Fallback: static PDF @ /public/fairseas/FSA.pdf ---
    // Absolute path from project root
    const pdfPath = join(process.cwd(), 'public', 'fairseas', 'FSA.pdf')
    // Alternative resolution (for monorepos / adapters):
    // const pdfPath = fileURLToPath(new URL('../../../public/fairseas/FSA.pdf', import.meta.url))

    // Read and base64 encode
    const pdfBuffer = await fs.readFile(pdfPath).catch(() => null)
    if (!pdfBuffer) {
      throw createError({ statusCode: 500, statusMessage: `FSA.pdf not found at ${pdfPath}` })
    }

    // Place one SignHere on page 1 near the bottom as a safe default
    const signHere = {
      documentId: '1',
      pageNumber: '1',
      xPosition: '100',
      yPosition: '600'
    }

    envelopeDef = {
      emailSubject: 'FairSeas – FairShare Agreement (FSA)',
      documents: [
        {
          documentBase64: pdfBuffer.toString('base64'),
          name: 'FSA',
          fileExtension: 'pdf',
          documentId: '1'
        }
      ],
      recipients: {
        signers: [
          {
            name,
            email,
            recipientId: '1',
            routingOrder: '1',
            clientUserId: crewId,
            tabs: { signHereTabs: [signHere] }
          }
        ]
      },
      status: 'sent'
    }
  }

  // 5) Create the envelope
  const envelopeResp = await $fetch<any>(`${baseRest}/v2.1/accounts/${accountId}/envelopes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    },
    body: envelopeDef
  }).catch((e: any) => {
    // Surface DocuSign error details if present
    const msg = e?.data?.message || e?.data?.errorCode || e?.message || 'Envelope create failed'
    throw createError({ statusCode: 400, statusMessage: `DocuSign: ${msg}` })
  })

  const envelopeId = envelopeResp?.envelopeId
  if (!envelopeId) {
    throw createError({ statusCode: 400, statusMessage: 'No envelopeId returned' })
  }

  // 6) Embedded recipient view (signing URL)
  const returnUrl = cfg.public.embedReturnUrl || (cfg.public.appBaseUrl + '/fairseas/thanks')
  const viewReq = {
    returnUrl,
    authenticationMethod: 'none',
    email,
    userName: name,
    clientUserId: crewId
  }

  const viewResp = await $fetch<any>(`${baseRest}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json'
    },
    body: viewReq
  }).catch((e: any) => {
    const msg = e?.data?.message || e?.data?.errorCode || e?.message || 'Recipient view failed'
    throw createError({ statusCode: 400, statusMessage: `DocuSign: ${msg}` })
  })

  if (!viewResp?.url) {
    throw createError({ statusCode: 400, statusMessage: 'No recipient view URL returned' })
  }

  // 7) Done – return URL (client should redirect to it)
  return { envelopeId, url: viewResp.url }
})
