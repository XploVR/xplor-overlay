<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
import heroDevs from '@/assets/images/developments/developments-3.jpg'
useHead({
  title: 'Developments on xplor — Off-plan, Masterplans & Sales',
  meta: [{ name: 'description', content: 'Launch off-plan with immersive tours, unit mix, docs, and investor-ready microsites.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none opacity-100 bg-cover bg-center z-0" :style="{ backgroundImage: `url(${heroDevs})` }" ></div>
      <div
        class="absolute inset-0 pointer-events-none z-[10] [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)] z-0">
      </div>
      <div class="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/60 to-transparent z-0" ></div>
      <div class="relative z-50 container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Tell the whole story — before ground breaks.</h1>
          <p class="mt-4 text-lg text-white/80">xplor packages CGIs, 360° tours, unit plans, and docs into a single, shareable source of truth.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=developments" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Development</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why developers choose xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Make your vision explorable and investor-ready with live links and up-to-date collateral.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">CGI + 360° tours</div><p class="text-sm text-white/70 mt-1">Bring masterplans and units to life.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Unit lists & filters</div><p class="text-sm text-white/70 mt-1">Mix, availability, and key metrics.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Docs & data room</div><p class="text-sm text-white/70 mt-1">Brochures, specs, terms, investor decks.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Phased privacy</div><p class="text-sm text-white/70 mt-1">Public, broker-only, or PIN for VIPs.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeddable</div><p class="text-sm text-white/70 mt-1">Microsites that drop into any stack.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Investor interest, referrals, geo heat.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_DEVELOPMENT_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Development Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Development Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">From masterplan to microsite</h3>
            <p class="mt-2 text-white/80">One link for stakeholders with tours, plans, and controlled access to docs.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Unit plans & specs</li><li>• Doc links & data room</li><li>• UTM-tracked CTAs</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=developments" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">xplor Developments</NuxtLink>
              <NuxtLink to="/upload?type=developments" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload a Development</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Make your vision explorable</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=developments" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start a Development Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>





