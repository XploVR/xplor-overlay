<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/yachts/owners/owner-001.jpg'
const title = 'FairSeas — Owners: Enable FairSeas'
const description = 'How yacht owners enable FairSeas, acknowledge the FSA, and coordinate with management under MYBA.'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="Owners — Enable FairSeas"
      subtitle="Keep MYBA terms intact while allowing crew to share from Xplor’s commission under the FSA.">
      <template #cta>
        <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Contact Us</NuxtLink>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="owners" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
