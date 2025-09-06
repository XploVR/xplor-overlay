<!-- components/contracts/ContractSelector.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { contractConfigs, type ContractConfig } from '@/types/contracts'

interface Props {
  theme?: 'light' | 'dark'
  userRole?: 'crew' | 'broker' | 'owner' | 'escrow' | 'admin'
}

interface Emits {
  (e: 'contract-selected', contractId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  userRole: 'crew'
})

const emit = defineEmits<Emits>()

const selectedCategory = ref<string>('all')

// Filter contracts based on user role and category
const availableContracts = computed(() => {
  const contracts = Object.values(contractConfigs)
  
  let filtered = contracts
  
  // Filter by user role (admins see everything)
  if (props.userRole !== 'admin') {
    filtered = filtered.filter(contract => {
      switch (props.userRole) {
        case 'crew':
          return contract.category === 'crew'
        case 'broker':
          return ['broker', 'escrow'].includes(contract.category)
        case 'owner':
          return ['owner', 'broker', 'escrow'].includes(contract.category)
        case 'escrow':
          return contract.category === 'escrow'
        default:
          return true
      }
    })
  }
  
  // Filter by selected category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(contract => contract.category === selectedCategory.value)
  }
  
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const categories = computed(() => {
  const cats = new Set(Object.values(contractConfigs).map(c => c.category))
  return Array.from(cats).sort()
})

// Get complexity indicator based on number of signers and fields
function getComplexity(contract: ContractConfig): 'Simple' | 'Medium' | 'Complex' {
  const signerCount = contract.signers.length
  const fieldCount = contract.fields.length
  
  if (signerCount <= 2 && fieldCount <= 5) return 'Simple'
  if (signerCount <= 3 && fieldCount <= 10) return 'Medium'
  return 'Complex'
}

function getComplexityColor(complexity: string, theme: string): string {
  if (theme === 'dark') {
    switch (complexity) {
      case 'Simple': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'Complex': return 'text-red-400'
      default: return 'text-white/70'
    }
  } else {
    switch (complexity) {
      case 'Simple': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'Complex': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'crew': return '⚓'
    case 'broker': return '🤝'
    case 'owner': return '🛥️'
    case 'escrow': return '🏦'
    default: return '📄'
  }
}

function selectContract(contractId: string) {
  emit('contract-selected', contractId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-4">
      <h1 :class="theme === 'dark' ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-gray-900'">
        Contract Management Center
      </h1>
      <p :class="theme === 'dark' ? 'text-white/70 text-lg' : 'text-gray-600 text-lg'">
        Select a contract type to create and manage your FairSeas agreements
      </p>
    </div>

    <!-- Role indicator -->
    <div class="flex justify-center">
      <div :class="theme === 'dark' ? 'px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30' : 'px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30'">
        <span :class="theme === 'dark' ? 'text-teal-300 font-medium' : 'text-blue-700 font-medium'">
          Role: {{ userRole?.charAt(0).toUpperCase() + userRole?.slice(1) }}
        </span>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-2">
      <button @click="selectedCategory = 'all'"
              :class="selectedCategory === 'all' 
                ? (theme === 'dark' ? 'px-4 py-2 rounded-lg bg-teal-500 text-white' : 'px-4 py-2 rounded-lg bg-blue-500 text-white')
                : (theme === 'dark' ? 'px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20' : 'px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200')">
        All Categories
      </button>
      <button v-for="category in categories" :key="category"
              @click="selectedCategory = category"
              :class="selectedCategory === category 
                ? (theme === 'dark' ? 'px-4 py-2 rounded-lg bg-teal-500 text-white' : 'px-4 py-2 rounded-lg bg-blue-500 text-white')
                : (theme === 'dark' ? 'px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20' : 'px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200')">
        {{ getCategoryIcon(category) }} {{ category.charAt(0).toUpperCase() + category.slice(1) }}
      </button>
    </div>

    <!-- Contracts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="contract in availableContracts" :key="contract.id"
           @click="selectContract(contract.id)"
           :class="theme === 'dark' 
             ? 'group cursor-pointer p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200'
             : 'group cursor-pointer p-6 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200'">
        
        <!-- Contract Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ getCategoryIcon(contract.category) }}</span>
            <div>
              <h3 :class="theme === 'dark' ? 'font-semibold text-white group-hover:text-teal-300' : 'font-semibold text-gray-900 group-hover:text-blue-600'">
                {{ contract.name }}
              </h3>
              <span :class="theme === 'dark' ? 'text-xs text-white/50 uppercase tracking-wide' : 'text-xs text-gray-500 uppercase tracking-wide'">
                {{ contract.category }}
              </span>
            </div>
          </div>
          
          <!-- Complexity Badge -->
          <div :class="getComplexityColor(getComplexity(contract), theme) + ' text-xs font-medium px-2 py-1 rounded-full ' + (theme === 'dark' ? 'bg-white/10' : 'bg-gray-100')">
            {{ getComplexity(contract) }}
          </div>
        </div>

        <!-- Contract Description -->
        <p :class="theme === 'dark' ? 'text-white/70 text-sm mb-4 line-clamp-2' : 'text-gray-600 text-sm mb-4 line-clamp-2'">
          {{ contract.description }}
        </p>

        <!-- Contract Stats -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span :class="theme === 'dark' ? 'text-white/60' : 'text-gray-500'">Signers:</span>
            <span :class="theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'">
              {{ contract.signers.length }}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span :class="theme === 'dark' ? 'text-white/60' : 'text-gray-500'">Fields:</span>
            <span :class="theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'">
              {{ contract.fields.length }}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span :class="theme === 'dark' ? 'text-white/60' : 'text-gray-500'">Workflow:</span>
            <span :class="theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'">
              {{ contract.workflow.type === 'sequential' ? 'Sequential' : 'Parallel' }}
            </span>
          </div>
        </div>

        <!-- Dependencies -->
        <div v-if="contract.dependencies && contract.dependencies.length > 0" class="mt-4 pt-4 border-t" :class="theme === 'dark' ? 'border-white/10' : 'border-gray-200'">
          <span :class="theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-gray-500'">
            Requires: {{ contract.dependencies.map(dep => contractConfigs[dep]?.name).join(', ') }}
          </span>
        </div>

        <!-- Action Indicator -->
        <div class="flex items-center justify-center mt-4 pt-4 border-t" :class="theme === 'dark' ? 'border-white/10' : 'border-gray-200'">
          <span :class="theme === 'dark' ? 'text-teal-400 text-sm font-medium group-hover:text-teal-300' : 'text-blue-600 text-sm font-medium group-hover:text-blue-700'">
            Create Contract →
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="availableContracts.length === 0" class="text-center py-12">
      <div :class="theme === 'dark' ? 'text-white/40 text-6xl mb-4' : 'text-gray-300 text-6xl mb-4'">📄</div>
      <h3 :class="theme === 'dark' ? 'text-white/70 text-lg mb-2' : 'text-gray-600 text-lg mb-2'">
        No contracts available
      </h3>
      <p :class="theme === 'dark' ? 'text-white/50' : 'text-gray-500'">
        No contracts match your current role and selected category.
      </p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>