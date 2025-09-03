<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const { public: pub } = useRuntimeConfig()
const supa = createClient(pub.supabaseUrl, pub.supabaseAnonKey)

const fileRef = ref<HTMLInputElement | null>(null)
const lastUrl = ref<string>('')

async function doUpload() {
  const el = fileRef.value
  if (!el || !el.files || el.files.length === 0) {
    alert('Pick a file first')
    return
  }
  const file = el.files[0]
  if (!file) {
    alert('No file selected')
    return
  }
  const path = `dev/${Date.now()}-${encodeURIComponent(file.name)}`

  const { error } = await supa.storage.from('property-media').upload(path, file, {
    upsert: false,
    contentType: file.type || undefined
  })
  if (error) {
    console.error('[test upload] error:', error)
    alert('Upload failed: ' + error.message)
    return
  }

  const { data } = supa.storage.from('property-media').getPublicUrl(path)
  lastUrl.value = data.publicUrl
}
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-4">
    <h1 class="text-xl font-semibold">Storage Upload Test</h1>
    <input type="file" ref="fileRef" class="block" />
    <button class="bg-black text-white rounded px-4 py-2" @click="doUpload">
      Upload
    </button>

    <div v-if="lastUrl" class="space-y-2">
      <div class="text-sm text-gray-600 break-all">{{ lastUrl }}</div>
      <img :src="lastUrl" alt="preview" class="w-full max-w-sm rounded border" />
    </div>
  </div>
</template>
