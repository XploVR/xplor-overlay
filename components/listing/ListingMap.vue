<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'

type Item = { id:string; title?:string; lat?:number; lng?:number }

const props = defineProps<{
  items: Item[]
  center?: [number, number]   // [lng, lat]
  zoom?: number
}>()

const cfg = useRuntimeConfig().public
const hasToken = computed(() => !!cfg.mapboxToken)

const mapContainer = ref<HTMLDivElement | null>(null)
let map: mapboxgl.Map | null = null
let markers: mapboxgl.Marker[] = []
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null

function clearMarkers() { for (const m of markers) m.remove(); markers = [] }

function addMarkers(items: Item[]) {
  if (!map) return
  clearMarkers()
  const valid = (items || []).filter(i => typeof i.lat === 'number' && typeof i.lng === 'number')
  for (const it of valid) {
    const el = document.createElement('div')
    el.style.cssText = 'width:12px;height:12px;border-radius:9999px;background:#111'
    new mapboxgl.Marker({ element: el })
      .setLngLat([it.lng!, it.lat!])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(
        `<div style="font:12px/1.2 sans-serif">
           <a href="/spaces/${it.id}" style="text-decoration:underline">
             ${(it.title || 'View').replace(/</g,'&lt;')}
           </a>
         </div>`
      ))
      .addTo(map)
      && markers.push()
  }
}

function initMapIfVisible() {
  const el = mapContainer.value
  if (!el || map) return
  const rect = el.getBoundingClientRect()
  const visible = rect.width > 0 && rect.height > 0
  if (!visible) {
    console.log('[Map] container not visible yet; waiting…')
    return
  }
  mapboxgl.accessToken = cfg.mapboxToken as string
  map = new mapboxgl.Map({
    container: el,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: props.center || [2.6502, 39.5696],
    zoom: props.zoom ?? 9
  })
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
  map.on('load', async () => {
    console.log('[Map] loaded; size=', el.clientWidth, el.clientHeight)
    addMarkers(props.items || [])
    await nextTick()
    map?.resize()
    setTimeout(() => map?.resize(), 50)
  })
  map.on('error', (e) => console.error('[Map] error:', e?.error || e))
}

onMounted(async () => {
  if (!hasToken.value) { console.warn('[Map] Missing mapboxToken'); return }
  if (!mapboxgl.supported()) { console.warn('[Map] WebGL not supported'); return }

  // Wait until the ref actually exists (because of <ClientOnly>/layout timing)
  const stopWatchRef = watch(() => mapContainer.value, async (el) => {
    if (!el) return
    await nextTick()
    // Set up observers once the element exists
    io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) initMapIfVisible()
    }, { root: null, threshold: 0.01 })
    io.observe(el)
    ro = new ResizeObserver(() => { map?.resize() })
    ro.observe(el)

    // Try immediate init too (in case it's already visible)
    initMapIfVisible()
    stopWatchRef()
  }, { immediate: true })
})

watch(() => props.items, (val) => { if (map) addMarkers(val || []) }, { deep: true })

onBeforeUnmount(() => {
  const el = mapContainer.value
  if (io && el) io.unobserve(el)
  if (ro && el) ro.unobserve(el)
  io = null; ro = null
  clearMarkers()
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="border rounded overflow-hidden bg-white">
    <ClientOnly>
      <div v-if="!hasToken" class="p-4 text-red-600">
        Mapbox token missing — set <code>NUXT_PUBLIC_MAPBOX_TOKEN</code> in <code>.env</code>
      </div>
      <!-- Inline height to avoid layout issues -->
      <div v-else ref="mapContainer" style="height:60vh;width:100%;"></div>
    </ClientOnly>
  </div>
</template>
