<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ multiple?: boolean }>()
const openItems = ref<string[]>([])
const toggle = (val: string) => {
  if (props.multiple) {
    openItems.value.includes(val)
      ? openItems.value = openItems.value.filter(v => v !== val)
      : openItems.value.push(val)
  } else {
    openItems.value = openItems.value[0] === val ? [] : [val]
  }
}
provide('accordion', { openItems, toggle })
</script>

<template>
  <div class="w-full">
    <slot />
  </div>
</template>

