<!-- pages/fairseas/thanks.vue -->
<script setup lang="ts">
const route = useRoute()

const eventParam = computed(() => String(route.query.event || '').toLowerCase())
const status = computed(() => {
  switch (eventParam.value) {
    case 'signing_complete': return 'Complete'
    case 'decline': return 'Declined'
    case 'cancel': return 'Canceled'
    default: return 'Done'
  }
})
</script>

<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-semibold">DocuSign — {{ status }}</h1>
    <p class="mt-2 text-white/70">
      Thank you. You can close this window or return to your dashboard.
    </p>

    <div class="mt-4 rounded-xl border border-white/10 p-4 text-sm text-white/70">
      <div v-if="route.query.event">Event: <strong>{{ route.query.event }}</strong></div>
      <div v-if="route.query.envelopeId">Envelope: <strong>{{ route.query.envelopeId }}</strong></div>
    </div>

    <NuxtLink to="/fairseas/crew" class="mt-6 inline-flex items-center rounded-xl bg-teal-500 text-black px-4 py-2">
      Back to Crew
    </NuxtLink>
  </div>
</template>
