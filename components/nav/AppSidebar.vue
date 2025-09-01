<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSidebar } from '~/composables/useSidebar'

const route = useRoute()
const { expanded, toggleExpanded, mobileOpen, closeMobile } = useSidebar()

const nav = [
  { label: 'Explore',   to: '/spaces',    icon: 'M3 5h18M3 12h18M3 19h18' },
  { label: 'Upload',    to: '/upload',    icon: 'M12 3v18m9-9H3' },
  { label: 'Dashboard', to: '/dashboard', icon: 'M3 12l2-2 4 4 8-8 4 4' },
  { label: 'FairSeas',  to: '/fairseas',  icon: 'M4 6h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z' },
  { label: 'Landing',   to: '/landing',   icon: 'M3 12l9-9 9 9-9 9-9-9z' },
]

// Close mobile drawer on route change
watch(() => route.fullPath, () => { if (mobileOpen.value) closeMobile() })
</script>

<template>
  <!-- Desktop sidebar -->
  <aside
    class="hidden md:flex h-dvh sticky top-0 border-r border-white/10 bg-[var(--x-black)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--x-black)]/70
           flex-col transition-[width] duration-200 overflow-y-auto"
    :class="expanded ? 'w-64' : 'w-16'"
    aria-label="Sidebar"
  >
    <!-- Header / toggle -->
    <div class="flex items-center justify-between px-3 h-14 shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-xplor-yellow"></div>
        <span v-if="expanded" class="font-semibold tracking-wide">XPLOR</span>
      </NuxtLink>
      <button class="p-2 rounded-md hover:bg-white/10" title="Toggle sidebar" @click="toggleExpanded">
        <svg viewBox="0 0 24 24" class="w-5 h-5"><path d="M3 4h18M3 12h12M3 20h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      </button>
    </div>

    <!-- Nav -->
    <nav class="px-2 py-2 space-y-1">
      <NuxtLink
        v-for="item in nav" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10"
        :class="{ 'bg-white/10': $route.path.startsWith(item.to) }"
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5 shrink-0">
          <path :d="item.icon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="expanded" class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="mt-auto p-2">
      <div class="text-[10px] text-xplor-gray2 px-2 py-1.5 rounded-lg border border-white/10">
        <span v-if="expanded">© Xplor</span>
        <span v-else>©</span>
      </div>
    </div>
  </aside>

  <!-- Mobile toggle + drawer (mobile only) -->
  <div class="md:hidden">
    <!-- Toggle button -->
    <button
      class="fixed top-3 left-3 z-40 p-2 rounded-md bg-black/60 border border-white/10"
      @click="mobileOpen = !mobileOpen"
      aria-label="Open sidebar"
    >
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-white">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Drawer -->
    <transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 z-40">
        <div class="absolute inset-0 bg-black/60" @click="closeMobile"></div>
        <aside
          class="absolute left-0 top-0 h-full w-72 bg-[var(--x-black)] border-r border-white/10 p-3 overflow-y-auto"
          aria-label="Mobile Sidebar"
        >
          <div class="flex items-center justify-between h-12">
            <NuxtLink to="/" class="flex items-center gap-2" @click="closeMobile">
              <div class="w-2.5 h-2.5 rounded-full bg-xplor-yellow"></div>
              <span class="font-semibold tracking-wide">XPLOR</span>
            </NuxtLink>
            <button class="p-2 rounded-md hover:bg-white/10" @click="closeMobile" aria-label="Close">
              <svg viewBox="0 0 24 24" class="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </button>
          </div>

          <nav class="mt-2 space-y-1">
            <NuxtLink
              v-for="item in nav" :key="item.to" :to="item.to"
              class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10"
              :class="{ 'bg-white/10': $route.path.startsWith(item.to) }"
              @click="closeMobile"
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5"><path :d="item.icon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="truncate">{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
