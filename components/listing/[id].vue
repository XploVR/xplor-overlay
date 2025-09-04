<script setup lang="ts">
import { ref } from 'vue'

type P = {
  id: string
  title: string
  description: string
  address_line1: string
  city: string
  country: string
  lat: number | null
  lng: number | null
  status: 'draft' | 'active' | 'archived'
}

const route = useRoute()
const id = route.params.id as string

const { data: initial, error } = await useFetch<P>(`/api/properties`, {
  // Reuse list API then pick the row, or you can make a dedicated show endpoint later.
  // For now we’ll fetch list and filter in created().
  default: () => undefined
})

const form = ref<P | null>(null)
const saving = ref(false)
const saveErr = ref<string | null>(null)

onMounted(async () => {
  // Fetch a single row directly from Supabase (client) so we get full columns
  const { $supabase } = useNuxtApp()
  const { data, error } = await $supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  if (!error) form.value = data as P
})

async function save() {
  if (!form.value) return
  saveErr.value = null
  saving.value = true
  try {
    const body = {
      title: form.value.title,
      description: form.value.description,
      address_line1: form.value.address_line1,
      city: form.value.city,
      country: form.value.country,
      lat: form.value.lat,
      lng: form.value.lng,
      status: form.value.status
    }
    const updated = await $fetch(`/api/properties/${id}`, { method: 'PATCH', body })
    form.value = updated as P
  } catch (e: any) {
    saveErr.value = e?.data?.message || e?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Edit Listing</h1>
      <NuxtLink :to="`/spaces/${id}`" class="underline">View</NuxtLink>
    </div>

    <div v-if="!form" class="text-gray-600">Loading…</div>
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label class="block">
          <div class="text-sm font-medium">Title</div>
          <input v-model="form.title" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label class="block">
          <div class="text-sm font-medium">Status</div>
          <select v-model="form.status" class="mt-1 w-full border rounded px-3 py-2">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label class="block sm:col-span-2">
          <div class="text-sm font-medium">Description</div>
          <textarea v-model="form.description" rows="3" class="mt-1 w-full border rounded px-3 py-2"/>
        </label>
        <label class="block">
          <div class="text-sm font-medium">Address line 1</div>
          <input v-model="form.address_line1" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label class="block">
          <div class="text-sm font-medium">City</div>
          <input v-model="form.city" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label class="block">
          <div class="text-sm font-medium">Country</div>
          <input v-model="form.country" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label class="block">
          <div class="text-sm font-medium">Latitude</div>
          <input v-model.number="form.lat" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label class="block">
          <div class="text-sm font-medium">Longitude</div>
          <input v-model.number="form.lng" class="mt-1 w-full border rounded px-3 py-2" />
        </label>
      </div>

      <div class="flex items-center gap-3">
        <button @click="save" :disabled="saving" class="px-4 py-2 rounded bg-black text-white">
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
        <span v-if="saveErr" class="text-red-600">{{ saveErr }}</span>
      </div>

      <FormsMediaManager :property-id="id" />
    </template>
  </div>
</template>
