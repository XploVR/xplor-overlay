<!-- pages/about/fairseas.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { Users, Star, DollarSign, Ship, Award, TrendingUp, CheckCircle, Shield } from 'lucide-vue-next'

// Ensure this path exists in /assets
import heroImage from '@/assets/images/yachts/crew/crew-009.jpg'

const brandText = 'Xplor'
const title = `FairSeas by ${brandText} — 50/50 Crew Commission`
const description = `FairSeas shares 50% of ${brandText}’s net charter commission with verified crew on eligible charters. Transparent, fair, crew-first.`

const ldJson = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "FairSeas (Crew Commission Sharing)",
  "alternateName": "FairShare / FairSeas",
  "provider": { "@type": "Organization", "name": "Xplor" },
  "description": "FairSeas shares 50% of Xplor’s net charter commission with verified crew on eligible charters.",
  "areaServed": "Worldwide",
  "audience": { "@type": "Audience", "audienceType": "Yacht crew" },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Crew receive 50% of Xplor's net charter commission, split equally among verified crew onboard."
  },
  // 👇 this is the About page’s own URL
  "url": "/about/fairseas",
  // 👇 point to your canonical crew page
  "termsOfService": "/fairseas/crew"
}

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: heroImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: heroImage }
  ],
  // 👇 canonical for the About page
  link: [{ rel: 'canonical', href: '/about/fairseas' }],
  script: [{ type: 'application/ld+json', children: JSON.stringify(ldJson) }]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- HERO (image + overlays; text above everything) -->
    <section class="relative overflow-hidden">
      <!-- background image -->
      <div
        class="absolute inset-0 bg-cover bg-center hero-overlay z-0 pointer-events-none"
        :style="{ backgroundImage: `url('${heroImage}')` }"
        aria-hidden="true"
      ></div>
      <!-- strong angled shade -->
      <div
        class="absolute inset-0 hero-overlay
               [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)] z-0 pointer-events-none"
        aria-hidden="true"
      ></div>
      <!-- subtle blend -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent hero-overlay z-0 pointer-events-none" aria-hidden="true"></div>

      <div class="relative z-50 container-x py-16 md:py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
          FairSeas by
          <BrandXplor size="inherit" class="mx-1 text-black" />
        </h1>

        <p class="mt-4 text-lg text-white/85 max-w-3xl mx-auto">
          Because <strong>crew deserve a cut of the commission</strong>. FairSeas shares
          <strong>50% of our net charter commission</strong> with active crew on yachts chartered through Xplor.
          No tiers. No secrets. Just fair.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <!-- ✅ Goes to your landing page: pages/fairseas/index.vue -->
          <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
            Explore FairSeas
          </NuxtLink>
          <!-- ✅ Crew instructions page -->
          <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10 focus:outline-none focus:ring-2 focus:ring-teal-400">
            Crew Instructions
          </NuxtLink>
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
            Upload a Yacht
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Quick role links -->
    <section class="container-x py-6">
      <div class="flex flex-wrap justify-center gap-3 text-sm">
        <NuxtLink to="/fairseas/crew" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Crew</NuxtLink>
        <NuxtLink to="/fairseas/owners" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Owners</NuxtLink>
        <NuxtLink to="/fairseas/management" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Management</NuxtLink>
        <!-- 👇 match your actual file name: broker.vue (singular) -->
        <NuxtLink to="/fairseas/broker" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Brokers</NuxtLink>
        <NuxtLink to="/fairseas/clients" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Charter Clients</NuxtLink>
      </div>
    </section>

    <!-- The rest of your sections below are unchanged, only links were fixed -->
    <!-- 50/50 SPLIT -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">50/50 Commission Split</h2>
      <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
        Every eligible charter booked via Xplor triggers a <strong>50/50 split of our net commission</strong>:
      </p>
      <div class="mt-8 grid sm:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center">
          <div class="text-5xl font-bold">50%</div>
          <p class="mt-2 text-white/80">For Crew (shared equally among verified onboard crew)</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center">
          <div class="text-5xl font-bold">50%</div>
          <p class="mt-2 text-white/80">For Xplor (operations, platform & brokerage)</p>
        </div>
      </div>
    </section>

    <!-- WHAT / WHY -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <div class="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 class="text-3xl font-semibold tracking-tight">What is FairSeas?</h2>
            <p class="mt-3 text-white/80">
              FairSeas is Xplor’s commission-sharing program designed for active crew on charter yachts.
              If your yacht is chartered through Xplor — as the central agent or a 3rd-party broker —
              we split <strong>50% of our net commission</strong> equally among the verified crew on board.
            </p>
          </div>
          <div>
            <h2 class="text-3xl font-semibold tracking-tight">Why FairSeas Exists</h2>
            <p class="mt-3 text-white/80">
              Crew help close deals, make guests return, and create unforgettable experiences — yet traditionally receive nothing from brokerage commission.
              That’s broken. <strong>FairSeas fixes it</strong> with transparent, fair compensation.
            </p>
          </div>
        </div>

        <div class="mt-10 grid md:grid-cols-2 gap-6">
          <div class="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 class="font-medium text-lg">Traditional Model</h3>
            <ul class="mt-3 space-y-2 text-sm text-white/70">
              <li>• Brokerages keep all commission</li>
              <li>• Crew get no financial recognition</li>
              <li>• Hidden fee structures</li>
              <li>• No transparency</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
            <h3 class="font-medium text-lg">FairSeas Model</h3>
            <ul class="mt-3 space-y-2 text-sm text-white/80">
              <li>• <strong>50% commission</strong> shared with crew</li>
              <li>• Recognition for real contribution</li>
              <li>• Complete transparency</li>
              <li>• Fair compensation system</li>
            </ul>
          </div>
        </div>

        <blockquote class="mt-8 max-w-3xl mx-auto text-center text-white/85 italic">
          “Crew aren’t just service providers — they’re the reason the charter succeeds. FairSeas puts that into action.”<br />
          <span class="not-italic text-white/60">— Capt. Johnny Drummond, Founder, Xplor</span>
        </blockquote>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">How It Works</h2>
      <div class="mt-10 grid md:grid-cols-4 sm:grid-cols-2 gap-6">
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          <div class="text-3xl font-bold">1</div>
          <h3 class="mt-2 font-medium">Yacht listed with Xplor</h3>
          <p class="text-sm text-white/70 mt-2">Create or link your yacht profile for charter.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          <div class="text-3xl font-bold">2</div>
          <h3 class="mt-2 font-medium">Xplor secures a booking</h3>
          <p class="text-sm text-white/70 mt-2">As central agent or a 3rd-party broker.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          <div class="text-3xl font-bold">3</div>
          <h3 class="mt-2 font-medium">FairSeas is triggered</h3>
          <p class="text-sm text-white/70 mt-2">50% of net commission is split evenly among verified crew.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          <div class="text-3xl font-bold">4</div>
          <h3 class="mt-2 font-medium">You get paid</h3>
          <p class="text-sm text-white/70 mt-2">Simple, fair, and direct.</p>
        </div>
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">Explore FairSeas</NuxtLink>
        <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10">Crew Instructions & Upload Guide</NuxtLink>
      </div>
    </section>

    <!-- ELIGIBILITY, WHY JOIN, QUICK START, CRI+, BEYOND CREW, COMING SOON, FINAL CTA -->
    <!-- (unchanged content below; only links above were adjusted) -->

    <!-- … keep your remaining sections exactly as in your current file … -->

  </div>
</template>

<style scoped>
.hero-overlay { pointer-events: none; z-index: 0; }
</style>
