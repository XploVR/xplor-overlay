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

type AccessRequest = {
  id: string
  listingId: string
  email: string
  note?: string
  status: 'pending'|'approved'|'rejected'
  createdAt: string
}

type NewsItem = { id: string; title: string; source: string; time: string; url?: string }

const {
  data: listingsData,
  pending: listingsPending,
  error: listingsError,
  refresh: refreshListings
} = await useAsyncData<Listing[]>('listings', () => $fetch('/api/listings'))

const listings = computed(() => listingsData.value ?? [])

const {
  data: reqData,
  pending: reqPending,
  error: reqError,
} = await useAsyncData<AccessRequest[]>('access-requests', () => $fetch('/api/access-requests'))
const accessRequests = computed(() => reqData.value ?? [])

const {
  data: newsData,
  pending: newsPending,
  error: newsError,
} = await useAsyncData<NewsItem[]>('news', () => $fetch('/api/news'))
const news = computed(() => newsData.value ?? [])

const area = ref('Marbella, ES')
const {
  data: areaData,
  pending: areaPending,
  error: areaError,
} = await useAsyncData<{ area: string; kpis: { name: string; value: string; delta: string }[] }>(
  'area-trends',
  () => $fetch('/api/trends/area', { query: { area: area.value } }),
  { watch: [area] }
)
const areaKpis = computed(() => areaData.value?.kpis ?? [])

