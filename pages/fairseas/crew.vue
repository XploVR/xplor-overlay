<!-- pages/fairseas/crew.vue (Fixed with proper reactive variables) -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useSupabaseUser } from '#imports'
import heroImage from '@/assets/images/yachts/crew/fairshare-hero.jpg'

useHead({
  title: 'FairSeas — Crew: Join & Get Paid',
  meta: [
    {
      name: 'description',
      content: 'Sign the FSA, verify your role, and set payout details. Crew share is 50% of Xplor\'s net charter commission.'
    }
  ]
})

// All reactive variables defined at the top
const user = useSupabaseUser()
const pdfPublicPath = '/fairseas/FSA.pdf'
const showAdvancedFlow = ref(false)
const signing = ref(false)
const connecting = ref(false)
const isConnected = ref(false)
const errorMsg = ref<string | null>(null)
const isDev = ref(process.dev)

type CrewForm = {
  name: string
  email: string
  crewId: string
  role: string
  yachtName: string
  passport: string
  iban: string
  swift: string
}

const crewForm = reactive<CrewForm>({
  name: '',
  email: '',
  crewId: '',
  role: '',
  yachtName: '',
  passport: '',
  iban: '',
  swift: ''
})

const isReady = computed(() => !!crewForm.name && !!crewForm.email && !!crewForm.crewId)

