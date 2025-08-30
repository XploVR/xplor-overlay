<script setup lang="ts">
type Property = {
  id: string
  title: string
  kind?: string
  city?: string
  country?: string
  status?: string
  created_at?: string
}

const { data: items, pending, error } = await useFetch<Property[]>('/api/properties', {
  default: () => [],
  server: true,
  onResponseError() { return [] }
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-semibold">All Listings (Dashboard)</h1>

    <div v-if="pending" class="text-gray-700">Loading…</div>
    <div v-else-if="error" class="text-red-600">Failed to load.</div>

    <div v-else>
      <div v-if="!items?.length" class="border rounded p-6 text-gray-700">
        No listings found. Try creating one on
        <NuxtLink to="/upload/real_estate" class="underline">Upload → Real Estate</NuxtLink>.
      </div>

      <div v-else class="overflow-x-auto border rounded">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-3 py-2">Title</th>
              <th class="text-left px-3 py-2">Kind</th>
              <th class="text-left px-3 py-2">City</th>
              <th class="text-left px-3 py-2">Country</th>
              <th class="text-left px-3 py-2">Status</th>
              <th class="text-left px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in items" :key="p.id" class="border-t">
              <td class="px-3 py-2">
                <NuxtLink :to="`/spaces/${p.id}`" class="underline">{{ p.title || '(untitled)' }}</NuxtLink>
              </td>
              <td class="px-3 py-2">{{ p.kind || '—' }}</td>
              <td class="px-3 py-2">{{ p.city || '—' }}</td>
              <td class="px-3 py-2">{{ p.country || '—' }}</td>
              <td class="px-3 py-2">{{ p.status || '—' }}</td>
              <td class="px-3 py-2">{{ p.created_at ? new Date(p.created_at).toLocaleString() : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
