// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

// Helpers to ensure absolute URLs for DocuSign return flow
const APP_BASE = process.env.PUBLIC_APP_BASE_URL || 'http://localhost:3001'

const EMBED_RETURN_URL = (() => {
  const raw = process.env.EMBED_RETURN_URL
  try {
    const u = raw ? new URL(raw, APP_BASE) : new URL('/fairseas/thanks', APP_BASE)
    return u.toString()
  } catch {
    return `${APP_BASE}/fairseas/thanks`
  }
})()

export default defineNuxtConfig({
  devtools: { enabled: true },

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/tailwind.css', '~/assets/css/fonts.css'],
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },

  modules: ['@nuxtjs/supabase'],

  runtimeConfig: {
    // 🔒 Server-only (server/api/*)
    docusign: {
      integrationKey:
        process.env.DOCUSIGN_INTEGRATION_KEY ||
        process.env.DS_INTEGRATION_KEY || '',
      clientSecret:
        process.env.DOCUSIGN_CLIENT_SECRET ||
        process.env.DS_CLIENT_SECRET || '',
      redirectUri:
        process.env.DOCUSIGN_REDIRECT_URI ||
        process.env.DS_REDIRECT_URI ||
        'http://localhost:3001/api/docusign/callback',

      authBaseUrl: process.env.DS_AUTH_BASE_URL || 'https://account-d.docusign.com',
      basePath: process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi',
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || process.env.DS_ACCOUNT_ID || '',

      // App specifics
      fsaTemplateId: process.env.DS_FSA_TEMPLATE_ID || '',
      fsaRoleName: process.env.DS_FSA_ROLE_NAME || 'Crew',
      webhookUrl: process.env.DS_WEBHOOK_URL || ''
    },

    // 🌐 Client + server
    public: {
      appBaseUrl: APP_BASE,
      embedReturnUrl: EMBED_RETURN_URL,

      mapboxToken: process.env.MAPBOX_TOKEN || '',
      requireAuth: false,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    redirect: false,
    cookieOptions: { sameSite: 'lax' },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  },

  nitro: {
    storage: { data: { driver: 'fs', base: '.data' } },

    // ✅ Keep these real packages available to the server runtime
    externals: { inline: ['docusign-esign', 'axios'] },

    routeRules: {
      '/api/docusign/**': { cors: true },
      '/api/fairseas/**': { cors: true },
      '/api/docusign/webhook': { cors: true },
    },
  },

  vite: {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    server: { fs: { strict: false } },

    // ✅ Ensure server build uses the real libs (not stubbed/externals-mangled)
    ssr: { noExternal: ['docusign-esign', 'axios'] },

    // ✅ Make sure dev optimizer grabs axios properly
    optimizeDeps: { include: ['axios'] },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@types/node', 'vite/client', './types/nuxt.d.ts'],
      },
    },
  },

  // Silence Nitro warning and lock behavior
  compatibilityDate: '2025-09-05',

  app: {
    head: {
      title: 'Xplor',
      htmlAttrs: { class: 'dark bg-black' },
      bodyAttrs: { class: 'bg-black text-white' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
