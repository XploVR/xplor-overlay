<!-- components/contracts/DynamicContractForm.vue -->
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { contractConfigs, type ContractConfig, type FieldConfig } from '@/types/contracts'

interface Props {
  contractType: string
  initialData?: Record<string, any>
  theme?: 'light' | 'dark'
}

interface Emits {
  (e: 'form-submitted', data: { contractId: string, formData: Record<string, any>, signers: any[] }): void
  (e: 'form-changed', data: Record<string, any>): void
  (e: 'back-clicked'): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark'
})

const emit = defineEmits<Emits>()

// Get contract configuration
const contractConfig = computed(() => contractConfigs[props.contractType])
const formData = reactive<Record<string, any>>({})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

// Group fields by their group property
const fieldGroups = computed(() => {
  if (!contractConfig.value) return {}
  
  const groups: Record<string, FieldConfig[]> = {}
  contractConfig.value.fields.forEach(field => {
    const group = field.group || 'general'
    if (!groups[group]) groups[group] = []
    groups[group].push(field)
  })
  return groups
})

// Validation
function validateField(field: FieldConfig, value: any): string | null {
  if (!field.validation) return null
  
  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return rule.message || `${field.label} is required`
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          return rule.message || 'Please enter a valid email address'
        }
        break
      case 'minLength':
        if (value && value.length < rule.value) {
          return rule.message || `${field.label} must be at least ${rule.value} characters`
        }
        break
      case 'pattern':
        if (value && !new RegExp(rule.value).test(value)) {
          return rule.message || `${field.label} format is invalid`
        }
        break
    }
  }
  return null
}

function validateForm(): boolean {
  errors.value = {}
  let isValid = true
  
  if (!contractConfig.value) return false
  
  contractConfig.value.fields.forEach(field => {
    if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
      errors.value[field.name] = `${field.label} is required`
      isValid = false
    }
    
    const error = validateField(field, formData[field.name])
    if (error) {
      errors.value[field.name] = error
      isValid = false
    }
  })
  
  return isValid
}

// Auto-populate from initial data
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData, newData)
  }
}, { immediate: true })

// Emit changes
watch(formData, (newData) => {
  emit('form-changed', { ...newData })
}, { deep: true })

// Form submission
async function handleSubmit() {
  if (!validateForm()) return
  
  submitting.value = true
  try {
    // Prepare signer data based on form input and config
    const signers = contractConfig.value!.signers.map(signer => ({
      ...signer,
      // Auto-populate known data
      email: signer.email || (signer.role === 'CREW' ? formData.crewEmail : undefined),
      name: signer.name || (signer.role === 'CREW' ? formData.crewFullName : undefined)
    }))
    
    emit('form-submitted', {
      contractId: contractConfig.value!.id,
      formData: { ...formData },
      signers
    })
  } finally {
    submitting.value = false
  }
}

// Group labels for better UX
const groupLabels: Record<string, string> = {
  general: 'General Information',
  personal: 'Personal Details',
  contact: 'Contact Information', 
  professional: 'Professional Details',
  banking: 'Banking & Payout Details',
  compliance: 'Compliance & Documentation',
  escrow: 'Escrow Agent Details',
  accounts: 'Account Information',
  charter: 'Charter Details',
  terms: 'Terms & Conditions',
  management: 'Management Details',
  vessel: 'Vessel Information'
}

function getInputClasses(hasError: boolean) {
  const base = 'w-full px-4 py-3 rounded-lg transition-colors duration-200'
  if (props.theme === 'dark') {
    return `${base} bg-white/10 border ${hasError ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20`
  } else {
    return `${base} bg-white border ${hasError ? 'border-red-500' : 'border-gray-300'} text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`
  }
}

onMounted(() => {
  // Set default values for select fields if needed
  if (contractConfig.value) {
    contractConfig.value.fields.forEach(field => {
      if (field.type === 'select' && field.options && !formData[field.name]) {
        // Don't auto-select for required fields - let user choose
      }
    })
  }
})
</script>

