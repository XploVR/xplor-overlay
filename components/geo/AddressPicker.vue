<!-- components/geo/AddressPicker.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useGeocode } from '~/composables/useGeocode'

type Coords = { lat: number; lng: number } | null
const props = defineProps<{
  modelValueCoords?: Coords
  modelValueAddress?: string
  label?: string
  height?: string
}>()

const emit = defineEmits<{
  (e: 'update:coords', v: Coords): void
  (e: 'update:address', v: string): void
  (e: 'resolved', v: { addressLine1?: string; city?: string; country?: string; lat: number; lng: number }): void
}>()

const address = ref(props.modelValueAddress ?? '')
const coords = ref<Coords>(props.modelValueCoords ?? null)
watch(() => props.modelValueAddress, (v) => { if (v !== undefined) address.value = v ?? '' })
watch(() => props.modelValueCoords,  (v) => { if (v !== undefined) coords.value = v ?? null })

watch(address, v => emit('update:address', v))
watch(coords,  v => emit('update:coords', v))

const { geocode, reverseGeocode } = useGeocode()
const q = ref('')
const results = ref<any[]>([])
const searching = ref(false)
const pick = async (r: any) => {
  address.value = r.title
  coords.value = { lat: r.lat, lng: r.lng }
  emit('resolved', { addressLine1: r.addressLine1, city: r.city, country: r.country, lat: r.lat, lng: r.lng })
  results.value = []
  await centerMap()
}

watch(q, async (val) => {
  if (!val.trim()) { results.value = []; return }
  searching.value = true
  results.value = await geocode(val)
  searching.value = false
})

// manual lat/lng input
const latStr = ref(''), lngStr = ref('')
watch([latStr, lngStr], ([la, ln]) => {
  const lat = Number(la), lng = Number(ln)
  if (isFinite(lat) && isFinite(lng)) coords.value = { lat, lng }
})
function pasteLatLng(e: Event) {
  const val = (e.target as HTMLInputElement).value
  const m = val.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/)
  if (m) { latStr.value = m[1]; lngStr.value = m[3] }
}

// map setup
const mapEl = ref<HTMLElement | null>(null)
let map: any = null
let maplibregl: any = null
let marker: any = null

async function ensureMaplibre() {
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

async function initMap() {
  if (!mapEl.value || map) return
  await ensureMaplibre()
  map = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: coords.value ? [coords.value.lng, coords.value.lat] : [0, 20],
    zoom: coords.value ? 10 : 2,
    attributionControl: true,
  })
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

  marker = new maplibregl.Marker({ draggable: true })
  if (coords.value) marker.setLngLat([coords.value.lng, coords.value.lat]).addTo(map)

  map.on('click', async (e: any) => {
    coords.value = { lat: e.lngLat.lat, lng: e.lngLat.lng }
    ensureMarker()
    const r = await reverseGeocode(e.lngLat.lat, e.lngLat.lng)
    if (r) {
      address.value = r.title
      emit('resolved', { addressLine1: r.addressLine1, city: r.city, country: r.country, lat: r.lat, lng: r.lng })
    }
  })

  marker.on('dragend', async () => {
    const { lat, lng } = marker.getLngLat()
    coords.value = { lat, lng }
    const r = await reverseGeocode(lat, lng)
    if (r) {
      address.value = r.title
      emit('resolved', { addressLine1: r.addressLine1, city: r.city, country: r.country, lat: r.lat, lng: r.lng })
    }
  })
}

function ensureMarker() {
  if (!marker) return
  if (!coords.value) return
  marker.setLngLat([coords.value.lng, coords.value.lat])
  if (!(marker as any)._map) marker.addTo(map)
}

async function centerMap() {
  await nextTick()
  if (!map || !coords.value) return
  map.flyTo({ center: [coords.value.lng, coords.value.lat], zoom: Math.max(map.getZoom(), 12) })
  ensureMarker()
}

onMounted(async () => {
  await initMap()
  if (coords.value) await centerMap()
})
</script>

<template>
  <div class="space-y-3">
    <label class="text-xs text-x-gray2">{{ label || 'Search address' }}</label>
    <div class="relative">
      <input
        v-model="q"
        placeholder="Search worldwide (e.g., 1600 Amphitheatre Pkwy, Paris, Dubai Marina...)"
        class="w-full rounded-xl border px-3 py-2"
      />
      <div
        v-if="results.length"
        class="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow"
      >
        <button
          v-for="r in results"
          :key="r.title + r.lat + r.lng"
          class="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
          @click="pick(r)"
        >
          {{ r.title }}
        </button>
      </div>
      <div v-else-if="searching" class="absolute mt-1 text-xs text-x-gray2">Searchingâ€¦</div>
    </div>

    <ClientOnly>
      <div ref="mapEl" :style="{ height: height || '280px' }" class="rounded-2xl border overflow-hidden" />
      <template #fallback>
        <div :style="{ height: height || '280px' }" class="rounded-2xl border grid place-items-center text-sm text-x-gray2">
          Loading mapâ€¦
        </div>
      </template>
    </ClientOnly>

    <div class="grid sm:grid-cols-3 gap-3">
      <label class="space-y-1 sm:col-span-2">
        <span class="text-xs text-x-gray2">Address</span>
        <input v-model="address" class="w-full rounded-xl border px-3 py-2" />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Latitude</span>
          <input v-model="latStr" placeholder="e.g., 40.4168" class="w-full rounded-xl border px-3 py-2" @change="pasteLatLng" />
        </label>
        <label class="space-y-1">
          <span class="text-xs text-x-gray2">Longitude</span>
          <input v-model="lngStr" placeholder="-3.7038" class="w-full rounded-xl border px-3 py-2" @change="pasteLatLng" />
        </label>
      </div>
    </div>
  </div>
</template>

