<!-- pages/fairseas/contracts/index.vue -->
<script setup lang="ts">
definePageMeta({ 
  layout: 'default',
  title: 'FairSeas Contracts'
})

import { ref, computed, onMounted } from 'vue'
import { useSupabaseUser } from '#imports'
import type { ContractInstance } from '@/types/contracts'

useHead({
  title: 'FairSeas — Contract Management',
  meta: [
    {
      name: 'description',
      content: 'Manage your FairSeas contracts and agreements. Create, sign, and track contract progress.'
    }
  ]
})

const user = useSupabaseUser()
const selectedView = ref<'create' | 'active' | 'completed'>('create')
const userContracts = ref<ContractInstance[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Determine user role based on email domain or other logic
const userRole = computed(() => {
  if (!user.value?.email) return 'crew'
  
  // Add your role determination logic here
  if (user.value.email.includes('@xplor.io')) return 'admin'
  if (user.value.email.includes('@broker')) return 'broker'
  if (user.value.email.includes('@owner')) return 'owner'
  if (user.value.email.includes('@escrow')) return 'escrow'
  
  // Default to crew for regular users
  return 'crew'
})

const activeContracts = computed(() => 
  userContracts.value.filter(c => c.status === 'sent' || c.status === 'draft')
)

const completedContracts = computed(() => 
  userContracts.value.filter(c => c.status === 'completed')
)

const voidedContracts = computed(() => 
  userContracts.value.filter(c => c.status === 'voided')
)

// Handle contract selection from ContractSelector
function handleContractSelected(contractId: string) {
  navigateTo(`/fairseas/contracts/${contractId}`)
}

// Load user's existing contracts
async function loadUserContracts() {
  if (!user.value) return
  
  loading.value = true
  errorMsg.value = null
  
  try {
    const response = await $fetch('/api/fairseas/user-contracts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.value.id}`
      }
    })
    
    userContracts.value = response || []
  } catch (error: any) {
    console.error('Failed to load contracts:', error)
    errorMsg.value = 'Failed to load your contracts. Please try again.'
    userContracts.value = []
  } finally {
    loading.value = false
  }
}

// Refresh contracts data
function refreshContracts() {
  loadUserContracts()
}

// Check DocuSign connection status
async function checkDocuSignStatus() {
  try {
    const response = await $fetch('/api/docusign/status')
    return response?.ok === true
  } catch {
    return false
  }
}

const isDocuSignConnected = ref(false)

