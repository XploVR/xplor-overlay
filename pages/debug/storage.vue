<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Config (adjust if needed)
 */
const bucket = 'property-media'     // your Storage bucket name
const prefix = 'debug'              // folder/prefix to write to

/**
 * Env + client
 */
const env = useRuntimeConfig().public
let supa: SupabaseClient
try {
  supa = createClient(env.supabaseUrl, env.supabaseAnonKey)
} catch (e) {
  // If env is missing you’ll see it in the page logs
}

/**
 * UI state
 */
const files = ref<File[]>([])
const urls  = ref<string[]>([])
const logs  = ref<string[]>([])
const listing = ref<{ name: string, id?: string, updated_at?: string, metadata?: any }[]>([])

/**
 * Helpers
 */
function log(...args: any[]) {
  // show in browser console + on-page "Console" box
  console.log('[storage]', ...args)
  logs.value.push(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
}

/** Sanitize filename so Supabase doesn’t reject it (no % in keys, etc.) */
function makeSafeKey(name: string) {
  return name
    .normalize('NFKD')         // remove diacritics
    .replace(/[^\w.-]+/g, '-') // anything not [A-Za-z0-9_ . -] → '-'
    .replace(/-+/g, '-')       // collapse multiple '-'
    .replace(/^-|-$/g, '')     // trim leading/trailing '-'
    .toLowerCase()
}

/**
 * Actions
 */
onMounted(() => {
  log('env.supabaseUrl', env.supabaseUrl)
  log('env.supabaseAnonKey length', (env.supabaseAnonKey || '').length)
  log('bucket', bucket, 'prefix', prefix)
})

async function doUpload() {
  urls.value = []
  if (!files.value.length) { log('No files selected'); return }
  if (!supa) { log('Supabase client not initialized (check env)'); return }

  for (const [i, file] of files.value.entries()) {
    const safe = makeSafeKey(file.name)
    const path = `${prefix}/${Date.now()}-${i}-${safe}`

    log('Uploading', { path, type: file.type || 'unknown', size: file.size })
    const { error: upErr } = await supa
      .storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type || undefined
      })

    if (upErr) { log('Upload error:', upErr.message); continue }

    const { data } = supa.storage.from(bucket).getPublicUrl(path)
    if (!data?.publicUrl) { log('No publicUrl returned for', path); continue }

    urls.value.push(data.publicUrl)
    log('Uploaded OK →', data.publicUrl)
  }

  await listObjects()
}

async function listObjects() {
  listing.value = []
  if (!supa) { log('Supabase client not initialized (check env)'); return }

  log('Listing objects under', `${bucket}/${prefix}/`)
  const { data, error } = await supa
    .storage
    .from(bucket)
    .list(prefix, { limit: 1000, offset: 0, sortBy: { column: 'updated_at', order: 'desc' } })

  if (error) {
    log('List error:', error.message)
    return
  }
  listing.value = data || []
  log('Found', listing.value.length, 'object(s)')
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Storage Debug Upload</h1>

    <div class="space-y-2">
      <input
        type="file"
        multiple
        accept="image/*"
        @change="e => (files = Array.from((e.target as HTMLInputElement).files || []))"
        class="block"
      />
      <div class="flex gap-2">
        <button class="bg-black text-white rounded px-4 py-2" @click="doUpload">Upload</button>
        <button class="border rounded px-4 py-2" @click="listObjects">List Prefix</button>
      </div>
      <div class="text-sm text-gray-600">Selected: {{ files.length }}</div>
    </div>

    <div v-if="urls.length" class="space-y-2">
      <h2 class="font-medium">New Public URLs</h2>
      <ul class="list-disc pl-5">
        <li v-for="u in urls" :key="u">
          <a :href="u" target="_blank" class="underline break-all">{{ u }}</a>
        </li>
      </ul>
    </div>

    <div class="space-y-2">
      <h2 class="font-medium">Objects in "{{ prefix }}/"</h2>
      <div v-if="!listing.length" class="text-gray-500">No objects (yet).</div>
      <ul v-else class="list-disc pl-5 text-sm">
        <li v-for="obj in listing" :key="obj.name" class="break-all">
          {{ obj.name }} <span v-if="obj.updated_at" class="text-gray-500">— {{ new Date(obj.updated_at).toLocaleString() }}</span>
        </li>
      </ul>
    </div>

    <div class="space-y-1">
      <h2 class="font-medium">Console</h2>
      <pre class="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-72">{{ logs.join('\n') }}</pre>
    </div>
  </div>
</template>
