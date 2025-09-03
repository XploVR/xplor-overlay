<!-- pages/about/retail.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { useHead } from '#imports'
// Swap this with your real asset (or comment it out to use a solid gradient)
import heroRetail from '@/assets/images/heroretail.jpg'

useHead({
  title: 'Retail on xplor Immersive Stores, Pop-ups & Showrooms',
  meta: [
    {
      name: 'description',
      content:
        'Turn every store into a shoppable destination. xplor helps retailers showcase immersive 360°/3D tours, drive footfall, capture leads, and measure engagement.'
    }
  ]
})
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-100 bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroRetail})` }"
      ></div>
<div
  class="absolute inset-0 pointer-events-none z-[10]
         [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)]">
</div>
      <!-- left-to-right dark overlay for white text legibility -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
            Retail that customers can step into from anywhere.
          </h1>
          <p class="mt-4 text-lg text-white/80">
            xplor transforms stores, pop-ups, and showrooms into immersive, always-open experiences.
            Let shoppers browse layouts, discover products, and take action before they ever walk in.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink
              to="/upload?type=retail"
              class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90"
            >
              Upload a Retail Space
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10"
            >
              Talk to Sales
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY RETAIL ON xplor -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">
        Why your retail space belongs on xplor
      </h2>
      <p class="mt-3 text-center text-white/70 max-w-3xl mx-auto">
        Visual merchandising matters. With xplor, every store visit can start online increasing
        discovery, intent, and in-store conversions while giving you clear analytics and control.
      </p>

      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Benefit cards -->
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Immersive storefront</div>
          <p class="text-sm text-white/70 mt-1">
            360Â°/3D walkthroughs showcase layout, collections, and ambience. Perfect for launches,
            flagships, and pop-ups.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Shoppable actions</div>
          <p class="text-sm text-white/70 mt-1">
            Link hotspots to PDPs, promos, or booking flows. Capture leads or route to your ecommerce.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Map discovery</div>
          <p class="text-sm text-white/70 mt-1">
            Get found on Xplorâ€™s global map. Geo-search drives local footfall and destination retail.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Campaign-ready</div>
          <p class="text-sm text-white/70 mt-1">
            Launch seasonal edits, collaborations, and travel retail with linkable, embeddable tours.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Privacy & control</div>
          <p class="text-sm text-white/70 mt-1">
            Public, Private, or PIN share with partners or press before you go live.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">Analytics that matter</div>
          <p class="text-sm text-white/70 mt-1">
            View heat, time in scene, click-throughs, and top referrers. Pro plans unlock exports and API.
          </p>
        </div>
      </div>
    </section>

    <!-- SHOWCASE: Retail tour card -->
    <section class="container-x pb-4">
      <div class="rounded-3xl border border-white/10 bg-white/[0.05] overflow-hidden">
        <div class="grid md:grid-cols-2">
          <div class="aspect-video md:aspect-auto md:h-full">
            <!-- Swap the src with your real retail tour URL (Matterport, 3DVista, Kuula, custom) -->
            <iframe
              src="https://my.matterport.com/show/?m=YOUR_TOUR_ID"
              class="w-full h-full"
              allow="xr-spatial-tracking; fullscreen; autoplay"
              allowfullscreen
              title="Retail Virtual Tour"
            />
          </div>
          <div class="p-6 md:p-8">
            <div class="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 inline-block">
              Featured Retail Tour
            </div>
            <h3 class="mt-3 text-2xl font-semibold">Flagship Store Immersive Walkthrough</h3>
            <p class="mt-2 text-white/80">
              xplor the floor set, discover highlighted products, and preview the in-store experience.
              Hotspots link to PDPs and promos to drive both ecommerce and footfall.
            </p>

            <ul class="mt-4 space-y-1 text-sm text-white/70">
              <li>â€¢ Hotspots: PDP / Lookbook / Promo</li>
              <li>â€¢ UTM-tracked outbound links</li>
              <li>â€¢ Multi-language labels</li>
            </ul>

            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink
                to="/spaces?type=retail"
                class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90"
              >
                xplor Retail Spaces
              </NuxtLink>
              <NuxtLink
                to="/upload?type=retail"
                class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10"
              >
                Upload Your Store
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">How it works</h2>
      <div class="mt-8 grid md:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">1) Upload</div>
          <p class="text-sm text-white/70 mt-1">
            Add your tour (Matterport, 3DVista, Kuula, custom), photos, video, and product links.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">2) Publish & embed</div>
          <p class="text-sm text-white/70 mt-1">
            Share publicly, privately, or via PIN. Embed on your website, press pages, and social.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div class="text-lg font-medium">3) Measure & optimize</div>
          <p class="text-sm text-white/70 mt-1">
            See engagement, clicks, and referrers. Iterate your merchandising and drive more conversions.
          </p>
        </div>
      </div>
    </section>

    <!-- FUTURE-PROOF -->
    <section class="container-x pb-14 md:pb-16">
      <div class="rounded-3xl border border-white/10 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(232,247,147,0.12),transparent)] p-6 md:p-10">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-semibold tracking-tight">Built for now ready for whatâ€™s next</h2>
            <p class="mt-3 text-white/80">
              Xplorâ€™s geospatial index makes your location discoverable today, while our open approach to
              tour formats keeps you future-proof. Whether youâ€™re rolling regional pop-ups or opening
              global flagships, your stores live on a platform designed to scale.
            </p>
            <ul class="mt-6 space-y-2 text-sm text-white/70">
              <li>â€¢ Works with leading 360Â°/3D platforms</li>
              <li>â€¢ Global map discovery & search</li>
              <li>â€¢ Privacy controls: Public / Private / PIN</li>
              <li>â€¢ Pro & Business: analytics, exports, API</li>
            </ul>

            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink
                to="/upload?type=retail"
                class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90"
              >
                Start a Retail Upload
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10"
              >
                Contact Sales
              </NuxtLink>
            </div>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <h3 class="text-xl font-semibold">Retail use cases</h3>
            <ul class="mt-3 space-y-2 text-white/80 text-sm">
              <li>â€¢ Flagship & concept stores</li>
              <li>â€¢ Pop-ups & collab drops</li>
              <li>â€¢ Duty free & travel retail</li>
              <li>â€¢ Showrooms & wholesale appointments</li>
              <li>â€¢ Outlet villages & multi-brand halls</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Put your store on the map</h2>
        <p class="mt-3 text-white/80">
          If it can be walked through, it can be explored on xplor.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/upload?type=retail"
            class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90"
          >
            Upload a Retail Space
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10"
          >
            Contact Sales
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


