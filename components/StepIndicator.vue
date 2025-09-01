<script setup lang="ts">
const props = defineProps<{ steps: string[]; current: number }>()
</script>
<template>
<ol class="flex flex-wrap gap-2">
<li v-for="(s,i) in steps" :key="s" class="flex items-center gap-2">
<span class="h-6 w-6 grid place-items-center rounded-full text-xs"
:class="i<=current ? 'bg-x-black text-white' : 'bg-x-gray/50 text-x-deep'">{{ i+1 }}</span>
<span class="text-sm" :class="i<=current ? 'font-medium' : 'text-x-gray2'">{{ s }}</span>
<span v-if="i<steps.length-1" class="mx-2 text-x-gray2">›</span>
</li>
</ol>
</template>