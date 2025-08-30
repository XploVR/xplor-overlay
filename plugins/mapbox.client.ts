import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
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

function clearMarkers() { for (const m of markers) m.remove(); markers = [] }

function addMarkers(items: Item[]) {
  clearMarkers()
  const valid = (items || []).filter(i => typeof i.lat === 'number' && typeof i.lng === 'number')
  for (const it of valid) {
    const el = document.createElement('div')
    el.style.cssText = 'width:12px;height:12px;border-radius:9999px;background:#111'
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([it.lng!, it.lat!])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(
        `<div style="font:12px/1.2 sans-serif">
           <a href="/spaces/${it.id}" style="text-decoration:underline">
             ${(it.title || 'View').replace(/</g,'&lt;')}
           </a>
         </div>`
      ))
      .addTo(map!)
    markers.push(marker)
  }
}

onMounted(() => {
  if (!hasToken.value) {
    console.warn('[Map] Missing mapboxToken')
    return
  }
  if (!mapboxgl.supported()) {
    console.warn('[Map] mapboxgl.supported() is false (WebGL unavailable)')
    return
  }
  if (!mapContainer.value) {
    console.warn('[Map] container is null')
    return
  }

  // Set token (plugin can also set it; this is safe)
  mapboxgl.accessToken = cfg.mapboxToken as string

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: props.center || [2.6502, 39.5696],
    zoom: props.zoom ?? 9
  })

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

  map.on('load', () => {
    console.log('[Map] loaded')
    addMarkers(props.items || [])
  })

  map.on('error', (e) => {
    console.error('[Map] error event:', e?.error || e)
  })
})

watch(() => props.items, (val) => { if (map) addMarkers(val || []) }, { deep: true })

onBeforeUnmount(() => {
  clearMarkers()
  if (map) { map.remove(); map = null }
})
