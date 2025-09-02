<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'landinglayout' })
</script>

<template>
  <!-- HERO -->
  <section class="pt-2 md:pt-4 pb-12 md:pb-16">
    <div class="rounded-3xl overflow-hidden relative border border-white/10 bg-white/[0.04]">
      <div class="h-[62vh] md:h-[75vh] bg-gradient-to-br from-xplor-deep to-black relative">
        <div
          class="absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_30%_10%,rgba(232,247,147,0.12),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(232,247,147,0.07),transparent_40%)]"
        />
      </div>

      <div class="absolute inset-0 flex items-center">
        <div class="p-6 md:p-10 max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
            <BrandXplor size="10xl" />
            Everywhere,<br class="hidden md:block" />
            In Real Time.
          </h1>
          <p class="mt-4 text-lg text-white/70">
            Xplor.io is a universal platform for immersive tours — real estate, yachts, galleries,
            resorts, cities, and beyond.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/spaces" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">
              Start exploring
            </NuxtLink>
            <NuxtLink to="/upload" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
              List your space
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT IS XPLOR -->
  <section id="what" class="py-10 md:py-14">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div class="rounded-2xl border border-white/10 bg-white/[0.04] aspect-[4/3] flex items-center justify-center">
        <div class="text-center text-white/60">
          (Device mockups / screenshots here)
        </div>
      </div>

      <div>
        <h2 class="text-3xl font-semibold tracking-tight">What is Xplor?</h2>
        <p class="mt-3 text-white/70">
          Xplor.io lets you publish and discover immersive spaces. Upload 360° or 3D tours
          (Matterport, 3DVista, Kuula, custom), geotag them on an interactive Mapbox map,
          and share or embed everywhere — no app required.
        </p>
        <ul class="mt-6 space-y-2 text-sm text-white/60">
          <li>• Universal tour support (360°, 3D, video, galleries)</li>
          <li>• Geospatial search & global discovery</li>
          <li>• Clean embeds for websites & listings</li>
          <li>• Built with Supabase, Mapbox, Nuxt</li>
        </ul>
        <div class="mt-6">
          <NuxtLink to="/spaces" class="px-4 py-2 rounded-lg bg-xplor-yellow text-black hover:opacity-90">
            Explore spaces
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- VERTICALS -->
  <section id="verticals" class="py-10 md:py-14">
    <h2 class="text-3xl font-semibold tracking-tight">Key Verticals</h2>
    <p class="mt-2 text-white/70">From luxury rentals to cultural venues — Xplor is built for every kind of space.</p>

    <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      <NuxtLink to="/upload?type=real_estate"   class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🏡 Real Estate</div><p class="text-sm text-white/70 mt-1">Homes, villas, offices</p></NuxtLink>
      <NuxtLink to="/upload?type=developments"  class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🏗️ Developments</div><p class="text-sm text-white/70 mt-1">New builds & masterplans</p></NuxtLink>
      <NuxtLink to="/upload?type=yachts"        class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🛥️ Yachts</div><p class="text-sm text-white/70 mt-1">Charter & sales</p></NuxtLink>
      <NuxtLink to="/upload?type=hospitality"   class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🏨 Hospitality</div><p class="text-sm text-white/70 mt-1">Hotels & resorts</p></NuxtLink>
      <NuxtLink to="/upload?type=galleries"     class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🎨 Galleries</div><p class="text-sm text-white/70 mt-1">Museums & studios</p></NuxtLink>
      <NuxtLink to="/upload?type=automotive"    class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🚗 Automotive</div><p class="text-sm text-white/70 mt-1">Showrooms & events</p></NuxtLink>
      <NuxtLink to="/upload?type=aviation"      class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">✈️ Aviation</div><p class="text-sm text-white/70 mt-1">Jets & terminals</p></NuxtLink>
      <NuxtLink to="/upload?type=sports"        class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🏟️ Sports Facilities</div><p class="text-sm text-white/70 mt-1">Clubs & complexes</p></NuxtLink>
      <NuxtLink to="/upload?type=retail"        class="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition"><div class="text-lg font-medium">🛍️ Retail</div><p class="text-sm text-white/70 mt-1">Stores & pop-ups</p></NuxtLink>
    </div>
  </section>

  <!-- FAIRSEAS -->
  <section id="fairseas" class="py-10 md:py-14">
    <div class="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.04] p-6 md:p-10">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight">FairSeas by Xplor</h2>
          <p class="mt-3 text-white/70">
            FairSeas is our next-gen yacht brokerage model: we share <strong>50% of net charter commission with the crew</strong>.
            Happy crew → better service → repeat charters.
          </p>
          <ul class="mt-6 space-y-2 text-sm text-white/60">
            <li>• Transparent commission-sharing (crew-first)</li>
            <li>• CRI+ (Crew Rating Index) for measurable quality</li>
            <li>• Owners see higher guest satisfaction & utilization</li>
          </ul>
          <div class="mt-6 flex gap-3">
            <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">
              Learn more
            </NuxtLink>
            <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
              List a yacht
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(232,247,147,0.15),transparent)] h-[260px] md:h-[320px] flex items-center justify-center">
          <div class="text-center text-white/60"> (Yacht/crew imagery here) </div>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section id="how" class="py-10 md:py-14">
    <h2 class="text-3xl font-semibold tracking-tight">How it works</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-4">
      <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <div class="text-xl font-medium">1) Upload your space</div>
        <p class="text-sm text-white/70 mt-1">Add title, location, media (photos, 360°, video, 3D).</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <div class="text-xl font-medium">2) Get discovered</div>
        <p class="text-sm text-white/70 mt-1">Your listing appears on the global Xplor map and in search.</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <div class="text-xl font-medium">3) Share & monetize</div>
        <p class="text-sm text-white/70 mt-1">Embed tours, capture leads, book viewings or charters.</p>
      </div>
    </div>
  </section>

  <!-- TRUST / TECH -->
  <section id="tech" class="py-10 md:py-14">
    <div class="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
      <div class="flex flex-wrap items-center gap-6 text-sm text-white/70">
        <span class="opacity-80">Built with</span>
        <span class="px-3 py-1 rounded border border-white/10">Nuxt</span>
        <span class="px-3 py-1 rounded border border-white/10">Supabase</span>
        <span class="px-3 py-1 rounded border border-white/10">Mapbox</span>
        <span class="px-3 py-1 rounded border border-white/10">H3</span>
        <span class="px-3 py-1 rounded border border-white/10">Matterport</span>
        <span class="px-3 py-1 rounded border border-white/10">3DVista</span>
        <span class="px-3 py-1 rounded border border-white/10">Kuula</span>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section id="cta" class="py-12 md:py-16">
    <div class="rounded-3xl overflow-hidden border border-white/10 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)] p-8 md:p-12 text-center">
      <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Join the exploration revolution</h2>
      <p class="mt-3 text-white/70">Discover immersive spaces, or list your own today.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <NuxtLink to="/spaces" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Start exploring</NuxtLink>
        <NuxtLink to="/upload" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">List your space</NuxtLink>
      </div>
    </div>
  </section>
</template>
