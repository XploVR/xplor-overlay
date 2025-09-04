<!-- pages/fairseas.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { Users, Star, DollarSign, Ship, Award, TrendingUp, CheckCircle, Shield } from 'lucide-vue-next'

// ✅ Ensure this path exists in /assets
import heroImage from '@/assets/images/yachts/crew/crew-009.jpg'

const brandText = 'Xplor' // plain text for SEO/meta
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
  "url": "/fairseas",
  // 🔗 point to the new crew instructions page
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
  link: [{ rel: 'canonical', href: '/fairseas' }],
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
          <!-- Turquoise primary -->
          <NuxtLink to="/fairseas/join" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
            Join FairSeas Now
          </NuxtLink>
          <!-- Turquoise outline -->
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
        <NuxtLink to="/fairseas/brokers" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Brokers</NuxtLink>
        <NuxtLink to="/fairseas/clients" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">Charter Clients</NuxtLink>
      </div>
    </section>

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
        <NuxtLink to="/fairseas/join" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">Join FairSeas Now</NuxtLink>
        <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10">Crew Instructions & Upload Guide</NuxtLink>
      </div>
    </section>

    <!-- ELIGIBILITY -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">Who’s Eligible?</h2>
        <div class="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            <CheckCircle class="w-8 h-8 text-white/90" />
            <p class="mt-3 text-sm text-white/80">You’re an <strong>active crew member</strong> on a yacht.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            <Shield class="w-8 h-8 text-white/90" />
            <p class="mt-3 text-sm text-white/80">The yacht is listed for charter with Xplor (central or 3rd-party).</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            <Users class="w-8 h-8 text-white/90" />
            <p class="mt-3 text-sm text-white/80">You’ve registered and uploaded <strong>proof of crew status</strong>.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            <Star class="w-8 h-8 text-white/90" />
            <p class="mt-3 text-sm text-white/80">You’re onboard during the charter booked via Xplor.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY JOIN -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Why Join FairSeas?</h2>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <DollarSign class="w-10 h-10 mx-auto text-teal-300" />
          <h3 class="mt-3 font-medium">Commission Payouts</h3>
          <p class="text-sm text-white/70">Earn a real share of the deal you helped secure.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Users class="w-10 h-10 mx-auto text-teal-300" />
          <h3 class="mt-3 font-medium">Equal Split</h3>
          <p class="text-sm text-white/70">All verified crew split the 50% fairly — no hierarchy.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Star class="w-10 h-10 mx-auto text-teal-300" />
          <h3 class="mt-3 font-medium">Easy Eligibility</h3>
          <p class="text-sm text-white/70">Be crew on an Xplor-listed charter yacht. That’s it.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <TrendingUp class="w-10 h-10 mx-auto text-teal-300" />
          <h3 class="mt-3 font-medium">Transparent System</h3>
          <p class="text-sm text-white/70">See your eligibility and payouts clearly in your dashboard.</p>
        </div>
      </div>
    </section>

    <!-- QUICK START -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">Ready to Join? It’s Simple.</h2>
        <div class="mt-10 grid md:grid-cols-5 sm:grid-cols-2 gap-6">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <div class="text-2xl font-bold">1</div>
            <p class="mt-2 text-sm text-white/75">
              Create or find your yacht’s listing (use <NuxtLink to="/upload?type=yachts" class="underline underline-offset-2">Upload a Yacht</NuxtLink>)
            </p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <div class="text-2xl font-bold">2</div>
            <p class="mt-2 text-sm text-white/75">
              Register as crew via the <NuxtLink to="/fairseas/join" class="underline underline-offset-2">FairSeas signup form</NuxtLink>
            </p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <div class="text-2xl font-bold">3</div>
            <p class="mt-2 text-sm text-white/75">Upload proof of employment (valid contract or crew ID)</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <div class="text-2xl font-bold">4</div>
            <p class="mt-2 text-sm text-white/75">Keep your yacht & role updated (stay active)</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <div class="text-2xl font-bold">5</div>
            <p class="mt-2 text-sm text-white/75">Get notified when a charter is booked — track eligibility in your dashboard</p>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/fairseas/join" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">Join FairSeas Now</NuxtLink>
          <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10">Crew Instructions</NuxtLink>
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Upload Your Yacht</NuxtLink>
        </div>
      </div>
    </section>

    <!-- CRI+ -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">FairSeas Ratings (CRI+)</h2>
      <p class="mt-3 text-center text-white/80 max-w-2xl mx-auto">
        Tips aren’t always fair. That’s why we’re introducing an optional <strong>Crew Rating Index (CRI+)</strong> — an objective way to help distribute onboard bonuses.
      </p>

      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Award class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Experience</h3>
          <p class="text-sm text-white/70">Longevity, time in industry, verified sea miles.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Star class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Performance</h3>
          <p class="text-sm text-white/70">Past tips, guest satisfaction, steady growth.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Users class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Qualifications</h3>
          <p class="text-sm text-white/70">Role training, yacht size handled, certificates.</p>
        </div>
      </div>

      <p class="mt-8 text-center text-white/70 max-w-2xl mx-auto">
        Higher ratings can earn a larger share in CRI+-based distributions. Fair, transparent, motivating.
      </p>
    </section>

    <!-- BEYOND CREW -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">Ratings Beyond the Crew</h2>
        <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
          FairSeas also promotes transparency for <strong>owners, managers, and guests</strong> — because everyone benefits when accountability is clear.
        </p>
        <div class="mt-10 grid md:grid-cols-3 gap-6">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Ship class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Owners</h3>
            <p class="text-sm text-white/70">Encourage fair crew treatment, timely payments, sound practices.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Users class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Guests</h3>
            <p class="text-sm text-white/70">Reward respectful, generous charterers and repeat satisfaction.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <TrendingUp class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Managers</h3>
            <p class="text-sm text-white/70">Highlight companies with fair contracts and smooth ops.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMING SOON -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Coming Soon: Sales Commissions</h2>
      <p class="mt-4 text-white/80 max-w-3xl mx-auto text-center">
        For yachts sold via Xplor, we’re building a way to reward crew with a portion of the sales commission.
        Behind every sale is a team that maintained, presented, and operated the yacht.
      </p>
    </section>

    <!-- FINAL CTA -->
    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(20,184,166,0.15),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Your Work Deserves a Share of the Reward.</h2>
        <p class="mt-3 text-white/80 max-w-3xl mx-auto">
          FairSeas was built to change how things are done in yachting — and you’re the reason we started it.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/fairseas/join" class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">Join FairSeas Now</NuxtLink>
          <NuxtLink to="/fairseas/crew" class="px-5 py-3 rounded-xl border border-teal-400 text-teal-300 hover:bg-teal-500/10">Crew Instructions</NuxtLink>
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Upload a Yacht</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* keep overlays non-interactive and under content */
.hero-overlay { pointer-events: none; z-index: 0; }
</style>
