<!-- pages/fairseas/crew.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useSupabaseUser } from '#imports'
import heroImage from '@/assets/images/yachts/crew/fairshare-hero.jpg'

// Nuxt auto-imports navigateTo in script-setup
// (no manual import needed)

useHead({
  title: 'FairSeas — Crew: Join & Get Paid',
  meta: [
    {
      name: 'description',
      content:
        'Sign the FSA, verify your role, and set payout details. Crew share is 50% of Xplor’s net charter commission.'
    }
  ]
})

const user = useSupabaseUser()

// Use the exact same public path for viewing and for signing
const pdfPublicPath = '/fairseas/FSA.pdf'

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

onMounted(hydrateFromUser)
watch(user, hydrateFromUser)

const signing = ref(false)
const errorMsg = ref<string | null>(null)
const isReady = computed(() => !!crewForm.name && !!crewForm.email && !!crewForm.crewId)

async function startSigning() {
  errorMsg.value = null
  if (!crewForm.crewId) crewForm.crewId = makeGuestId()
  if (!isReady.value) {
    errorMsg.value = 'Please enter your name and email first.'
    return
  }

  signing.value = true
  try {
    // 1) Create the envelope — server returns envelopeId + the identity it used
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

    if (process.dev) {
      console.log('[crew] envelope created:', created)
    }

    // 2) Get embedded signing URL (server waits until envelope is "sent")
    const view = await $fetch<{ url: string }>(
      '/api/docusign/recipient-view',
      {
        method: 'POST',
        body: {
          envelopeId: created.envelopeId,
          name: created.name,
          email: created.email,
          // MUST be the same clientUserId used when creating the signer
          crewId: created.crewId,
          recipientId: '1'
        }
      }
    )

    if (process.dev) {
      console.log('[crew] recipient-view returned URL:', view?.url)
    }

    if (!view?.url) {
      throw new Error('No signing URL returned from server.')
    }

    // 3) Launch embedded signing (Nuxt-friendly external nav)
    await navigateTo(view.url, { external: true, replace: true })
  } catch (err: any) {
    const status = err?.statusCode || err?.response?.status
    if (status === 401) {
      // Not connected to DocuSign → connect first then come back
      await navigateTo(`/api/docusign/login?next=${encodeURIComponent('/fairseas/crew')}`, { external: true })
      return
    }

    // Try to surface the most useful message
    const serverMessage =
      err?.data?.message ||
      err?.data?.error ||
      err?.message ||
      'Could not start signing.'
    errorMsg.value = serverMessage

    if (process.dev) {
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
      subtitle="Sign the FSA, verify your role, and set payout details. Crew share is 50% of Xplor’s net charter commission."
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
              <a
                :href="`/api/docusign/login?next=${encodeURIComponent('/fairseas/crew')}`"
                class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600"
              >
                Connect DocuSign
              </a>

              <!-- Sign button -->
              <button
                @click="startSigning"
                :disabled="signing || !isReady"
                class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10 disabled:opacity-50"
              >
                <span v-if="!signing">Sign FSA Now</span>
                <span v-else>Preparing…</span>
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
          </div>
        </ClientOnly>
      </template>
    </FairSeasHero>

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