// Privacy controls
const savingId = ref<string | null>(null)
async function savePrivacy(l: Listing) {
  savingId.value = l.id
  try {
    await $fetch(`/api/listings/${l.id}/privacy`, {
      method: 'POST',
      body: { privacy: l.privacy, pinCode: l.pinCode ?? null }
    })
    await refreshListings()
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
  l.pinCode = Array.from({ length: 6 }, () => Math.floor(Math.random()*10)).join('')
  savePrivacy(l)
}
async function copyInvite(l: Listing) {
  const url = `${location.origin}/spaces/${l.id}?pin=${encodeURIComponent(l.pinCode || '')}`
  try { await navigator.clipboard.writeText(url) } catch {}
}

// Recently viewed (from middleware/localStorage)
type Viewed = { id: string; at: string; title?: string }
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

// Hot lists (with safe fallbacks)
const hotGlobal = computed(() =>
  [...listings.value].sort((a,b)=> b.views30d - a.views30d).slice(0,4)
)
const hotLocal = computed(() => {
  const mine = listings.value.filter(l => (l.city || '').toLowerCase() === 'marbella')
  return (mine.length ? mine : listings.value).slice(0,4)
})

// ApexCharts (dark, sparkline)
const sparkOpts = {
  chart: { type: 'area', height: 80, sparkline: { enabled: true }, toolbar: { show: false }, animations: { enabled: true } },
  stroke: { width: 2, curve: 'smooth' },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
  dataLabels: { enabled: false },
  tooltip: { enabled: false },
  grid: { show: false },
  theme: { mode: 'dark' },
  colors: undefined // let Apex pick (we're in dark theme)
}
function seriesFrom(arr: number[]) {
  const data = Array.isArray(arr) && arr.length ? arr : [0,0,0,0,0,0,0]
  return [{ name: 'trend', data }]
}
</script>

<template>
  <div class="container-x py-6 text-white">
    <div class="flex items-center gap-3 mb-4">
      <h1 class="text-2xl md:text-3xl font-semibold">Dashboard</h1>
      <span
        class="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5"
        :class="{
          'text-amber-300': listingsPending || reqPending || newsPending || areaPending,
          'text-red-300': listingsError || reqError || newsError || areaError,
          'text-emerald-300': !(listingsPending || reqPending || newsPending || areaPending) && !(listingsError || reqError || newsError || areaError)
        }"
      >
        {{ listingsError || reqError || newsError || areaError ? 'API error' : (listingsPending || reqPending || newsPending || areaPending ? 'Loading…' : 'Live') }}
      </span>
    </div>

    <!-- KPIs -->
    <div class="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
      <div class="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <div class="text-xs text-white/60">Listings</div>
        <div class="text-2xl font-semibold mt-1">{{ listings.length }}</div>
        <div class="mt-2 text-xs text-white/50">Total active</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <div class="text-xs text-white/60">Views (30d)</div>
        <div class="text-2xl font-semibold mt-1">
          {{ fmt(listings.reduce((a, b) => a + (b.views30d || 0), 0)) }}
        </div>
        <div class="mt-2 text-xs text-white/50">Aggregate</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <div class="text-xs text-white/60">Hits (30d)</div>
        <div class="text-2xl font-semibold mt-1">
          {{ fmt(listings.reduce((a, b) => a + (b.hits30d || 0), 0)) }}
        </div>
        <div class="mt-2 text-xs text-white/50">Aggregate</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <div class="text-xs text-white/60">Area</div>
        <div class="text-lg font-medium mt-1">{{ area }}</div>
        <div class="mt-2 text-xs text-white/50">Change area in code or UI</div>
      </div>
    </div>

    <!-- Hot Global w/ sparklines -->
    <h2 class="text-xl font-semibold mt-8 mb-3">Hot (Global)</h2>
    <div class="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
      <div
        v-for="l in (hotGlobal.length ? hotGlobal : [{id:'-',title:'No data',city:'',country:'', views30d:0,hits30d:0,trend:0,spark:[],privacy:'public',updatedAt:''}])"
        :key="l.id"
        class="rounded-xl border border-white/10 bg-white/[0.05] p-4"
      >
        <div class="flex items-center justify-between">
          <div class="font-medium truncate">{{ l.title }}</div>
          <div class="text-xs" :class="pctColor(l.trend)">{{ l.trend > 0 ? '+' : ''}}{{ l.trend }}%</div>
        </div>
        <div class="text-xs text-white/60 mt-1 truncate">{{ l.city }} {{ l.country }}</div>
        <div class="mt-3">
          <ClientOnly>
            <apexchart type="area" height="80" :options="sparkOpts" :series="seriesFrom(l.spark)" />
          </ClientOnly>
        </div>
        <div class="mt-2 text-xs text-white/60 flex items-center gap-3">
          <span>Views: <span class="text-white">{{ fmt(l.views30d || 0) }}</span></span>
          <span>Hits: <span class="text-white">{{ fmt(l.hits30d || 0) }}</span></span>
        </div>
      </div>
    </div>

    <!-- Area KPIs -->
    <h2 class="text-xl font-semibold mt-8 mb-3">Area Trends ({{ area }})</h2>
    <div class="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
      <div
        v-for="k in (areaKpis.length ? areaKpis : [{name:'No data', value:'—', delta:'—'}])"
        :key="k.name"
        class="rounded-xl border border-white/10 bg-white/[0.05] p-4"
      >
        <div class="text-xs text-white/60">{{ k.name }}</div>
        <div class="text-2xl font-semibold mt-1">{{ k.value }}</div>
        <div class="mt-1 text-xs" :class="k.delta.includes('-') ? 'text-red-300' : (k.delta.includes('+') ? 'text-emerald-300' : 'text-white/60')">
          {{ k.delta }}
        </div>
      </div>
    </div>

    <!-- Access Requests -->
    <h2 class="text-xl font-semibold mt-8 mb-3">Access Requests</h2>
    <div class="grid md:grid-cols-3 gap-4">
      <div
        v-for="r in (accessRequests.length ? accessRequests : [{id:'-',listingId:'—',email:'—',status:'pending', createdAt:new Date().toISOString()}])"
        :key="r.id"
        class="rounded-xl border border-white/10 bg-white/[0.05] p-4"
      >
        <div class="text-sm font-medium">{{ r.email }}</div>
        <div class="text-xs text-white/60 mt-1">Listing: <span class="font-mono">{{ r.listingId }}</span></div>
        <div class="text-xs text-white/60">When: {{ new Date(r.createdAt).toLocaleString() }}</div>
        <div class="mt-3 flex gap-2">
          <button class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs" @click="r.status='approved'">Approve</button>
          <button class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs" @click="r.status='rejected'">Reject</button>
        </div>
      </div>
    </div>

    <!-- News -->
    <h2 class="text-xl font-semibold mt-8 mb-3">News</h2>
    <div class="grid md:grid-cols-3 gap-4">
      <a
        v-for="n in (news.length ? news : [{id:'n0', title:'No news yet', source:'', time:'', url:'#'}])"
        :key="n.id"
        :href="n.url || '#'"
        target="_blank"
        class="rounded-xl border border-white/10 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition"
      >
        <div class="font-medium">{{ n.title }}</div>
        <div class="text-xs text-white/60 mt-1">{{ n.source }} <span v-if="n.time">• {{ n.time }}</span></div>
      </a>
    </div>

    <!-- Recently Viewed -->
    <h2 class="text-xl font-semibold mt-8 mb-3">Recently Viewed</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" v-if="recentlyViewed.length">
      <div
        v-for="it in recentlyViewed"
        :key="`${it.id}-${it.at}`"
        class="rounded-xl border border-white/10 bg-white/[0.05] p-4"
      >
        <div class="text-sm font-medium">ID: <span class="font-mono">{{ it.id }}</span></div>
        <div class="text-xs text-white/60 mt-1">At: {{ new Date(it.at).toLocaleString() }}</div>
        <NuxtLink :to="`/spaces/${it.id}`" class="inline-flex mt-3 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
          Open
        </NuxtLink>
      </div>
    </div>
    <div v-else class="text-white/60 text-sm">No recent items yet. Open a space detail page to populate this.</div>
  </div>
</template>
