<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: item, error: e1 }  = await useFetch(`/api/properties/${id}`, { server: true })
const { data: media, error: e2 } = await useFetch(`/api/property-media?property_id=${id}`, { server: true })
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div v-if="e1">Not found.</div>
    <template v-else-if="item">
      <h1 class="text-2xl font-semibold">{{ item.title }}</h1>
      <p class="text-gray-600">{{ item.description }}</p>

      <div class="text-sm text-gray-500">
        {{ item.address_line1 }} <span v-if="item.address_line1 && (item.city || item.country)"> · </span>
        {{ item.city }} <span v-if="item.city && item.country"> · </span>
        {{ item.country }}
      </div>

      <div v-if="media?.length" class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <img v-for="m in media" :key="m.id" :src="m.url" class="w-full h-48 object-cover rounded" />
      </div>
      <div v-else class="text-gray-500">No media yet.</div>
    </template>
  </div>
  <NuxtLink :to="`/spaces/${route.params.id}/request-access`" class="btn btn-ghost">
  Request Access
</NuxtLink>

</template>
