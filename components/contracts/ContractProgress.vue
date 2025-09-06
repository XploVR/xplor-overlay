<!-- components/contracts/ContractProgress.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { contractConfigs, type ContractInstance, type SignerInstance } from '@/types/contracts'

interface Props {
  contractInstance: ContractInstance
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark'
})

const contractConfig = computed(() => contractConfigs[props.contractInstance.contractId])

const progressPercentage = computed(() => {
  if (!props.contractInstance.signers.length) return 0
  
  const signedCount = props.contractInstance.signers.filter(s => s.status === 'signed').length
  return Math.round((signedCount / props.contractInstance.signers.length) * 100)
})

const currentStep = computed(() => {
  const pendingSigner = props.contractInstance.signers.find(s => 
    s.status === 'sent' || s.status === 'delivered'
  )
  return pendingSigner?.role || null
})

const nextSigner = computed(() => {
  const signers = [...props.contractInstance.signers].sort((a, b) => {
    const aConfig = contractConfig.value?.signers.find(s => s.role === a.role)
    const bConfig = contractConfig.value?.signers.find(s => s.role === b.role)
    return (aConfig?.order || 0) - (bConfig?.order || 0)
  })
  
  return signers.find(s => s.status === 'pending')
})

function getStatusColor(status: string): string {
  switch (status) {
    case 'signed': return props.theme === 'dark' ? 'text-green-400' : 'text-green-600'
    case 'sent':
    case 'delivered': return props.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
    case 'declined': return props.theme === 'dark' ? 'text-red-400' : 'text-red-600'
    default: return props.theme === 'dark' ? 'text-white/50' : 'text-gray-500'
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'signed': return '✓'
    case 'sent':
    case 'delivered': return '📧'
    case 'declined': return '❌'
    case 'pending': return '⏳'
    default: return '◯'
  }
}

function getOverallStatusColor(): string {
  switch (props.contractInstance.status) {
    case 'completed': return props.theme === 'dark' ? 'text-green-400' : 'text-green-600'
    case 'sent': return props.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
    case 'voided': return props.theme === 'dark' ? 'text-red-400' : 'text-red-600'
    default: return props.theme === 'dark' ? 'text-white/70' : 'text-gray-600'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div :class="theme === 'dark' ? 'bg-white/5 border border-white/10 rounded-xl p-6' : 'bg-white border border-gray-200 rounded-xl p-6 shadow-sm'">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h3 :class="theme === 'dark' ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'">
          {{ contractConfig?.name || 'Contract' }}
        </h3>
        <p :class="theme === 'dark' ? 'text-white/60 text-sm' : 'text-gray-600 text-sm'">
          Created {{ formatDate(contractInstance.createdAt) }}
        </p>
      </div>
      
      <div class="text-right">
        <div :class="getOverallStatusColor() + ' font-medium text-sm'">
          {{ contractInstance.status.toUpperCase() }}
        </div>
        <div :class="theme === 'dark' ? 'text-white/60 text-xs' : 'text-gray-600 text-xs'">
          {{ progressPercentage }}% Complete
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div :class="theme === 'dark' ? 'bg-white/10 rounded-full h-2' : 'bg-gray-200 rounded-full h-2'">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'"
          :style="{ width: `${progressPercentage}%` }">
        </div>
      </div>
    </div>

    <!-- Current Status -->
    <div v-if="currentStep || nextSigner" class="mb-6 p-4 rounded-lg" :class="theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'">
      <div v-if="currentStep" class="flex items-center gap-2 mb-2">
        <span class="text-yellow-400">🔄</span>
        <span :class="theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'">
          Waiting for: {{ contractConfig?.signers.find(s => s.role === currentStep)?.label }}
        </span>
      </div>
      
      <div v-if="nextSigner" class="flex items-center gap-2">
        <span class="text-blue-400">📋</span>
        <span :class="theme === 'dark' ? 'text-white/70' : 'text-gray-600'">
          Next: {{ contractConfig?.signers.find(s => s.role === nextSigner.role)?.label }}
        </span>
      </div>
    </div>

    <!-- Signers List -->
    <div class="space-y-3">
      <h4 :class="theme === 'dark' ? 'text-sm font-medium text-white/80 mb-3' : 'text-sm font-medium text-gray-700 mb-3'">
        Signing Progress
      </h4>
      
      <div v-for="signer in contractInstance.signers" :key="signer.role" 
           class="flex items-center justify-between p-3 rounded-lg"
           :class="theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'">
        
        <div class="flex items-center gap-3">
          <span class="text-lg">{{ getStatusIcon(signer.status) }}</span>
          <div>
            <div :class="theme === 'dark' ? 'font-medium text-white' : 'font-medium text-gray-900'">
              {{ contractConfig?.signers.find(s => s.role === signer.role)?.label || signer.role }}
            </div>
            <div :class="theme === 'dark' ? 'text-white/60 text-xs' : 'text-gray-600 text-xs'">
              {{ signer.email }}
            </div>
          </div>
        </div>
        
        <div class="text-right">
          <div :class="getStatusColor(signer.status) + ' font-medium text-sm'">
            {{ signer.status.charAt(0).toUpperCase() + signer.status.slice(1) }}
          </div>
          <div v-if="signer.signedAt" :class="theme === 'dark' ? 'text-white/50 text-xs' : 'text-gray-500 text-xs'">
            {{ formatDate(signer.signedAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="contractInstance.status === 'sent'" class="flex gap-3 mt-6 pt-4 border-t" :class="theme === 'dark' ? 'border-white/10' : 'border-gray-200'">
      <button 
        v-if="contractInstance.envelopeId"
        :class="theme === 'dark' 
          ? 'px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors' 
          : 'px-4 py-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 transition-colors'">
        View in DocuSign
      </button>
      
      <button 
        :class="theme === 'dark' 
          ? 'px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors' 
          : 'px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors'">
        Send Reminder
      </button>
    </div>

    <!-- Completion Message -->
    <div v-if="contractInstance.status === 'completed'" class="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
      <div class="flex items-center gap-2">
        <span class="text-green-400 text-lg">🎉</span>
        <span :class="theme === 'dark' ? 'text-green-300 font-medium' : 'text-green-700 font-medium'">
          Contract completed successfully!
        </span>
      </div>
      <p :class="theme === 'dark' ? 'text-green-400/80 text-sm mt-1' : 'text-green-600 text-sm mt-1'">
        All required signatures have been collected.
      </p>
    </div>
  </div>
</template>