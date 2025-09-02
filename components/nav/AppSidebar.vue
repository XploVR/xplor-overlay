<!-- components/nav/AppSidebar.vue -->
<script setup lang="ts">
import { h } from 'vue'
import { useSidebar } from '~/composables/useSidebar'

const { isOpen, isCollapsed, toggleCollapsed, closeMobile } = useSidebar()

const cats = [
  { key: 'real_estate',  label: 'Real Estate',        to: '/upload?type=real_estate' },
  { key: 'developments', label: 'Developments',       to: '/upload?type=developments' },
  { key: 'yachts',       label: 'Yachts',             to: '/upload?type=yachts' },
  { key: 'hospitality',  label: 'Hospitality',        to: '/upload?type=hospitality' },
  { key: 'galleries',    label: 'Galleries',          to: '/upload?type=galleries' },
  { key: 'automotive',   label: 'Automotive',         to: '/upload?type=automotive' },
  { key: 'aviation',     label: 'Aviation',           to: '/upload?type=aviation' },
  { key: 'sports',       label: 'Sports Facilities',  to: '/upload?type=sports' },
  { key: 'retail',       label: 'Retail',             to: '/upload?type=retail' },
]

const pages = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { key: 'about',     label: 'About',     to: '/about' },
  { key: 'fairseas',  label: 'FairSeas',  to: '/fairseas' },
  { key: 'faqs',      label: 'FAQs',      to: '/faqs' },
  { key: 'pros',      label: 'Tour Pros', to: '/tour-pros' },
  { key: 'gear',      label: 'Equipment', to: '/equipment' },
]

