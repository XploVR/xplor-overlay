// components/DocuSignEnvelopeFlow.vue (v13 - With processing wait)
<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">DocuSign Document Signing</h2>
    
    <!-- Step 1: Create Envelope -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Step 1: Create Document</h3>
      
      <form @submit.prevent="createEnvelope" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name *</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Email *</label>
            <input 
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Crew ID (optional)</label>
          <input 
            v-model="form.crewId"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <!-- Optional fields -->
        <details class="mt-4">
          <summary class="cursor-pointer text-sm font-medium text-gray-700 mb-2">
            Additional Information (Optional)
          </summary>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <input 
                v-model="form.role"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Yacht Name</label>
              <input 
                v-model="form.yachtName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Passport Number</label>
              <input 
                v-model="form.passportNumber"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Bank IBAN</label>
              <input 
                v-model="form.bankIban"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Bank SWIFT</label>
              <input 
                v-model="form.bankSwift"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </details>
        
        <button 
          type="submit"
          :disabled="loading.createEnvelope"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading.createEnvelope">Creating Document...</span>
          <span v-else>Create Document</span>
        </button>
      </form>
    </div>

    <!-- Step 2: Document Processing -->
    <div v-if="processingState.show" class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Step 2: Processing Document</h3>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded p-4">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
          <div class="flex-1">
            <p class="font-medium text-yellow-800">{{ processingState.message }}</p>
            <div class="w-full bg-yellow-200 rounded-full h-2 mt-2">
              <div 
                class="bg-yellow-600 h-2 rounded-full transition-all duration-1000"
                :style="{ width: processingState.progress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-yellow-600 mt-1">
              {{ Math.ceil(processingState.timeRemaining) }} seconds remaining
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Envelope Created -->
    <div v-if="envelope" class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Step 3: Document Ready</h3>
      
      <div class="bg-green-50 border border-green-200 rounded p-4 mb-4">
        <div class="flex items-center">
          <div class="text-green-600 mr-2">✓</div>
          <div>
            <p class="font-medium text-green-800">Document created and processed successfully!</p>
            <p class="text-sm text-green-600">Envelope ID: {{ envelope.envelopeId }}</p>
          </div>
        </div>
      </div>
      
      <button 
        @click="openForSigning"
        :disabled="loading.openSigning"
        class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading.openSigning">Opening...</span>
        <span v-else>Open for Signing</span>
      </button>
    </div>

    <!-- Step 4: Signing Interface -->
    <div v-if="signingUrl" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full h-full max-w-5xl max-h-[95vh] m-4 flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">DocuSign - Document Signing</h3>
          <button 
            @click="closeSigning"
            class="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div class="flex-1 p-4">
          <iframe 
            :src="signingUrl"
            class="w-full h-full border-0 rounded"
            @load="onSigningFrameLoad"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded p-4 mb-4">
      <div class="flex items-center">
        <div class="text-red-600 mr-2">⚠</div>
        <div class="flex-1">
          <p class="font-medium text-red-800">Error</p>
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
        <button 
          @click="error = null"
          class="text-red-500 hover:text-red-700 ml-4"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Loading States -->
    <div v-if="loading.createEnvelope && !processingState.show" class="text-center py-4">
      <div class="inline-flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
        <span class="text-gray-600">Creating document...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EnvelopeForm {
  name: string
  email: string
  crewId: string
  role: string
  yachtName: string
  passportNumber: string
  bankIban: string
  bankSwift: string
}

interface EnvelopeResult {
  envelopeId: string
  name: string
  email: string
  crewId: string
  isReady: boolean
  basePath: string
}

interface ProcessingState {
  show: boolean
  message: string
  progress: number
  timeRemaining: number
  startTime: number
}

// Reactive state
const form = ref<EnvelopeForm>({
  name: 'Johnny Drummond',
  email: 'info@xplor.io',
  crewId: '3e2890c9-7ec1-4d60-877d-bc7c964307cd',
  role: '',
  yachtName: '',
  passportNumber: '',
  bankIban: '',
  bankSwift: ''
})

const envelope = ref<EnvelopeResult | null>(null)
const signingUrl = ref<string | null>(null)
const error = ref<string | null>(null)

const loading = ref({
  createEnvelope: false,
  openSigning: false
})

const processingState = ref<ProcessingState>({
  show: false,
  message: 'Document is being processed by DocuSign...',
  progress: 0,
  timeRemaining: 30,
  startTime: 0
})

// Processing timer
let processingTimer: NodeJS.Timeout | null = null

