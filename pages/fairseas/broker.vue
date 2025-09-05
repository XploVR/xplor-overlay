<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/yachts/scum/scum-001.jpg'

const title = 'FairSeas — Brokers: Partner with Us'
const description = 'How brokerages co-broke with FairSeas under MYBA while crew share is paid from Xplor’s commission via the FSA.'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="Brokers — Partner with FairSeas"
      subtitle="Co-broke under MYBA as usual. Crew share is paid from Xplor’s net commission via the FairShare Agreement (FSA).">
      <template #cta>
        <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Partner with Us</NuxtLink>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="brokers" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
