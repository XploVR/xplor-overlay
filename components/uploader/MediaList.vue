<script setup lang="ts">
import type { PropType } from 'vue'

// Keep in sync with your composable type
type MediaItem = {
  id: string
  name: string
  url?: string
  thumb?: string
  width?: number
  height?: number
  duration?: number | null
  order?: number
  primary?: boolean
}

const props = defineProps({
  items: { type: Array as PropType<MediaItem[]>, required: true },
  primaryMode: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:items', value: MediaItem[]): void
  (e: 'remove', id: string): void
  (e: 'primary', id: string): void
}>()

function move(idx: number, dir: -1 | 1) {
  const arr = props.items.slice()
  const j = idx + dir
  if (j < 0 || j >= arr.length) return
  const tmp = arr[idx]
  arr[idx] = arr[j]
  arr[j] = tmp
  // recompute order
  arr.forEach((it, i) => (it.order = i))
  emit('update:items', arr)
}
</script>

<template>
  <div v-if="!items.length" class="text-sm text-x-gray2">No items yet.</div>

  <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="(it, i) in items" :key="it.id" class="card overflow-hidden">
      <div class="aspect-video bg-gray-100 grid place-items-center">
        <img
          v-if="it.thumb || (it.url && it.url.startsWith('blob:'))"
          :src="it.thumb || it.url"
          alt=""
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <template v-else>
          <p class="text-xs text-x-gray2 px-2 break-all truncate">{{ it.name }}</p>
        </template>
      </div>

      <div class="p-3 space-y-2 text-sm">
        <div class="flex items-center justify-between gap-2">
          <span class="truncate" :title="it.name">{{ it.name }}</span>
          <span v-if="primaryMode && it.primary" class="text-[10px] uppercase bg-black text-white px-1.5 py-0.5 rounded">Primary</span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <button class="btn btn-ghost !px-2" title="Move left" @click="move(i, -1)">←</button>
            <button class="btn btn-ghost !px-2" title="Move right" @click="move(i, 1)">→</button>
            <button v-if="primaryMode && !it.primary" class="btn btn-ghost !px-2" title="Set primary" @click="$emit('primary', it.id)">★</button>
          </div>
          <button class="btn btn-ghost !px-2 text-red-600" title="Remove" @click="$emit('remove', it.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
