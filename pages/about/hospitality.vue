<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
import heroHosp from '@/assets/images/hospitality-hero.jpg'
useHead({
  title: 'Hospitality on xplor — Hotels, Resorts & Villas',
  meta: [{ name: 'description', content: 'Let guests xplor rooms and amenities in 360°, then route them to booking engines or direct contact.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-100 bg-cover bg-center" :style="{ backgroundImage: `url(${heroHosp})` }" ></div>
      <div
        class="absolute inset-0 pointer-events-none z-[10]
               [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]">
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Let guests tour before they book.</h1>
          <p class="mt-4 text-lg text-white/80">Rooms, suites, villas, amenities, and spa — all explorable. Increase direct bookings with better pre-stay confidence.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=hospitality" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Hospitality Space</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why hospitality teams choose xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Stand out in search, reduce time-to-book, and showcase your brand story in immersive form.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">360° rooms & villas</div><p class="text-sm text-white/70 mt-1">Set clear expectations and reduce churn.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Booking links</div><p class="text-sm text-white/70 mt-1">Route directly to your engine or partners.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Amenities & F&B</div><p class="text-sm text-white/70 mt-1">Spa, pool, lounges — all highlighted.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds & PR</div><p class="text-sm text-white/70 mt-1">Great for press kits and campaigns.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Groups & MICE</div><p class="text-sm text-white/70 mt-1">Tours for events and site inspections.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Understand intent and channel performance.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_HOSPITALITY_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Hospitality Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Hospitality Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Confidence to click “Book”</h3>
            <p class="mt-2 text-white/80">Let guests xplor room types and venues, then push them to the booking engine.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Hotspots to room pages</li><li>• Special offer CTAs</li><li>• UTM tracked links</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=hospitality" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">xplor Hospitality</NuxtLink>
              <NuxtLink to="/upload?type=hospitality" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload Your Property</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Make your property explorable</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=hospitality" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start a Hospitality Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


