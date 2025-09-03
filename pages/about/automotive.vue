<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
import heroAuto from '@/assets/images/cars/cars-005.jpg'
useHead({
  title: 'Automotive on xplor — Showrooms, Launches & Events',
  meta: [{ name: 'description', content: 'Immersive vehicle walkarounds and showrooms that convert interest into test drives and sales.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-100 bg-cover bg-center" :style="{ backgroundImage: `url(${heroAuto})` }" ></div>
      <div
        class="absolute inset-0 pointer-events-none z-[10]
               [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]">
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Walk the showroom from your phone.</h1>
          <p class="mt-4 text-lg text-white/80">xplor lets shoppers xplor interiors, options, and trims in 360° — then book a test drive.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=automotive" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload an Automotive Space</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why automotive brands choose xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Make every launch or event persist online as an interactive experience.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">360° interiors</div><p class="text-sm text-white/70 mt-1">HMI, infotainment, material detail — all visible.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Hotspots & specs</div><p class="text-sm text-white/70 mt-1">Trim, packages, and feature callouts.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Test drive funnels</div><p class="text-sm text-white/70 mt-1">Route to booking flows or dealer contact.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Events & pop-ups</div><p class="text-sm text-white/70 mt-1">Make them evergreen and shareable.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds</div><p class="text-sm text-white/70 mt-1">Add in press kits and landing pages.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">See engagement by model and region.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_AUTOMOTIVE_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Automotive Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Automotive Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">xplor trims & options</h3>
            <p class="mt-2 text-white/80">Let shoppers compare interiors, materials, and features with contextual hotspots.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Hotspots to specs / PDP</li><li>• Dealer/test-drive CTAs</li><li>• UTM-tracked links</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=automotive" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">xplor Automotive</NuxtLink>
              <NuxtLink to="/upload?type=automotive" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload a Showroom</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Launch once. Showcase forever.</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=automotive" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start an Automotive Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


