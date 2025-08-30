// server/api/debug-config.get.ts
export default defineEventHandler(() => {
  const { public: pub } = useRuntimeConfig()
  return pub           // returns only public keys
})
