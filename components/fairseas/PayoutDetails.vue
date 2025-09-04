<script setup lang="ts">
import { Calculator, Banknote, Wallet, Landmark } from 'lucide-vue-next'
</script>

<template>
  <div class="grid sm:grid-cols-2 gap-4">
    <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
      <div class="flex items-center gap-2"><Calculator class="w-5 h-5" /><h3 class="font-medium">Commission Basis</h3></div>
      <p class="text-sm text-white/70 mt-2">
        <strong>Net charter commission</strong> per FSA (referencing MYBA): gross charter fee minus applicable deductions; Xplor’s commission after broker splits.
      </p>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
      <div class="flex items-center gap-2"><Banknote class="w-5 h-5" /><h3 class="font-medium">Timing</h3></div>
      <p class="text-sm text-white/70 mt-2">
        Payouts start after <strong>commission funds clear</strong> and post-charter reconciliation (damages/claims) is confirmed.
      </p>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
      <div class="flex items-center gap-2"><Wallet class="w-5 h-5" /><h3 class="font-medium">Methods</h3></div>
      <p class="text-sm text-white/70 mt-2">
        Bank transfer (<strong>IBAN/SEPA</strong> or <strong>SWIFT</strong>) to verified recipients; other compliant methods may be supported.
      </p>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/[0.05] p-5">
      <div class="flex items-center gap-2"><Landmark class="w-5 h-5" /><h3 class="font-medium">Compliance</h3></div>
      <p class="text-sm text-white/70 mt-2">
        KYC/AML, sanctions checks, and any required tax forms (e.g., W-8/W-9) must be completed before disbursement.
      </p>
    </div>
  </div>
</template>
