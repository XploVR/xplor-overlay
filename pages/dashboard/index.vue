<script setup lang="ts">
import { applyFilters, buildFacets, makeDefaultFilters, type Filters } from '~/server/utils/filtering'
type ApiResp<T> = { data?: T; count?: number; error?: any } | T
const { data: raw } = await useAsyncData('dash-properties', () => $fetch<ApiResp<any[]>>('/api/properties'))

const items = computed<any[]>(() => {
  const r = raw.value
  if (Array.isArray(r)) return r
  if (r && typeof r === 'object' && Array.isArray((r as any).data)) return (r as any).data
  return []
})

const filters = ref<Filters>(makeDefaultFilters())
const facets = computed(() => buildFacets(items.value))
const filtered = computed(() => applyFilters(items.value, filters.value))

const publishedCount = computed(() => filtered.value.filter((i: any) => i?.status === 'published').length)
const draftCount = computed(() => filtered.value.filter((i: any) => i?.status === 'draft').length)
const recent = computed(() => filtered.value.slice(0, 6))
function resetFilters() { filters.value = makeDefaultFilters() }
</script>

<template>
  <div class="container-x py-8 space-y-6">
    <h1 class="text-2xl font-semibold">Dashboard</h1>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4"><p class="text-sm text-x-gray2">Total</p><p class="text-2xl font-semibold">{{ filtered.length }}</p></div>
      <div class="card p-4"><p class="text-sm text-x-gray2">Published</p><p class="text-2xl font-semibold">{{ publishedCount }}</p></div>
      <div class="card p-4"><p class="text-sm text-x-gray2">Drafts</p><p class="text-2xl font-semibold">{{ draftCount }}</p></div>
      <div class="card p-4"><p class="text-sm text-x-gray2">Avg Price</p><p class="text-2xl font-semibold">
        {{ filtered.length ? Math.round(filtered.reduce((s: number, i: any) => s + (i?.price ?? 0), 0) / filtered.length).toLocaleString() : '—' }}
      </p></div>
    </div>

    <FiltersBar v-model="filters" :cities="facets.cities" :statuses="facets.statuses" @reset="resetFilters" />

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Recent</h2>
      <ListingGrid :items="recent" />
    </section>
  </div>
</template>
