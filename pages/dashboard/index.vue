<!-- pages/dashboard/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

type Privacy = 'public' | 'private' | 'pin'
type Listing = {
  id: string
  title: string
  city?: string
  country?: string
  views30d: number
  hits30d: number
  trend: number
  spark: number[]
  privacy: Privacy
  pinCode?: string | null
  updatedAt: string
}

const { data: listingsData, refresh: refreshListings } = await useAsyncData<Listing[]>(
  'listings',
  () => $fetch('/api/listings')
)
const listings = ref<Listing[]>(listingsData.value || [])

// Access Requests
type AccessRequest = { id: string; listingId: string; email: string; note?: string; status: 'pending'|'approved'|'rejected'; createdAt: string }
const { data: reqData, refresh: refreshReqs } = await useAsyncData<AccessRequest[]>(
  'access-requests',
  () => $fetch('/api/access-requests')
)
const accessRequests = ref<AccessRequest[]>(reqData.value || [])

// News
type NewsItem = { id: string; title: string; source: string; time: string; url?: string }
const { data: newsData } = await useAsyncData<NewsItem[]>('news', () => $fetch('/api/news'))
const news = ref(newsData.value || [])

// Area trends
const userCity = ref('Marbella')
const area = ref('Marbella, ES')
const { data: areaData, refresh: refreshArea } = await useAsyncData<{ area: string; kpis: { name: string; value: string; delta: string }[] }>(
  () => `area:${area.value}`,
  () => $fetch('/api/trends/area', { query: { area: area.value } }),
  { watch: [area] }
)
const areaKpis = computed(() => areaData.value?.kpis || [])

// Toasts
const toasts = ref<{ id: string; msg: string; kind: 'ok'|'warn' }[]>([])
function toast(msg: string, kind: 'ok' | 'warn' = 'ok') {
  toasts.value.push({ id: `${Date.now()}`, msg, kind })
  setTimeout(() => { toasts.value.shift() }, 2200)
}

// Privacy + PIN
const savingId = ref<string | null>(null)
function randomPin(n = 6) { return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('') }

async function savePrivacy(l: Listing) {
  savingId.value = l.id
  try {
    await $fetch(`/api/listings/${l.id}/privacy`, {
      method: 'POST',
      body: { privacy: l.privacy, pinCode: l.pinCode ?? null }
    })
    await refreshListings()
    toast('Privacy updated')
  } catch {
    toast('Failed to save', 'warn')
  } finally {
    savingId.value = null
  }
}
function setPrivacy(l: Listing, p: Privacy) {
  l.privacy = p
  if (p !== 'pin') l.pinCode = null
  savePrivacy(l)
}
function generatePin(l: Listing) {
  l.privacy = 'pin'
  l.pinCode = randomPin(6)
  savePrivacy(l)
}
async function copyInvite(l: Listing) {
  const url = `${location.origin}/spaces/${l.id}?pin=${encodeURIComponent(l.pinCode || '')}`
  try { await navigator.clipboard.writeText(url); toast('Invite link copied') }
  catch { toast('Could not copy', 'warn') }
}

// Approve/reject (client-side status for now)
function approveReq(r: AccessRequest) { r.status = 'approved'; toast('Request approved') }
function rejectReq(r: AccessRequest) { r.status = 'rejected'; toast('Request rejected', 'warn') }

// Recently viewed: read from localStorage
type Viewed = { id: string; title?: string; at: string }
const recentlyViewed = ref<Viewed[]>([])
onMounted(() => {
  try {
    const raw = localStorage.getItem('xplor_recent')
    recentlyViewed.value = raw ? JSON.parse(raw) : []
  } catch {}
})

// Helpers
function pctColor(n: number) { return n > 0 ? 'text-emerald-400' : (n < 0 ? 'text-red-400' : 'text-white/70') }
function fmt(n: number) { return Intl.NumberFormat(undefined, { notation: 'compact' }).format(n) }

const hotGlobal = computed(() => [...listings.value].sort((a,b)=> b.views30d - a.views30d).slice(0,4))
const hotLocal = computed(() => {
  const local = listings.value.filter(l => (l.city || '').toLowerCase() === userCity.value.toLowerCase())
  return (local.length ? local : listings.value).sort((a,b)=> b.hits30d - a.hits30d).slice(0,4)
})
</script>


