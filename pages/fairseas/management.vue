<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/yachts/marinas/marina-002.jpg'
const title = 'FairSeas — Management: Coordinate & Verify'
const description = 'How management companies coordinate MYBA close-out, confirm commission receipt, and trigger crew payouts under the FSA.'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="Management — Coordinate & Verify"
      subtitle="Confirm MYBA charter settlement, crew list, and commission receipt so FairSeas can disburse under the FSA.">
      <template #cta>
        <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Talk to Us</NuxtLink>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="management" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
