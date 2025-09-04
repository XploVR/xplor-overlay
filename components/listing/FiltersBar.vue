<script setup lang="ts">
const props = defineProps<{ modelValue: {
  q?: string; kind?: string; city?: string; status?: string; sort?: 'new'|'old'
} }>()
const emit = defineEmits<{(e:'update:modelValue', v:any):void, (e:'submit'):void }>()
const local = reactive({ q:'', kind:'', city:'', status:'', sort:'new', ...props.modelValue })

watch(() => props.modelValue, v => Object.assign(local, v))
watch(local, v => emit('update:modelValue', v), { deep: true })

function submit() { emit('submit') }
function clear() {
  Object.assign(local, { q:'', kind:'', city:'', status:'', sort:'new' })
  submit()
}
</script>

<template>
  <form @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
    <label class="sm:col-span-2 block">
      <div class="text-sm font-medium">Search</div>
      <input v-model="local.q" class="mt-1 w-full border rounded px-3 py-2" placeholder="Loft, yacht, galleryâ€¦" />
    </label>

    <label class="block">
      <div class="text-sm font-medium">Kind</div>
      <select v-model="local.kind" class="mt-1 w-full border rounded px-3 py-2">
        <option value="">Any</option>
        <option value="real_estate">Real estate</option>
        <option value="yacht">Yacht</option>
        <option value="gallery">Gallery</option>
      </select>
    </label>

    <label class="block">
      <div class="text-sm font-medium">City</div>
      <input v-model="local.city" class="mt-1 w-full border rounded px-3 py-2" placeholder="City" />
    </label>

    <label class="block">
      <div class="text-sm font-medium">Status</div>
      <select v-model="local.status" class="mt-1 w-full border rounded px-3 py-2">
        <option value="">Any</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </label>

    <label class="block">
      <div class="text-sm font-medium">Sort</div>
      <select v-model="local.sort" class="mt-1 w-full border rounded px-3 py-2">
        <option value="new">Newest</option>
        <option value="old">Oldest</option>
      </select>
    </label>

    <div class="sm:col-span-6 flex gap-2">
      <button class="px-4 py-2 rounded bg-black text-white" type="submit">Apply</button>
      <button class="px-4 py-2 rounded border" type="button" @click="clear">Clear</button>
    </div>
  </form>
</template>

