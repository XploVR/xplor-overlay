<script setup lang="ts">
import { inject } from 'vue'
const props = defineProps<{ value: string }>()
const { openItems, toggle } = inject<any>('accordion')
const isOpen = computed(() => openItems.value.includes(props.value))
</script>

<template>
  <div class="border-b border-white/10">
    <slot name="trigger" :isOpen="isOpen" :toggle="() => toggle(props.value)" />
    <div v-show="isOpen" class="pb-3">
      <slot />
    </div>
  </div>
</template>

