<script setup lang="ts">
definePageMeta({ layout: 'default' })

// Optional hero image (put the file at assets/about-hero.jpg or swap the import)
import aboutHero from '@/assets/images/about-hero.jpg'
import {
  Ship, Home, Hotel, Car, Plane, Building2, Globe, ArrowRight, Users, Eye, DollarSign,
  Trophy, ShoppingBag
} from 'lucide-vue-next'

type Vertical = { icon: any; label: string; description: string; status: string; to: string }

const verticals: Vertical[] = [
  { icon: Ship,         label: 'Yachts',            description: 'List & explore yachts for sale/charter — powered by FairSeas.',                status: 'Live', to: '/upload?type=yachts' },
  { icon: Home,         label: 'Real Estate',       description: 'Immersive walkthroughs for sales & rentals with lead capture.',               status: 'Live', to: '/upload?type=real_estate' },
  { icon: Hotel,        label: 'Hospitality',       description: 'Resorts & hotels with rooms, amenities, and booking funnels.',                status: 'Beta', to: '/upload?type=hospitality' },
  { icon: Building2,    label: 'Developments',      description: 'Off-plan, branded residences, investor microsites & docs.',                   status: 'Live', to: '/upload?type=developments' },
  { icon: Car,          label: 'Automotive',        description: '360° walkarounds, showrooms, events — ready for launch.',                     status: 'Beta', to: '/upload?type=automotive' },
  { icon: Plane,        label: 'Aviation',          description: 'Cabin tours, charter/management funnels, FBOs & training.',                   status: 'Beta', to: '/upload?type=aviation' },
  { icon: Building2,    label: 'Galleries',         description: 'Museums, exhibitions, studios — curate and sell from tours.',                 status: 'Beta', to: '/upload?type=galleries' },
  // ✅ Added
  { icon: Trophy,       label: 'Sports Facilities', description: 'Stadiums, clubs & complexes with multi-space tours.',                          status: 'Beta', to: '/upload?type=sports' },
  { icon: ShoppingBag,  label: 'Retail',            description: 'Stores, pop-ups & showrooms with product hotspots.',                           status: 'Beta', to: '/upload?type=retail' },
]

