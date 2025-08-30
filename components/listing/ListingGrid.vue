<script setup lang="ts">
import ListingCard from '~/components/listing/ListingCard.vue'
type Item = { id:string; title:string; city?:string; country?:string; thumbnail_url?:string|null }
const props = defineProps<{ items: Item[] }>()
</script>

<template>
  <div v-if="!props.items?.length" class="text-gray-600 border rounded p-6">
    No spaces yet.
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <ListingCard
      v-for="it in props.items"
      :key="it.id"
      :id="it.id"
      :title="it.title"
      :city="it.city"
      :country="it.country"
      :thumbnail_url="it.thumbnail_url"
    />
  </div>
</template>
