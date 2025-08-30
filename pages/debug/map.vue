<script setup lang="ts">
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

const cfg = useRuntimeConfig().public
const ok = !!cfg.mapboxToken
const el = ref<HTMLDivElement|null>(null)

onMounted(() => {
  if (!ok || !el.value || !mapboxgl.supported()) return
  mapboxgl.accessToken = cfg.mapboxToken as string
  const map = new mapboxgl.Map({
    container: el.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [2.6502, 39.5696],
    zoom: 9
  })
  map.addControl(new mapboxgl.NavigationControl({ showCompass:false }), 'top-right')
  map.on('load', () => console.log('[Debug Map] loaded'))
  map.on('error', (e) => console.error('[Debug Map] error:', e?.error || e))
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-semibold">Map Debug</h1>
    <div>Token present: <b>{{ ok ? 'yes' : 'no' }}</b></div>
    <div v-if="!ok" class="text-red-600">Set NUXT_PUBLIC_MAPBOX_TOKEN in .env</div>
    <div ref="el" style="height:60vh;width:100%;border:1px solid #ddd;"></div>
  </div>
</template>
