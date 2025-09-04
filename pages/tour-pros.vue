<!-- pages/tour-pros.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })
import { Camera, Users, TrendingUp, Star, DollarSign, Globe, Layers, Rocket } from "lucide-vue-next"

// ✅ Replace this path with a real image that exists in /assets/images/
import heroTourPros from '@/assets/images/gigs-hero-2.jpg'
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- HERO (image + same shading/gradient as about/index.vue) -->
    <section class="relative h-[34vh] md:h-[36vh] w-full overflow-hidden">
      <!-- Background image -->
      <div
        class="absolute inset-0 bg-cover bg-center z-0 pointer-events-none"
        :style="{ backgroundImage: `url('${heroTourPros}')` }"
        aria-hidden="true"
      />
      <!-- Strong angled shade -->
      <div
        class="absolute inset-0 pointer-events-none z-[5]
               [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)] z-0"
        aria-hidden="true"
      ></div>
      <!-- Subtle blend -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-[6] z-0 pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- Hero content -->
      <div class="relative z-50 h-full">
        <div class="container-x h-full px-6 md:px-10">
          <div class="flex h-full flex-col items-center justify-end pb-10 text-center md:pb-16">
            <h1 class="text-3xl font-semibold tracking-tight md:text-5xl">
              Become a Tour Pro with Xplor
            </h1>
            <p class="mt-3 max-w-3xl text-white/85 md:text-lg">
              Join the platform that transforms your skills into a scalable business. Deliver premium virtual tours,
              grow your income, and stand out as a leader in immersive media.
            </p>
            <div class="mt-5 flex flex-wrap justify-center gap-3">
              <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">
                Join the Affiliate Program
              </NuxtLink>
              <NuxtLink to="/upload" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
                Try Uploading a Tour
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INDUSTRY LANDSCAPE -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">
        The Virtual Tour Industry is Exploding
      </h2>
      <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
        From real estate and hospitality to retail and yachts, businesses worldwide are demanding
        immersive, interactive experiences. Clients now expect more than static photos — they want
        to step inside spaces digitally. This creates massive opportunities for skilled creators.
      </p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Globe class="w-10 h-10 mx-auto text-xplor-yellow" />
          <h3 class="mt-3 font-medium">Global Demand</h3>
          <p class="text-sm text-white/70">Industries worldwide now adopt immersive experiences.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Camera class="w-10 h-10 mx-auto text-xplor-yellow" />
          <h3 class="mt-3 font-medium">Premium Clients</h3>
          <p class="text-sm text-white/70">Luxury real estate, hotels, and yachts demand top quality tours.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <TrendingUp class="w-10 h-10 mx-auto text-xplor-yellow" />
          <h3 class="mt-3 font-medium">Rising Prices</h3>
          <p class="text-sm text-white/70">Professionals command higher fees with immersive services.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
          <Layers class="w-10 h-10 mx-auto text-xplor-yellow" />
          <h3 class="mt-3 font-medium">Endless Verticals</h3>
          <p class="text-sm text-white/70">From showrooms to sports facilities, every space needs tours.</p>
        </div>
      </div>
    </section>

    <!-- PROFESSIONAL CHALLENGES -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">
          The Challenges Professionals Face
        </h2>
        <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
          Many creators struggle with price competition, limited tools, and platforms that
          can’t keep up with client demands.
        </p>
        <ul class="mt-8 grid md:grid-cols-2 gap-6 text-white/80 max-w-4xl mx-auto text-sm">
          <li class="p-4 rounded-xl border border-white/10 bg-white/[0.05]">• Competing on price instead of quality</li>
          <li class="p-4 rounded-xl border border-white/10 bg-white/[0.05]">• Limited creative options with outdated tools</li>
          <li class="p-4 rounded-xl border border-white/10 bg-white/[0.05]">• Slow, unreliable platforms</li>
          <li class="p-4 rounded-xl border border-white/10 bg-white/[0.05]">• Hard to scale business operations</li>
        </ul>
      </div>
    </section>

    <!-- SOLUTION -->
    <section class="container-x py-14 md:py-16">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight">Xplor Solves This</h2>
          <p class="mt-3 text-white/80">
            Xplor is more than a tool — it’s your complete business ecosystem.
            With professional-grade features, streamlined workflow, and affiliate
            revenue opportunities, it lets you focus on creativity while growing income.
          </p>
          <ul class="mt-6 space-y-2 text-sm text-white/70">
            <li>• Professional-level rendering and interactivity</li>
            <li>• White-label options for brand consistency</li>
            <li>• Fast, reliable hosting with SEO-friendly delivery</li>
            <li>• Analytics and engagement tracking</li>
            <li>• Business tools for client management</li>
          </ul>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center">
          <Rocket class="w-12 h-12 mx-auto text-xplor-yellow" />
          <p class="mt-4 text-lg font-medium">Grow Faster, Earn More</p>
          <p class="text-white/70 text-sm">A platform designed for ambitious creators.</p>
        </div>
      </div>
    </section>

    <!-- AFFILIATE PROGRAM -->
    <section class="bg-white/[0.02] py-14 md:py-16">
      <div class="container-x">
        <h2 class="text-3xl font-semibold tracking-tight text-center">The Tour Pro Affiliate Program</h2>
        <p class="mt-3 text-center text-white/80 max-w-3xl mx-auto">
          Earn while you create. Our affiliate model rewards you for every client you bring
          and every tour you build.
        </p>
        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <DollarSign class="w-10 h-10 mx-auto text-xplor-yellow" />
            <h3 class="mt-3 font-medium">Commission Earnings</h3>
            <p class="text-sm text-white/70">Transparent rates, scalable income opportunities.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Star class="w-10 h-10 mx-auto text-xplor-yellow" />
            <h3 class="mt-3 font-medium">Certification</h3>
            <p class="text-sm text-white/70">Access training, badges, and professional recognition.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Users class="w-10 h-10 mx-auto text-xplor-yellow" />
            <h3 class="mt-3 font-medium">Community</h3>
            <p class="text-sm text-white/70">Network with fellow creators, share resources, grow together.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <Layers class="w-10 h-10 mx-auto text-xplor-yellow" />
            <h3 class="mt-3 font-medium">Resources</h3>
            <p class="text-sm text-white/70">Marketing kits, templates, and sales support.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SUCCESS SCENARIOS -->
    <section class="container-x py-14 md:py-16">
      <h2 class="text-3xl font-semibold tracking-tight text-center">Real-World Scenarios</h2>
      <div class="mt-10 grid md:grid-cols-2 gap-8">
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <h3 class="font-medium">Real Estate Photographer</h3>
          <p class="text-sm text-white/70 mt-2">
            Expands from stills into high-value luxury property tours,
            charging premium rates and building recurring maintenance contracts.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <h3 class="font-medium">Commercial Photographer</h3>
          <p class="text-sm text-white/70 mt-2">
            Wins corporate showroom projects with interactive tours and
            adds long-term corporate accounts to their portfolio.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <h3 class="font-medium">Marketing Agency</h3>
          <p class="text-sm text-white/70 mt-2">
            Offers immersive virtual experiences to clients, differentiating
            themselves in a competitive digital market.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <h3 class="font-medium">Freelance Creator</h3>
          <p class="text-sm text-white/70 mt-2">
            Builds recurring revenue through monthly hosting and content updates
            for small businesses, galleries, and venues.
          </p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="py-16 md:py-20 bg-[radial-gradient(80%_80%_at_50%_10%,rgba(232,247,147,0.12),transparent)]">
      <div class="container-x text-center">
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">Ready to elevate your career?</h2>
        <p class="mt-3 text-white/80 max-w-3xl mx-auto">
          Join the world’s most advanced virtual tour platform.  
          Build your business, grow your income, and become a recognized Tour Pro.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/contact" class="px-5 py-3 rounded-xl bg-xplor-yellow text-black hover:opacity-90">Join the Program</NuxtLink>
          <NuxtLink to="/upload" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Start Uploading</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>


