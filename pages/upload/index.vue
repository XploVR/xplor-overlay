<!-- pages/upload/index.vue -->
<script setup lang="ts">
import { ref, reactive, watch, watchEffect, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { z } from 'zod'
import { useRuntimeConfig } from '#app'
import type { ListingDraft } from '~/types/media'
import { useAutosave } from '~/composables/useAutosave'
import { useUploader } from '~/composables/useUploader'
import UploadZone from '~/components/uploader/UploadZone.vue'
import MediaList from '~/components/uploader/MediaList.vue'


defineOptions({ name: 'UploadPage' })

/* ------------------------------------
   Small local helper: download JSON
------------------------------------ */
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

/* ------------------------------------
   Draft state + autosave
------------------------------------ */
const draftId = 'draft_001'

const draft = reactive<ListingDraft>({
  id: draftId,
  details: {
    title: '',
    status: 'draft',
    leadContactPreference: 'form',
    // location fields
    addressLine1: '',
    city: '',
    country: '',
    lat: null as number | null,
    lng: null as number | null,
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

/* ------------------------------------
   Uploader (files + URLs) + limits
------------------------------------ */
const uploaderLimits = {
  primaryPhotos: 15,
  virtualTours: 5,
  videos: 5,
  drone: 10,
  floorPlans: 10,
  documents: 20,
  additional: 20,
} as const

const {
  media, addFiles, addUrl, remove, setPrimaryPhoto, reorder,
  limits: activeLimits, remaining, status
} = useUploader(draftId, { limits: uploaderLimits })

// keep draft.media in sync
watchEffect(() => { draft.media = media as any })

/* ------------------------------------
   Wizard: steps + URL sync + keyboard
------------------------------------ */
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

const route = useRoute()
const router = useRouter()

// read initial step from ?step= (0..8)
const step = ref(
  Math.max(0, Math.min(steps.length - 1, Number(route.query.step ?? 0)))
)

function goNext() { if (step.value < steps.length - 1) step.value++ }
function goBack() { if (step.value > 0) step.value-- }

// keep URL in sync with the current step
watch(step, (s) => {
  router.replace({ query: { ...route.query, step: String(s) } })
})

// keyboard navigation
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') goNext()
  if (e.key === 'ArrowLeft') goBack()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// controlled inputs for URL fields
const tourUrl = ref('')
const videoUrl = ref('')

/* ------------------------------------
   LOCATION: search + map + lat/lng
------------------------------------ */
type Coords = { lat: number; lng: number } | null
const coords = computed<Coords>({
  get: () => (draft.details.lat != null && draft.details.lng != null)
    ? { lat: draft.details.lat!, lng: draft.details.lng! }
    : null,
  set: (v) => {
    draft.details.lat = v?.lat ?? null
    draft.details.lng = v?.lng ?? null
  }
})
const addrModel = computed({
  get: () => draft.details.addressLine1 || '',
  set: (v: string) => { draft.details.addressLine1 = v }
})

// geocoding (Mapbox if token present → Nominatim fallback)
const cfg = useRuntimeConfig()
const mapboxToken = (cfg.public?.mapboxToken as string | undefined) || undefined
const q = ref('')
const results = ref<any[]>([])
const searching = ref(false)

function debounce<F extends (...a: any[]) => any>(fn: F, ms = 350) {
  let t: number | null = null
  return (...args: Parameters<F>) => new Promise<ReturnType<F>>((resolve) => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(async () => resolve(await fn(...args)), ms)
  })
}

const geocode = debounce(async (query: string) => {
  const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en'
  if (!query.trim()) return [] as any[]
  try {
    if (mapboxToken) {
      const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`)
      url.searchParams.set('access_token', mapboxToken)
      url.searchParams.set('limit', '5')
      url.searchParams.set('language', lang)
      const res = await fetch(url.toString())
      if (res.ok) {
        const json = await res.json()
        return (json.features || []).map((f: any) => {
          const [lng, lat] = f.center || []
          const ctx = Object.fromEntries((f.context || []).map((c: any) => [c.id.split('.')[0], c.text]))
          return {
            title: f.place_name,
            addressLine1: f.text,
            city: f.place_type?.includes('place') ? f.text : (ctx.place || ctx.locality),
            country: ctx.country,
            lat, lng,
          }
        })
      }
    }
  } catch { /* fallback */ }

  // Nominatim fallback
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '5')
    url.searchParams.set('accept-language', lang)
    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return []
    const json = await res.json()
    return json.map((r: any) => ({
      title: r.display_name,
      addressLine1: r.address?.house_number ? `${r.address.road ?? ''} ${r.address.house_number}`.trim() : (r.address?.road || r.name),
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet,
      country: r.address?.country_code?.toUpperCase?.() || r.address?.country,
      lat: Number(r.lat), lng: Number(r.lon),
    }))
  } catch {
    return []
  }
}, 350)

async function reverseGeocode(lat: number, lng: number) {
  const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en'
  try {
    if (mapboxToken) {
      const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`)
      url.searchParams.set('access_token', mapboxToken)
      url.searchParams.set('limit', '1')
      url.searchParams.set('language', lang)
      const res = await fetch(url.toString())
      if (res.ok) {
        const json = await res.json()
        const f = json.features?.[0]
        if (f) {
          const [lng2, lat2] = f.center || []
          const ctx = Object.fromEntries((f.context || []).map((c: any) => [c.id.split('.')[0], c.text]))
          return {
            title: f.place_name,
            addressLine1: f.text,
            city: ctx.place || ctx.locality,
            country: ctx.country,
            lat: lat2, lng: lng2,
          }
        }
      }
    }
  } catch { /* fallback */ }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('accept-language', lang)
    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return null
    const r = await res.json()
    return {
      title: r.display_name,
      addressLine1: r.address?.house_number ? `${r.address.road ?? ''} ${r.address.house_number}`.trim() : (r.address?.road || r.name),
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet,
      country: r.address?.country_code?.toUpperCase?.() || r.address?.country,
      lat: Number(r.lat), lng: Number(r.lon),
    }
  } catch {
    return null
  }
}

watch(q, async (val) => {
  if (!val.trim()) { results.value = []; return }
  searching.value = true
  results.value = await geocode(val)
  searching.value = false
})

function onPickPlace(r: any) {
  draft.details.addressLine1 = r.addressLine1 || r.title || ''
  draft.details.city = r.city || draft.details.city || ''
  draft.details.country = r.country || draft.details.country || ''
  draft.details.lat = r.lat
  draft.details.lng = r.lng
  results.value = []
  centerMapToCurrent()
}

function onPlaceResolved(r: any) {
  if (!r) return
  draft.details.addressLine1 = r.addressLine1 || draft.details.addressLine1
  draft.details.city = r.city || draft.details.city
  draft.details.country = r.country || draft.details.country
  draft.details.lat = r.lat
  draft.details.lng = r.lng
}

// manual lat/lng inputs (supports pasting "lat,lng")
const latStr = ref<string>(''), lngStr = ref<string>('')
watch([latStr, lngStr], ([la, ln]) => {
  const lat = Number(la), lng = Number(ln)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    draft.details.lat = lat
    draft.details.lng = lng
    centerMapToCurrent()
  }
})
function tryParseLatLng(val: string) {
  const m = val.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/)
  if (m) { latStr.value = m[1]; lngStr.value = m[3] }
}

