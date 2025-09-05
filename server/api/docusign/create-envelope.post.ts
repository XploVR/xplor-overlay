// server/api/docusign/create-envelope.post.ts
import * as docusign from 'docusign-esign'
import { getCookie, readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const ds  = cfg.docusign

  const accessToken = getCookie(event, 'docusign_access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not connected to DocuSign. Click “Connect DocuSign” first.' })
  }

  let accountId = getCookie(event, 'docusign_account_id') || ds.accountId || ''
  let basePath  = getCookie(event, 'docusign_base_uri')   || ds.basePath   || 'https://demo.docusign.net/restapi'

  const apiClient = new docusign.ApiClient()
  apiClient.setBasePath(basePath)
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)

  // ---------- Read inputs ----------
  const raw = (await readBody<any>(event).catch(() => ({}))) || {}

  const name   = String(raw.name ?? '').trim()
  const email  = String(raw.email ?? '').trim()
  let crewId   = String(raw.crewId ?? '').trim()
  const pdfUrl = String(raw.pdfUrl ?? '').trim()

  // Optional business fields
  const role            = String(raw.role ?? '').trim()
  const yachtName       = String(raw.yachtName ?? '').trim()
  const passportNumber  = String(raw.passportNumber ?? '').trim()
  const bankIban        = String(raw.bankIban ?? '').trim()
  const bankSwift       = String(raw.bankSwift ?? '').trim()

  if (!name || !email) {
    throw createError({ statusCode: 400, message: 'Missing required fields: name, email.' })
  }
  if (!crewId) crewId = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`

  // ---------- Resolve account & base_uri if missing ----------
  if (!accountId || !getCookie(event, 'docusign_base_uri')) {
    try {
      const authBase = ds.authBaseUrl || 'https://account-d.docusign.com'
      const ui: any = await $fetch(new URL('/oauth/userinfo', authBase).toString(), {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const def = ui?.accounts?.find((a: any) => a.is_default) || ui?.accounts?.[0]
      accountId = accountId || def?.account_id
      const rest = `${def?.base_uri || ''}/restapi`
      if (!accountId || !rest) throw new Error('No account_id/base_uri in userinfo')
      basePath = rest
      setCookie(event, 'docusign_account_id', accountId, { httpOnly: true, sameSite: 'lax', path: '/' })
      setCookie(event, 'docusign_base_uri',  basePath,  { httpOnly: true, sameSite: 'lax', path: '/' })
      apiClient.setBasePath(basePath)
    } catch {
      throw createError({
        statusCode: 401,
        message: 'DocuSign session present but no account found. Please reconnect.'
      })
    }
  }

  // ---------- Load PDF (same file as public View link) ----------
  let pdfBuffer: Buffer
  try {
    const absolute = new URL(pdfUrl || '/fairseas/FSA.pdf', cfg.public.appBaseUrl).toString()
    const arr = await $fetch<ArrayBuffer>(absolute, { responseType: 'arrayBuffer' })
    pdfBuffer = Buffer.from(arr)
  } catch {
    const { readFile } = await import('node:fs/promises')
    const { fileURLToPath } = await import('node:url')
    const fsUrl = new URL('../../../public/fairseas/FSA.pdf', import.meta.url)
    pdfBuffer = await readFile(fileURLToPath(fsUrl))
  }

  const doc = new docusign.Document({
    documentBase64: pdfBuffer.toString('base64'),
    name: 'FairSeas FSA',
    fileExtension: 'pdf',
    documentId: '1'
  })

  // ---------- Tabs ----------
  const signHere = new docusign.SignHere({
    documentId: '1',
    pageNumber: '1',
    recipientId: '1',
    anchorString: '[[SIGN_HERE]]',
    anchorUnits: 'pixels',
    anchorXOffset: '0',
    anchorYOffset: '0',
    anchorIgnoreIfNotPresent: 'true',
    xPosition: '100',
    yPosition: '650'
  })

  const textTabs: docusign.Text[] = []
  if (role) textTabs.push(new docusign.Text({ documentId: '1', recipientId: '1', value: role,           anchorString: '[[ROLE]]',       anchorIgnoreIfNotPresent: 'true' }))
  if (yachtName) textTabs.push(new docusign.Text({ documentId: '1', recipientId: '1', value: yachtName,      anchorString: '[[YACHT_NAME]]', anchorIgnoreIfNotPresent: 'true' }))
  if (passportNumber) textTabs.push(new docusign.Text({ documentId: '1', recipientId: '1', value: passportNumber, anchorString: '[[PASSPORT]]',   anchorIgnoreIfNotPresent: 'true' }))
  if (bankIban) textTabs.push(new docusign.Text({ documentId: '1', recipientId: '1', value: bankIban,       anchorString: '[[IBAN]]',      anchorIgnoreIfNotPresent: 'true' }))
  if (bankSwift) textTabs.push(new docusign.Text({ documentId: '1', recipientId: '1', value: bankSwift,      anchorString: '[[SWIFT]]',     anchorIgnoreIfNotPresent: 'true' }))

  const signer = new docusign.Signer({
    email,
    name,
    recipientId: '1',
    clientUserId: crewId
  })
  signer.tabs = new docusign.Tabs({
    signHereTabs: [signHere],
    ...(textTabs.length ? { textTabs } : {})
  })

  const customFields = new docusign.CustomFields({
    textCustomFields: [
      ...(role           ? [new docusign.TextCustomField({ name: 'role',           value: role,           required: 'false', show: 'false' })] : []),
      ...(yachtName      ? [new docusign.TextCustomField({ name: 'yachtName',      value: yachtName,      required: 'false', show: 'false' })] : []),
      ...(passportNumber ? [new docusign.TextCustomField({ name: 'passportNumber', value: passportNumber, required: 'false', show: 'false' })] : []),
      ...(bankIban       ? [new docusign.TextCustomField({ name: 'bankIban',       value: bankIban,       required: 'false', show: 'false' })] : []),
      ...(bankSwift      ? [new docusign.TextCustomField({ name: 'bankSwift',      value: bankSwift,      required: 'false', show: 'false' })] : []),
    ]
  })

  const envelopesApi = new docusign.EnvelopesApi(apiClient)

  try {
    // Step 1: create in "created"
    const envelopeDefinition = new docusign.EnvelopeDefinition({
      emailSubject: 'FairSeas — FairShare Agreement (FSA)',
      documents: [doc],
      recipients: new docusign.Recipients({ signers: [signer] }),
      customFields,
      status: 'created'
    })

    const createResult = await envelopesApi.createEnvelope(accountId, { envelopeDefinition })
    const envelopeId = createResult.envelopeId
    if (!envelopeId) throw new Error('DocuSign did not return an envelope ID')

    if (process.dev) {
      console.log('[create-envelope] Envelope created:', envelopeId, 'basePath:', basePath)
    }

    // Step 2: mark as "sent"
    await envelopesApi.update(accountId, envelopeId, { envelope: { status: 'sent' } })

    // Step 3: wait until actually sent/delivered
    let isReady = false
    const started = Date.now()
    const maxMs = 15000

    async function getStatus(): Promise<string> {
      const env = await envelopesApi.getEnvelope(accountId, envelopeId)
      return String((env as any).status || '').toLowerCase()
    }

    while (!isReady && Date.now() - started < maxMs) {
      const s = await getStatus().catch(() => '')
      if (process.dev) console.log('[create-envelope] status:', s)
      if (s === 'sent' || s === 'delivered') isReady = true
      else await new Promise(r => setTimeout(r, 900))
    }

    return { envelopeId, name, email, crewId, recipientId: '1', isReady, basePath }
  } catch (error: any) {
    console.error('[create-envelope] Error:', error?.response?.data || error.message)
    throw createError({
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || error.message || 'Failed to create envelope'
    })
  }
})
