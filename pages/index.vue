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

const { data: items } = await useFetch<ListItem[]>('/api/properties', {
  default: () => [],
  server: true
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Welcome</h1>
    <ListingGrid :items="(items || []).slice(0,6)" />
    <ListingMap :items="items || []" :center="[2.6502,39.5696]" :zoom="9" />
  </div>
</template>