onMounted(async () => {
  await loadUserContracts()
  isDocuSignConnected.value = await checkDocuSignStatus()
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <div class="container-x py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">FairSeas Contract Center</h1>
        <p class="text-white/70 text-lg max-w-2xl mx-auto">
          Manage all your FairSeas agreements in one place. Create new contracts, track signing progress, and view completed documents.
        </p>
      </div>

      <!-- DocuSign Connection Status -->
      <div class="flex justify-center mb-6">
        <div v-if="isDocuSignConnected" class="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
          <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-green-300 font-medium">Connected to DocuSign</span>
        </div>
        <div v-else class="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30">
          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="text-yellow-300 font-medium">DocuSign Not Connected</span>
          <a href="/api/docusign/login?next=/fairseas/contracts" class="ml-2 text-yellow-200 hover:text-yellow-100 underline">Connect</a>
        </div>
      </div>

      <!-- User Role & Stats -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-6">
          <div class="px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30">
            <span class="text-teal-300 font-medium">Role: {{ userRole.charAt(0).toUpperCase() + userRole.slice(1) }}</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-white/60">
            <span>Active: {{ activeContracts.length }}</span>
            <span>Completed: {{ completedContracts.length }}</span>
            <span v-if="voidedContracts.length > 0">Voided: {{ voidedContracts.length }}</span>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span class="text-red-300 font-medium">{{ errorMsg }}</span>
          </div>
          <button @click="refreshContracts" class="text-red-300 hover:text-red-200 underline">
            Try Again
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-8">
        <div class="flex bg-white/10 rounded-lg p-1">
          <button @click="selectedView = 'create'"
                  :class="selectedView === 'create' 
                    ? 'px-6 py-2 rounded-md bg-teal-500 text-white font-medium transition-all' 
                    : 'px-6 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all'">
            Create New
          </button>
          <button @click="selectedView = 'active'"
                  :class="selectedView === 'active' 
                    ? 'px-6 py-2 rounded-md bg-teal-500 text-white font-medium transition-all' 
                    : 'px-6 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all'">
            Active
            <span v-if="activeContracts.length > 0" class="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">
              {{ activeContracts.length }}
            </span>
          </button>
          <button @click="selectedView = 'completed'"
                  :class="selectedView === 'completed' 
                    ? 'px-6 py-2 rounded-md bg-teal-500 text-white font-medium transition-all' 
                    : 'px-6 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all'">
            Completed
            <span v-if="completedContracts.length > 0" class="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">
              {{ completedContracts.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Create New Contracts View -->
      <div v-if="selectedView === 'create'" class="mb-8">
        <ContractSelector 
          theme="dark" 
          :user-role="userRole"
          @contract-selected="handleContractSelected" />
      </div>

      <!-- Active Contracts View -->
      <div v-else-if="selectedView === 'active'">
        <div v-if="loading" class="text-center py-12">
          <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white/70">Loading active contracts...</p>
        </div>

        <div v-else-if="activeContracts.length > 0" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Active Contracts</h2>
            <button @click="refreshContracts" 
                    class="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
          
          <ContractProgress 
            v-for="contract in activeContracts" 
            :key="contract.id"
            :contract-instance="contract"
            theme="dark" />
        </div>

        <div v-else class="text-center py-12">
          <div class="text-white/40 text-6xl mb-4">📋</div>
          <h3 class="text-white/70 text-lg mb-2">No active contracts</h3>
          <p class="text-white/50 mb-6">You don't have any contracts currently in progress.</p>
          <button @click="selectedView = 'create'"
                  class="px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">
            Create Your First Contract
          </button>
        </div>
      </div>

      <!-- Completed Contracts View -->
      <div v-else-if="selectedView === 'completed'">
        <div v-if="loading" class="text-center py-12">
          <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white/70">Loading completed contracts...</p>
        </div>

        <div v-else-if="completedContracts.length > 0" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Completed Contracts</h2>
            <div class="text-sm text-white/60">
              {{ completedContracts.length }} contract{{ completedContracts.length === 1 ? '' : 's' }} completed
            </div>
          </div>
          
          <ContractProgress 
            v-for="contract in completedContracts" 
            :key="contract.id"
            :contract-instance="contract"
            theme="dark" />
        </div>

        <div v-else class="text-center py-12">
          <div class="text-white/40 text-6xl mb-4">✅</div>
          <h3 class="text-white/70 text-lg mb-2">No completed contracts</h3>
          <p class="text-white/50">Completed contracts will appear here once all parties have signed.</p>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="mt-16 pt-8 border-t border-white/10">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">Quick Actions</h2>
          <p class="text-white/60">Common tasks and helpful links</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <!-- Crew Portal -->
          <NuxtLink to="/fairseas/crew" 
                    class="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">⚓</div>
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">Crew Portal</h3>
            <p class="text-white/60 text-sm">Access your crew dashboard and FSA signing</p>
          </NuxtLink>

          <!-- New Contract -->
          <button @click="selectedView = 'create'" 
                  class="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">📄</div>
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">New Contract</h3>
            <p class="text-white/60 text-sm">Create a new FairSeas agreement</p>
          </button>

          <!-- DocuSign Connection -->
          <a :href="`/api/docusign/login?next=${encodeURIComponent('/fairseas/contracts')}`"
             v-if="!isDocuSignConnected"
             class="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">🔗</div>
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">Connect DocuSign</h3>
            <p class="text-white/60 text-sm">Link your DocuSign account for signing</p>
          </a>

          <!-- Reconnect DocuSign (if connected but having issues) -->
          <a :href="`/api/docusign/login?next=${encodeURIComponent('/fairseas/contracts')}`"
             v-else
             class="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">Refresh DocuSign</h3>
            <p class="text-white/60 text-sm">Reconnect if having signing issues</p>
          </a>

          <!-- FairSeas Home -->
          <NuxtLink to="/fairseas" 
                    class="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">FairSeas Home</h3>
            <p class="text-white/60 text-sm">Return to FairSeas overview</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-12 text-center">
        <div class="max-w-2xl mx-auto p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 class="text-lg font-semibold text-white mb-2">Need Help?</h3>
          <p class="text-white/60 text-sm mb-4">
            If you have questions about contracts or need assistance with the signing process, our support team is here to help.
          </p>
          <a href="mailto:contracts@xplor.io" 
             class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.21a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>