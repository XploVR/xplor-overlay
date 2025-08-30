<script setup lang="ts">
import { ref } from 'vue'
import type { BaseListing, SpaceKind } from '~/types/listing'

const props = defineProps<{ kind: SpaceKind }>()
const emit = defineEmits<{ (e: 'created', value: BaseListing): void }>()

const form = ref<BaseListing>({
  id: '' as any, // server will set, we don’t send this
  kind: props.kind,
  title: '',
  description: '',
  address_line1: '',
  city: '',
  country: 'Spain',
  lat: 0,
  lng: 0,
  status: 'draft'
})

async function submit() {
  const created = await $fetch('/api/properties', {
    method: 'POST',
    body: {
      kind: form.value.kind,
      title: form.value.title,
      description: form.value.description,
      address_line1: form.value.address_line1,
      city: form.value.city,
      country: form.value.country,
      lat: form.value.lat,
      lng: form.value.lng,
      status: form.value.status
      // no owner_user_id; trigger fills it
    }
  })
  emit('created', created)
}

</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label class="block text-sm font-medium">Title</label>
      <input v-model="form.title" class="w-full border rounded p-2 text-gray-900" placeholder="Sea View Villa" />
    </div>

    <div>
      <label class="block text-sm font-medium">Description</label>
      <textarea v-model="form.description" class="w-full border rounded p-2 h-28 text-gray-900" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium">Address</label>
        <input v-model="form.address_line1" class="w-full border rounded p-2 text-gray-900" />
      </div>
      <div>
        <label class="block text-sm font-medium">City</label>
        <input v-model="form.city" class="w-full border rounded p-2 text-gray-900" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium">Country</label>
        <input v-model="form.country" class="w-full border rounded p-2 text-gray-900" />
      </div>
      <div class="flex items-end">
        <button type="submit" class="bg-black text-white rounded px-4 py-2">
          Create Draft
        </button>
      </div>
    </div>
  </form>
</template>
