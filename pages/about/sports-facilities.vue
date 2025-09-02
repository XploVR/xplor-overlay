<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
// import heroSports from '@/assets/images/sports-hero.jpg'
useHead({
  title: 'Sports Facilities on Xplor — Stadiums, Clubs & Complexes',
  meta: [{ name: 'description', content: 'Tour stadiums, clubs, and training centres online. Drive memberships, bookings, and events.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <!-- <div class="absolute inset-0 opacity-45 bg-cover bg-center" :style="{ backgroundImage: `url(${heroSports})` }" /> -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Let fans and members explore your venue.</h1>
          <p class="mt-4 text-lg text-white/80">Showcase hospitality suites, training areas, courts, and arenas — then route to bookings and memberships.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=sports" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Sports Facility</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why sports venues choose Xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Elevate sales, events, and recruitment with immersive previews.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Hospitality & boxes</div><p class="text-sm text-white/70 mt-1">Sell suites with accurate previews.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Training facilities</div><p class="text-sm text-white/70 mt-1">Show equipment, layout, and flow.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Event sales</div><p class="text-sm text-white/70 mt-1">Route to venue hire enquiries.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Access control</div><p class="text-sm text-white/70 mt-1">Public / Private / PIN for partners.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds</div><p class="text-sm text-white/70 mt-1">Drop tours into sites and proposals.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">See what spaces convert best.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_SPORTS_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Sports Facility Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Sports Facility Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Sell the experience</h3>
            <p class="mt-2 text-white/80">Memberships, suites, events — all with accurate previews and clear CTAs.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Hospitality & seating previews</li><li>• Venue hire CTAs</li><li>• UTM tracked links</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=sports" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">Explore Sports Venues</NuxtLink>
              <NuxtLink to="/upload?type=sports" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload a Facility</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Turn visits into bookings</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on Xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=sports" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start a Sports Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
