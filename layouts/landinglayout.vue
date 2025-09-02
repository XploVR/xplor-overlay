<script setup lang="ts">
import AppSidebar from '~/components/nav/AppSidebar.vue'
import { useSidebar } from '~/composables/useSidebar'

const { toggleMobile } = useSidebar()
</script>

<template>
  <!-- Full viewport height & width -->
  <div class="min-h-dvh w-full bg-black text-white">
    <!-- Top bar -->
    <header class="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
      <div class="h-14 flex items-center gap-3 px-4 md:px-8">
        <button
          class="md:hidden px-3 py-2 rounded-lg border border-white/15 text-white/80"
          @click="toggleMobile"
        >
          Menu
        </button>

        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-xplor-yellow text-black font-display">X</span>
          <span class="font-medium tracking-wide">xplor</span>
        </NuxtLink>

        <div class="ml-auto flex items-center gap-2">
          <NuxtLink to="/spaces" class="hidden sm:inline-flex px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10">Explore</NuxtLink>
          <NuxtLink to="/upload" class="px-3 py-2 rounded-lg bg-xplor-yellow text-black">+ Upload</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Sidebar + content row -->
    <!-- Fixed-height row so only MAIN scrolls; sidebar stays sticky -->
    <div class="flex w-full gap-6 md:gap-8 pt-4 md:pt-6 pb-6 px-4 md:px-8 h-[calc(100dvh-3.5rem)]">
      <!-- Sidebar lives ONLY here -->
      <ClientOnly>
        <AppSidebar />
      </ClientOnly>

      <!-- Main content: independent scroll -->
      <main class="flex-1 min-w-0 overflow-y-auto overscroll-contain">
        <slot />
      </main>
    </div>
  </div>
</template>
