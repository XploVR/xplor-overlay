<script setup lang="ts">
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

const props = defineProps<{ propertyId: string }>()
const cfg = useRuntimeConfig().public
const supa = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)

type MediaRow = { id: string; url: string; position: number }

const loading = ref(true)
const err = ref<string | null>(null)
const items = ref<MediaRow[]>([])

async function load() {
  loading.value = true
  err.value = null
  const { data, error } = await supa
    .from('property_media')
    .select('id,url,position')
    .eq('property_id', props.propertyId)
    .order('position', { ascending: true })
  if (error) err.value = error.message
  items.value = (data || []) as MediaRow[]
  loading.value = false
}

function moveUp(i: number) {
  if (i <= 0) return
  const tmp = items.value[i - 1]!
  items.value[i - 1] = items.value[i]!
  items.value[i] = tmp!
}

function moveDown(i: number) {
  if (i >= items.value.length - 1) return
  const tmp = items.value[i + 1]
  items.value[i + 1] = items.value[i]!
  items.value[i] = tmp!
}

async function saveOrder() {
  const order = items.value.map(x => x.id)
  await $fetch('/api/property-media/reorder', { method: 'POST', body: { property_id: props.propertyId, order } })
  await load()
}

async function setCover(i: number) {
  // put selected item at index 0
  const sel = items.value.splice(i, 1)[0]
  if (sel) {
    items.value.unshift(sel)
    await saveOrder()
  }
}

async function remove(idx: number) {
  const row = items.value[idx]

  // Best-effort: delete the file from storage. Path is after bucket name:
  // Our URLs are public; extract path after ".../object/public/property-media/"
  const match = row.url.split('/property-media/')[1]
  if (match) {
    try {
      await supa.storage.from('property-media').remove([match])
    } catch (e) {
      console.warn('Storage remove failed:', e)
    }
  }

  try {
    await $fetch(`/api/property-media/${row.id}`, { method: 'DELETE' })
  } catch (e) {
    console.error('Failed to delete row', e)
  }

  await load()
}

onMounted(load)

const hasItems = computed(() => items.value.length > 0)
</script>

<template>
  <div class="border rounded p-4 space-y-3">
    <div class="flex items-center justify-between">
      <div class="font-medium">Media</div>
      <button v-if="hasItems" @click="saveOrder" class="text-sm underline">Save order</button>
    </div>

    <div v-if="loading">Loading…</div>
    <div v-else-if="err" class="text-red-600">{{ err }}</div>
    <div v-else-if="!hasItems" class="text-gray-600">No media yet.</div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div v-for="(m,i) in items" :key="m.id" class="border rounded overflow-hidden">
        <div class="aspect-[4/3] bg-gray-100">
          <img :src="m.url" class="w-full h-full object-cover" />
        </div>
        <div class="p-2 flex items-center justify-between text-sm">
          <div>
            <span v-if="i===0" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">Cover</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="moveUp(i)" class="underline disabled:opacity-40" :disabled="i===0">Up</button>
            <button @click="moveDown(i)" class="underline disabled:opacity-40" :disabled="i===items.length-1">Down</button>
            <button @click="setCover(i)" class="underline" v-if="i!==0">Make cover</button>
            <button @click="remove(i)" class="underline text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
