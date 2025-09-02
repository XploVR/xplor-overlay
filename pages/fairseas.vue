<!-- pages/fairseas.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { Users, Star, DollarSign, Ship, Award, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
      <div class="relative container-x py-16 md:py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
          FairSeas by Xplor
        </h1>
        <p class="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          The world’s first brokerage model that shares
          <strong>50% of charter commission with the crew</strong> — because crew are the ones who make
          every charter unforgettable.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">
            List a yacht
          </NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
            Contact us
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- COMMISSION MODEL -->
    <section class="container-x py-14 md:py-16">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight">50% Crew Commission</h2>
          <p class="mt-3 text-white/80">
            FairSeas is simple: we give <strong>half of our charter commission directly to the crew</strong>.
            When Xplor is central agent, that means <strong>double the payout</strong> compared to a standard
            brokerage model. No smoke and mirrors — transparent, fair, crew-first.
          </p>
          <ul class="mt-6 space-y-2 text-sm text-white/70">
            <li>• 50% of Xplor’s commission shared with the crew</li>
            <li>• Direct reward for those who actually deliver the charter experience</li>
            <li>• Central-agent deals mean bigger payouts for the team onboard</li>
          </ul>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center">
          <DollarSign class="w-12 h-12 mx-auto text-xplor-yellow" />
          <p class="mt-4 text-lg font-medium">A revolutionary split</p>
          <p class="text-white/70 text-sm">Because crew deserve more than tips alone.</p>
        </div>
      </div>
    </section>

    <!-- RATINGS SYSTEM -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">FairSeas Ratings System</h2>
        <p class="mt-3 text-center text-white/80 max-w-2xl mx-auto">
          Tips aren’t always fair. That’s why we’re introducing an optional
          <strong>Crew Rating Index (CRI+)</strong> — an objective way to divide
          onboard commission bonuses.
        </p>

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Award class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Experience</h3>
            <p class="text-sm text-white/70">Longevity on yachts, time in industry, verified sea miles.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Star class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Performance</h3>
            <p class="text-sm text-white/70">Past charter tips, proven guest satisfaction, steady growth.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Users class="w-10 h-10 mx-auto text-white/90" />
            <h3 class="mt-3 font-medium">Qualifications</h3>
            <p class="text-sm text-white/70">Role-specific training, yacht size handled, certificates held.</p>
          </div>
        </div>

        <p class="mt-8 text-center text-white/70 max-w-2xl mx-auto">
          The higher the rating, the bigger the share. Fair, transparent, motivating.
        </p>
      </div>
    </section>

    <!-- BEYOND CREW -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Ratings Beyond the Crew</h2>
      <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
        FairSeas doesn’t stop with crew. We’re also creating transparent ratings for
        <strong>management companies, owners, and charter guests</strong>. Everyone
        in the ecosystem benefits when accountability is clear.
      </p>
      <div class="mt-10 grid md:grid-cols-3 gap-6">
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Ship class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Owners</h3>
          <p class="text-sm text-white/70">Encourage fair treatment of crew, transparent payments, and good practices.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Users class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Guests</h3>
          <p class="text-sm text-white/70">Reward respectful, generous charterers and track repeat satisfaction.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <TrendingUp class="w-10 h-10 mx-auto text-white/90" />
          <h3 class="mt-3 font-medium">Managers</h3>
          <p class="text-sm text-white/70">Show which companies deliver fair contracts, happy crews, and smooth operations.</p>
        </div>
      </div>
    </section>

    <!-- FUTURE SALES COMMISSION -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x text-center">
        <h2 class="text-3xl font-semibold tracking-tight">Coming Soon: Sales Commissions</h2>
        <p class="mt-4 text-white/80 max-w-3xl mx-auto">
          For yachts sold via Xplor, we’re building a way to reward crew with a portion of the sales commission.
          Because behind every sale is a team that maintained, presented, and operated the yacht.
        </p>
      </div>
    </section>

    <!-- REVOLUTION CTA -->
    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">The industry needs a revolution</h2>
        <p class="mt-3 text-white/80 max-w-3xl mx-auto">
          FairSeas is built for the people who matter most — the crew.  
          You are the heart of yachting. You make every trip possible.  
          Now, you finally share in the rewards.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/upload?type=yachts" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">List a yacht</NuxtLink>
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Contact us</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