<template>
  <div class="container-x py-6 space-y-6">
    <!-- Toasts -->
    <div class="fixed z-50 top-16 right-4 space-y-2">
      <div
        v-for="t in toasts" :key="t.id"
        class="px-3 py-2 rounded-lg border text-sm"
        :class="t.kind === 'ok' ? 'bg-white/10 border-white/15' : 'bg-red-500/20 border-red-500/40'"
      >
        {{ t.msg }}
      </div>
    </div>

    <!-- Header -->
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Dashboard</h1>
        <p class="text-white/60 text-sm">Overview of performance, trends, and controls</p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/upload" class="btn btn-primary">+ New Listing</NuxtLink>
        <NuxtLink to="/spaces" class="btn btn-ghost">View All</NuxtLink>
      </div>
    </div>

    <!-- Top KPIs -->
    <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4">
        <p class="text-xs text-white/60">Total Views (30d)</p>
        <p class="text-2xl font-semibold mt-1">{{ fmt(listings.reduce((s,l)=>s+l.views30d,0)) }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-white/60">Total Hits (30d)</p>
        <p class="text-2xl font-semibold mt-1">{{ fmt(listings.reduce((s,l)=>s+l.hits30d,0)) }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-white/60">Active Listings</p>
        <p class="text-2xl font-semibold mt-1">{{ listings.length }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-white/60">Avg Trend</p>
        <p class="text-2xl font-semibold mt-1" :class="pctColor(Math.round(listings.reduce((s,l)=>s+l.trend,0)/Math.max(1,listings.length)))">
          {{ Math.round(listings.reduce((s,l)=>s+l.trend,0)/Math.max(1,listings.length)) }}%
        </p>
      </div>
    </section>

    <!-- Main grid -->
    <section class="grid lg:grid-cols-3 gap-6">
      <!-- Left: Listings & Privacy -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Your Listings</h2>
            <span class="text-xs text-white/50">30 days</span>
          </div>

          <div class="mt-3 divide-y divide-white/10">
            <div v-for="l in listings" :key="l.id" class="py-3 flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 grid place-items-center text-white/70">
                <!-- placeholder thumb -->
                {{ l.title.split(' ').map(w=>w[0]).slice(0,2).join('') }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/spaces/${l.id}`" class="font-medium hover:underline truncate">{{ l.title }}</NuxtLink>
                  <span class="text-xs text-white/50 truncate">· {{ l.city }} {{ l.country ? '· ' + l.country : '' }}</span>
                </div>

                <div class="mt-1 grid grid-cols-3 gap-3 items-center">
                  <div class="text-sm">
                    <span class="text-white/60">Views</span>
                    <span class="ml-2 font-medium">{{ fmt(l.views30d) }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-white/60">Hits</span>
                    <span class="ml-2 font-medium">{{ fmt(l.hits30d) }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-white/60">Trend</span>
                    <span class="ml-2 font-medium" :class="pctColor(l.trend)">{{ l.trend }}%</span>
                  </div>
                </div>
              </div>

              <!-- Sparkline -->
              <div class="hidden md:block w-[160px] h-[46px]">
                <svg viewBox="0 0 160 46" class="w-full h-full">
                  <polyline
                    :points="l.spark.map((v,i)=>`${Math.round(i*(160/29))},${46 - Math.round((v/100)*40) - 3}`).join(' ')"
                    fill="none" stroke="currentColor" stroke-width="2" class="text-white/70"
                  />
                </svg>
              </div>

              <!-- Privacy controls -->
              <div class="flex items-center gap-2">
                <select
                  class="px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-sm"
                  :disabled="savingId===l.id"
                  v-model="l.privacy"
                  @change="setPrivacy(l, l.privacy)"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="pin">PIN</option>
                </select>

                <div v-if="l.privacy==='pin'" class="flex items-center gap-2">
                  <input
                    v-model="l.pinCode"
                    placeholder="PIN"
                    class="w-[88px] px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-sm"
                    @change="savePrivacy(l)"
                  />
                  <button class="btn btn-ghost text-xs" @click="generatePin(l)">Generate</button>
                  <button class="btn btn-ghost text-xs" :disabled="!l.pinCode" @click="copyInvite(l)">Copy link</button>
                </div>

                <NuxtLink :to="`/upload?id=${l.id}`" class="btn btn-ghost text-xs">Edit</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Access Requests -->
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Access Requests</h2>
            <span class="text-xs text-white/50">{{ accessRequests.filter(r=>r.status==='pending').length }} pending</span>
          </div>

          <div v-if="accessRequests.length" class="mt-3 divide-y divide-white/10">
            <div v-for="r in accessRequests" :key="r.id" class="py-3 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm">
                  <span class="text-white/80">{{ r.email }}</span>
                  <span class="text-white/50"> requests access to </span>
                  <span class="text-white/80">{{ (listings.find(l=>l.id===r.listingId)?.title) || r.listingId }}</span>
                </p>
                <p v-if="r.note" class="text-xs text-white/50 mt-1 truncate">{{ r.note }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-1 rounded-md text-xs"
                  :class="{
                    'bg-yellow-500/20 border border-yellow-500/30': r.status==='pending',
                    'bg-emerald-500/20 border border-emerald-500/30': r.status==='approved',
                    'bg-red-500/20 border border-red-500/30': r.status==='rejected'
                  }"
                >{{ r.status }}</span>
                <button v-if="r.status==='pending'" class="btn btn-ghost text-xs" @click="approveReq(r)">Approve</button>
                <button v-if="r.status==='pending'" class="btn btn-ghost text-xs" @click="rejectReq(r)">Reject</button>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-white/60 mt-2">No requests yet.</p>
        </div>
      </div>

      <!-- Right: Trends & News -->
      <div class="space-y-6">
        <!-- Hot properties -->
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Hot Properties</h2>
            <input v-model="userCity" class="px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-xs w-[150px]" placeholder="Your city" />
          </div>
          <p class="text-xs text-white/50 mt-1">Local: {{ userCity || '—' }}</p>

          <div class="mt-3 grid grid-cols-1 gap-3">
            <div>
              <h3 class="text-sm text-white/70 mb-2">Local</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NuxtLink v-for="l in hotLocal" :key="l.id" :to="`/spaces/${l.id}`" class="rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.08]">
                  <p class="font-medium truncate">{{ l.title }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ l.city }} · {{ fmt(l.hits30d) }} hits</p>
                </NuxtLink>
              </div>
            </div>
            <div>
              <h3 class="text-sm text-white/70 mb-2">Global</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NuxtLink v-for="l in hotGlobal" :key="l.id" :to="`/spaces/${l.id}`" class="rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.08]">
                  <p class="font-medium truncate">{{ l.title }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ l.city }} · {{ fmt(l.views30d) }} views</p>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Area Trends -->
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Area Trends</h2>
            <input v-model="area" class="px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-xs w-[190px]" />
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <div v-for="k in areaKpis" :key="k.name" class="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p class="text-xs text-white/60">{{ k.name }}</p>
              <p class="text-lg font-semibold mt-1">{{ k.value }}</p>
              <p class="text-xs text-white/60 mt-1">{{ k.delta }}</p>
            </div>
          </div>
        </div>

        <!-- News -->
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">News</h2>
            <NuxtLink to="/spaces" class="text-xs text-white/60 hover:underline">View all</NuxtLink>
          </div>
          <div class="mt-3 space-y-3">
            <div v-for="n in news" :key="n.id" class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm leading-tight">
                  <span class="font-medium">{{ n.title }}</span>
                </p>
                <p class="text-xs text-white/50 mt-1">{{ n.source }} · {{ n.time }}</p>
              </div>
              <a v-if="n.url" :href="n.url" target="_blank" class="text-xs underline">Open</a>
            </div>
          </div>
        </div>

        <!-- Recently Viewed -->
        <div class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Recently Viewed</h2>
            <NuxtLink to="/recent" class="text-xs text-white/60 hover:underline">See all</NuxtLink>
          </div>
          <div class="mt-3 grid grid-cols-1 gap-2">
            <NuxtLink
              v-for="v in recentlyViewed"
              :key="v.id"
              :to="`/spaces/${v.id}`"
              class="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.08]"
            >
              <span class="truncate">{{ v.title }}</span>
              <span class="text-xs text-white/50">{{ new Date(v.at).toLocaleString() }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
