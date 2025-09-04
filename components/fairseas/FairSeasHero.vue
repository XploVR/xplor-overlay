<script setup lang="ts">
const props = withDefaults(defineProps<{
  heroImage: string
  title?: string
  subtitle?: string
}>(), {
  title: 'FairSeas — Crew-First Yachting',
  subtitle: 'Join, verify, and get paid under the FairShare Agreement (FSA), derived from MYBA charter principles.'
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- bg -->
    <div class="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
         :style="{ backgroundImage: `url('${heroImage}')` }"></div>
    <!-- angled shade -->
    <div class="absolute inset-0 pointer-events-none z-0
      [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]"></div>
    <!-- soft blend -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent pointer-events-none z-0"></div>

    <div class="relative z-50 container-x py-16 md:py-24 text-center">
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
        {{ title }}
      </h1>
      <p class="mt-4 text-white/85 max-w-3xl mx-auto">
        {{ subtitle }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <slot name="cta" />
      </div>
    </div>
  </section>
</template>
