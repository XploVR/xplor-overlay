export default defineEventHandler(async (event) => {
  // If you kept useSoapInterface=false, DocuSign will POST JSON here.
  const payload = await readBody(event)
  // TODO: verify HMAC (Connect Key) if you enable it in DocuSign Connect.
  // Update your DB with envelope status → completed/declined/sent, etc.
  // Example:
  // const envelopeId = payload?.envelopeId
  // const status     = payload?.envelopeStatus
  // await someDB.updateEnvelope(envelopeId, status, payload)
  return 'OK'
})
