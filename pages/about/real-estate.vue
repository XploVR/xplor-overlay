<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
// import heroRealEstate from '@/assets/images/real-estate-hero.jpg'

useHead({
  title: 'Real Estate on Xplor — Sell and Lease with Immersive Tours',
  meta: [{ name: 'description', content: 'Market homes, villas, and offices with immersive 360°/3D tours, lead capture, and map discovery.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <!-- <div class="absolute inset-0 opacity-45 bg-cover bg-center" :style="{ backgroundImage: `url(${heroRealEstate})` }" /> -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Show, don’t tell. Close faster.</h1>
          <p class="mt-4 text-lg text-white/80">Xplor turns listings into walkable experiences — boosting enquiries and pre-qualifying buyers before viewings.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=real_estate" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Real Estate Space</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why real estate teams choose Xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Qualify buyers online, reduce wasted viewings, and keep your pipeline moving with better media and data.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Immersive 360° / 3D</div><p class="text-sm text-white/70 mt-1">Matterport, 3DVista, Kuula — or custom viewers.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Lead capture & CRM</div><p class="text-sm text-white/70 mt-1">Route to forms/WhatsApp, export or sync later.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Floor plans & docs</div><p class="text-sm text-white/70 mt-1">Add plans, brochures, disclosures in one place.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Privacy controls</div><p class="text-sm text-white/70 mt-1">Public, Private, or PIN for off-market deals.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds everywhere</div><p class="text-sm text-white/70 mt-1">Add to portals, sites, emails, and press kits.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Time in tour, hotspots, referrals, geography.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_REAL_ESTATE_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Real Estate Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Real Estate Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Walkthrough before the walkthrough</h3>
            <p class="mt-2 text-white/80">Drive qualified enquiries by letting buyers explore layout, finish, and flow ahead of time.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70">
              <li>• Hotspots to brochure / floor plan / enquiry</li>
              <li>• UTM-tracked links</li>
              <li>• Multi-language labels</li>
            </ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=real_estate" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">Explore Listings</NuxtLink>
              <NuxtLink to="/upload?type=real_estate" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload a Property</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Turn your listings into destinations</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on Xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=real_estate" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start a Real Estate Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
