<!-- pages/upload/index.vue -->
<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { z } from 'zod'

import type { ListingDraft } from '~/types/media'
import { useAutosave } from '~/composables/useAutosave'
import { useUploader } from '~/composables/useUploader'

// Use the local shim so we avoid the old utils/media.ts issues
// (Make sure you created components/uploader/_media.local.ts as shared earlier)
import {
  objectUrl, readImageDims, readVideoInfo, makeThumbnail, extractMeta, compressImage
} from '~/components/uploader/_media.local'

// If components auto-import is OFF in your project, uncomment these:
// import StepIndicator from '~/components/StepIndicator.vue'
// import UploadZone from '~/components/UploadZone.vue'
// import MediaList from '~/components/MediaList.vue'

defineOptions({ name: 'UploadPage' })

/** -----------------------------
 * Local JSON downloader (client)
 * ----------------------------- */
function downloadJSON(filename: string, data: unknown) {
  if (import.meta.server) return
  const name = filename.endsWith('.json') ? filename : `${filename}.json`
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** ----------------------------------------------------------------
 * Draft state + autosave
 * ---------------------------------------------------------------- */
const draftId = 'draft_001'

const draft = reactive<ListingDraft>({
  id: draftId,
  details: {
    title: '',
    status: 'draft',
    leadContactPreference: 'form',
  },
  media: {
    primaryPhotos: [],
    virtualTours: [],
    videos: [],
    drone: [],
    floorPlans: [],
    documents: [],
    additional: [],
  },
  updatedAt: new Date().toISOString(),
})

const { state: savedDraft, savedAt, saveNow } =
  useAutosave<ListingDraft>(`xplor_draft_${draftId}`, draft)
watchEffect(() => Object.assign(draft, savedDraft.value))

/** ----------------------------------------------------------------
 * Uploader (files + URLs)
 * ---------------------------------------------------------------- */
const { media, addFiles, addUrl, remove, setPrimaryPhoto, reorder } = useUploader(draftId)
// keep draft.media in sync
watchEffect(() => { draft.media = media as any })

/** ----------------------------------------------------------------
 * Wizard control
 * ---------------------------------------------------------------- */
const step = ref(0)
const steps = [
  'Details',
  'Primary Photos',
  'Virtual Tours',
  'Video',
  'Drone',
  'Floor Plans',
  'Documents',
  'Additional',
  'Review',
] as const

// controlled inputs for URL fields
const tourUrl = ref('')
const videoUrl = ref('')

/** ----------------------------------------------------------------
 * Build a lean payload and validate before publishing
 * ---------------------------------------------------------------- */
type ListingPayload = {
  details: {
    title: string
    description?: string
    city?: string
    price?: number
    status?: 'draft' | 'published'
    energyRating?: string
    showingInstructions?: string
    leadContactPreference?: 'email' | 'phone' | 'form' | 'none'
  }
  media: {
    primaryPhotos: { name: string; url?: string; order?: number; primary?: boolean }[]
    virtualTours: { url: string }[]
    videos: { url: string }[]
    drone: { name: string; url?: string; order?: number }[]
    floorPlans: { name: string; url?: string; order?: number }[]
    documents: { name: string; url?: string; order?: number }[]
    additional: { name: string; url?: string; order?: number }[]
  }
}

function toPayload(d = draft): ListingPayload {
  return {
    details: {
      title: d.details.title?.trim() || '',
      description: d.details.description,
      city: d.details.city,
      price: d.details.price,
      status: d.details.status ?? 'draft',
      energyRating: d.details.energyRating,
      showingInstructions: d.details.showingInstructions,
      leadContactPreference: d.details.leadContactPreference ?? 'form',
    },
    media: {
      primaryPhotos: d.media.primaryPhotos.map(m => ({
        name: m.name, url: m.url, order: m.order, primary: !!m.primary,
      })),
      virtualTours: d.media.virtualTours.map(m => ({ url: m.url || m.name })),
      videos: d.media.videos.map(m => ({ url: m.url || m.name })),
      drone: d.media.drone.map(m => ({ name: m.name, url: m.url, order: m.order })),
      floorPlans: d.media.floorPlans.map(m => ({ name: m.name, url: m.url, order: m.order })),
      documents: d.media.documents.map(m => ({ name: m.name, url: m.url, order: m.order })),
      additional: d.media.additional.map(m => ({ name: m.name, url: m.url, order: m.order })),
    },
  }
}

const PayloadSchema = z.object({
  details: z.object({
    title: z.string().min(1, 'Title is required'),
    city: z.string().optional(),
    price: z.number().optional(),
    status: z.enum(['draft', 'published']).optional(),
    energyRating: z.string().optional(),
    showingInstructions: z.string().optional(),
    leadContactPreference: z.enum(['email', 'phone', 'form', 'none']).optional(),
    description: z.string().optional(),
  }),
  media: z.object({
    primaryPhotos: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
      order: z.number().optional(),
      primary: z.boolean().optional(),
    })).min(1, 'At least one primary photo is required'),
    virtualTours: z.array(z.object({ url: z.string().url('Tour URL must be valid') })).default([]),
    videos: z.array(z.object({ url: z.string().url('Video URL must be valid') })).default([]),
    drone: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    floorPlans: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    documents: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    additional: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
  }),
})

