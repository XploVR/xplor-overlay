export default defineEventHandler(() => {
  const cfg = useRuntimeConfig()
  return { public: cfg.public }
})
