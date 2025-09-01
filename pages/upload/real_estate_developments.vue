<script setup lang="ts">
import FormsUploadWithMedia from '~/components/forms/UploadWithMedia.vue'
</script>

<template>
  <div class="w-full px-4 md:px-6 lg:px-8 py-8 space-y-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold">Real Estate — Developments</h1>
    <!-- Pass subcategory via prop if your form supports it; otherwise a hidden field -->
    <FormsUploadWithMedia kind="real_estate" subcategory="developments" />
  </div>
</template>
