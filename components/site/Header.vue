<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X, Bell, ShoppingCart } from 'lucide-vue-next'

type NavItem = { label: string; to: string }
const nav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Uploads',   to: '/upload' },
  { label: 'FAQs',      to: '/faqs' },
  { label: 'About',     to: '/about' },
  { label: 'Alerts',    to: '/alerts' },
  { label: 'Cart',      to: '/cart' },
]

const mobileOpen = ref(false)
const route = useRoute()
const isActive = (path: string) => computed(() => route.path.startsWith(path))

// (Optional) badges â€” wire these to your store later
const alertsCount = ref<number>(0)
const cartCount = ref<number>(0)
</script>

<template>
  <header class="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-white/10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="h-14 flex items-center justify-between">
        <!-- Left: Brand -->
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <!-- Replace with <BrandXplor /> if you have it -->
          <span class="inline-block h-2 w-2 rounded-full bg-xplor-yellow"></span>
          <span>xplor</span>
        </NuxtLink>

        <!-- Center: Desktop nav -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="px-3 py-1.5 rounded-lg text-sm hover:bg-white/5"
            :class="isActive(item.to).value ? 'text-white bg-white/10' : 'text-white/80'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right: Actions -->
        <div class="hidden md:flex items-center gap-3">
          <NuxtLink to="/alerts" class="relative p-2 rounded-lg hover:bg-white/5">
            <Bell class="w-5 h-5" />
            <span
              v-if="alertsCount > 0"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-red-500 text-white"
            >{{ alertsCount }}</span>
          </NuxtLink>

          <NuxtLink to="/cart" class="relative p-2 rounded-lg hover:bg-white/5">
            <ShoppingCart class="w-5 h-5" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-xplor-yellow text-black"
            >{{ cartCount }}</span>
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded-lg hover:bg-white/5"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
        >
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <div
      id="mobile-menu"
      class="md:hidden border-t border-white/10 bg-black/95"
      v-show="mobileOpen"
    >
      <nav class="px-4 py-3 space-y-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="block px-3 py-2 rounded-lg text-sm hover:bg-white/5"
          :class="isActive(item.to).value ? 'text-white bg-white/10' : 'text-white/80'"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>

        <div class="flex items-center gap-2 pt-2">
          <NuxtLink to="/alerts" class="flex-1 text-center px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10">
            Alerts
          </NuxtLink>
          <NuxtLink to="/cart" class="flex-1 text-center px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10">
            Cart
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

