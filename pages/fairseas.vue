<script setup lang="ts">
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 space-y-6">
    <h1 class="text-3xl font-semibold tracking-tight">FairSeas by Xplor</h1>
    <p class="text-xplor-gray2">
      FairSeas aligns incentives by sharing <strong>50% of net charter commission</strong> with the crew.
      We believe outstanding guest experiences start with engaged, fairly rewarded teams.
    </p>

    <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
      <h2 class="text-xl font-medium">Why FairSeas</h2>
      <ul class="list-disc pl-5 text-xplor-gray">
        <li>Transparent commission-sharing (crew-first model)</li>
        <li>CRI+ (Crew Rating Index) to measure service quality</li>
        <li>Owners benefit from happier guests & repeat bookings</li>
      </ul>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
      <h2 class="text-xl font-medium">Get involved</h2>
      <p class="text-xplor-gray2">Captains, crew, managers, or owners — we’d love to talk.</p>
      <div class="flex gap-3">
        <NuxtLink to="/upload/yacht" class="px-4 py-2 rounded-lg bg-xplor-yellow text-xplor-black hover:opacity-90">
          List a yacht
        </NuxtLink>
        <NuxtLink to="/spaces?kind=yacht" class="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10">
          Explore yachts
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
