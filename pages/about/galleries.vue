<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { useHead } from '#imports'
// import heroGalleries from '@/assets/images/galleries-hero.jpg'
useHead({
  title: 'Galleries on Xplor — Exhibitions, Studios & Museums',
  meta: [{ name: 'description', content: 'Curate shows online with immersive tours, wall labels, and shop links for prints and editions.' }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <!-- <div class="absolute inset-0 opacity-45 bg-cover bg-center" :style="{ backgroundImage: `url(${heroGalleries})` }" /> -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">Let audiences walk the show, worldwide.</h1>
          <p class="mt-4 text-lg text-white/80">Xplor helps galleries, studios, and museums present exhibitions with wall labels, audio, and shop links.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/upload?type=galleries" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Upload a Gallery Space</NuxtLink>
            <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Talk to Sales</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why cultural spaces choose Xplor</h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">Accessible, archivable, and shoppable — extend your show beyond the walls.</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Labels & audio</div><p class="text-sm text-white/70 mt-1">Artist texts, captions, and tours.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Shop links</div><p class="text-sm text-white/70 mt-1">Prints, editions, catalogues.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Archives</div><p class="text-sm text-white/70 mt-1">Make every show last forever online.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Embeds & PR</div><p class="text-sm text-white/70 mt-1">Press pages and partnerships.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Access control</div><p class="text-sm text-white/70 mt-1">Public, Private, or PIN for previews.</p></div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><div class="text-lg font-medium">Analytics</div><p class="text-sm text-white/70 mt-1">Understand engagement and referrals.</p></div>
      </div>
    </section>

    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <iframe src="https://my.matterport.com/show/?m=YOUR_GALLERY_TOUR" class="w-full h-full" allow="xr-spatial-tracking; fullscreen; autoplay" allowfullscreen title="Gallery Virtual Tour" />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">Featured Gallery Tour</div>
            <h3 class="mt-3 text-2xl font-semibold">Curate online with context</h3>
            <p class="mt-2 text-white/80">Wall texts, audio guides, and links to enquiries or shop pages.</p>
            <ul class="mt-4 space-y-1 text-sm text-white/70"><li>• Label & media hotspots</li><li>• Shop / enquiry links</li><li>• UTM-tracked CTAs</li></ul>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink to="/spaces?type=galleries" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">Explore Galleries</NuxtLink>
              <NuxtLink to="/upload?type=galleries" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Upload a Space</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Make art explorable</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on Xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=galleries" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start a Gallery Upload</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact Sales</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
