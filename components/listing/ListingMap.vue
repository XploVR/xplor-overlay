<script setup lang="ts">
const props = defineProps<{ items?: any[]; center?: [number, number]; zoom?: number }>()
const el = ref<HTMLElement | null>(null)
let map: any = null
let markers: any[] = []

const items = computed<any[]>(() => Array.isArray(props.items) ? props.items : [])

function clearMarkers() {
  markers.forEach(m => { try { m.remove() } catch {} })
  markers = []
}

onMounted(() => {
  const { $createMap, $mapbox } = useNuxtApp()
  if (!el.value) return
  map = $createMap({ container: el.value, center: props.center ?? [0,0], zoom: props.zoom ?? 2 })
  map.on('load', () => addMarkers())
  function addMarkers() {
    clearMarkers()
    for (const it of items.value) {
      const [lng, lat] = it?.coords ?? []
      if (typeof lng !== 'number' || typeof lat !== 'number') continue
      const m = new ($mapbox as any).Marker().setLngLat([lng, lat]).addTo(map)
      markers.push(m)
    }
  }
  watch(items, () => { if (map && map.loaded()) addMarkers() }, { deep: true })
})

onBeforeUnmount(() => {
  clearMarkers()
  try { map?.remove?.() } catch {}
})
</script>

<template>
  <div ref="el" class="w-full rounded-xl overflow-hidden" style="aspect-ratio: 16 / 9;" />
</template>