// Methods
const createEnvelope = async () => {
  loading.value.createEnvelope = true
  error.value = null
  
  try {
    const result = await $fetch('/api/docusign/create-envelope', {
      method: 'POST',
      body: form.value
    })
    
    // If envelope isn't immediately ready, show processing state
    if (!result.isReady) {
      showProcessingState()
      
      // Wait for DocuSign to process the envelope
      await waitForEnvelopeProcessing()
    }
    
    envelope.value = result
    
  } catch (err: any) {
    console.error('Envelope creation failed:', err)
    error.value = err.data?.message || err.message || 'Failed to create document'
  } finally {
    loading.value.createEnvelope = false
    hideProcessingState()
  }
}

const showProcessingState = () => {
  processingState.value = {
    show: true,
    message: 'DocuSign is processing your document...',
    progress: 0,
    timeRemaining: 30,
    startTime: Date.now()
  }
  
  // Start progress animation
  processingTimer = setInterval(() => {
    const elapsed = (Date.now() - processingState.value.startTime) / 1000
    const totalTime = 30 // 30 seconds total
    
    processingState.value.progress = Math.min((elapsed / totalTime) * 100, 95)
    processingState.value.timeRemaining = Math.max(totalTime - elapsed, 0)
    
    // Update message based on progress
    if (elapsed < 10) {
      processingState.value.message = 'Creating envelope in DocuSign...'
    } else if (elapsed < 20) {
      processingState.value.message = 'Processing document and preparing for signing...'
    } else {
      processingState.value.message = 'Finalizing document setup...'
    }
    
    if (elapsed >= totalTime) {
      processingState.value.progress = 100
      hideProcessingState()
    }
  }, 500)
}

const hideProcessingState = () => {
  if (processingTimer) {
    clearInterval(processingTimer)
    processingTimer = null
  }
  processingState.value.show = false
}

const waitForEnvelopeProcessing = async () => {
  // Wait 30 seconds for DocuSign to process the envelope
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 30000) // 30 seconds
  })
}

const openForSigning = async () => {
  if (!envelope.value) return
  
  loading.value.openSigning = true
  error.value = null
  
  try {
    const result = await $fetch('/api/docusign/recipient-view', {
      method: 'POST',
      body: {
        envelopeId: envelope.value.envelopeId,
        name: envelope.value.name,
        email: envelope.value.email,
        clientUserId: envelope.value.crewId
      }
    })
    
    signingUrl.value = result.url
    
  } catch (err: any) {
    console.error('Failed to open signing interface:', err)
    
    // Handle specific error cases
    if (err.data?.message?.includes('not yet sent') || 
        err.data?.message?.includes('ENVELOPE_INVALID_STATUS') ||
        err.data?.message?.includes('created')) {
      error.value = 'Document is still being processed by DocuSign. Please wait a moment and try again.'
      
      // Offer to retry after a short delay
      setTimeout(() => {
        if (error.value?.includes('still being processed')) {
          error.value += ' You can try again now.'
        }
      }, 10000)
    } else {
      error.value = err.data?.message || err.message || 'Failed to open signing interface'
    }
  } finally {
    loading.value.openSigning = false
  }
}

const closeSigning = () => {
  signingUrl.value = null
}

const onSigningFrameLoad = () => {
  console.log('Signing interface loaded')
}

// Listen for messages from DocuSign iframe
const handleDocuSignMessage = (event: MessageEvent) => {
  // Only accept messages from DocuSign domains
  const allowedOrigins = [
    'https://demo.docusign.net', 
    'https://na1.docusign.net', 
    'https://na2.docusign.net', 
    'https://na3.docusign.net'
  ]
  
  if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
    return
  }
  
  console.log('DocuSign message received:', event.data)
  
  // Handle different types of DocuSign messages
  if (event.data.type === 'signing_complete' || 
      event.data.action === 'signing_complete' ||
      event.data.event === 'signing_complete') {
    console.log('Document signing completed!')
    closeSigning()
    
    // Reset form for next document
    envelope.value = null
    
    // Show success message
    setTimeout(() => {
      alert('Document signed successfully!')
      
      // Optional: Reset form
      // form.value = { name: '', email: '', crewId: '', role: '', yachtName: '', passportNumber: '', bankIban: '', bankSwift: '' }
    }, 500)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('message', handleDocuSignMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleDocuSignMessage)
  hideProcessingState()
})

// Reset error when form changes
watch(form, () => {
  error.value = null
}, { deep: true })

// Auto-retry functionality
const retryOpenSigning = async () => {
  if (envelope.value && error.value?.includes('still being processed')) {
    error.value = null
    await openForSigning()
  }
}

// Expose retry function for manual retry
defineExpose({
  retryOpenSigning
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Progress bar animations */
.transition-all {
  transition: all 0.5s ease-in-out;
}
</style>