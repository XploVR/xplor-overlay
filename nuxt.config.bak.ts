// nuxt.config.ts
export default defineNuxtConfig({
  // Fix Nitro compatibility warning
  compatibilityDate: '2025-08-31',

  // Global styles
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/fonts.css',
    'mapbox-gl/dist/mapbox-gl.css',
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/supabase',
  ],

  /**
   * Runtime config
   * - top-level keys are PRIVATE (server-only)
   * - inside `public` are exposed to the client
   */
  runtimeConfig: {
    // Keep service role PRIVATE (never put this under `public`)
    supabaseServiceRole: process.env.NUXT_PUBLIC_SUPABASE_SERVICE_ROLE,

    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,
    },
  },

  // Nuxt Image defaults (optional)
  image: {
    dir: 'assets/images',
  },

  // You can turn these on later if you want partial SSR caching, etc.
  // routeRules: {
  //   '/spaces': { ssr: true, isr: 60 },
  //   '/spaces/**': { ssr: true, isr: 60 },
  // },

  // Devtools are handy during build-out; disable in prod
  devtools: { enabled: true },

  // TypeScript is auto by Nuxt; you can tighten options in tsconfig if needed
})
