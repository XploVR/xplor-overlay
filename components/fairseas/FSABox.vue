<script setup lang="ts">
import { Info, FileText } from 'lucide-vue-next'
</script>

<template>
  <aside class="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
    <div class="flex items-center gap-2">
      <Info class="w-5 h-5" />
      <h3 class="font-medium">FairShare Agreement (FSA)</h3>
    </div>
    <p class="text-sm text-white/70 mt-3">
      The FSA is a concise addendum that references core <strong>MYBA</strong> definitions (charter fee, commission, settlement timing).
      It does not alter the owner–broker relationship under MYBA; it governs how the <strong>crew share of Xplor’s commission</strong> is handled.
    </p>
    <ul class="mt-3 text-sm text-white/70 space-y-2">
      <li>• Applies only to charters booked via Xplor.</li>
      <li>• Crew must be <strong>verified and onboard</strong> for the charter period.</li>
      <li>• Payments are conditional on <strong>cleared commission</strong> after charter close-out.</li>
    </ul>
    <NuxtLink to="/fairseas/fsa.pdf"
      class="mt-4 inline-flex items-center gap-2 rounded-lg border border-xplor-yellow text-xplor-yellow px-4 py-2 hover:bg-xplor-yellow/10">
      <FileText class="w-4 h-4" /> View FSA (PDF)
    </NuxtLink>
  </aside>
</template>
