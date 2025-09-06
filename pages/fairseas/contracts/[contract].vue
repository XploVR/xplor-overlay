<!-- pages/fairseas/contracts/[contract].vue -->
<script setup lang="ts">
definePageMeta({ 
  layout: 'default'
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabaseUser } from '#imports'
import { contractConfigs } from '@/types/contracts'

const route = useRoute()
const user = useSupabaseUser()

const contractType = computed(() => route.params.contract as string)
const contractConfig = computed(() => contractConfigs[contractType.value])

// Form state
const formData = ref<Record<string, any>>({})
const submitting = ref(false)
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

// Set page title based on contract
useHead({
  title: computed(() => contractConfig.value ? `${contractConfig.value.name} - FairSeas` : 'Contract - FairSeas'),
  meta: [
    {
      name: 'description',
      content: computed(() => contractConfig.value?.description || 'FairSeas contract management')
    }
  ]
})

// Auto-populate form with user data
function hydrateFormFromUser() {
  if (user.value) {
    formData.value = {
      crewFullName: (user.value.user_metadata as any)?.full_name || user.value.email?.split('@')[0] || '',
      crewEmail: user.value.email || '',
      crewId: user.value.id || makeGuestId(),
      ...formData.value
    }
  }
}

function makeGuestId() {
  return `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

// Handle form submission
async function handleFormSubmission(data: { contractId: string, formData: Record<string, any>, signers: any[] }) {
  errorMsg.value = null
  successMsg.value = null
  submitting.value = true

  try {
    console.log('[DEBUG] Sending form data to API:', {
      name: data.formData.crewFullName || '',
      email: data.formData.crewEmail || '',
      crewId: data.formData.crewId || makeGuestId(),
      pdfUrl: contractConfig.value?.pdfPath
    })

    // Create envelope using the updated API structure
    const created = await $fetch('/api/docusign/create-envelope', {
      method: 'POST',
      body: {
        name: data.formData.crewFullName || '',
        email: data.formData.crewEmail || '',
        crewId: data.formData.crewId || makeGuestId(),
        role: data.formData.crewTitle || '',
        yachtName: data.formData.yachtName || '',
        passportNumber: data.formData.passportNumber || '',
        bankIban: data.formData.iban || '',
        bankSwift: data.formData.swift || '',
        pdfUrl: contractConfig.value?.pdfPath || '/fairseas/FSA.pdf'
      }
    })

    console.log('[contract] Envelope created:', created)

    // Get embedded signing URL for the first signer (usually the user)
    const primarySigner = data.signers.find(s => s.recipientId === '1')
    if (primarySigner) {
      const view = await $fetch('/api/docusign/recipient-view', {
        method: 'POST',
        body: {
          envelopeId: created.envelopeId,
          name: primarySigner.name,
          email: primarySigner.email,
          crewId: data.formData.crewId || makeGuestId(),
          recipientId: '1'
        }
      })

      if (view?.url) {
        // Launch embedded signing
        await navigateTo(view.url, { external: true, replace: true })
        return
      }
    }

    // If no embedded signing, show success message
    successMsg.value = `${contractConfig.value?.name} created successfully! Check your email for signing instructions.`
    
    // Redirect to contracts overview after a delay
    setTimeout(() => {
      navigateTo('/fairseas/contracts')
    }, 3000)

  } catch (err: any) {
    console.error('[DEBUG] API Error details:', err)
    console.error('[DEBUG] Error status:', err?.statusCode || err?.response?.status)
    console.error('[DEBUG] Error data:', err?.data)
    console.error('[contract] Submission error:', err)
    
    const status = err?.statusCode || err?.response?.status
    if (status === 401) {
      // Not connected to DocuSign - but let's show error first, don't redirect immediately
      errorMsg.value = 'DocuSign authentication required. Please connect DocuSign first.'
      console.log('[DEBUG] Would redirect to DocuSign login, but showing error instead')
      // Comment out the redirect for debugging:
      // await navigateTo(`/api/docusign/login?next=${encodeURIComponent(route.fullPath)}`, { external: true })
      // return
    } else {
      errorMsg.value = err?.data?.message || err?.message || 'Failed to create contract. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}

// Handle back navigation
function handleBackClick() {
  navigateTo('/fairseas/contracts')
}

onMounted(() => {
  // Check if contract type is valid
  if (!contractConfig.value) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: `Contract type "${contractType.value}" not found` 
    })
  }
  
  hydrateFormFromUser()
})

// Watch for user changes
watch(user, hydrateFormFromUser)
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <div class="container-x py-8">
      <!-- Error Message -->
      <div v-if="errorMsg" class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-lg">❌</span>
          <span class="text-red-300 font-medium">Error Creating Contract</span>
        </div>
        <p class="text-red-400/80 text-sm mt-1">{{ errorMsg }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMsg" class="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <div class="flex items-center gap-2">
          <span class="text-green-400 text-lg">✅</span>
          <span class="text-green-300 font-medium">Success!</span>
        </div>
        <p class="text-green-400/80 text-sm mt-1">{{ successMsg }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="submitting" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-black/95 border border-white/20 rounded-xl p-8 text-center">
          <div class="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold text-white mb-2">Creating Contract</h3>
          <p class="text-white/70">Please wait while we prepare your {{ contractConfig?.name }}...</p>
        </div>
      </div>

      <!-- Contract Form -->
      <DynamicContractForm 
        :contract-type="contractType"
        :initial-data="formData"
        theme="dark"
        @form-submitted="handleFormSubmission"
        @back-clicked="handleBackClick" />
    </div>
  </div>
</template>