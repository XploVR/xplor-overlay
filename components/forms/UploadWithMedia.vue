<script setup lang="ts">
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const props = defineProps<{ kind: 'real_estate' | 'yacht' | 'gallery' }>()
const created = ref<any | null>(null)

const cfg = useRuntimeConfig().public
const supa = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)

const files = ref<FileList | null>(null)
const uploading = ref(false)
const uploadErr = ref<string | null>(null)

function onCreated(row: any) {
  created.value = row
}

async function upload() {
  uploadErr.value = null
  if (!created.value?.id) { uploadErr.value = 'Create a draft first.'; return }
  if (!files.value?.length) { uploadErr.value = 'Pick at least one image.'; return }

  uploading.value = true
  const propertyId = created.value.id
  const items: { kind:'image'; url:string; position:number }[] = []

  try {
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      if (!file) continue
      const path = `${propertyId}/${Date.now()}-${i}-${file.name}`
      const { error: upErr } = await supa
        .storage
        .from('property-media')
        .upload(path, file, { upsert: false })
      if (upErr) { uploadErr.value = upErr.message; continue }

      const { data } = supa.storage.from('property-media').getPublicUrl(path)
      items.push({ kind: 'image', url: data.publicUrl, position: i })
    }

    if (items.length) {
      await $fetch('/api/property-media', {
        method: 'POST',
        body: { property_id: propertyId, items }
      })
      navigateTo(`/spaces/${propertyId}`)
    } else {
      uploadErr.value = 'Nothing uploaded.'
    }
  } catch (e: any) {
    uploadErr.value = e?.data?.message || e?.message || 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <FormsBaseListingForm :kind="props.kind" @created="onCreated" />

    <div v-if="created" class="border rounded p-4">
      <div class="font-medium mb-2">Upload media for: {{ created.title }}</div>
      <input type="file" accept="image/*" multiple @change="(e:any)=>files = e.target.files" />
      <div class="mt-3 flex items-center gap-2">
        <button @click="upload" :disabled="uploading" class="px-4 py-2 rounded bg-black text-white">
          {{ uploading ? 'Uploading…' : 'Upload & Publish' }}
        </button>
        <span v-if="uploadErr" class="text-red-600">{{ uploadErr }}</span>
      </div>
    </div>

    <div v-else class="text-gray-600">Create a draft to enable media upload.</div>
  </div>
</template>
