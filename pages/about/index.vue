<template>
  <main class="min-h-screen text-slate-900">
    <!-- HERO -->
    <section class="relative h-[68vh] md:h-[72vh] w-full overflow-hidden">
      <!-- Background image (put file in /public/images/) -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url('${heroImage}')`
        }"
        aria-hidden="true"
      />
      <!-- Gradient overlay: transparent -> 30% black -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" aria-hidden="true" />
      <!-- Hero content -->
      <div class="relative z-10 h-full">
        <div class="container mx-auto h-full px-6 md:px-10">
          <div class="flex h-full flex-col justify-end pb-14 md:pb-20">
            <h1 class="max-w-5xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Discover, xplor, and Showcase Any Space with xplor
            </h1>
            <p class="mt-4 max-w-2xl text-white/90 md:text-lg">
              The global platform that brings virtual tours to life
            </p>
            <div class="mt-6">
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
              SEO-optimized listing—each with a global, searchable location. Promote, sell, rent, charter, or simply showcase your
              space to the world with tools designed for speed, clarity, and impact.
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
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-2xl font-bold md:text-3xl">xplor Our Focus Categories</h2>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="cat in categories"
            :key="cat.title"
            class="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl"
          >
            <div class="relative h-44 w-full">
              <img :src="cat.image" :alt="cat.title" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                  xplor Category
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Use Case Inspiration -->
    <section class="bg-white py-14 md:py-20">
      <div class="container mx-auto px-6 md:px-10">
        <h2 class="text-2xl font-bold md:text-3xl">Inspiration & Use Cases</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-2">
          <ul class="space-y-3 text-slate-700">
            <li v-for="(item, idx) in inspirationLeft" :key="idx" class="flex items-start gap-3">
              <span class="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
          <ul class="space-y-3 text-slate-700">
            <li v-for="(item, idx) in inspirationRight" :key="idx" class="flex items-start gap-3">
              <span class="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FairSeas Spotlight -->
    <section class="relative overflow-hidden py-16 md:py-24">
      <!-- subtle wavey gradient background -->
      <div class="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50" aria-hidden="true" />
      <div class="relative container mx-auto px-6 md:px-10">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p class="font-semibold uppercase tracking-wider text-sky-700">Introducing</p>
            <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              FairSeas – Your Gateway to Maritime Excellence
            </h2>
            <p class="mt-4 text-slate-700 md:text-lg">
              FairSeas is xplor’s flagship for yachts and marine. Create immersive yacht tours with 360° decks and interiors,
              enable charter bookings, list marinas with services and berths, and integrate boat sales—all on a global,
              searchable canvas designed for discovery.
            </p>
            <ul class="mt-6 space-y-2 text-slate-700">
              <li class="flex items-start gap-3">
                <span class="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-600"></span>
                Virtual yacht tours & immersive media
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-600"></span>
                Charter booking capabilities & availability
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-600"></span>
                Marina listings & berth details
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-600"></span>
                Boat sales integration & specifications
              </li>
            </ul>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink
                to="/upload/yacht"
                class="inline-flex items-center rounded-2xl bg-cyan-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Upload Your Yacht
              </NuxtLink>
              <NuxtLink
                to="/fairseas"
                class="inline-flex items-center rounded-2xl border border-cyan-200 bg-white px-5 py-3 font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                xplor FairSeas
              </NuxtLink>
            </div>
          </div>
          <div class="overflow-hidden rounded-2xl shadow-2xl">
            <img
              :src="fairseasImage"
              alt="FairSeas yacht experience"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose xplor -->
    <section class="bg-slate-50 py-14 md:py-20">
      <div class="container mx-auto px-6 md:px-10">
        <h2 class="text-2xl font-bold md:text-3xl">Why Choose xplor</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(point, i) in whyPoints" :key="i" class="rounded-2xl bg-white p-6 shadow-md">
            <h3 class="text-base font-semibold text-slate-900">{{ point.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ point.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="bg-white py-16 md:py-24">
      <div class="container mx-auto px-6 text-center md:px-10">
        <h2 class="text-2xl font-extrabold md:text-3xl">Start Showcasing Your Space Today</h2>
        <p class="mx-auto mt-3 max-w-2xl text-slate-600">
          Create your first listing in minutes and unlock global discovery across web and mobile.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/signup"
            class="inline-flex items-center rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Get Started
          </NuxtLink>
          <NuxtLink
            to="/fairseas"
            class="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Learn More about FairSeas
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Nuxt 3 page meta & head
definePageMeta({ layout: 'default' })
useHead({
  title: 'About xplor — Virtual Tours & Media Showcase',
  meta: [
    { name: 'description', content: 'xplor is the global platform to create, upload, and showcase immersive virtual tours and media for any space.' }
  ]
})

// Hero & section images. Place files in /public/images/ to use direct URLs.
const heroImage = '/images/about-hero.jpg'          // replace with your hero
const overviewImage = '/images/about-overview.jpg'  // replace with your image
const fairseasImage = '/images/fairseas-spotlight.jpg' // replace with your image

// Categories (3x3)
const categories = [
  { title: 'Real Estate', subtitle: 'Residential & commercial properties', href: '/categories/real-estate', image: '/images/cat-realestate.jpg' },
  { title: 'Yachts & Marine', subtitle: 'Boats, superyachts, marinas', href: '/categories/yachts-marine', image: '/images/cat-yachts.jpg' },
  { title: 'Hotels & Hospitality', subtitle: 'Hotels, resorts, restaurants', href: '/categories/hospitality', image: '/images/cat-hotels.jpg' },
  { title: 'Event Spaces', subtitle: 'Venues, conference centers, weddings', href: '/categories/event-spaces', image: '/images/cat-events.jpg' },
  { title: 'Retail & Showrooms', subtitle: 'Stores, galleries, showrooms', href: '/categories/retail', image: '/images/cat-retail.jpg' },
  { title: 'Architecture & Design', subtitle: 'Concepts & off-plan developments', href: '/categories/architecture', image: '/images/cat-architecture.jpg' },
  { title: 'Education & Institutions', subtitle: 'Schools, museums, libraries', href: '/categories/education', image: '/images/cat-education.jpg' },
  { title: 'Recreation & Leisure', subtitle: 'Gyms, spas, entertainment venues', href: '/categories/recreation', image: '/images/cat-recreation.jpg' },
  { title: 'Industrial & Commercial', subtitle: 'Warehouses, factories, offices', href: '/categories/industrial', image: '/images/cat-industrial.jpg' }
]

// Use case bullets (split into two columns)
const inspiration = [
  'Real estate agents showcasing luxury properties with drone footage and floor plans',
  'Yacht brokers creating immersive charter experiences with 360° deck tours',
  'Architects presenting off-plan developments with concept renderings and virtual walkthroughs',
  'Hotel managers highlighting amenities with virtual room tours and local area guides',
  'Event planners showcasing venues with capacity layouts and decoration possibilities',
  'Retailers creating virtual showrooms with product demonstrations',
  'Marina operators displaying berth availability with live webcam feeds',
  'Developers marketing pre-construction projects with interactive site plans'
]
const inspirationLeft = inspiration.slice(0, 4)
const inspirationRight = inspiration.slice(4)

// Why choose xplor cards
const whyPoints = [
  { title: 'Global Search & Discovery', desc: 'Listings are location-aware and SEO-optimized for maximum visibility.' },
  { title: 'All Media Welcome', desc: 'VR tours, photos, videos, 360°, floor plans, and documents in one place.' },
  { title: 'Simple Uploads', desc: 'Streamlined creation and management tools save time and reduce friction.' },
  { title: 'Seamless Integrations', desc: 'Connect booking engines, CRMs, and sales systems as you grow.' },
  { title: 'Mobile-Responsive', desc: 'Every listing is optimized for phones, tablets, and desktops.' },
  { title: 'Analytics & Insights', desc: 'Track engagement to refine your media and boost conversions.' }
]
</script>

<style scoped>
/* Optional: smoother section entrances without extra libs */
section {
  scroll-margin-top: 80px;
}
</style>
