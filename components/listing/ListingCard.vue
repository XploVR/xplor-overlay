<script setup lang="ts">
const props = defineProps<{
  id: string
  title: string
  city?: string
  country?: string
  thumbnail_url?: string | null
}>()
</script>

<template>
  <NuxtLink :to="`/spaces/${props.id}`" class="block border rounded overflow-hidden hover:shadow">
    <div class="aspect-[4/3] bg-gray-100">
      <img v-if="props.thumbnail_url" :src="props.thumbnail_url" alt="" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-500">No image</div>
    </div>
    <div class="p-3">
      <div class="font-medium truncate">{{ props.title }}</div>
      <div class="text-sm text-gray-600 truncate">
        {{ props.city }}<span v-if="props.city && props.country"> · </span>{{ props.country }}
      </div>
    </div>
  </NuxtLink>
</template>

