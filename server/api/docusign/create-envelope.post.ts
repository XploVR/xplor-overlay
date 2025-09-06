// server/api/docusign/create-envelope.post.ts (Updated with Cookie Debug)
import * as docusign from 'docusign-esign'
import { getCookie, readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const ds  = cfg.docusign

  // Debug logging to check available cookies
  console.log('[create-envelope] Available cookies:')
  console.log('docusign_access_token:', getCookie(event, 'docusign_access_token') ? 'present' : 'missing')
  console.log('ds_access_token:', getCookie(event, 'ds_access_token') ? 'present' : 'missing')
  console.log('docusign_account_id:', getCookie(event, 'docusign_account_id'))
  console.log('ds_account_id:', getCookie(event, 'ds_account_id'))
  console.log('docusign_base_uri:', getCookie(event, 'docusign_base_uri'))
  console.log('ds_api_base:', getCookie(event, 'ds_api_base'))

  // Try both cookie naming conventions
  const accessToken = getCookie(event, 'docusign_access_token') || getCookie(event, 'ds_access_token')
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      message: 'Not connected to DocuSign. Click "Connect DocuSign" first.'
    })
  }

  let accountId = getCookie(event, 'docusign_account_id') || getCookie(event, 'ds_account_id') || ds.accountId || ''
  let basePath  = getCookie(event, 'docusign_base_uri') || getCookie(event, 'ds_api_base') || ds.basePath || 'https://demo.docusign.net/restapi'

  console.log('[create-envelope] Using access token from:', accessToken === getCookie(event, 'docusign_access_token') ? 'docusign_access_token' : 'ds_access_token')
  console.log('[create-envelope] Using account ID:', accountId, 'from:', accountId === getCookie(event, 'docusign_account_id') ? 'docusign_account_id' : 'ds_account_id')
  console.log('[create-envelope] Using base path:', basePath)

  const apiClient = new docusign.ApiClient()
  apiClient.setBasePath(basePath)
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)

  // ---------- Read inputs ----------
  console.log('[create-envelope] About to read request body...')
  let raw = {}
  try {
    raw = await readBody<any>(event) || {}
    console.log('[create-envelope] Request body read successfully:', Object.keys(raw))
  } catch (bodyError) {
    console.error('[create-envelope] Error reading request body:', bodyError)
    raw = {}
  }

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

  if (process.dev) {
    console.log('[create-envelope] Input validation passed:', {
      name: name,
      email: email,
      crewId: crewId,
      pdfUrl: pdfUrl,
      nameType: typeof name,
      emailType: typeof email,
      crewIdType: typeof crewId
    })
  }

  // ---------- Resolve account & base_uri if missing ----------
  if (!accountId || (!getCookie(event, 'docusign_base_uri') && !getCookie(event, 'ds_api_base'))) {
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
      // Also set the ds_ prefixed cookies for compatibility
      setCookie(event, 'ds_account_id', accountId, { httpOnly: true, sameSite: 'lax', path: '/' })
      setCookie(event, 'ds_api_base',  basePath,  { httpOnly: true, sameSite: 'lax', path: '/' })
      apiClient.setBasePath(basePath)
    } catch (userInfoError) {
      console.error('[create-envelope] UserInfo error:', userInfoError)
      throw createError({
        statusCode: 401,
        message: 'DocuSign session present but no account found. Please reconnect.'
      })
    }
  }

  if (process.dev) {
    console.log('[create-envelope] Using account:', accountId)
    console.log('[create-envelope] Base path:', basePath)
  }

  // ---------- Load PDF ----------
  let pdfBuffer: Buffer
  try {
    // Handle different PDF path formats
    let pdfPath = pdfUrl
    if (pdfPath.startsWith('/contracts/')) {
      // Contract system path
      const { readFile } = await import('node:fs/promises')
      const { join } = await import('node:path')
      const fullPath = join(process.cwd(), 'public', pdfPath)
      console.log('[create-envelope] Loading PDF from:', fullPath)
      pdfBuffer = await readFile(fullPath)
    } else {
      // Fallback to FSA PDF
      const { readFile } = await import('node:fs/promises')
      const { fileURLToPath } = await import('node:url')
      const fsUrl = new URL('../../../public/fairseas/FSA.pdf', import.meta.url)
      pdfBuffer = await readFile(fileURLToPath(fsUrl))
    }
  } catch (pdfError) {
    console.error('[create-envelope] PDF loading error:', pdfError)
    throw createError({
      statusCode: 400,
      message: `Could not load PDF: ${pdfUrl}`
    })
  }

  if (process.dev) {
    console.log('[create-envelope] PDF loaded, size:', pdfBuffer.length, 'bytes')
  }

  // ---------- Create Document ----------
  const document = new docusign.Document()
  document.documentBase64 = pdfBuffer.toString('base64')
  document.name = pdfUrl.includes('Crew_Participation') ? 'Crew Participation Agreement' : 'FairSeas FSA'
  document.fileExtension = 'pdf'
  document.documentId = '1'

  if (process.dev) {
    console.log('[create-envelope] Document created:', {
      name: document.name,
      documentId: document.documentId,
      fileExtension: document.fileExtension,
      hasBase64: !!document.documentBase64
    })
  }

  // ---------- Create Signer ----------
  const signHereTab = new docusign.SignHere()
  signHereTab.documentId = '1'
  signHereTab.pageNumber = '1'  // Changed from '2' to '1' - PDF only has 1 page
  signHereTab.recipientId = '1'
  signHereTab.xPosition = '150'
  signHereTab.yPosition = '550'

  const tabs = new docusign.Tabs()
  tabs.signHereTabs = [signHereTab]

  const signer = new docusign.Signer()
  signer.email = email
  signer.name = name
  signer.recipientId = '1'
  signer.clientUserId = crewId
  signer.routingOrder = '1'
  signer.tabs = tabs

  if (process.dev) {
    console.log('[create-envelope] SignHere tab:', {
      documentId: signHereTab.documentId,
      pageNumber: signHereTab.pageNumber,
      recipientId: signHereTab.recipientId,
      xPosition: signHereTab.xPosition,
      yPosition: signHereTab.yPosition
    })
    
    console.log('[create-envelope] Signer created successfully:', {
      email: signer.email,
      name: signer.name,
      recipientId: signer.recipientId,
      clientUserId: signer.clientUserId,
      routingOrder: signer.routingOrder,
      hasSignTab: !!(signer.tabs && signer.tabs.signHereTabs && signer.tabs.signHereTabs.length > 0),
      signTabCount: signer.tabs?.signHereTabs?.length || 0
    })
  }

  // ---------- Create Recipients ----------
  const recipients = new docusign.Recipients()
  recipients.signers = [signer]

  if (process.dev) {
    console.log('[create-envelope] Recipients created successfully:', {
      signersCount: recipients.signers?.length,
      firstSignerEmail: recipients.signers?.[0]?.email,
      firstSignerName: recipients.signers?.[0]?.name
    })
  }

  // ---------- Create custom fields ----------
  const customFields = new docusign.CustomFields({
    textCustomFields: [
      ...(role           ? [new docusign.TextCustomField({ name: 'role',           value: role,           required: 'false', show: 'false' })] : []),
      ...(yachtName      ? [new docusign.TextCustomField({ name: 'yachtName',      value: yachtName,      required: 'false', show: 'false' })] : []),
      ...(passportNumber ? [new docusign.TextCustomField({ name: 'passportNumber', value: passportNumber, required: 'false', show: 'false' })] : []),
      ...(bankIban       ? [new docusign.TextCustomField({ name: 'bankIban',       value: bankIban,       required: 'false', show: 'false' })] : []),
      ...(bankSwift      ? [new docusign.TextCustomField({ name: 'bankSwift',      value: bankSwift,      required: 'false', show: 'false' })] : []),
    ]
  })

  // ---------- Create Envelope Definition ----------
  const envelopeDefinition = new docusign.EnvelopeDefinition()
  envelopeDefinition.emailSubject = document.name.includes('Participation') ? 'FairSeas — Crew Participation Agreement' : 'FairSeas — FairShare Agreement (FSA)'
  envelopeDefinition.documents = [document]
  envelopeDefinition.recipients = recipients
  envelopeDefinition.customFields = customFields
  envelopeDefinition.status = 'sent'

  if (process.dev) {
    console.log('[create-envelope] Envelope definition validation passed')
    console.log('[create-envelope] Subject:', envelopeDefinition.emailSubject)
    console.log('[create-envelope] Documents count:', envelopeDefinition.documents?.length)
    console.log('[create-envelope] Signers count:', envelopeDefinition.recipients?.signers?.length)
  }

  const envelopesApi = new docusign.EnvelopesApi(apiClient)

  try {
    if (process.dev) {
      console.log('[create-envelope] Creating envelope directly in "sent" status...')
    }

    const createResult = await envelopesApi.createEnvelope(accountId, { 
      envelopeDefinition 
    })

    const envelopeId = createResult.envelopeId
    if (!envelopeId) {
      throw new Error('DocuSign did not return an envelope ID')
    }

    if (process.dev) {
      console.log('[create-envelope] Envelope created with ID:', envelopeId)
    }

    const envelopeInfo = await envelopesApi.getEnvelope(accountId, envelopeId)
    
    if (process.dev) {
      console.log('[create-envelope] Immediate envelope status:', envelopeInfo.status)
    }

    return {
      envelopeId,
      name,
      email,
      crewId,
      recipientId: '1',
      isReady: envelopeInfo.status === 'sent' || envelopeInfo.status === 'delivered',
      basePath,
      status: envelopeInfo.status
    }

  } catch (error: any) {
    const errorResponse = error?.response
    const errorData = errorResponse?.body || errorResponse?.data || errorResponse?.text
    
    console.error('[create-envelope] Full error details:', {
      status: errorResponse?.status,
      statusText: errorResponse?.statusText,
      data: errorData,
      url: errorResponse?.config?.url,
      method: errorResponse?.config?.method
    })

    let errorMessage = 'Failed to create envelope'
    let errorDetails = errorData

    try {
      if (typeof errorData === 'string' && errorData.startsWith('{')) {
        const parsed = JSON.parse(errorData)
        errorMessage = parsed.message || parsed.errorDescription || errorMessage
        errorDetails = parsed
        console.error('[create-envelope] Parsed DocuSign error:', parsed)
      }
    } catch (parseError) {
      console.error('[create-envelope] Could not parse error response:', parseError)
    }

    throw createError({
      statusCode: errorResponse?.status || 500,
      message: errorMessage,
      data: {
        details: errorDetails,
        envelope: {
          hasSubject: !!envelopeDefinition.emailSubject,
          hasDocuments: !!(envelopeDefinition.documents?.length),
          hasRecipients: !!(envelopeDefinition.recipients?.signers?.length),
          hasTabs: !!(signer.tabs?.signHereTabs?.length)
        }
      }
    })
  }
})