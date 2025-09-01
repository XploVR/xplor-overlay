<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// --- data types (relaxed so it adapts to your current API) ---
type Space = {
  id: string
  title: string
  city?: string
  country?: string
  kind?: string
  lat?: number | null
  lng?: number | null
  image?: string | null
  href?: string
}

// --- state ---
const q = ref('')
const spaces = ref<Space[]>([])
const loading = ref(true)
const loadErr = ref<string | null>(null)

// --- map refs ---
const mapEl = ref<HTMLElement | null>(null)
let map: any = null
let maplibregl: any = null

// --- tiny helpers ---
const placeholderImg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="16">
    No image
  </text>
</svg>`)

function normalize(raw: any): Space {
  // Try to map common property/spaces shapes to our Space type
  return {
    id: String(raw.id ?? raw.slug ?? cryptoRandom('s')),
    title: String(raw.title ?? raw.name ?? 'Untitled'),
    city: raw.city ?? raw.location?.city ?? raw.address?.city ?? undefined,
    country: raw.country ?? raw.location?.country ?? undefined,
    kind: raw.kind ?? raw.type ?? undefined,
    lat: raw.lat ?? raw.latitude ?? raw.location?.lat ?? null,
    lng: raw.lng ?? raw.longitude ?? raw.location?.lng ?? null,
    image:
      raw.image ??
      raw.cover ?? 
      raw.thumbnail ??
      raw.media?.primary?.url ??
      raw.media?.primaryPhotos?.[0]?.url ??
      null,
    href: raw.href ?? (raw.id ? `/spaces/${raw.id}` : undefined),
  }
}

function cryptoRandom(prefix = 'x') {
  try {
    const bytes = crypto.getRandomValues(new Uint8Array(6))
    const b64 = btoa(String.fromCharCode(...bytes)).replace(/[^a-z0-9]/gi, '').slice(0, 8)
    return `${prefix}_${b64}`
  } catch {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
  }
}

// --- fetch spaces on client (keeps SSR simple while your API settles) ---
onMounted(async () => {
  loading.value = true
  loadErr.value = null
  const endpoints = ['/api/properties', '/api/spaces', '/api/listings']
  let found: any[] | null = null

  for (const url of endpoints) {
    try {
      const res = await $fetch<any>(url, { method: 'GET' })
      if (Array.isArray(res)) { found = res; break }
      if (Array.isArray((res as any)?.data)) { found = (res as any).data; break }
    } catch (e: any) {
      // keep trying
    }
  }

  if (!found) {
    // fallback demo data so the UI is usable immediately
    found = [
      { id: 'demo1', title: 'Beachfront Villa', city: 'Marbella', country: 'ES', kind: 'real_estate', lat: 36.5099, lng: -4.8850, image: null },
      { id: 'demo2', title: 'Dubai Marina Tower', city: 'Dubai', country: 'AE', kind: 'development', lat: 25.0800, lng: 55.1400, image: null },
      { id: 'demo3', title: 'Gallery Pop-up', city: 'London', country: 'UK', kind: 'gallery', lat: 51.5074, lng: -0.1278, image: null },
    ]
  }

  spaces.value = found.map(normalize)
  loading.value = false

  // init map after we have data
  await initMap()
  addMarkers()
})

// --- map setup with CDN fallback ---
async function initMap() {
  if (!mapEl.value) return
  if (map) return

  // Try ESM first
  try {
    maplibregl = (await import('maplibre-gl')).default
    await ensureMapLibreCss()
  } catch {
    // Fallback to CDN (no build needed)
    await injectScript('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js', 'maplibre-gl-js')
    await injectCss('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css', 'maplibre-gl-css')
    maplibregl = (window as any).maplibregl
  }

  if (!maplibregl) return

  map = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [-3.7038, 40.4168], // Madrid
    zoom: 2.5,
    attributionControl: true,
  })

  // controls
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
}

function addMarkers() {
  if (!map || !maplibregl) return
  const pts = spaces.value.filter(s => isFinite(Number(s.lng)) && isFinite(Number(s.lat)))
  if (!pts.length) return

  const bounds = new maplibregl.LngLatBounds()
  pts.forEach((s) => {
    const el = document.createElement('div')
    el.className = 'marker'
    el.style.cssText = 'width:12px;height:12px;border-radius:9999px;background:#111;box-shadow:0 0 0 2px #fff;'
    const m = new maplibregl.Marker({ element: el })
      .setLngLat([Number(s.lng), Number(s.lat)])
      .setPopup(
        new maplibregl.Popup({ offset: 12 }).setHTML(
          `<div style="font-family:system-ui,ui-sans-serif,sans-serif;font-size:12px;">
            <strong>${escapeHtml(s.title)}</strong><br/>
            ${[s.city, s.country].filter(Boolean).join(', ')}
          </div>`
        )
      )
      .addTo(map)
    bounds.extend([Number(s.lng), Number(s.lat)])
  })

  try {
    map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 12 })
  } catch {}
}

function escapeHtml(str?: string) {
  return (str || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] as string))
}

// --- utilities to load CSS/JS when ESM import fails ---
function injectScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve()
    const s = document.createElement('script')
    s.id = id
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
}
function injectCss(href: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve()
    const l = document.createElement('link')
    l.id = id
    l.rel = 'stylesheet'
    l.href = href
    l.onload = () => resolve()
    l.onerror = (e) => reject(e)
    document.head.appendChild(l)
  })
}
async function ensureMapLibreCss() {
  // when using ESM, MapLibre doesn't auto-inject CSS — add it once
  const existing = document.getElementById('maplibre-gl-css')
  if (existing) return
  await injectCss('https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css', 'maplibre-gl-css')
}

// --- filtering ---
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return spaces.value
  return spaces.value.filter((s) =>
    [s.title, s.city, s.country, s.kind]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(term))
  )
})
</script>

<template>
  <div class="container-x py-8 space-y-8">
    <!-- Hero / Search -->
    <section class="space-y-3">
      <h1 class="font-display text-2xl md:text-3xl tracking-tight">Explore Spaces</h1>
      <p class="text-sm text-x-deep/70">Search the latest virtual tours and listings on the map or in the grid.</p>
      <div class="flex gap-2">
        <input
          v-model="q"
          placeholder="Search by title, city, country, type…"
          class="flex-1 rounded-xl border px-4 py-2"
        />
        <span class="text-xs text-x-gray2 self-center">{{ filtered.length }} results</span>
      </div>
    </section>

    <!-- Map -->
    <section>
      <ClientOnly>
        <div ref="mapEl" class="h-72 md:h-96 rounded-2xl border border-x-gray/40 overflow-hidden"></div>
        <template #fallback>
          <div class="h-72 md:h-96 rounded-2xl border border-dashed grid place-items-center text-sm text-x-gray2">
            Loading map…
          </div>
        </template>
      </ClientOnly>
      <p v-if="loadErr" class="mt-2 text-xs text-red-600">Error: {{ loadErr }}</p>
    </section>

    <!-- Grid -->
    <section class="space-y-3">
      <h2 class="font-display text-xl">Latest</h2>

      <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl border p-3">
          <div class="aspect-video rounded-lg bg-gray-100 mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="s in filtered"
          :key="s.id"
          class="group rounded-2xl border border-x-gray/40 overflow-hidden bg-white/80 hover:shadow-sm transition-shadow"
        >
          <NuxtLink :to="s.href || '#'" class="block">
            <div class="aspect-video bg-gray-100 overflow-hidden">
              <img
                :src="s.image || placeholderImg"
                alt=""
                class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="p-3">
              <h3 class="font-semibold truncate">{{ s.title }}</h3>
              <p class="text-xs text-x-gray2 mt-1 truncate">
                <span v-if="s.kind" class="uppercase tracking-wide">{{ s.kind }}</span>
                <span v-if="s.kind && (s.city || s.country)"> • </span>
                {{ [s.city, s.country].filter(Boolean).join(', ') }}
              </p>
            </div>
          </NuxtLink>
        </article>
      </div>

      <div v-if="!loading && filtered.length === 0" class="text-sm text-x-gray2">
        No results match “{{ q }}”.
      </div>
    </section>
  </div>
</template>

<style scoped>
/* optional: nicer marker hover target on touch */
.marker { cursor: pointer; }
</style>
