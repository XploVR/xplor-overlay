<script setup lang="ts">
import { applyFilters, buildFacets, makeDefaultFilters, type Filters } from '~/server/utils/filtering'
type ApiResp<T> = { data?: T; count?: number; error?: any } | T
const { data: raw } = await useAsyncData('spaces-properties', () => $fetch<ApiResp<any[]>>('/api/properties'))

const items = computed<any[]>(() => {
  const r = raw.value
  if (Array.isArray(r)) return r
  if (r && typeof r === 'object' && Array.isArray((r as any).data)) return (r as any).data
  return []
})

const filters = ref<Filters>(makeDefaultFilters())
const facets = computed(() => buildFacets(items.value))
const filtered = computed(() => applyFilters(items.value, filters.value))
function resetFilters() { filters.value = makeDefaultFilters() }
</script>

<template>
  <div class="container-x py-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Spaces</h1>
      <NuxtLink to="/upload" class="btn btn-alt">+ Upload</NuxtLink>
    </div>

    <FiltersBar v-model="filters" :cities="facets.cities" :statuses="facets.statuses" @reset="resetFilters" />

    <ListingGrid :items="filtered" />
  </div>
</template>