/* ---- MapLibre inline (ESM → CDN fallback) ---- */
const mapEl = ref<HTMLElement | null>(null)
let map: any = null
let maplibregl: any = null
let marker: any = null

async function ensureMaplibre() {
  if (maplibregl) return
  try {
    maplibregl = (await import('maplibre-gl')).default
    await injectCss('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css', 'maplibre-gl-css')
  } catch {
    await injectScript('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js', 'maplibre-gl-js')
    await injectCss('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css', 'maplibre-gl-css')
    maplibregl = (window as any).maplibregl
  }
}

function injectScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve()
    const s = document.createElement('script'); s.id = id; s.src = src; s.async = true
    s.onload = () => resolve(); s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
}
function injectCss(href: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve()
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = href
    l.onload = () => resolve(); l.onerror = (e) => reject(e)
    document.head.appendChild(l)
  })
}

async function initMapIfNeeded() {
  if (!mapEl.value || map) return
  await ensureMaplibre()
  map = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: coords.value ? [coords.value.lng, coords.value.lat] : [-3.7038, 40.4168], // Madrid default
    zoom: coords.value ? 10 : 3,
    attributionControl: true,
  })
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

  marker = new maplibregl.Marker({ draggable: true })
  if (coords.value) marker.setLngLat([coords.value.lng, coords.value.lat]).addTo(map)

  map.on('click', async (e: any) => {
    draft.details.lat = e.lngLat.lat
    draft.details.lng = e.lngLat.lng
    ensureMarker()
    const r = await reverseGeocode(e.lngLat.lat, e.lngLat.lng)
    onPlaceResolved(r)
  })

  marker.on('dragend', async () => {
    const { lat, lng } = marker.getLngLat()
    draft.details.lat = lat
    draft.details.lng = lng
    const r = await reverseGeocode(lat, lng)
    onPlaceResolved(r)
  })
}
function ensureMarker() {
  if (!marker || draft.details.lat == null || draft.details.lng == null) return
  marker.setLngLat([draft.details.lng, draft.details.lat])
  // @ts-ignore internal _map check to avoid double-adding
  if (!marker._map) marker.addTo(map)
}
async function centerMapToCurrent() {
  await nextTick()
  if (!map || draft.details.lat == null || draft.details.lng == null) return
  map.flyTo({ center: [draft.details.lng, draft.details.lat], zoom: Math.max(map.getZoom(), 12) })
  ensureMarker()
}

