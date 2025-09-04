<script setup lang="ts">
import {
  Users, Ship, ShieldCheck, ClipboardCheck, ArrowRight, FileCheck, Link2,
  Briefcase, FileSignature, CalendarCheck, CreditCard, Handshake
} from 'lucide-vue-next'

const props = defineProps<{ role: 'crew' | 'owners' | 'management' | 'brokers' | 'clients' }>()
</script>

<template>
  <!-- CREW -->
  <div v-if="role==='crew'" class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
    <div class="flex items-center gap-2"><Users class="w-6 h-6" /><h3 class="text-lg font-medium">Crew — Join & Verify</h3></div>
    <ol class="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
      <li>Create an account and complete profile.</li>
      <li>Find your yacht or <NuxtLink to="/upload?type=yachts" class="underline">add it</NuxtLink> if missing.</li>
      <li>Accept the <strong>FSA</strong> in your dashboard.</li>
      <li>Upload role verification (crew list, contract, or officer letter).</li>
      <li>Complete KYC (government ID; proof of address if requested).</li>
      <li>Enter payout details (IBAN/SWIFT).</li>
    </ol>
    <div class="mt-4">
      <div class="flex items-center gap-2 text-white/70"><ClipboardCheck class="w-4 h-4" />Required docs</div>
      <ul class="mt-2 text-sm text-white/60 space-y-1">
        <li>• Passport/national ID</li>
        <li>• Proof of crew status for charter dates</li>
        <li>• Bank details (name must match ID)</li>
        <li>• Tax form (e.g., W-8/W-9) if applicable</li>
      </ul>
    </div>
    <NuxtLink to="/fairseas/join" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-500 text-black px-4 py-2 hover:bg-teal-600">
      Join as Crew <ArrowRight class="w-4 h-4" />
    </NuxtLink>
  </div>

  <!-- OWNERS -->
  <div v-else-if="role==='owners'" class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
    <div class="flex items-center gap-2"><Ship class="w-6 h-6" /><h3 class="text-lg font-medium">Owners — Enable FairSeas</h3></div>
    <ol class="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
      <li>Ensure your yacht listing is complete and bookable.</li>
      <li>Confirm CA status and commission terms in dashboard.</li>
      <li>Accept the <strong>FSA</strong> (owner consent acknowledgement).</li>
      <li>Designate the management company (if any) and contacts.</li>
      <li>Provide owner settlement bank details (separate from crew payouts).</li>
    </ol>
    <div class="mt-4">
      <div class="flex items-center gap-2 text-white/70"><FileCheck class="w-4 h-4" />Notes</div>
      <ul class="mt-2 text-sm text-white/60 space-y-1">
        <li>• FSA doesn’t change owner’s MYBA cashflows.</li>
        <li>• Crew share is carved from <em>Xplor’s</em> commission only.</li>
        <li>• No effect on APA/VAT/owner settlements.</li>
      </ul>
    </div>
    <NuxtLink to="/contact" class="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">
      Owner Help <ArrowRight class="w-4 h-4" />
    </NuxtLink>
  </div>

  <!-- MANAGEMENT -->
  <div v-else-if="role==='management'" class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
    <div class="flex items-center gap-2"><ShieldCheck class="w-6 h-6" /><h3 class="text-lg font-medium">Management — Coordinate & Verify</h3></div>
    <ol class="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
      <li>Confirm MYBA terms, broker splits, and banking details.</li>
      <li>Accept the <strong>FSA</strong> acknowledgment for the vessel.</li>
      <li>Upload/approve the <em>official crew list</em> for charter dates.</li>
      <li>Close out charter (damages/claims sign-off & final statements).</li>
      <li>Confirm commission receipt so FairSeas can trigger payout.</li>
    </ol>
    <div class="mt-4">
      <div class="flex items-center gap-2 text-white/70"><Link2 class="w-4 h-4" />Interfaces</div>
      <ul class="mt-2 text-sm text-white/60 space-y-1">
        <li>• Manager dashboard for documents & confirmations</li>
        <li>• API/secure inbox options for crew lists & statements</li>
      </ul>
    </div>
    <NuxtLink to="/contact" class="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">
      Management Help <ArrowRight class="w-4 h-4" />
    </NuxtLink>
  </div>

  <!-- BROKERS -->
  <div v-else-if="role==='brokers'" class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
    <div class="flex items-center gap-2"><Briefcase class="w-6 h-6" /><h3 class="text-lg font-medium">Brokers — Work with FairSeas</h3></div>
    <ol class="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
      <li>Register brokerage account; complete company KYC (registry, VAT, address).</li>
      <li>Add team members and preferred split settings for co-broking.</li>
      <li>Acknowledge the <strong>FSA</strong> (broker edition): crew share is carved from <em>Xplor’s</em> commission only.</li>
      <li>Confirm MYBA booking worksheet, CA status, and agreed broker split.</li>
      <li>Execute MYBA charter; follow remittance/escrow instructions per contract.</li>
      <li>Provide commission advice & final statements; confirm fund receipt to trigger crew disbursement.</li>
    </ol>
    <div class="mt-4">
      <div class="flex items-center gap-2 text-white/70"><Handshake class="w-4 h-4" />Assurances</div>
      <ul class="mt-2 text-sm text-white/60 space-y-1">
        <li>• Your agreed broker commission is unchanged.</li>
        <li>• Crew share is from <em>Xplor’s</em> net; not an extra client cost.</li>
        <li>• No effect on APA/VAT; standard MYBA processes apply.</li>
      </ul>
    </div>
    <NuxtLink to="/contact" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-500 text-black px-4 py-2 hover:bg-teal-600">
      Partner with FairSeas <ArrowRight class="w-4 h-4" />
    </NuxtLink>
  </div>

  <!-- CLIENTS (Charterers) -->
  <div v-else class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
    <div class="flex items-center gap-2"><CreditCard class="w-6 h-6" /><h3 class="text-lg font-medium">Charter Clients — Book with Confidence</h3></div>
    <ol class="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
      <li>Browse yachts and send an enquiry; receive proposals and availability.</li>
      <li>Review and sign the MYBA charter contract; pay deposits as scheduled.</li>
      <li>Share preferences/guest details; arrange APA, insurance, and logistics.</li>
      <li>Enjoy your charter; settle any post-charter items during close-out.</li>
      <li>After commission clears under MYBA timelines, crew receive their FairSeas share — at no extra cost to you.</li>
    </ol>
    <div class="mt-4">
      <div class="flex items-center gap-2 text-white/70"><FileSignature class="w-4 h-4" />Transparency</div>
      <ul class="mt-2 text-sm text-white/60 space-y-1">
        <li>• The FairSeas crew share comes from <em>Xplor’s</em> commission.</li>
        <li>• It doesn’t increase your charter price or APA.</li>
        <li>• Tips remain discretionary and appreciated.</li>
      </ul>
    </div>
    <div class="mt-5 flex gap-2">
      <NuxtLink to="/yachts" class="inline-flex items-center gap-2 rounded-xl bg-teal-500 text-black px-4 py-2 hover:bg-teal-600">
        Explore Yachts <ArrowRight class="w-4 h-4" />
      </NuxtLink>
      <NuxtLink to="/contact" class="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10">
        Talk to Us <ArrowRight class="w-4 h-4" />
      </NuxtLink>
    </div>
  </div>
</template>
