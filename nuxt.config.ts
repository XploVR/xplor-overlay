export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css', 'mapbox-gl/dist/mapbox-gl.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,   // 👈 important
    },
  },
})
