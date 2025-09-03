<script setup lang="ts">
const aboutHero = '@assets/images/about-hero.jpg'
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-50 bg-cover bg-center"
        :style="{ backgroundImage: 'url(' + aboutHero + ')' }"
      ></div>
      <div
        class="absolute inset-0 pointer-events-none z-[10]"
        style="
          background:linear-gradient(
            90deg,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.55) 35%,
            rgba(0,0,0,0.20) 65%,
            rgba(0,0,0,0.00) 100%
          );
        "
      ></div>
      <div class="relative container-x py-16 md:py-24">
        <div class="max-w-3xl">
          <h1 class="font-display text-3xl md:text-5xl font-semibold tracking-tight">About xplor</h1>
          <p class="mt-4 text-white/80">
            A platform for immersive, interactive experiences across real estate, yachts,
            retail, hospitality, galleries, aviation, automotive, developments, and sports facilities.
          </p>
          <div class="mt-6 flex gap-3">
            <NuxtLink to="/upload" class="px-4 py-2 rounded-xl bg-yellow-300 text-black font-medium">Upload a Space</NuxtLink>
            <NuxtLink to="/chat" class="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10">Talk to Us</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-x py-12 space-y-10">
      <div class="grid md:grid-cols-3 gap-6">
        <div class="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h3 class="font-semibold">High-fidelity tours</h3>
          <p class="mt-2 text-sm text-white/70">Fast, reliable, premium visual quality.</p>
        </div>
        <div class="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h3 class="font-semibold">Built for business</h3>
          <p class="mt-2 text-sm text-white/70">Lead capture, analytics, and collaboration.</p>
        </div>
        <div class="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h3 class="font-semibold">Future-ready</h3>
          <p class="mt-2 text-sm text-white/70">A roadmap focused on creators and teams.</p>
        </div>
      </div>

      <div class="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
        <h2 class="font-display text-2xl">Why xplor</h2>
        <p class="mt-3 text-sm text-white/75">
          Centralize all your immersive content, publish anywhere, and measure impact.
        </p>
      </div>
    </section>
  </div>
</template>
