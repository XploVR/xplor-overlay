// server/api/docusign/create-multi-envelope.post.ts
import { readFile } from 'fs/promises'
import { join } from 'path'
import { contractConfigs, type ContractConfig } from '@/types/contracts'

interface CreateMultiEnvelopeRequest {
  contractId: string
  formData: Record<string, any>
  signers: Array<{
    role: string
    email?: string
    name?: string
    recipientId: string
  }>
}

interface CreateMultiEnvelopeResponse {
  envelopeId: string
  contractId: string
  signers: Array<{
    role: string
    email: string
    name: string
    recipientId: string
  }>
}

export default defineEventHandler(async (event): Promise<CreateMultiEnvelopeResponse> => {
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  // Get DocuSign credentials from cookies
  const access = getCookie(event, 'ds_access_token')
  const apiBase = getCookie(event, 'ds_api_base')
  const accountId = getCookie(event, 'ds_account_id')

  console.log('[create-multi-envelope] Checking DocuSign credentials:')
  console.log('[create-multi-envelope] access token:', access ? 'present' : 'missing')
  console.log('[create-multi-envelope] apiBase:', apiBase)
  console.log('[create-multi-envelope] accountId:', accountId)

  if (!access || !apiBase) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'DocuSign not connected. Please authenticate first.' 
    })
  }

  // Extract account ID from apiBase if not in cookie
  let finalAccountId = accountId
  if (!finalAccountId && apiBase) {
    // Try to extract from URL like: https://demo.docusign.net/restapi/v2.1/accounts/12345678
    const match = apiBase.match(/accounts\/([^\/]+)/)
    if (match) {
      finalAccountId = match[1]
    } else {
      // Try different pattern: full base URL
      const baseMatch = apiBase.match(/https:\/\/[^\/]+/)
      if (baseMatch) {
        // We'll get account ID from user info call
        try {
          const authBase = useRuntimeConfig().docusign.authBaseUrl
          const userInfo = await $fetch(`${authBase}/oauth/userinfo`, {
            headers: { Authorization: `Bearer ${access}` }
          })
          if (userInfo?.accounts?.length > 0) {
            finalAccountId = userInfo.accounts[0].account_id
            console.log('[create-multi-envelope] Got account ID from userinfo:', finalAccountId)
          }
        } catch (userInfoError) {
          console.error('[create-multi-envelope] Failed to get user info:', userInfoError)
        }
      }
    }
  }

  if (!finalAccountId) {
    console.error('[create-multi-envelope] No account ID found in any method')
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'DocuSign account ID not found. Please reconnect to DocuSign.' 
    })
  }

  console.log('[create-multi-envelope] Using account ID:', finalAccountId)

  const body = await readBody<CreateMultiEnvelopeRequest>(event)
  const { contractId, formData, signers } = body

  // Get contract configuration
  const contractConfig = contractConfigs[contractId]
  if (!contractConfig) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: `Contract configuration not found: ${contractId}` 
    })
  }

  try {
    // Read the PDF template
    const pdfPath = join(process.cwd(), 'public', contractConfig.pdfPath)
    const pdfBuffer = await readFile(pdfPath)
    const pdfBase64 = pdfBuffer.toString('base64')

    // Create envelope signers
    const envelopeSigners = createSigners(contractConfig, signers, formData)

    // Create DocuSign envelope definition
    const envelopeDefinition = {
      emailSubject: `${contractConfig.name} - Please Review and Sign`,
      emailBlurb: `Please review and sign the ${contractConfig.name}. This document is part of the FairSeas program.`,
      status: 'sent',
      
      // Document
      documents: [{
        documentId: '1',
        name: contractConfig.name,
        fileExtension: 'pdf',
        documentBase64: pdfBase64
      }],

      // Recipients
      recipients: {
        signers: envelopeSigners
      },

      // Workflow settings
      notification: {
        useAccountDefaults: false,
        reminders: {
          reminderEnabled: contractConfig.workflow.reminderEnabled,
          reminderDelay: contractConfig.workflow.reminderDelay.toString(),
          reminderFrequency: '2'
        },
        expirations: {
          expireEnabled: true,
          expireAfter: contractConfig.workflow.expirationDays.toString(),
          expireWarn: '2'
        }
      }
    }

    console.log('[create-multi-envelope] Creating envelope for:', contractConfig.name)
    console.log('[create-multi-envelope] Signers count:', envelopeSigners.length)

    // Create envelope via DocuSign API
    const createResponse = await $fetch(`${apiBase}/v2.1/accounts/${finalAccountId}/envelopes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json'
      },
      body: envelopeDefinition
    })

    if (!createResponse?.envelopeId) {
      throw new Error('Failed to create envelope - no envelope ID returned')
    }

    console.log('[create-multi-envelope] Envelope created:', createResponse.envelopeId)

    // Return the created envelope details
    return {
      envelopeId: createResponse.envelopeId,
      contractId: contractConfig.id,
      signers: envelopeSigners.map(signer => ({
        role: signer.roleName,
        email: signer.email,
        name: signer.name,
        recipientId: signer.recipientId
      }))
    }

  } catch (error: any) {
    console.error('[create-multi-envelope] Error:', error)
    
    if (error.response?.status === 401) {
      throw createError({ 
        statusCode: 401, 
        statusMessage: 'DocuSign authentication expired. Please reconnect.' 
      })
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || 'Failed to create envelope'
    })
  }
})

function createSigners(
  contractConfig: ContractConfig, 
  providedSigners: any[], 
  formData: Record<string, any>
) {
  return contractConfig.signers.map(signerConfig => {
    // Find provided signer data for this role
    const providedSigner = providedSigners.find(s => s.role === signerConfig.role)
    
    // Use provided data, fall back to config defaults, or form data
    const email = providedSigner?.email || 
                 signerConfig.email || 
                 getEmailFromFormData(signerConfig.role, formData)
    
    const name = providedSigner?.name || 
                signerConfig.name || 
                getNameFromFormData(signerConfig.role, formData)

    if (!email || !name) {
      throw new Error(`Missing required signer information for role: ${signerConfig.role}`)
    }

    // Create signer with tabs
    const signer: any = {
      email,
      name,
      recipientId: signerConfig.recipientId,
      roleName: signerConfig.role,
      routingOrder: signerConfig.order.toString(),
      tabs: createTabsForSigner(contractConfig, signerConfig.role, formData)
    }

    // Add client user ID for embedded signing (first signer only)
    if (signerConfig.order === 1) {
      signer.clientUserId = formData.crewId || generateClientUserId()
    }

    return signer
  })
}

function createTabsForSigner(
  contractConfig: ContractConfig, 
  signerRole: string, 
  formData: Record<string, any>
) {
  const tabs: any = {
    signHereTabs: [],
    dateSignedTabs: [],
    textTabs: [],
    emailTabs: []
  }

  const recipientId = getRecipientIdForRole(contractConfig, signerRole)

  // Add signature and date tabs for this signer
  tabs.signHereTabs.push({
    documentId: '1',
    pageNumber: '1',
    recipientId: recipientId,
    anchorString: `[[SIGNATURE::${signerRole}]]`,
    anchorXOffset: '20',
    anchorYOffset: '10',
    anchorIgnoreIfNotPresent: 'true'
  })

  tabs.dateSignedTabs.push({
    documentId: '1',
    pageNumber: '1',
    recipientId: recipientId,
    anchorString: `[[DATE::${signerRole}]]`,
    anchorXOffset: '20',
    anchorYOffset: '10',
    anchorIgnoreIfNotPresent: 'true'
  })

  // Add pre-filled text tabs based on form data
  const fieldMappings = getFieldMappingsForRole(signerRole, formData)
  fieldMappings.forEach(mapping => {
    tabs.textTabs.push({
      documentId: '1',
      pageNumber: '1',
      recipientId: recipientId,
      anchorString: mapping.placeholder,
      value: mapping.value,
      locked: true,
      required: false,
      anchorIgnoreIfNotPresent: 'true'
    })
  })

  return tabs
}

function getFieldMappingsForRole(role: string, formData: Record<string, any>) {
  const mappings: Array<{ placeholder: string, value: string }> = []

  // Common mappings based on role
  switch (role) {
    case 'CREW':
      if (formData.crewFullName) mappings.push({ placeholder: '[[FULLNAME::CREW]]', value: formData.crewFullName })
      if (formData.crewEmail) mappings.push({ placeholder: '[[EMAIL::CREW]]', value: formData.crewEmail })
      if (formData.crewTitle) mappings.push({ placeholder: '[[TITLE::CREW]]', value: formData.crewTitle })
      break
    case 'COMPANY':
      mappings.push({ placeholder: '[[FULLNAME::COMPANY]]', value: 'xplorVR Media Group - FZCO' })
      mappings.push({ placeholder: '[[EMAIL::COMPANY]]', value: 'contracts@xplor.io' })
      mappings.push({ placeholder: '[[TITLE::COMPANY]]', value: 'Authorized Representative' })
      break
  }

  // Contract-specific field mappings
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      const placeholder = `[[${key.toUpperCase()}]]`
      mappings.push({ placeholder, value: value.toString() })
    }
  })

  return mappings
}

function getEmailFromFormData(role: string, formData: Record<string, any>): string | undefined {
  switch (role) {
    case 'CREW': return formData.crewEmail
    case 'COMPANY': return 'contracts@xplor.io'
    case 'ESCROW_AGENT': return formData.escrowEmail
    default: return undefined
  }
}

function getNameFromFormData(role: string, formData: Record<string, any>): string | undefined {
  switch (role) {
    case 'CREW': return formData.crewFullName
    case 'COMPANY': return 'xplorVR Media Group - FZCO'
    case 'ESCROW_AGENT': return formData.escrowName
    default: return undefined
  }
}

function getRecipientIdForRole(contractConfig: ContractConfig, role: string): string {
  const signer = contractConfig.signers.find(s => s.role === role)
  return signer?.recipientId || '1'
}

function generateClientUserId(): string {
  return `client_${Math.random().toString(36).slice(2)}_${Date.now()}`
}