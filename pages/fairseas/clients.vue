<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/yachts/superyachts/yacht-012.jpg'

const title = 'FairSeas — Charter Clients: How It Works'
const description = 'What charter clients can expect under MYBA with FairSeas: booking flow, no extra cost for crew commission share, and clear close-out.'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="Charter Clients — Book with Confidence"
      subtitle="Your MYBA charter stays the same. FairSeas pays crew from Xplor’s net commission via the FSA — no extra cost to you.">
      <template #cta>
        <NuxtLink to="/yachts" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Explore Yachts</NuxtLink>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="clients" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
