// server/api/docusign/recipient-view.post.ts (Improved timing handling)
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const token = getCookie(event, 'docusign_access_token')

  if (!token) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'No DocuSign token found. Please connect to DocuSign first.' 
    })
  }

  const raw = (await readBody<any>(event).catch(() => ({}))) || {}
  const envelopeId = String(raw.envelopeId || '').trim()
  const name       = String(raw.name || raw.userName || '').trim()
  const email      = String(raw.email || '').trim()
  const crewId     = String(raw.clientUserId || raw.crewId || '').trim()
  const recipientId = String(raw.recipientId || '1')

  if (!envelopeId || !name || !email || !crewId) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Missing required fields: envelopeId, name, email, or crewId' 
    })
  }

  // Resolve account + basePath from userinfo
  let accountId = cfg.docusign?.accountId || ''
  let basePath  = cfg.docusign?.basePath || 'https://demo.docusign.net/restapi'
  
  try {
    const authBase = cfg.docusign?.authBaseUrl || 'https://account-d.docusign.com'
    const ui = await axios.get(`${authBase}/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000
    })
    const acct = ui.data?.accounts?.find((a: any) => a.is_default) || ui.data?.accounts?.[0]
    if (acct) {
      accountId = accountId || acct.account_id
      basePath  = `${acct.base_uri}/restapi`
    }
  } catch (e: any) {
    console.warn('[recipient-view] userinfo lookup failed:', e?.response?.data || e?.message)
  }
  
  if (!accountId) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'DocuSign accountId could not be resolved.' 
    })
  }

  // Enhanced envelope status checking with retry logic
  const maxRetries = 6 // Try for up to 30 seconds (6 * 5 seconds)
  let attempt = 0
  let envelopeStatus = ''
  
  while (attempt < maxRetries) {
    try {
      const statusResp = await axios.get(
        `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
        { 
          headers: { Authorization: `Bearer ${token}` }, 
          timeout: 10000 
        }
      )
      
      envelopeStatus = String(statusResp.data?.status || '').toLowerCase()
      
      if (process.dev) {
        console.log(`[recipient-view] Attempt ${attempt + 1}: envelope status = "${envelopeStatus}"`)
      }

      // If envelope is ready, break out of loop
      if (envelopeStatus === 'sent' || envelopeStatus === 'delivered') {
        break
      }
      
      // If envelope is still being created, wait and retry
      if (envelopeStatus === 'created' && attempt < maxRetries - 1) {
        if (process.dev) {
          console.log(`[recipient-view] Envelope still processing, waiting 5 seconds... (attempt ${attempt + 1}/${maxRetries})`)
        }
        await new Promise(resolve => setTimeout(resolve, 5000))
        attempt++
        continue
      }
      
      // If we've exhausted retries or got an unexpected status
      if (envelopeStatus !== 'sent' && envelopeStatus !== 'delivered') {
        throw createError({ 
          statusCode: 400, 
          statusMessage: `Envelope status is "${envelopeStatus}" after ${attempt + 1} attempts. Must be "sent" or "delivered" to create recipient view. Please try again in a moment.` 
        })
      }
      
    } catch (statusError: any) {
      if (statusError.statusCode) {
        throw statusError // Re-throw our custom errors
      }
      
      console.error('[recipient-view] Status check failed:', statusError?.response?.data || statusError.message)
      throw createError({ 
        statusCode: 400, 
        statusMessage: `Failed to check envelope status: ${statusError?.response?.data?.message || statusError.message}` 
      })
    }
    
    attempt++
  }

  const returnBase = cfg.public?.embedReturnUrl || `${cfg.public?.appBaseUrl || 'http://localhost:3000'}/fairseas/thanks`

  const body = {
    returnUrl: `${returnBase}?envelopeId=${encodeURIComponent(envelopeId)}`,
    authenticationMethod: 'none',
    email,
    userName: name,
    clientUserId: crewId,
    recipientId,
    pingFrequency: '600',
    pingUrl: cfg.public?.appBaseUrl || 'http://localhost:3000'
  }

  if (process.dev) {
    console.log('[recipient-view] Creating recipient view with final status:', envelopeStatus)
    console.log('[recipient-view] Request body:', JSON.stringify(body, null, 2))
  }

  try {
    const { data } = await axios.post(
      `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-DocuSign-SDK': 'Nuxt-DirectAxios'
        },
        timeout: 30000
      }
    )

    if (process.dev) {
      console.log('[recipient-view] DocuSign returned URL successfully')
    }

    if (!data?.url) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'DocuSign did not return a signing URL.' 
      })
    }
    
    return { url: data.url }
    
  } catch (e: any) {
    const ds = e?.response?.data
    console.error('[recipient-view] DocuSign createRecipientView error:', ds || e?.message || e)
    
    // Provide specific error messages for common issues
    let errorMessage = ds?.message || ds?.errorDescription || e?.message || 'DocuSign createRecipientView failed.'
    
    if (errorMessage.includes('ENVELOPE_INVALID_STATUS')) {
      errorMessage = 'The envelope is still being processed by DocuSign. Please wait a moment and try again.'
    } else if (errorMessage.includes('RECIPIENT_NOT_FOUND')) {
      errorMessage = 'The recipient information does not match the envelope. Please check the details and try again.'
    } else if (errorMessage.includes('INVALID_CLIENT_USER_ID')) {
      errorMessage = 'The client user ID does not match the envelope recipient. Please try creating a new envelope.'
    }
    
    throw createError({
      statusCode: e?.response?.status || 500,
      statusMessage: errorMessage
    })
  }
})