<template>
  <div v-if="contractConfig" class="space-y-8">
    <!-- Back Button -->
    <button @click="emit('back-clicked')" 
            :class="theme === 'dark' ? 'flex items-center gap-2 text-white/70 hover:text-white transition-colors' : 'flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Contract Selection
    </button>

    <!-- Contract Header -->
    <div class="text-center space-y-2">
      <h2 :class="theme === 'dark' ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-900'">
        {{ contractConfig.name }}
      </h2>
      <p :class="theme === 'dark' ? 'text-white/70' : 'text-gray-600'">
        {{ contractConfig.description }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Render fields grouped by category -->
      <div v-for="(fields, groupKey) in fieldGroups" :key="groupKey" class="space-y-4">
        <h3 :class="theme === 'dark' ? 'text-lg font-semibold text-white border-b border-white/20 pb-2' : 'text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2'">
          {{ groupLabels[groupKey] || groupKey }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in fields" :key="field.name" 
               :class="field.type === 'textarea' ? 'md:col-span-2' : 'col-span-1'">
            
            <label :for="field.name" 
                   :class="theme === 'dark' ? 'block text-sm font-medium text-white/90 mb-2' : 'block text-sm font-medium text-gray-700 mb-2'">
              {{ field.label }}
              <span v-if="field.required" class="text-red-400">*</span>
            </label>

            <!-- Text Input -->
            <input v-if="field.type === 'text' || field.type === 'email' || field.type === 'number'"
                   :id="field.name"
                   v-model="formData[field.name]"
                   :type="field.type"
                   :placeholder="field.placeholder"
                   :class="getInputClasses(!!errors[field.name])"
                   :required="field.required" />

            <!-- Date Input -->
            <input v-else-if="field.type === 'date'"
                   :id="field.name"
                   v-model="formData[field.name]"
                   type="date"
                   :class="getInputClasses(!!errors[field.name])"
                   :required="field.required" />

            <!-- Textarea -->
            <textarea v-else-if="field.type === 'textarea'"
                      :id="field.name"
                      v-model="formData[field.name]"
                      :placeholder="field.placeholder"
                      rows="4"
                      :class="getInputClasses(!!errors[field.name])"
                      :required="field.required"></textarea>

            <!-- Select -->
            <select v-else-if="field.type === 'select'"
                    :id="field.name"
                    v-model="formData[field.name]"
                    :class="getInputClasses(!!errors[field.name])"
                    :required="field.required">
              <option value="">{{ field.required ? 'Select an option...' : 'Optional - Select if applicable...' }}</option>
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <!-- Error message -->
            <p v-if="errors[field.name]" class="mt-1 text-sm text-red-400">
              {{ errors[field.name] }}
            </p>
          </div>
        </div>
      </div>

      <!-- Signers Preview -->
      <div class="space-y-4">
        <h3 :class="theme === 'dark' ? 'text-lg font-semibold text-white border-b border-white/20 pb-2' : 'text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2'">
          Required Signatures
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="signer in contractConfig.signers" :key="signer.role"
               :class="theme === 'dark' ? 'p-4 rounded-lg bg-white/5 border border-white/10' : 'p-4 rounded-lg bg-gray-50 border border-gray-200'">
            <div class="flex items-center gap-2">
              <div :class="theme === 'dark' ? 'w-2 h-2 rounded-full bg-teal-400' : 'w-2 h-2 rounded-full bg-blue-500'"></div>
              <span :class="theme === 'dark' ? 'font-medium text-white' : 'font-medium text-gray-900'">
                {{ signer.label }}
              </span>
              <span v-if="!signer.required" :class="theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-gray-500'">
                (Optional)
              </span>
            </div>
            <p :class="theme === 'dark' ? 'text-sm text-white/70 mt-1' : 'text-sm text-gray-600 mt-1'">
              Order: {{ signer.order }}
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-6">
        <button type="submit" 
                :disabled="submitting"
                :class="theme === 'dark' 
                  ? 'px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 font-medium text-lg transition-all duration-200'
                  : 'px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 font-medium text-lg transition-all duration-200'">
          <span v-if="!submitting">Create Contract & Send for Signing</span>
          <span v-else class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Preparing Contract...
          </span>
        </button>
      </div>
    </form>
  </div>
  
  <div v-else :class="theme === 'dark' ? 'text-center text-white/70' : 'text-center text-gray-600'">
    <p>Contract configuration not found for: {{ contractType }}</p>
  </div>
</template>