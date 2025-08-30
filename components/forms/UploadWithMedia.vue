<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseListingForm from '~/components/forms/BaseListingForm.vue'
import { createClient } from '@supabase/supabase-js'

type SpaceKind = 'real_estate'|'yacht'|'gallery'|'hotel'|'restaurant'|'museum'|'vehicle'
type BaseListing = { id?: string }
type CreatedListing = { id: string | undefined }

const props = defineProps<{ kind: SpaceKind }>()
const created = ref<CreatedListing | null>(null)
const createdId = computed(() => created.value?.id || '')
const pendingFiles = ref<File[]>([])

const cfg = useRuntimeConfig().public
const supa = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
const bucket = 'property-media'

function makeSafeKey(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function onCreated(listing: BaseListing) {
  created.value = { id: listing.id ?? undefined }
}

async function uploadMedia() {
  if (!createdId.value) { console.warn('[upload] no property id'); return }
  if (!pendingFiles.value.length) { console.warn('[upload] no files'); return }

  const propertyId = createdId.value
  const uploaded: { kind: 'image'; url: string; position: number }[] = []

  for (const [i, file] of pendingFiles.value.entries()) {
    const path = `${propertyId}/${Date.now()}-${i}-${makeSafeKey(file.name)}`
    const { error: upErr } = await supa.storage.from(bucket).upload(path, file, {
      upsert: false, contentType: file.type || undefined
    })
    if (upErr) { console.error('[upload] storage:', upErr.message); continue }

    const { data } = supa.storage.from(bucket).getPublicUrl(path)
    if (!data?.publicUrl) { console.error('[upload] no publicUrl'); continue }
    uploaded.push({ kind: 'image', url: data.publicUrl, position: i })
  }

  if (uploaded.length) {
    try {
      await $fetch('/api/property-media', { method: 'POST', body: { property_id: propertyId, items: uploaded } })
    } catch (e) { console.error('[upload] persist error:', e) }
  }

  navigateTo(`/spaces/${propertyId}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Step 1: create draft property -->
    <BaseListingForm :kind="props.kind" @created="onCreated" />

    <!-- Step 2: upload media for that property -->
    <div v-if="createdId" class="mt-2 border-t pt-6 space-y-3">
      <h3 class="font-medium">Upload Media</h3>

      <input
        type="file"
        multiple
        accept="image/*"
        @change="e => (pendingFiles = Array.from((e.target as HTMLInputElement).files || []))"
        class="block"
      />
      <div class="text-xs text-gray-600">Selected: {{ pendingFiles.length }} file(s)</div>

      <button class="bg-black text-white rounded px-4 py-2" @click="uploadMedia">
        Upload & Continue
      </button>
    </div>
  </div>
</template>