function Icon (name: string, cls = 'w-5 h-5') {
  const base = { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': 1.6, class: cls }
  switch (name) {
    case 'real_estate':  return h('svg', base, [h('path', { d: 'M3 11.5L12 4l9 7.5M5 10.5V20h14v-9.5' }), h('path', { d:'M9 20v-6h6v6' })])
    case 'developments': return h('svg', base, [h('rect', { x:3, y:3, width:7, height:7, rx:1.5 }), h('rect', { x:14, y:3, width:7, height:7, rx:1.5 }), h('rect', { x:3, y:14, width:7, height:7, rx:1.5 }), h('rect', { x:14, y:14, width:7, height:7, rx:1.5 })])
    case 'yachts':       return h('svg', base, [h('path', { d: 'M4 15h9l3-4 4 4H4Z' }), h('path', { d:'M3 18c2 2 5 2 7 0 2 2 5 2 7 0' })])
    case 'hospitality':  return h('svg', base, [h('path', { d: 'M3 12h18M5 12V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 12v7m14-7v7M5 19h14' })])
    case 'galleries':    return h('svg', base, [h('rect', { x:3, y:4, width:18, height:14, rx:2 }), h('path', { d:'M7 13l3-3 4 4 3-3 3 3' }), h('circle', { cx:8.5, cy:8.5, r:1.25 })])
    case 'automotive':   return h('svg', base, [h('path', { d: 'M3 13h18l-2-4a3 3 0 0 0-2.7-1.8H7.7A3 3 0 0 0 5 9l-2 4Z' }), h('circle', { cx:7.5, cy:16.5, r:1.5 }), h('circle', { cx:16.5, cy:16.5, r:1.5 }), h('path', { d:'M3 16.5h2m14 0h2' })])
    case 'aviation':     return h('svg', base, [h('path', { d: 'M2 12h8l4-7 2 7h6l-6 3 1.5 6-4.5-4-4.5 4L9 15l-7-3Z' })])
    case 'sports':       return h('svg', base, [h('path', { d:'M4 18c4-2 12-2 16 0M6 9c3-1 9-1 12 0' }), h('rect', { x:3, y:6, width:18, height:12, rx:3 })])
    case 'retail':       return h('svg', base, [h('path', { d:'M6 9V7a6 6 0 0 1 12 0v2' }), h('rect', { x:4, y:9, width:16, height:11, rx:2 })])
    case 'dashboard':    return h('svg', base, [h('path', { d:'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z' })])
    case 'about':        return h('svg', base, [h('circle', { cx:12, cy:7, r:3 }), h('path', { d:'M4 20a8 8 0 0 1 16 0' })])
    case 'fairseas':     return h('svg', base, [h('path', { d:'M4 15h9l3-4 4 4H4Z' }), h('path', { d:'M3 18c2 2 5 2 7 0 2 2 5 2 7 0' })])
    case 'faqs':         return h('svg', base, [h('path', { d:'M12 18v-2a4 4 0 1 0-4-4' }), h('circle', { cx:12, cy:19, r:1 })])
    case 'pros':         return h('svg', base, [h('path', { d:'M12 3l3 7h7l-5.5 4 2 7-6.5-4.5L5 21l2-7L2 10h7z' })])
    case 'gear':         return h('svg', base, [h('path', { d:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-5l2 2 3-1 1 3 3 1-1 3 2 2-2 2 1 3-3 1-1 3-3-1-2 2-2-2-3 1-1-3-3-1 1-3-2-2 2-2-1-3 3-1 1-3 3 1 2-2z' })])
    default:             return h('svg', base, [h('circle', { cx:12, cy:12, r:8 })])
  }
}
</script>

<template>
  <!-- Desktop sticky sidebar -->
  <aside
    class="hidden md:flex shrink-0 transition-all duration-200 ease-out sticky top-0 self-stretch"
    :class="isCollapsed ? 'w-[76px]' : 'w-[280px]'"
  >
    <div class="relative w-full rounded-2xl border border-white/10 bg-white/[0.03] p-2 flex flex-col">
      <!-- Top: brand + collapse toggle -->
      <div class="flex items-center justify-between px-2 py-1">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="inline-grid place-items-center h-7 w-7 rounded-lg bg-yellow-300 text-black font-bold">X</span>
          <span v-if="!isCollapsed" class="font-medium">xplor</span>
        </NuxtLink>
        <button
          class="ml-2 inline-grid place-items-center w-8 h-8 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.12]"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleCollapsed"
        >
          <!-- « or » -->
          <svg v-if="!isCollapsed" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
            <path d="M13.5 6l-6 6 6 6M20 6l-6 6 6 6"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
            <path d="M10.5 6l6 6-6 6M4 6l6 6-6 6"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable nav -->
      <div class="mt-2 flex-1 overflow-y-auto thin-scroll">
        <div v-if="!isCollapsed" class="px-2 pt-1 pb-2">
          <p class="text-xs uppercase tracking-wide text-white/50">Categories</p>
        </div>
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="c in cats"
            :key="c.key"
            :to="c.to"
            class="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.08]"
            :title="isCollapsed ? c.label : undefined"
          >
            <span class="inline-grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] p-2 text-white/80">
              <component :is="Icon(c.key, 'w-5 h-5')" />
            </span>
            <span v-if="!isCollapsed" class="truncate">{{ c.label }}</span>
          </NuxtLink>
        </nav>

        <div v-if="!isCollapsed" class="px-2 pt-4 pb-2">
          <p class="text-xs uppercase tracking-wide text-white/50">Pages</p>
        </div>
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="p in pages"
            :key="p.key"
            :to="p.to"
            class="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.08]"
            :title="isCollapsed ? p.label : undefined"
          >
            <span class="inline-grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] p-2 text-white/80">
              <component :is="Icon(p.key, 'w-5 h-5')" />
            </span>
            <span v-if="!isCollapsed" class="truncate">{{ p.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </aside>

  <!-- Mobile drawer -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[60] bg-black/50 md:hidden" @click.self="closeMobile" />
    </transition>
    <transition name="slide">
      <div v-if="isOpen" class="fixed inset-y-0 left-0 z-[61] w-[86vw] max-w-[320px] bg-[#0b0b0b] border-r border-white/10 p-3 md:hidden">
        <div class="flex items-center justify-between px-1 py-2">
          <div class="flex items-center gap-2">
            <span class="inline-grid place-items-center h-8 w-8 rounded-xl bg-yellow-300 text-black font-bold">X</span>
            <span class="font-medium">Xplor</span>
          </div>
          <button class="px-2 py-1 rounded-lg border border-white/15 text-white/80" @click="closeMobile">Close</button>
        </div>

        <nav class="mt-3 grid grid-cols-2 gap-2">
          <NuxtLink v-for="c in cats" :key="c.key" :to="c.to" class="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/[0.08]" @click="closeMobile">
            <span class="inline-grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] p-2 text-white/80">
              <component :is="Icon(c.key, 'w-5 h-5')" />
            </span>
            <span class="truncate">{{ c.label }}</span>
          </NuxtLink>
          <NuxtLink v-for="p in pages" :key="p.key" :to="p.to" class="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/[0.08]" @click="closeMobile">
            <span class="inline-grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] p-2 text-white/80">
              <component :is="Icon(p.key, 'w-5 h-5')" />
            </span>
            <span class="truncate">{{ p.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.thin-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.25) transparent; }
.thin-scroll::-webkit-scrollbar { width: 8px; }
.thin-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,.22); border-radius: 8px; }
.thin-scroll::-webkit-scrollbar-track { background: transparent; }

.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform .18s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
