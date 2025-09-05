<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/Yachts/superyachts/yacht-010.jpg'

const title = 'FairSeas — Join & Get Paid'
const description = 'Crew, owners, and management: how to participate in FairSeas and receive commission-sharing payouts under the FSA derived from MYBA.'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="FairSeas — The Crew-First Hub for Yachting"
      subtitle="Clear steps for crew, yacht owners, and management to join FairSeas and receive payouts under the FairShare Agreement (FSA), derived from MYBA.">
      <template #cta>
        <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Crew Instructions</NuxtLink>
        <NuxtLink to="/fairseas/owners" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Owners</NuxtLink>
        <NuxtLink to="/fairseas/management" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Management</NuxtLink>
        <NuxtLink to="/fairseas/broker" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Brokers</NuxtLink>
        <NuxtLink to="/fairseas/clients" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Charter Clients</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <h2 class="text-3xl font-semibold tracking-tight">How Payouts Work</h2>
          <p class="mt-3 text-white/80">
            Once a charter settles and Xplor’s commission clears under MYBA timelines, <strong>50% of Xplor’s net charter commission</strong> is allocated to verified crew per the FSA.
          </p>
          <div class="mt-6">
            <PayoutDetails />
          </div>
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
