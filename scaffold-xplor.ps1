# Xplor Nuxt 3 — full scaffold with safe writes (LiteralPath)
# Run from your project root (where nuxt.config.ts / app.vue will live)

# --- SETTINGS ---
$OverwriteAll = $false   # set $true to overwrite existing non-empty files

# --- HELPERS ---
function Ensure-Dir($path) {
  if ($path -and -not (Test-Path -LiteralPath $path)) {
    New-Item -ItemType Directory -Path $path | Out-Null
  }
}

function Write-Boilerplate($path, $content) {
  $dir = Split-Path $path -Parent
  if ($dir) { Ensure-Dir $dir }
  $shouldWrite = $OverwriteAll -or -not (Test-Path -LiteralPath $path) -or ((Get-Item -LiteralPath $path).Length -eq 0)
  if ($shouldWrite) {
    $content | Out-File -LiteralPath $path -Encoding utf8 -Force
    Write-Host "Wrote: $path"
  } else {
    Write-Host "Skip (has content): $path"
  }
}

# --- DIRECTORIES ---
$dirs = @(
  "assets",
  "components/forms",
  "components/listing",
  "components/ui",
  "composables",
  "layouts",
  "pages",
  "pages/upload",
  "pages/spaces",
  "pages/dashboard",
  "plugins",
  "server/api",
  "types"
)
$dirs | ForEach-Object { Ensure-Dir $_ }

# --- CONTENT STRINGS ---

$appVue = @"
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
"@

$nuxtConfig = @"
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss','nuxt-mapbox','@pinia/nuxt','@nuxt/image'],
  css: ['~/assets/tailwind.css'],
  typescript: { strict: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_TOKEN,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },
  mapbox: { accessToken: process.env.MAPBOX_TOKEN },
  routeRules: { '/spaces': { ssr: true, isr: 60 }, '/spaces/**': { ssr: true, isr: 300 } }
})
"@

$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}'
  ],
  theme: { extend: {} },
  plugins: []
}
"@

$tailwindCss = "@tailwind base;`n@tailwind components;`n@tailwind utilities;"

$layoutDefault = @"
<template>
  <div class='min-h-screen flex flex-col'>
    <header class='border-b'>
      <div class='max-w-6xl mx-auto px-4 py-3 flex items-center gap-4'>
        <NuxtLink to='/' class='font-bold'>Xplor</NuxtLink>
        <nav class='ml-auto flex items-center gap-4'>
          <NuxtLink to='/spaces'>Explore</NuxtLink>
          <NuxtLink to='/upload'>Upload</NuxtLink>
          <NuxtLink to='/dashboard'>Dashboard</NuxtLink>
        </nav>
      </div>
    </header>
    <main class='flex-1'><slot/></main>
    <footer class='border-t'>
      <div class='max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500'>© Xplor</div>
    </footer>
  </div>
</template>
"@

$typesListing = @"
export type SpaceKind = 'real_estate'|'yacht'|'gallery'|'hotel'|'restaurant'|'museum'|'vehicle'
export interface BaseListing {
  id?: string; kind: SpaceKind; title: string; description: string;
  address_line1: string; city: string; country: string;
  lat: number; lng: number; status: 'draft'|'active'|'archived'
}
"@

$listCard = @"
<script setup lang='ts'>
import type { BaseListing } from '~/types/listing'
const props = defineProps<{ item: BaseListing }>()
</script>
<template>
  <NuxtLink :to="`/spaces/${props.item.id}`" class='block border rounded overflow-hidden'>
    <div class='aspect-video bg-gray-100'></div>
    <div class='p-3'>
      <div class='font-medium truncate'>{{ props.item.title }}</div>
      <div class='text-sm text-gray-500'>{{ props.item.city }}, {{ props.item.country }}</div>
    </div>
  </NuxtLink>
</template>
"@

$listGrid = @"
<script setup lang='ts'>
import type { BaseListing } from '~/types/listing'
import ListingCard from './ListingCard.vue'
const props = defineProps<{ items: BaseListing[] }>()
</script>
<template>
  <div class='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
    <ListingCard v-for='p in props.items' :key='p.id' :item='p' />
  </div>
</template>
"@

$listMap = @"
<script setup lang='ts'>
import type { BaseListing } from '~/types/listing'
const props = defineProps<{ items: BaseListing[]; center?: [number,number]; zoom?: number }>()
const center = computed(() => props.center || [2.6502, 39.5696])
const zoom = computed(() => props.zoom ?? 10)
</script>
<template>
  <MapboxMap :style=""{ height: '70vh' }"" map-style='mapbox://styles/mapbox/streets-v12' :center='center' :zoom='zoom'>
    <MapboxMarker v-for='p in props.items' :key='p.id' :lng-lat='[p.lng, p.lat]'>
      <MapboxPopup :offset='[0,-14]'>
        <div class='w-48'>
          <div class='font-medium text-sm'>{{ p.title }}</div>
          <div class='text-xs text-gray-500'>{{ p.city }}, {{ p.country }}</div>
          <NuxtLink :to=""`/spaces/${p.id}`"" class='text-xs underline'>View</NuxtLink>
        </div>
      </MapboxPopup>
    </MapboxMarker>
  </MapboxMap>
</template>
"@

