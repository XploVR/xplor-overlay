<script setup lang="ts">
const props = withDefaults(defineProps<{ tone?: 'ok'|'warn'|'neutral' }>(), { tone: 'neutral' })
</script>

<template>
  <span
    class="px-2 py-0.5 text-[10px] rounded uppercase tracking-wide"
    :class="[
      tone==='ok' && 'bg-green-900/40 text-green-200 border border-green-700/40',
      tone==='warn' && 'bg-yellow-900/30 text-yellow-200 border border-yellow-700/40',
      tone==='neutral' && 'bg-white/5 text-[var(--x-gray)] border border-white/10'
    ]"
  >
    <slot />
  </span>
</template>
