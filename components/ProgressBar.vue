<script setup lang="ts">
const props = defineProps<{ value?: number }>()
</script>
<template>
<div class="h-2 w-full rounded bg-x-gray/30 overflow-hidden">
<div class="h-full bg-x-yellow" :style="{ width: `${Math.min(props.value ?? 0, 100)}%` }" />
</div>
</template>