// init map when the page loads and whenever we land on step 0
onMounted(async () => {
  await nextTick()
  await initMapIfNeeded()
})
watch(step, async (s) => {
  if (s === 0) {
    await nextTick()
    await initMapIfNeeded()
    centerMapToCurrent()
  }
})

/* ------------------------------------
   Build payload + validate + publish
------------------------------------ */
type ListingPayload = {
  details: {
    title: string
    description?: string
    city?: string
    country?: string
    price?: number
    status?: 'draft' | 'published'
    energyRating?: string
    showingInstructions?: string
    leadContactPreference?: 'email' | 'phone' | 'form' | 'none'
    addressLine1?: string
    lat?: number | null
    lng?: number | null
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
      country: d.details.country,
      price: d.details.price,
      status: d.details.status ?? 'draft',
      energyRating: d.details.energyRating,
      showingInstructions: d.details.showingInstructions,
      leadContactPreference: d.details.leadContactPreference ?? 'form',
      addressLine1: d.details.addressLine1,
      lat: d.details.lat ?? null,
      lng: d.details.lng ?? null,
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
    country: z.string().optional(),
    price: z.number().optional(),
    status: z.enum(['draft', 'published']).optional(),
    energyRating: z.string().optional(),
    showingInstructions: z.string().optional(),
    leadContactPreference: z.enum(['email', 'phone', 'form', 'none']).optional(),
    description: z.string().optional(),
    addressLine1: z.string().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
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

    // NOTE: align this with your real server route
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

    // Jump the user to likely fix step
    if (publishError.value?.toLowerCase().includes('photo') && step.value !== 1) step.value = 1
    if (publishError.value?.toLowerCase().includes('title') && step.value !== 0) step.value = 0
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <div class="container-x py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Upload a Space</h1>
      <div class="text-xs text-x-gray2">
        Last saved: <span class="font-mono">{{ savedAt || '—' }}</span>
      </div>
    </div>

    <!-- Clickable step tabs (sticky) -->
    <div class="sticky top-16 z-10 bg-white/70 backdrop-blur rounded-xl border p-2 flex flex-wrap gap-2">
      <button
        v-for="(label, i) in steps"
        :key="label"
        class="px-3 py-1.5 rounded-lg text-sm border transition"
        :class="i === step ? 'bg-x-yellow/80 text-x-black border-x-gray/40' : 'bg-white hover:bg-gray-50'"
        @click="step = i"
      >
        {{ i + 1 }}. {{ label }}
      </button>
    </div>

    <!-- STEP 0: Details + Location -->
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
          <span class="text-xs text-x-gray2">Country</span>
          <input v-model="draft.details.country" class="w-full rounded-xl border px-3 py-2" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Price (€)</span>
          <input type="number" v-model.number="draft.details.price" class="w-full rounded-xl border px-3 py-2" />
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-xs text-x-gray2">Address</span>
          <input v-model="draft.details.addressLine1" class="w-full rounded-xl border px-3 py-2" placeholder="Street & number (auto-filled when you pick on the map)" />
        </label>
      </div>

      <!-- Address search -->
      <div class="space-y-2">
        <label class="text-xs text-x-gray2">Search address worldwide</label>
        <div class="relative">
          <input
            v-model="q"
            placeholder="Try '1600 Amphitheatre Pkwy', 'Marbella, ES', 'Dubai Marina'..."
            class="w-full rounded-xl border px-3 py-2"
            @change="(e:any) => tryParseLatLng(e?.target?.value || '')"
          />
          <div v-if="results.length" class="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow">
            <button
              v-for="r in results"
              :key="r.title + r.lat + r.lng"
              class="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
              @click="onPickPlace(r)"
            >
              {{ r.title }}
            </button>
          </div>
          <div v-else-if="searching" class="absolute mt-1 text-xs text-x-gray2">Searching…</div>
        </div>
      </div>

      <!-- Map & lat/lng -->
      <ClientOnly>
        <div ref="mapEl" class="h-80 rounded-2xl border overflow-hidden" />
        <template #fallback>
          <div class="h-80 rounded-2xl border grid place-items-center text-sm text-x-gray2">Loading map…</div>
        </template>
      </ClientOnly>

      <div class="grid md:grid-cols-3 gap-3">
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Latitude</span>
          <input
            v-model="latStr"
            :placeholder="draft.details.lat != null ? String(draft.details.lat) : 'e.g., 40.4168'"
            class="w-full rounded-xl border px-3 py-2"
          />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Longitude</span>
          <input
            v-model="lngStr"
            :placeholder="draft.details.lng != null ? String(draft.details.lng) : 'e.g., -3.7038'"
            class="w-full rounded-xl border px-3 py-2"
          />
        </label>
        <div class="self-end text-xs text-x-gray2">
          <span v-if="draft.details.lat != null && draft.details.lng != null">
            Selected: {{ draft.details.lat?.toFixed(6) }}, {{ draft.details.lng?.toFixed(6) }}
          </span>
          <span v-else>No location selected</span>
        </div>
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
    <section v-if="step === 1" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Primary photos — {{ media.primaryPhotos.length }}/{{ activeLimits.primaryPhotos }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone
        label="Drop photos here or click to choose (JPG/PNG/WebP)"
        accept="image/*"
        multiple
        @files="(fs) => addFiles('primaryPhotos', fs)"
      />
      <MediaList
        :items="media.primaryPhotos"
        primary-mode
        @update:items="(v) => reorder('primaryPhotos', v)"
        @primary="setPrimaryPhoto"
        @remove="(id) => remove('primaryPhotos', id)"
      />
    </section>

    <!-- STEP 2: Virtual Tours (URLs) -->
    <section v-if="step === 2" class="space-y-2 card p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Virtual Tours — {{ media.virtualTours.length }}/{{ activeLimits.virtualTours }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <label class="space-y-1">
        <span class="text-xs text-x-gray2">Add tour URL (Matterport, etc.)</span>
        <div class="flex gap-2">
          <input
            v-model="tourUrl"
            placeholder="https://my.matterport.com/..."
            class="flex-1 rounded-xl border px-3 py-2"
          />
          <button
            class="btn btn-primary"
            @click="() => { if (tourUrl) { addUrl('virtualTours', tourUrl, 'virtualTour'); tourUrl = ''; } }"
          >
            Add
          </button>
        </div>
      </label>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="t in media.virtualTours" :key="t.id" class="card overflow-hidden">
          <div class="aspect-video">
            <iframe v-if="t.url" :src="t.url" class="w-full h-full" allowfullscreen />
          </div>
          <div class="p-3 flex items-center justify-between text-sm">
            <span class="truncate">{{ t.name }}</span>
            <button class="underline" @click="remove('virtualTours', t.id)">Delete</button>
          </div>
        </div>
      </div>
    </section>

    <!-- STEP 3: Video -->
    <section v-if="step === 3" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Videos — {{ media.videos.length }}/{{ activeLimits.videos }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone label="Upload videos (MP4/WebM)" accept="video/*" multiple @files="(fs) => addFiles('videos', fs)" />
      <label class="space-y-1 card p-3">
        <span class="text-xs text-x-gray2">Or add YouTube/Vimeo URL</span>
        <div class="flex gap-2">
          <input v-model="videoUrl" placeholder="https://youtu.be/..." class="flex-1 rounded-xl border px-3 py-2" />
          <button
            class="btn btn-primary"
            @click="() => { if (videoUrl) { addUrl('videos', videoUrl, 'video'); videoUrl = ''; } }"
          >
            Add
          </button>
        </div>
      </label>
      <MediaList
        :items="media.videos"
        @update:items="(v) => reorder('videos', v)"
        @remove="(id) => remove('videos', id)"
      />
    </section>

    <!-- STEP 4: Drone -->
    <section v-if="step === 4" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Drone — {{ media.drone.length }}/{{ activeLimits.drone }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone label="Drone photos/videos" accept="image/*,video/*" multiple @files="(fs) => addFiles('drone', fs)" />
      <MediaList
        :items="media.drone"
        @update:items="(v) => reorder('drone', v)"
        @remove="(id) => remove('drone', id)"
      />
    </section>

    <!-- STEP 5: Floor Plans -->
    <section v-if="step === 5" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Floor Plans — {{ media.floorPlans.length }}/{{ activeLimits.floorPlans }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone
        label="Floor plans (PDF/JPG/PNG)"
        accept="application/pdf,image/*"
        multiple
        @files="(fs) => addFiles('floorPlans', fs)"
      />
      <MediaList
        :items="media.floorPlans"
        @update:items="(v) => reorder('floorPlans', v)"
        @remove="(id) => remove('floorPlans', id)"
      />
    </section>

    <!-- STEP 6: Documents -->
    <section v-if="step === 6" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Documents — {{ media.documents.length }}/{{ activeLimits.documents }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone label="Documents (PDF)" accept="application/pdf" multiple @files="(fs) => addFiles('documents', fs)" />
      <MediaList
        :items="media.documents"
        @update:items="(v) => reorder('documents', v)"
        @remove="(id) => remove('documents', id)"
      />
    </section>

    <!-- STEP 7: Additional -->
    <section v-if="step === 7" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-sm">
          Additional — {{ media.additional.length }}/{{ activeLimits.additional }}
        </p>
        <p v-if="status?.message && status?.type==='error'" class="text-xs text-red-600">{{ status.message }}</p>
      </div>

      <UploadZone
        label="Additional media (brochures, photos)"
        accept="image/*,application/pdf"
        multiple
        @files="(fs) => addFiles('additional', fs)"
      />
      <MediaList
        :items="media.additional"
        @update:items="(v) => reorder('additional', v)"
        @remove="(id) => remove('additional', id)"
      />
    </section>

    <!-- STEP 8: Review -->
    <section v-if="step === 8" class="card p-4 space-y-3">
      <h3 class="font-medium">Preview</h3>
      <p class="text-sm text-x-gray2">
        Use the JSON export for API testing or visit <code>/preview</code> for a print/PDF view.
      </p>
      <div class="flex gap-2">
        <button class="btn btn-ghost" @click="downloadJSON(`xplor_draft_${draftId}`, draft)">Export JSON</button>
        <button class="btn btn-primary" :disabled="publishing" @click="publish">
          <span v-if="publishing">Publishing…</span>
          <span v-else>Publish</span>
        </button>
      </div>
      <p v-if="publishError" class="text-sm text-red-600 mt-1">{{ publishError }}</p>
    </section>

    <!-- Wizard Nav -->
    <div class="flex items-center justify-between pt-2">
      <button class="btn btn-ghost" :disabled="step === 0" @click="goBack">Back</button>
      <div class="flex gap-2">
        <button class="btn btn-ghost" @click="saveNow">Save Draft</button>
        <button class="btn btn-alt" :disabled="step === steps.length - 1" @click="goNext">Next</button>
      </div>
    </div>
  </div>
</template>
