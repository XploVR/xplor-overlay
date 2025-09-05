// server/api/docusign/client.ts
import * as docusign_esign from 'docusign-esign'

// Nuxt/Nitro (ESM) sometimes wraps CJS.
// This ensures we always get the namespace with classes on it.
const docusign: any = (docusign_esign as any).default ?? docusign_esign

export function getApiClient() {
  const apiClient = new docusign.ApiClient()
  apiClient.setBasePath('https://demo.docusign.net/restapi')
  return { docusign, apiClient }
}
