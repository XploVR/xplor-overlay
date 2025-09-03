<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
// import heroAv from '@/assets/images/aviation-hero.jpg'
useHead({
  title: 'Aviation on Xplor — Jets, FBOs & Training',
  meta: [{ name: 'description', content: 'Cabin tours, operator funnels, and training spaces you can walk through online.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <!-- <div class="absolute inset-0 opacity-45 bg-cover bg-center" :style="{ backgroundImage: `url(${heroAv})` }" ></div>
<div
  class="absolute inset-0 pointer-events-none z-[10]
         [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]">
</div> -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Cabins and facilities, open 24/7.</h1>
          <p class="mt-4 text-lg text-white/80">Let clients explore configurations and finishes, then route to charter or management contact.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=aviation" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload an Aviation Space</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why aviation teams choose Xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">From cabin tours to FBO walkthroughs and training centres — make it explorable online.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Cabin 360°</div><p class="text-sm text-white/70 mt-1">Layouts, materials, and seating plans.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Operator funnels</div><p class="text-sm text-white/70 mt-1">Lead to charter or management contact.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">FBO & training</div><p class="text-sm text-white/70 mt-1">Tour facilities for clients and staff.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Privacy</div><p class="text-sm text-white/70 mt-1">Public, private, or PIN access.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds</div><p class="text-sm text-white/70 mt-1">Operator sites and PR packs.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Understand cabin and page engagement.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_AVIATION_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Aviation Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Aviation Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Configuration clarity</h3>
            <p class="mt-2 text-white/80">Show cabin layouts and materials while directing prospects to the right next step.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Hotspots to spec & enquiry</li><li>• Operator routing</li><li>• UTM-tracked links</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=aviation" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">Explore Aviation</NuxtLink>
              <NuxtLink to="/upload?type=aviation" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload an Aircraft</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Make every inspection instant</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on Xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=aviation" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start an Aviation Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


