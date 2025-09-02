<!-- components/BrandXplor.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  label?: string
  size?: 'inherit'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'5xl'|'6xl'|'7xl'|'8xl'|'9xl'|'10xl'
  mark?: boolean
  glow?: boolean
}>(), {
  as: 'span',
  label: 'Xplor',
  size: 'md',
  mark: false,
  glow: false,
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':  return 'text-xs'
    case 'sm':  return 'text-sm'
    case 'md':  return 'text-base'
    case 'lg':  return 'text-lg'
    case 'xl':  return 'text-xl'
    case '2xl': return 'text-2xl'
    case '3xl': return 'text-3xl'
    case '4xl': return 'text-4xl'
    case '5xl': return 'text-5xl'
    case '6xl': return 'text-6xl'
    case '7xl': return 'text-7xl'
    case '8xl': return 'text-8xl'
    case '9xl': return 'text-9xl'
    case '10xl': return 'text-10xl'
    default:    return 'text-base'
  }
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'inline-flex items-center gap-2 align-baseline',
      glow && 'brand-glow'
    ]"
    aria-label="Xplor"
  >
    <span
      v-if="mark"
      class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-xplor-yellow text-black font-bold leading-none select-none"
    >X</span>

    <span class="brand-xplor" :class="sizeClass">{{ label }}</span>
  </component>
</template>
