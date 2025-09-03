<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
import heroYachts from '@/assets/images/yachts/superyachts/yacht-006.jpg'
useHead({
  title: 'Yachts on xplor — Sales, Charters & FairSeas',
  meta: [{ name: 'description', content: 'Showcase yachts with immersive tours, capture enquiries, and align incentives with FairSeas.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-100 bg-cover bg-center" :style="{ backgroundImage: `url(${heroYachts})` }" ></div>
<div
  class="absolute inset-0 pointer-events-none z-[10]
         [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]">
</div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Bring clients onboard — from anywhere.</h1>
          <p class="mt-4 text-lg text-white/80">Tours, plans, specs, and crew info in one shareable page. Perfect for sales and charter funnels.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Yacht</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
            <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Learn about FairSeas</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why list your yacht on xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Let buyers and charterers xplor deck-by-deck. Convert curiosity into qualified enquiries.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">360°/3D tours</div><p class="text-sm text-white/70 mt-1">Matterport, 3DVista, Kuula or custom.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Lead capture</div><p class="text-sm text-white/70 mt-1">Forms, WhatsApp, broker email routing.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Fleet discovery</div><p class="text-sm text-white/70 mt-1">Findable on global map & filters.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Privacy</div><p class="text-sm text-white/70 mt-1">Public / Private / PIN for VIPs & press.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Time-in-tour, hotspots, referrers.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">FairSeas</div><p class="text-sm text-white/70 mt-1">Crew-first: 50% of net charter commission.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_YACHT_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Yacht Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Yacht Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Walk the decks</h3>
            <p class="mt-2 text-white/80">Sundeck, salon, staterooms, crew areas — with hotspots to specs and enquiry.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Deck-by-deck navigation</li><li>• Hotspots to PDF/specs</li><li>• UTM-tracked links</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=yachts" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">xplor Yachts</NuxtLink>
              <NuxtLink to="/upload?type=yachts" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload Your Yacht</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Ready to list?</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Yacht</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


