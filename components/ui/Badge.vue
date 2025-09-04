<script setup lang="ts">
const props = withDefaults(defineProps<{ tone?: 'ok'|'warn'|'neutral' }>(), { tone: 'neutral' })
</script>

<template>
  <span
    class="px-2 py-0.5 text-[10px] rounded uppercase tracking-wide font-typografix"
    :class="[
      tone === 'ok' && 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/40',
      tone === 'warn' && 'bg-xplor-yellow text-black border border-xplor-yellow/30',
      tone === 'neutral' && 'bg-white/5 text-[var(--x-gray)] border border-white/10'
    ]"
  >
    <slot />
  </span>
</template>

