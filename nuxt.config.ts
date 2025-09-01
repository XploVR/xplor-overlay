// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  devtools: { enabled: true },

  components: [{ path: '~/components', pathPrefix: false }],

  // Tailwind + PostCSS (keep PostCSS here; remove postcss.config.js)
  css: ['~/assets/css/tailwind.css'],
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },


  // Runtime config (public is exposed to client)
  runtimeConfig: {
    public: {
      mapboxToken: process.env.MAPBOX_TOKEN || '', // set in .env (or leave empty to use MapLibre fallback)
      requireAuth: false,                          // keep auth OFF during dev
    },
  },

  // Nitro (server) config
  nitro: {
    // Mock Supabase server module so endpoints don't warn/error in no-auth dev
    alias: {
      '#supabase/server': fileURLToPath(new URL('./mocks/supabase-server.ts', import.meta.url)),
    },
    // Simple JSON storage for mock “DB”
    storage: {
      data: { driver: 'fs', base: '.data' },
    },
  },

  // Vite alias so both server & client resolve the mock module
  vite: {
    resolve: {
      alias: {
        '#supabase/server': fileURLToPath(new URL('./mocks/supabase-server.ts', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    server: {
      fs: { strict: false },
    },
  },

  // Pick up our local type augmentations (optional but nice)
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@types/node', 'vite/client', './types/nuxt.d.ts'],
      },
    },
  },

  // Set Nitro compatibility to silence the warning
  compatibilityDate: '2025-09-01',

  app: {
    head: {
      title: 'Xplor',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
