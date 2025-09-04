<script setup lang="ts">
const props = defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits(['close'])
</script>
<template>
<Teleport to="body">
<div v-if="open" class="fixed inset-0 z-50 grid place-items-center p-4">
<div class="absolute inset-0 bg-black/40 z-0 pointer-events-none" @click="emit('close')" />
<div class="relative z-10 w-full max-w-2xl card p-4">
<div class="flex items-center justify-between pb-2 border-b"><h3 class="font-medium">{{ props.title }}</h3>
<button class="px-2 py-1 text-sm" @click="emit('close')">âœ•</button>
</div>
<slot />
</div>
</div>
</Teleport>
</template>