const publishing = ref(false)
const publishError = ref<string | null>(null)

async function publish() {
  publishError.value = null
  publishing.value = true
  try {
    const payload = toPayload(draft)
    PayloadSchema.parse(payload)

    // NOTE: align with your actual server route; earlier we set up /api/properties
    const res = await $fetch<{ ok?: boolean; id?: string; message?: string }>('/api/properties', {
      method: 'POST',
      body: payload,
    })
    if (!res || (res.ok === false && !res.id)) {
      throw new Error(res?.message || 'Publish failed')
    }

    await navigateTo('/spaces')
  } catch (err: any) {
    publishError.value =
      err?.issues?.[0]?.message ||
      err?.data?.message ||
      err?.message ||
      'Publish failed'

    if (publishError.value?.includes('photo') && step.value !== 1) step.value = 1
    if (publishError.value?.includes('Title') && step.value !== 0) step.value = 0
  } finally {
    publishing.value = false
  }
}

function exportJSON() {
  downloadJSON(`xplor_draft_${draftId}`, draft)
}
</script>

<template>
  <div class="container-x py-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Upload a Space</h1>
      <div class="text-xs text-x-gray2">
        Last saved: <span class="font-mono">{{ savedAt || '—' }}</span>
      </div>
    </div>

    <StepIndicator :steps="steps as unknown as string[]" :current="step" />

    <!-- STEP 0: Details -->
    <section v-if="step === 0" class="card p-4 space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Title *</span>
          <input v-model="draft.details.title" class="w-full rounded-xl border px-3 py-2" placeholder="e.g., Hillside Finca" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">City</span>
          <input v-model="draft.details.city" class="w-full rounded-xl border px-3 py-2" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Price (€)</span>
          <input type="number" v-model.number="draft.details.price" class="w-full rounded-xl border px-3 py-2" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Energy Rating</span>
          <input v-model="draft.details.energyRating" class="w-full rounded-xl border px-3 py-2" />
        </label>
      </div>

      <label class="space-y-1">
        <span class="text-xs text-x-gray2">Description</span>
        <textarea v-model="draft.details.description" rows="4" class="w-full rounded-xl border px-3 py-2" />
      </label>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Showing Instructions</span>
          <input v-model="draft.details.showingInstructions" class="w-full rounded-xl border px-3 py-2" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Lead Contact Preference</span>
          <select v-model="draft.details.leadContactPreference" class="w-full rounded-xl border px-3 py-2">
            <option value="form">Form</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="none">None</option>
          </select>
        </label>
      </div>
    </section>

    <!-- STEP 1: Primary Photos -->
    <section v-if="step === 1" class="card p-4 space-y-4">
      <!-- Add your Primary Photos upload UI here -->
    </section>
    
    <!-- Add additional steps and sections as needed -->
    
      </div>
    </template>

