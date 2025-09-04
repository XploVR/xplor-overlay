<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-dvh grid place-items-center p-8">
    <div class="max-w-xl text-center space-y-4">
      <h1 class="text-3xl font-bold">Uh oh â€” {{ props.error.statusCode || 404 }}</h1>
      <p class="text-gray-600">{{ props.error.statusMessage || 'Page not found' }}</p>
      <button class="px-4 py-2 border rounded-xl hover:bg-gray-50" @click="handleError">
        Go Home
      </button>
    </div>
  </div>
</template>

