<script setup lang="ts">
import { ref, computed } from 'vue'
import heroImage from '@/assets/images/yachts/crew/crew-009.jpg'

const title = 'Join FairSeas — Crew'
const description = 'Sign the FSA, verify your role, and add payout details to receive 50% crew commission on eligible charters.'
useHead({ title, meta: [{ name: 'description', content: description }] })

// form fields
const crewFullName = ref('')
const crewEmail = ref('')
const crewPhone = ref('')
const nationality = ref('')
const passportNumber = ref('')
const yachtName = ref('')
const crewRole = ref('')
const startDateOnboard = ref('')
const payoutMethod = ref<'IBAN'|'SWIFT'|'Wise'|'PayPal'|'Other'>('IBAN')
const accountHolder = ref('')
const iban = ref('')
const swift = ref('')
const bankName = ref('')
const bankCountry = ref('')
const wiseEmail = ref('')
const paypalEmail = ref('')
const otherPayoutNotes = ref('')
const agreeFSA = ref(false)
const allowVerification = ref(true)

const submitting = ref(false)
const errorMsg = ref('')

const needsIBAN = computed(() => payoutMethod.value === 'IBAN')
const needsSWIFT = computed(() => payoutMethod.value === 'SWIFT')
const needsWise  = computed(() => payoutMethod.value === 'Wise')
const needsPayPal= computed(() => payoutMethod.value === 'PayPal')
const needsOther = computed(() => payoutMethod.value === 'Other')

const submit = async () => {
  errorMsg.value = ''
  if (!agreeFSA.value) {
    errorMsg.value = 'Please agree to the FairShare Agreement (FSA) to proceed.'
    return
  }
  submitting.value = true
  try {
    const res = await $fetch('/api/fairseas/crew-sign', {
      method: 'POST',
      body: {
        crewFullName: crewFullName.value,
        crewEmail: crewEmail.value,
        crewPhone: crewPhone.value,
        nationality: nationality.value,
        passportNumber: passportNumber.value,
        yachtName: yachtName.value,
        crewRole: crewRole.value,
        startDateOnboard: startDateOnboard.value,
        payout: {
          payoutMethod: payoutMethod.value,
          accountHolder: accountHolder.value,
          iban: iban.value,
          swift: swift.value,
          bankName: bankName.value,
          bankCountry: bankCountry.value,
          wiseEmail: wiseEmail.value,
          paypalEmail: paypalEmail.value,
          otherPayoutNotes: otherPayoutNotes.value,
        },
        consents: {
          agreeFSA: agreeFSA.value,
          allowVerification: allowVerification.value
        }
      }
    }) as { signingUrl: string }
    window.location.href = res.signingUrl
  } catch (e:any) {
    errorMsg.value = e?.data?.message || e?.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh bg-black text-white">
    <!-- Hero -->
    <FairSeasHero
      :hero-image="heroImage"
      title="Crew — Join & Get Paid"
      subtitle="Sign the FSA, verify your role, and add payout details. FairSeas shares 50% of Xplor’s net charter commission with verified crew."
    >
      <template #cta>
        <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Back to FairSeas</NuxtLink>
      </template>
    </FairSeasHero>

    <!-- Form -->
    <section class="container-x py-14 md:py-16">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- main form -->
        <form class="lg:col-span-2 space-y-8" @submit.prevent="submit">
          <!-- Crew details -->
          <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <h2 class="text-xl font-semibold">Your Details</h2>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <input v-model="crewFullName" required placeholder="Full name"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <input v-model="crewEmail" required type="email" placeholder="Email"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <input v-model="crewPhone" placeholder="Phone"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <input v-model="nationality" placeholder="Nationality"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <input v-model="passportNumber" placeholder="Passport / Seaman’s Book #"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
            </div>
          </div>

          <!-- Yacht + role -->
          <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <h2 class="text-xl font-semibold">Yacht & Role</h2>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <input v-model="yachtName" required placeholder="Yacht name"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <input v-model="crewRole" required placeholder="Role (e.g., Chief Stew, Engineer)"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              <label class="md:col-span-2 text-sm text-white/70">Start date onboard</label>
              <input v-model="startDateOnboard" type="date"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">
            </div>
          </div>

          <!-- Payout details -->
          <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Payout Details</h2>
              <NuxtLink to="/fairseas/crew" class="text-sm text-teal-300 hover:text-teal-200 underline underline-offset-4">How we pay</NuxtLink>
            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label class="md:col-span-2 text-sm text-white/70">Payout method</label>
              <select v-model="payoutMethod"
                      class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">
                <option>IBAN</option>
                <option>SWIFT</option>
                <option>Wise</option>
                <option>PayPal</option>
                <option>Other</option>
              </select>

              <input v-model="accountHolder" placeholder="Account holder name"
                     class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">

              <!-- IBAN -->
              <template v-if="needsIBAN">
                <input v-model="iban" placeholder="IBAN"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">
                <input v-model="bankName" placeholder="Bank name"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <input v-model="bankCountry" placeholder="Bank country"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              </template>

              <!-- SWIFT -->
              <template v-if="needsSWIFT">
                <input v-model="swift" placeholder="SWIFT / BIC"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <input v-model="bankName" placeholder="Bank name"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <input v-model="bankCountry" placeholder="Bank country"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400">
              </template>

              <!-- Wise -->
              <template v-if="needsWise">
                <input v-model="wiseEmail" type="email" placeholder="Wise account email"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">
              </template>

              <!-- PayPal -->
              <template v-if="needsPayPal">
                <input v-model="paypalEmail" type="email" placeholder="PayPal email"
                       class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2">
              </template>

              <!-- Other -->
              <template v-if="needsOther">
                <textarea v-model="otherPayoutNotes" rows="3" placeholder="Describe your payout preference"
                          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2"></textarea>
              </template>
            </div>
          </div>

          <!-- Agreements -->
          <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <h2 class="text-xl font-semibold">Agreements</h2>
            <div class="mt-4 space-y-3 text-sm">
              <label class="flex items-start gap-3">
                <input type="checkbox" v-model="agreeFSA" class="mt-1">
                <span>I have read and agree to the FairShare Agreement (FSA), derived from MYBA. (Required)</span>
              </label>
              <label class="flex items-start gap-3">
                <input type="checkbox" v-model="allowVerification" class="mt-1">
                <span>I allow Xplor to verify my crew status with the captain/management.</span>
              </label>
            </div>

            <p v-if="errorMsg" class="mt-4 text-red-300">{{ errorMsg }}</p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button :disabled="submitting || !agreeFSA"
                      class="px-5 py-3 rounded-xl bg-teal-500 text-black hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50">
                {{ submitting ? 'Preparing DocuSign…' : 'Continue to Sign' }}
              </button>
              <NuxtLink to="/fairseas" class="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">Cancel</NuxtLink>
            </div>
          </div>
        </form>

        <!-- right rail card (FSA summary) -->
        <FSABox />
      </div>
    </section>
  </div>
</template>

