<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm'|'md'|'lg'
}>(), { variant: 'primary', size: 'md' })
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-lg transition-colors"
    :class="[
      // size
      size==='sm' ? 'px-3 py-1.5 text-sm' : size==='lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm',
      // variants
      variant==='primary' && 'bg-[var(--x-yellow)] text-[var(--x-black)] hover:opacity-90',
      variant==='outline' && 'border border-[var(--x-gray2)]/40 text-[var(--x-white)] hover:bg-white/5',
      variant==='ghost'   && 'text-[var(--x-white)] hover:bg-white/5'
    ]"
  >
    <slot />
  </button>
</template>