const whyXplorPillars = [
  { icon: Eye,        title: 'Immersion',     description: '360° / 3D walkthroughs that show the whole picture.' },
  { icon: Users,      title: 'Access',        description: 'Public, private, or PIN-protected listings in one click.' },
  { icon: DollarSign, title: 'Monetization',  description: 'Lead capture, bookings, and FairSeas revenue sharing.' },
  { icon: Globe,      title: 'Reach',         description: 'Global visibility on a geospatial map with smart search.' },
]
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-50 bg-cover bg-center"
           :style="{ backgroundImage: `url(${aboutHero})` }" />
      <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 md:from-black/25 md:via-black/15 md:to-black/25" />

      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
            We’re building the world’s most immersive map.
          </h1>
          <p class="mt-4 text-lg text-white/80">
            Xplor is a universal platform to discover, upload, and monetize immersive tours of real-world spaces —
            from superyachts and villas to galleries, resorts, and jet cabins.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/spaces" class="btn btn-primary px-5 py-3 rounded-xl bg-x-yellow text-black hover:opacity-90">
              Explore the platform
            </NuxtLink>
            <NuxtLink to="/upload" class="btn btn-primary px-5 py-3 rounded-xl border border-white/15 hover:bg-black/10">
              List a space
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- VERTICALS -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">
        From yacht charters to skyscrapers — we’re mapping the world in 3D.
      </h2>
      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="(v, i) in verticals" :key="i" :to="v.to"
          class="rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition p-5"
        >
          <div class="flex items-center justify-between">
            <component :is="v.icon" class="w-6 h-6 text-white/90" />
            <span class="text-xs px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">{{ v.status }}</span>
          </div>
          <div class="mt-3">
            <div class="font-medium">{{ v.label }}</div>
            <p class="text-sm text-white/70 mt-1">{{ v.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- FAIRSEAS -->
    <section class="py-14 md:py-16">
      <div class="container-x">
        <div class="rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:p-10">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-3xl font-semibold tracking-tight">FairSeas by Xplor</h2>
              <p class="mt-3 text-white/80">
                We share <span class="font-semibold">50% of net charter commission with the crew</span>. Happier crew → better service → repeat charters.
                FairSeas aligns incentives and raises the bar for the whole industry.
              </p>
              <ul class="mt-6 space-y-2 text-sm text-white/70">
                <li>• Transparent revenue sharing</li>
                <li>• CRI+ (Crew Rating Index) for measurable quality</li>
                <li>• Owners see higher guest satisfaction & utilization</li>
              </ul>
              <div class="mt-6 flex gap-3">
                <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl bg-x-yellow text-black hover:opacity-90">
                  Learn more
                </NuxtLink>
                <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
                  List a yacht
                </NuxtLink>
              </div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(232,247,147,0.15),transparent)] h-[260px] md:h-[320px] flex items-center justify-center">
              <div class="text-white/70">Crew-first brokerage, built into Xplor.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY XPLOR -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Because photos aren’t enough anymore.</h2>
      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(p, i) in whyXplorPillars" :key="i" class="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <component :is="p.icon" class="w-8 h-8 mx-auto text-white/90" />
          <div class="mt-3 font-medium">{{ p.title }}</div>
          <p class="text-sm text-white/70 mt-1">{{ p.description }}</p>
        </div>
      </div>
    </section>

    <!-- IMMERSIVE INDEX -->
    <section class="py-14 md:py-16">
      <div class="container-x text-center">
        <div class="rounded-3xl border border-white/10 bg-white/[0.05] p-8 md:p-12">
          <h2 class="text-3xl font-semibold tracking-tight">We’re building the world’s immersive index.</h2>
          <p class="mt-4 text-white/80 max-w-3xl mx-auto">
            Like the web was indexed by pages, Xplor indexes real spaces — searchable, explorable, monetizable.
            Homes, hotels, yachts, jets, retail… everything with a door.
          </p>
          <div class="mt-6 inline-flex items-center gap-2 text-white/80">
            <Globe class="w-6 h-6 animate-spin-slow" />
            <span>2,000+ spaces mapped and growing</span>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPANY -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Built by explorers, for explorers.</h2>
      <div class="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold">Company</h3>
            <div class="mt-3 space-y-2 text-white/80">
              <p><strong>XPLORVR Media Group FZCO</strong></p>
              <p>HQ: Dubai, UAE</p>
              <p>Founder: Capt. Johnny Drummond</p>
              <p>Experience: 20+ years in yachting</p>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold">Mission</h3>
            <p class="mt-3 text-white/80">
              To create the most comprehensive immersive platform, connecting physical spaces with digital experiences
              while empowering creators and industry professionals through innovative monetization models.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="py-14 md:py-16">
      <div class="container-x text-center">
        <h2 class="text-3xl font-semibold tracking-tight">Let’s talk</h2>
        <p class="mt-3 text-white/80">Partnerships, press, or product — we’d love to hear from you.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-x-yellow text-black hover:opacity-90">
            <ArrowRight class="w-4 h-4 inline -mt-1 mr-1" /> Contact us
          </NuxtLink>
          <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
            Partner with Xplor
          </NuxtLink>
          <NuxtLink to="/press" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
            Press kit
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Ready to explore what Xplor can do?</h2>
        <p class="mt-3 text-white/80">If it can be walked through, it can be explored on Xplor.</p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload" class="px-5 py-3 rounded-xl bg-x-yellow text-black hover:opacity-90">Upload a space</NuxtLink>
          <NuxtLink to="/spaces" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Browse the map</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* slow spin for the globe */
@keyframes spin-slow { from { transform: rotate(0deg)} to { transform: rotate(360deg)} }
.animate-spin-slow { animation: spin-slow 12s linear infinite }
</style>
