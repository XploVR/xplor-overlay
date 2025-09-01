<script setup lang="ts">
import type { MediaItem } from '~/types/media'
const props = defineProps<{ item: MediaItem; canPrimary?: boolean }>()
const emit = defineEmits(['remove','primary'])
</script>
<template>
<div class="card overflow-hidden">
<div class="aspect-video bg-x-gray/20 grid place-items-center">
<img v-if="item.thumbUrl || item.blobUrl || item.url" :src="item.thumbUrl || item.blobUrl || item.url" class="h-full w-full object-cover" />
<span v-else class="text-x-gray2 text-sm">No preview</span>
</div>
<div class="p-3 space-y-2">
<div class="flex items-center justify-between gap-2">
<p class="text-sm truncate" :title="item.name">{{ item.name }}</p>
<span class="chip" v-if="item.primary">Primary</span>
</div>
<ProgressBar :value="item.progress ?? 0" />
<div class="flex items-center justify-between text-sm">
<button class="underline" @click="$emit('remove')">Delete</button>
<button v-if="canPrimary" class="underline" @click="$emit('primary')">Set Primary</button>
</div>
<p v-if="item.error" class="text-xs text-red-600">{{ item.error }}</p>
</div>
</div>
</template>