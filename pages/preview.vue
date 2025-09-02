<script setup lang="ts">
import type { ListingDraft } from '~/types/media'
const draftId = 'draft_001'
const draft = useLocalStorage<ListingDraft>(`xplor_draft_${draftId}`, null as any)
</script>
<template>
<div class="container-x py-8 space-y-6">
<h1 class="text-2xl font-semibold">Preview</h1>
<div v-if="!draft" class="card p-6">No draft found.</div>
<div v-else class="space-y-4">
<div class="card p-4">
<h2 class="font-display text-xl">{{ draft.details.title }}</h2>
<p class="text-x-gray2">{{ draft.details.city }} • €{{ draft.details.price?.toLocaleString() }}</p>
</div>
<div class="grid md:grid-cols-2 gap-4">
<img v-for="p in draft.media.primaryPhotos" :key="p.id" :src="p.thumbUrl || p.url || p.blobUrl" class="w-full rounded-xl"/>
</div>
</div>
</div>
</template>
