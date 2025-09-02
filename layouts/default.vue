<!-- layouts/default.vue -->
<script setup lang="ts">
import AppSidebar from '~/components/nav/AppSidebar.vue'
import { useSidebar } from '~/composables/useSidebar'

const { toggleMobile } = useSidebar()

// Simple helper to style active header links
const activeClasses =
  'text-white bg-white/10 border-white/20';
const baseClasses =
  'px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition';
</script>

<template>
  <div class="min-h-dvh w-full bg-black text-white">
    <!-- Skip to content (a11y) -->
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 rounded bg-yellow-300 text-black">
      Skip to content
    </a>

    <!-- Top bar -->
    <header class="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
      <div class="h-14 flex items-center gap-3 px-4 md:px-8">
        <!-- Mobile menu button (opens sidebar) -->
        <button class="md:hidden px-3 py-2 rounded-lg border border-white/15 text-white/80" @click="toggleMobile">
          Menu
        </button>

        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-300 text-black font-bold">X</span>
          <span class="font-medium tracking-wide">xplor</span>
        </NuxtLink>

        <!-- Primary nav (header) -->
        <nav class="ml-auto hidden md:flex items-center gap-2">
          <NuxtLink to="/dashboard" class="px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition" active-class="text-white bg-white/10 border-white/20">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/upload" class="px-3 py-2 rounded-lg bg-yellow-300 text-black hover:opacity-90 transition">
            + Uploads
          </NuxtLink>
          <NuxtLink to="/faqs" class="px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition" active-class="text-white bg-white/10 border-white/20">
            FAQs
          </NuxtLink>
          <NuxtLink to="/about" class="px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition" active-class="text-white bg-white/10 border-white/20">
            About
          </NuxtLink>
          <NuxtLink to="/alerts" class="px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition" active-class="text-white bg-white/10 border-white/20">
            Alerts
          </NuxtLink>
          <NuxtLink to="/cart" class="px-3 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition" active-class="text-white bg-white/10 border-white/20">
            Cart
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Sidebar + content row
         - Fills viewport minus header height (3.5rem / 56px)
         - Hides outer scroll so MAIN scrolls independently
    -->
    <div
      class="flex w-full gap-6 md:gap-8 pt-4 md:pt-6 pb-6 px-4 md:px-8
             h-[calc(100dvh-3.5rem)] overflow-hidden"
    >
      <!-- Sidebar (sticky inside itself; see AppSidebar.vue) -->
      <ClientOnly>
        <AppSidebar />
      </ClientOnly>

      <!-- Main content: independent scroll -->
      <main id="main" class="flex-1 min-w-0 overflow-y-auto overscroll-contain">
        <slot />
      </main>
    </div>
  </div>
</template>
