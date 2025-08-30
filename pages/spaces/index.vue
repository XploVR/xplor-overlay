<script setup lang="ts">
type ListItem = {
  id: string
  title: string
  city?: string
  country?: string
  thumbnail_url?: string | null
  lat?: number
  lng?: number
}

const { data: items, pending, error } = await useFetch<ListItem[]>('/api/properties', {
  default: () => [],
  server: true,
  onResponseError() { return [] }
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Explore Spaces</h1>
    <div v-if="pending">Loading…</div>
    <div v-else-if="error" class="text-red-600">Failed to load.</div>
    <ListingGrid v-else :items="items || []" />
    <ListingMap :items="items || []" :center="[2.6502,39.5696]" :zoom="9" />
  </div>
</template>
