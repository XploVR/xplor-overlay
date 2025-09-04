<script setup lang="ts">
definePageMeta({ layout: 'default' })
import heroImage from '@/assets/images/yachts/crew/fairshare-hero.jpg'
const title = 'FairSeas — Crew: Join & Get Paid'
const description = 'How crew join FairSeas, verify eligibility, and receive their share under the FSA (derived from MYBA).'
useHead({ title, meta: [{ name: 'description', content: description }] })
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <FairSeasHero :hero-image="heroImage"
      title="Crew — Join & Get Paid"
      subtitle="Sign the FSA, verify your role, and set payout details. Crew share is 50% of Xplor’s net charter commission.">
      <template #cta>
        <NuxtLink to="/fairseas/join" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600">Join as Crew</NuxtLink>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <PayoutDetails />
          <RoleSteps role="crew" />
        </div>
        <FSABox />
      </div>
    </section>
  </div>
</template>
