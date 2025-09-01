<!-- app/error.vue -->
<script setup lang="ts">
const props = defineProps<{ error: any }>()
</script>

<template>
  <NuxtLayout>
    <div class="container-x py-12">
      <h1 class="text-2xl font-bold">Something went wrong</h1>
      <p class="mt-2 text-sm text-x-gray2">Route: {{ $route.fullPath }}</p>
      <pre class="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">
{{ props.error?.message }}
      </pre>
    </div>
  </NuxtLayout>
</template>
