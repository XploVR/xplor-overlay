<!-- pages/uploader-test.vue -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Try both casings so a file-name mismatch doesn't block you
const Uploadform = defineAsyncComponent(async () => {
  try {
    const mod = await import('~/components/uploader/Uploadform.vue')
    return mod.default
  } catch (e1) {
    try {
      const mod2 = await import('~/components/uploader/Uploadform.vue')
      return mod2.default
    } catch (e2) {
      // Surface both errors in console for clarity
      console.error('[uploader-test] Failed to load UploadForm.vue:', e1)
      console.error('[uploader-test] Failed to load Uploadform.vue:', e2)
      throw e2
    }
  }
})

function onErr(err: unknown) {
  console.error('[uploader-test] component error:', err)
}
</script>

<template>
  <!-- No layout to remove noise -->
  <div class="container-x mx-auto p-6">
    <h1 class="font-display text-2xl md:text-3xl">Uploader Test</h1>

    <NuxtErrorBoundary @error="onErr">
      <ClientOnly fallback="Loading uploader…">
        <Uploadform />
      </ClientOnly>

      <!-- If the component or its imports throw, you'll see it here -->
      <template #error="{ error }">
        <div class="mt-6 rounded-lg border p-4">
          <h2 class="font-semibold">Upload form failed to mount</h2>
          <p class="text-sm text-x-gray2 mt-1">
            {{ (error && (error.message || error.toString())) || 'Unknown error' }}
          </p>
          <p class="text-xs text-x-gray2 mt-2">
            Check the console for details (e.g. missing exports in utils/media).
          </p>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>