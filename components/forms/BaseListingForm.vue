<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ kind: 'real_estate' | 'yacht' | 'gallery' }>()
const emit = defineEmits<{ (e: 'created', value: any): void }>()

const title = ref('')
const description = ref('')
const address_line1 = ref('')
const city = ref('')
const country = ref('')
const lat = ref<string>('')   // keep as strings in inputs; cast before send
const lng = ref<string>('')

const pending = ref(false)
const errorMsg = ref<string | null>(null)

async function submit() {
  errorMsg.value = null

  // simple client-side required fields to match DB constraints
  const required = { title, description, address_line1, city, country }
  for (const [k, v] of Object.entries(required)) {
    if (!v.value || v.value.trim() === '') {
      errorMsg.value = `Please fill ${k.replace('_', ' ')}`
      return
    }
  }

  pending.value = true
  try {
    const created = await $fetch('/api/properties', {
      method: 'POST',
      body: {
        kind: props.kind,
        title: title.value,
        description: description.value,
        address_line1: address_line1.value,
        city: city.value,
        country: country.value,
        lat: lat.value ? Number(lat.value) : null,
        lng: lng.value ? Number(lng.value) : null,
      }
    })
    emit('created', created)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Failed to create draft'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label class="block">
        <div class="text-sm font-medium">Title *</div>
        <input v-model="title" class="mt-1 w-full border rounded px-3 py-2" placeholder="Cozy loftâ€¦" />
      </label>

      <label class="block">
        <div class="text-sm font-medium">Address line 1 *</div>
        <input v-model="address_line1" class="mt-1 w-full border rounded px-3 py-2" placeholder="123 Main St" />
      </label>

      <label class="block">
        <div class="text-sm font-medium">City *</div>
        <input v-model="city" class="mt-1 w-full border rounded px-3 py-2" placeholder="Palma" />
      </label>

      <label class="block">
        <div class="text-sm font-medium">Country *</div>
        <input v-model="country" class="mt-1 w-full border rounded px-3 py-2" placeholder="Spain" />
      </label>

      <label class="block sm:col-span-2">
        <div class="text-sm font-medium">Description *</div>
        <textarea v-model="description" class="mt-1 w-full border rounded px-3 py-2" rows="3" placeholder="Describe the spaceâ€¦"/>
      </label>

      <label class="block">
        <div class="text-sm font-medium">Latitude (optional)</div>
        <input v-model="lat" class="mt-1 w-full border rounded px-3 py-2" placeholder="39.5696" />
      </label>

      <label class="block">
        <div class="text-sm font-medium">Longitude (optional)</div>
        <input v-model="lng" class="mt-1 w-full border rounded px-3 py-2" placeholder="2.6502" />
      </label>
    </div>

    <div class="flex items-center gap-3">
      <button @click="submit" :disabled="pending" class="px-4 py-2 rounded bg-black text-white">
        {{ pending ? 'Creatingâ€¦' : 'Create draft' }}
      </button>
      <span v-if="errorMsg" class="text-red-600">{{ errorMsg }}</span>
    </div>
  </div>
</template>