$uploadWithMedia = @"
<script setup lang='ts'>
import { ref } from 'vue'
import type { SpaceKind } from '~/types/listing'
const props = defineProps<{ kind: SpaceKind }>()
const created = ref<any>(null)
function fakeCreate() { created.value = { id: crypto.randomUUID?.() ?? String(Date.now()) } }
</script>
<template>
  <div class='space-y-4'>
    <button class='bg-black text-white rounded px-4 py-2' @click='fakeCreate'>Create Draft</button>
    <div v-if='created' class='border-t pt-4'>
      <p class='text-sm text-gray-600'>Draft created (demo). Proceed with media upload wiring.</p>
    </div>
  </div>
</template>
"@

# PAGES
$homePage = @"
<template>
  <div class='max-w-3xl mx-auto p-8'>
    <h1 class='text-2xl font-semibold mb-2'>Xplor Starter</h1>
    <p class='text-gray-600'>
      Go to <NuxtLink to='/upload'>Upload</NuxtLink> or <NuxtLink to='/spaces'>Explore</NuxtLink>.
    </p>
  </div>
</template>
"@

$uploadIndex = @"
<template>
  <div class='max-w-3xl mx-auto p-6'>
    <h1 class='text-2xl font-semibold mb-4'>Upload a Space</h1>
    <div class='grid grid-cols-2 md:grid-cols-3 gap-3'>
      <NuxtLink to='/upload/real_estate' class='border rounded p-4 hover:bg-gray-50'>Real estate</NuxtLink>
      <NuxtLink to='/upload/yacht' class='border rounded p-4 hover:bg-gray-50'>Yacht</NuxtLink>
      <NuxtLink to='/upload/gallery' class='border rounded p-4 hover:bg-gray-50'>Gallery</NuxtLink>
    </div>
  </div>
</template>
"@

$uploadRealEstate = @"
<script setup lang='ts'>
import UploadWithMedia from '~/components/forms/UploadWithMedia.vue'
</script>
<template>
  <div class='max-w-3xl mx-auto p-6'>
    <h1 class='text-2xl font-semibold mb-4'>Upload — Real Estate</h1>
    <UploadWithMedia kind='real_estate' />
  </div>
</template>
"@

$spacesIndex = @"
<script setup lang='ts'>
import ListingGrid from '~/components/listing/ListingGrid.vue'
import ListingMap from '~/components/listing/ListingMap.vue'
import type { BaseListing } from '~/types/listing'
const items = ref<BaseListing[]>([])
onMounted(() => {
  items.value = [
    { id: '1', kind:'real_estate', title:'Sea View Villa', description:'...', address_line1:'Carrer', city:'Palma', country:'Spain', lat:39.57, lng:2.65, status:'active' },
    { id: '2', kind:'yacht', title:'M/Y Lady Victoria', description:'...', address_line1:'Port', city:'Antibes', country:'France', lat:43.58, lng:7.12, status:'active' }
  ]
})
</script>
<template>
  <div class='max-w-6xl mx-auto p-6 space-y-6'>
    <h1 class='text-2xl font-semibold'>Explore Spaces</h1>
    <ListingGrid :items='items' />
    <ListingMap :items='items' :center='[2.6502,39.5696]' />
  </div>
</template>
"@

$spacesId = @"
<script setup lang='ts'>
const route = useRoute()
const id = route.params.id as string
const item = ref<any>(null)
onMounted(() => { item.value = { id, title:'Example Space', city:'Palma', country:'Spain' } })
</script>
<template>
  <div class='max-w-4xl mx-auto p-6'>
    <h1 class='text-2xl font-semibold mb-2'>{{ item?.title }}</h1>
    <div class='text-gray-500'>{{ item?.city }}, {{ item?.country }}</div>
    <div class='mt-6 h-64 bg-gray-100 rounded'></div>
  </div>
</template>
"@

$dashIndex = @"
<script setup lang='ts'>
const myItems = ref<any[]>([])
</script>
<template>
  <div class='max-w-5xl mx-auto p-6'>
    <h1 class='text-2xl font-semibold mb-4'>My Listings</h1>
    <div v-if='!myItems.length' class='text-gray-500'>
      No listings yet. <NuxtLink class='underline' to='/upload'>Create one</NuxtLink>.
    </div>
  </div>
</template>
"@

# --- WRITE FILES ---

Write-Boilerplate "app.vue"                                   $appVue
Write-Boilerplate "nuxt.config.ts"                           $nuxtConfig
Write-Boilerplate "tailwind.config.js"                       $tailwindConfig
Write-Boilerplate "assets/tailwind.css"                      $tailwindCss
Write-Boilerplate "layouts/default.vue"                      $layoutDefault

Write-Boilerplate "types/listing.ts"                         $typesListing
Write-Boilerplate "components/listing/ListingCard.vue"       $listCard
Write-Boilerplate "components/listing/ListingGrid.vue"       $listGrid
Write-Boilerplate "components/listing/ListingMap.vue"        $listMap
Write-Boilerplate "components/forms/UploadWithMedia.vue"     $uploadWithMedia

Write-Boilerplate "pages/index.vue"                          $homePage
Write-Boilerplate "pages/upload/index.vue"                   $uploadIndex
Write-Boilerplate "pages/upload/real_estate.vue"             $uploadRealEstate
Write-Boilerplate "pages/spaces/index.vue"                   $spacesIndex
Write-Boilerplate "pages/spaces/[id].vue"                    $spacesId
Write-Boilerplate "pages/dashboard/index.vue"                $dashIndex

Write-Host "`n✅ Scaffold complete. Flip `$OverwriteAll = $true` and rerun if you want to force-overwrite files."
Write-Host "Next: npm i  &&  npm run dev"
