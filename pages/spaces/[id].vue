<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

type Item = { id: string; title: string; description?: string; image?: string | null }
const route = useRoute()
const id = String(route.params.id || "")
const item = ref<Item | null>(null)
const e1 = ref<string | null>(null)

onMounted(async () => {
  try {
    const urls = [`/api/spaces/${id}`, `/api/properties/${id}`]
    let res: any = null
    for (const u of urls) { try { res = await $fetch(u); if (res) break } catch {} }
    if (!res) res = { id, title: "Demo Space", description: "This is a demo detail view." }
    item.value = { id: String(res.id ?? id), title: String(res.title ?? res.name ?? "Untitled"), description: res.description ?? "", image: res.image ?? res.cover ?? null }
  } catch (err: any) { e1.value = err?.message || "Failed to load" }
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div v-if="e1">Not found.</div>
    <template v-else-if="item">
      <h1 class="text-2xl font-semibold">{{ item.title }}</h1>
      <p class="text-white/70">{{ item.description }}</p>
      <div v-if="item.image" class="rounded-2xl border overflow-hidden">
        <img :src="item.image" alt="" class="w-full h-auto" />
      </div>
    </template>
    <template v-else>
      <p class="text-sm text-white/60">Loading…</p>
    </template>
  </div>
</template>

<style scoped>
</style>
