<template>
  <main class="min-h-screen text-slate-900">
    <!-- HERO -->
    <section class="relative h-[34vh] md:h-[36vh] w-full overflow-hidden">
      <!-- Background image -->
      <div
        class="absolute inset-0 pointer-events-none bg-cover bg-center z-0"
        :style="{ backgroundImage: `url('${heroImage}')` }"
        aria-hidden="true"
      />
      <!-- Strong angled shade (matches other About pages) -->
      <div
        class="absolute inset-0 pointer-events-none z-[5]
               [background:linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_35%,rgba(0,0,0,.20)_65%,rgba(0,0,0,0)_100%)] z-0"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/60 to-transparent z-[6] z-0"
        aria-hidden="true"
      ></div>

      <!-- Hero content -->
      <div class="relative h-full z-50">
        <div class="container mx-auto h-full px-6 md:px-10">
          <div class="flex h-full flex-col justify-end pb-10 md:pb-16">
            <h1 class="max-w-5xl text-2xl font-extrabold tracking-tight text-white md:text-4xl">
              Discover, xplor, and Showcase Any Space with xplor
            </h1>
            <p class="mt-3 max-w-2xl text-white/90 md:text-lg">
              The global platform that brings virtual tours to life
            </p>
            <div class="mt-5">
              <NuxtLink
                to="/signup"
                class="inline-flex items-center rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                Start Your Virtual Journey
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Overview -->
    <section class="bg-white py-14 md:py-20">
      <div class="container mx-auto px-6 md:px-10">
        <div class="grid gap-8 md:grid-cols-12 md:items-center">
          <div class="md:col-span-7">
            <h2 class="text-2xl font-bold md:text-3xl">The Platform for Immersive Spaces</h2>
            <p class="mt-4 text-slate-600 md:text-lg">
              xplor is the ultimate platform for creating and sharing immersive experiences of any space. Upload
              <span class="font-medium">virtual tours, photos, videos, 360° content, floor plans, and documents</span> into a single,
              SEO-optimized listing—each with a global, searchable location.
            </p>
          </div>
          <div class="md:col-span-5">
            <div class="overflow-hidden rounded-2xl shadow-xl">
              <img
                :src="overviewImage"
                alt="xplor immersive media example"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nine Categories -->
    <section class="bg-slate-50 py-14 md:py-20">
      <div class="container mx-auto px-6 md:px-10">
        <h2 class="text-2xl font-bold md:text-3xl">xplor Our Focus Categories</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="cat in categories"
            :key="cat.title"
            class="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl cursor-pointer"
            role="link"
            tabindex="0"
            @click="go(cat.href)"
            @keydown.enter.prevent="go(cat.href)"
            @keydown.space.prevent="go(cat.href)"
            :aria-label="`Open About page for ${cat.title}`"
          >
            <div class="relative h-44 w-full">
              <img :src="cat.image" :alt="cat.title" class="absolute inset-0 pointer-events-none h-full w-full object-cover z-0" loading="lazy" />
              <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent z-0" />
              <h3 class="absolute bottom-3 left-4 right-4 text-lg font-semibold text-white drop-shadow-md">
                {{ cat.title }}
              </h3>
            </div>
            <div class="p-5">
              <p class="min-h-[3.5rem] text-sm text-slate-600">{{ cat.subtitle }}</p>
              <div class="mt-4">
                <NuxtLink
                  :to="cat.href"
                  class="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  About this Category
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FairSeas Spotlight -->
    <section class="relative overflow-hidden py-16 md:py-24">
      <div class="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-50 via-white to-cyan-50 z-0" aria-hidden="true" />
      <div class="relative container mx-auto px-6 md:px-10">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p class="font-semibold uppercase tracking-wider text-sky-700">Introducing</p>
            <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              FairSeas — The Crew-First Hub for Yachting
            </h2>
            <p class="mt-4 text-slate-700 md:text-lg">
              Showcase every deck and detail with immersive 360° tours, publish live charter availability, list marinas and berths, and connect boat sales — all on a global, searchable canvas built to convert. And with FairSeas’ crew-first model, <strong>50% of Xplor’s net charter commission is shared with verified crew</strong>, rewarding the team that makes every charter exceptional.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink
                to="/upload/yacht"
                class="inline-flex items-center rounded-2xl bg-cyan-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Upload Your Yacht
              </NuxtLink>
              <!-- Updated to the new location -->
              <NuxtLink
                to="/about/fairseas"
                class="inline-flex items-center rounded-2xl border border-cyan-200 bg-white px-5 py-3 font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                xplor FairSeas
              </NuxtLink>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl shadow-2xl">
            <img :src="fairseasImage" alt="FairSeas yacht experience" class="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({
  title: 'About xplor — Virtual Tours & Media Showcase',
  meta: [
    { name: 'description', content: 'xplor is the global platform to create, upload, and showcase immersive virtual tours and media for any space.' }
  ]
})

import { useRouter } from 'vue-router'
const router = useRouter()
const go = (to: string) => router.push(to)

// Import images from /assets so Nuxt/Vite can process them
import heroImage from '@/assets/images/about-hero.jpg'
import overviewImage from '@/assets/images/education-schools-hero.jpg'
import fairseasImage from '@/assets/images/yachts/superyachts/yacht-004.jpg'

// Category images
import imgRealEstate from '@/assets/images/real-estate/real-estate-008.jpg'
import imgYacht from '@/assets/images/yachts/superyachts/yacht-004.jpg'
import imgHotel from '@/assets/images/hotels/hotels-003.jpg'
import imgCar from '@/assets/images/cars/cars-002.jpg'
import imgRetail from '@/assets/images/retail/retail-001.jpg'
import imgAviation from '@/assets/images/aviation/aviation-001.jpg'
import imgDev from '@/assets/images/developments/developments-004.jpg'
import imgSports from '@/assets/images/sports/sports-004.jpg'
import imgGallery from '@/assets/images/galleries/gallery-003.jpg'

/**
 * Link each card to its corresponding About page
 */
const categories = [
  { title: 'Real Estate', subtitle: 'Residential & commercial properties', href: '/about/real-estate', image: imgRealEstate },
  { title: 'Yachts & Marine', subtitle: 'Boats, superyachts, marinas', href: '/about/yachts', image: imgYacht },
  { title: 'Hospitality', subtitle: 'Hotels, resorts, restaurants', href: '/about/hospitality', image: imgHotel },
  { title: 'Automotive', subtitle: 'Vehicles, showrooms, concept launches', href: '/about/automotive', image: imgCar },
  { title: 'Retail & Showrooms', subtitle: 'Stores, galleries, showrooms', href: '/about/retail', image: imgRetail },
  { title: 'Aviation', subtitle: 'Aircraft, airports & FBOs', href: '/about/aviation', image: imgAviation },
  { title: 'Developments', subtitle: 'Concepts, off-plan, launches', href: '/about/developments', image: imgDev },
  { title: 'Sports & Leisure', subtitle: 'Gyms, spas, entertainment venues', href: '/about/sports-facilities', image: imgSports },
  { title: 'Galleries & Art Spaces', subtitle: 'Art galleries, studios, creative spaces', href: '/about/galleries', image: imgGallery }
]
</script>

<style scoped>
/* Optional: smoother section entrances without extra libs */
section { scroll-margin-top: 80px; }
</style>