function makeGuestId() {
  return `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

function hydrateFromUser() {
  if (user.value) {
    crewForm.name =
      (user.value.user_metadata as any)?.full_name ||
      user.value.email?.split('@')[0] ||
      crewForm.name
    crewForm.email = user.value.email || crewForm.email
    crewForm.crewId = user.value.id || crewForm.crewId
  }
  if (!crewForm.crewId) crewForm.crewId = makeGuestId()
}

// Check DocuSign connection status
async function checkDocuSignConnection() {
  if (isDev.value) {
    console.log('[crew] Starting DocuSign status check...')
  }
  
  try {
    const response = await $fetch('/api/docusign/status', {
      method: 'GET'
    })
    
    if (isDev.value) {
      console.log('[crew] DocuSign status response:', response)
      console.log('[crew] response.ok:', response?.ok)
    }
    
    isConnected.value = response?.ok === true
    
    if (isDev.value) {
      console.log('[crew] isConnected.value is now:', isConnected.value)
    }
  } catch (err: any) {
    if (isDev.value) {
      console.log('[crew] DocuSign status check failed:', err)
    }
    isConnected.value = false
  }
}

// DocuSign connection handler
async function connectDocuSign() {
  connecting.value = true
  try {
    await navigateTo(`/api/docusign/login?next=${encodeURIComponent('/fairseas/crew')}`, { external: true })
  } catch (err) {
    console.error('DocuSign connection error:', err)
    errorMsg.value = 'Failed to connect to DocuSign. Please try again.'
  } finally {
    // Note: connecting.value will remain true until page redirects
  }
}

// Advanced flow methods
function openAdvancedFlow() {
  errorMsg.value = null
  if (!crewForm.crewId) crewForm.crewId = makeGuestId()
  if (!isReady.value) {
    errorMsg.value = 'Please enter your name and email first.'
    return
  }
  showAdvancedFlow.value = true
}

function closeAdvancedFlow() {
  showAdvancedFlow.value = false
}

function onDocumentSigned(data: any) {
  console.log('Document signed:', data)
  closeAdvancedFlow()
  navigateTo('/fairseas/thanks')
}

onMounted(() => {
  hydrateFromUser()
  checkDocuSignConnection()
})
watch(user, hydrateFromUser)

async function startSigning() {
  errorMsg.value = null
  if (!crewForm.crewId) crewForm.crewId = makeGuestId()
  if (!isReady.value) {
    errorMsg.value = 'Please enter your name and email first.'
    return
  }

  signing.value = true
  try {
    const created = await $fetch<{
      envelopeId: string
      name: string
      email: string
      crewId: string
    }>('/api/docusign/create-envelope', {
      method: 'POST',
      body: {
        name: crewForm.name.trim(),
        email: crewForm.email.trim(),
        crewId: crewForm.crewId,
        role: crewForm.role.trim(),
        yachtName: crewForm.yachtName.trim(),
        passportNumber: crewForm.passport.trim(),
        bankIban: crewForm.iban.trim(),
        bankSwift: crewForm.swift.trim(),
        pdfUrl: pdfPublicPath
      }
    })

    if (created.envelopeId) {
      console.log('[crew] envelope created:', created)
    }

    const view = await $fetch<{ url: string }>(
      '/api/docusign/recipient-view',
      {
        method: 'POST',
        body: {
          envelopeId: created.envelopeId,
          name: created.name,
          email: created.email,
          crewId: created.crewId,
          recipientId: '1'
        }
      }
    )

    if (view?.url) {
      console.log('[crew] recipient-view returned URL:', view?.url)
    }

    if (!view?.url) {
      throw new Error('No signing URL returned from server.')
    }

    await navigateTo(view.url, { external: true, replace: true })
  } catch (err: any) {
    const status = err?.statusCode || err?.response?.status
    if (status === 401) {
      await navigateTo(`/api/docusign/login?next=${encodeURIComponent('/fairseas/crew')}`, { external: true })
      return
    }

    const serverMessage =
      err?.data?.message ||
      err?.data?.error ||
      err?.message ||
      'Could not start signing.'
    errorMsg.value = serverMessage

    if (err) {
      console.error('[crew] startSigning error:', err)
    }
  } finally {
    signing.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero
      :hero-image="heroImage"
      title="Crew — Join & Get Paid"
      subtitle="Sign the FSA, verify your role, and set payout details. Crew share is 50% of Xplor's net charter commission."
    >
      <template #cta>
        <ClientOnly>
          <div class="flex flex-col items-center gap-3">
            <!-- Inline, bound inputs -->
            <div class="flex flex-wrap gap-2 justify-center mb-1">
              <input
                v-model.trim="crewForm.name"
                type="text"
                placeholder="Your name"
                autocomplete="name"
                required
                class="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/50"
              />
              <input
                v-model.trim="crewForm.email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                class="px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/50"
              />
            </div>

            <div class="flex flex-wrap gap-3 justify-center">
              <!-- Connect first to store a DocuSign token (PKCE) -->
              <button
                @click="connectDocuSign"
                :disabled="connecting"
                class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2"
              >
                <div v-if="connecting" class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span v-if="!connecting">Connect DocuSign</span>
                <span v-else>Connecting…</span>
              </button>

              <!-- Sign FSA Now button (opens advanced flow) -->
              <button
                @click="openAdvancedFlow"
                :disabled="!isReady"
                class="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 font-medium"
              >
                Sign FSA Now
              </button>

              <!-- Static PDF preview uses the same path -->
              <a
                :href="pdfPublicPath"
                target="_blank"
                rel="noopener"
                class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10"
              >
                View FSA PDF
              </a>
            </div>

            <p v-if="errorMsg" class="text-sm text-red-300">{{ errorMsg }}</p>
            
            <!-- Connection status message -->
            <p v-if="isConnected" class="text-sm text-green-400 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Connected to DocuSign
            </p>
            
            <!-- Debug info (remove in production) -->
            <div v-if="isDev" class="text-xs text-white/50 mt-2">
              <p>Debug: isConnected = {{ isConnected }}</p>
              <button @click="checkDocuSignConnection" class="underline">
                Test Status Check
              </button>
            </div>
          </div>
        </ClientOnly>
      </template>
    </FairSeasHero>

    <!-- Advanced Signing Modal -->
    <div v-if="showAdvancedFlow" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-black/95 border border-white/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-white/20">
          <div>
            <h3 class="text-xl font-semibold text-white">FairShare Agreement</h3>
            <p class="text-sm text-white/60">Enhanced signing experience with progress tracking</p>
          </div>
          <button
            @click="closeAdvancedFlow"
            class="text-white/60 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ×
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6">
          <DocuSignEnvelopeFlow
            :initial-form="{
              name: crewForm.name,
              email: crewForm.email,
              crewId: crewForm.crewId,
              role: crewForm.role,
              yachtName: crewForm.yachtName,
              passportNumber: crewForm.passport,
              bankIban: crewForm.iban,
              bankSwift: crewForm.swift
            }"
            :pdf-url="pdfPublicPath"
            theme="dark"
            @document-signed="onDocumentSigned"
            @close-modal="closeAdvancedFlow"
          />
        </div>
      </div>
    </div>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="crew" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Dark theme overrides for the DocuSign component */
.docusign-dark-theme :deep(.bg-white) {
  @apply bg-white/5 backdrop-blur-sm border border-white/10;
}

.docusign-dark-theme :deep(.text-gray-700) {
  @apply text-white/90;
}

.docusign-dark-theme :deep(.text-gray-600) {
  @apply text-white/70;
}

.docusign-dark-theme :deep(.text-gray-500) {
  @apply text-white/60;
}

.docusign-dark-theme :deep(.border-gray-300) {
  @apply border-white/20;
}

.docusign-dark-theme :deep(.bg-blue-500) {
  @apply bg-teal-500;
}

.docusign-dark-theme :deep(.hover\:bg-blue-600:hover) {
  @apply hover:bg-teal-600;
}

.docusign-dark-theme :deep(.bg-green-500) {
  @apply bg-teal-500;
}

.docusign-dark-theme :deep(.hover\:bg-green-600:hover) {
  @apply hover:bg-teal-600;
}

.docusign-dark-theme :deep(.bg-yellow-50) {
  @apply bg-yellow-500/10 border-yellow-500/20;
}

.docusign-dark-theme :deep(.text-yellow-800) {
  @apply text-yellow-300;
}

.docusign-dark-theme :deep(.text-yellow-600) {
  @apply text-yellow-400;
}

.docusign-dark-theme :deep(.bg-green-50) {
  @apply bg-green-500/10 border-green-500/20;
}

.docusign-dark-theme :deep(.text-green-800) {
  @apply text-green-300;
}

.docusign-dark-theme :deep(.text-green-600) {
  @apply text-green-400;
}

.docusign-dark-theme :deep(.bg-red-50) {
  @apply bg-red-500/10 border-red-500/20;
}

.docusign-dark-theme :deep(.text-red-800) {
  @apply text-red-300;
}

.docusign-dark-theme :deep(.text-red-600) {
  @apply text-red-400;
}

.docusign-dark-theme :deep(input) {
  @apply bg-white/10 border-white/20 text-white placeholder-white/50;
}

.docusign-dark-theme :deep(input:focus) {
  @apply border-teal-500 ring-teal-500/20;
}

.docusign-dark-theme :deep(.shadow) {
  @apply shadow-xl shadow-black/50;
}
</style>