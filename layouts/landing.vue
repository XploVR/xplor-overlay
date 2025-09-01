<script setup lang="ts">
import AppSidebar from '~/components/nav/AppSidebar.vue'
import { useSidebar } from '~/composables/useSidebar'
const { expanded } = useSidebar()
</script>

<template>
  <div class="min-h-dvh flex">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main content -->
    <div class="flex-1 min-w-0">
      <!-- Top bar with toggle mirror (desktop only collapsed space) -->
      <header class="h-14 border-b border-white/10 flex items-center px-4 sticky top-0 bg-[var(--x-black)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--x-black)]/40 z-10">
        <div class="flex items-center gap-3">
          <!-- Space for alignment when sidebar is collapsed -->
          <div :class="expanded ? 'w-0' : 'w-4'"></div>
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-xplor-yellow"></div>
            <span class="font-semibold tracking-wide">XPLOR</span>
          </NuxtLink>
        </div>
        <div class="ml-auto">
          <NuxtLink to="/upload" class="px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-sm">List your space</NuxtLink>
        </div>
      </header>

      <!-- Page slot -->
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
