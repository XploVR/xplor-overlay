<script setup lang="ts">
const props = defineProps<{ items?: any[] }>()
const safe = computed(() => Array.isArray(props.items) ? props.items : [])
</script>

<template>
  <div>
    <div v-if="safe.length === 0" class="card p-6 text-x-gray2">No listings yet.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <article v-for="it in safe" :key="it.id ?? JSON.stringify(it)" class="card p-4 hover:shadow transition">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-medium">{{ it.title ?? 'Untitled' }}</h3>
            <p class="text-sm text-x-gray2">{{ it.city ?? '—' }}</p>
          </div>
          <span class="chip">€{{ Intl.NumberFormat().format(it.price ?? 0) }}</span>
        </div>
        <NuxtLink
          v-if="it.id"
          :to="`/spaces/${it.id}`"
          class="mt-3 inline-block text-sm underline"
        >View details</NuxtLink>
      </article>
    </div>
  </div>
</template>

