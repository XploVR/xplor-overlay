// server/api/docusign/auth-status.get.ts
export default defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, 'docusign_access_token')
    
    if (!accessToken) {
      return { 
        authenticated: false,
        message: 'No DocuSign access token found'
      }
    }

    // Try to validate the token by making a simple API call
    const cfg = useRuntimeConfig()
    const authBase = cfg.docusign?.authBaseUrl || 'https://account-d.docusign.com'
    
    try {
      const response = await $fetch(`${authBase}/oauth/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 10000
      })

      return { 
        authenticated: true,
        user: {
          name: response.name,
          email: response.email,
          accounts: response.accounts?.length || 0
        }
      }

    } catch (tokenError) {
      // Token is invalid or expired
      return { 
        authenticated: false,
        message: 'DocuSign token is invalid or expired'
      }
    }

  } catch (error) {
    console.error('[auth-status] Error:', error)
    return { 
      authenticated: false,
      error: error.message
    }
  }
})