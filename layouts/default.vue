<template>
  <div class="min-h-dvh flex flex-col bg-[linear-gradient(180deg,#fff,rgba(232,247,147,0.25)_160px,transparent_320px)]">
    <!-- Header -->
    <header class="border-b border-x-gray/40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav class="container-x h-16 flex items-center justify-between gap-4">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-x-yellow text-x-black font-display text-xl">X</span>
          <span class="font-display text-lg tracking-wide">Xplor</span>
        </NuxtLink>

        <!-- Primary Nav -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink to="/" class="nav-link" :class="$route.path==='/' && 'nav-link-active'">Home</NuxtLink>
          <NuxtLink to="/spaces" class="nav-link" :class="$route.path.startsWith('/spaces') && 'nav-link-active'">Spaces</NuxtLink>
          <NuxtLink to="/dashboard" class="nav-link" :class="$route.path.startsWith('/dashboard') && 'nav-link-active'">Dashboard</NuxtLink>
          <NuxtLink :to="{ name: 'upload' }" class="nav-link" :class="$route.path.startsWith('/upload') && 'nav-link-active'"> Upload</NuxtLink>
          <NuxtLink to="/contact" class="nav-link" :class="$route.path==='/contact' && 'nav-link-active'">Contact</NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <NuxtLink :to="{ name: 'upload' }" class="btn btn-alt">+ upload</NuxtLink>
          <NuxtLink :to="{ name: 'spaces-new' }" class="btn btn-ghost">Add Space</NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Page -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-12 border-t border-x-gray/40 bg-white">
      <div class="container-x py-8 grid gap-6 md:grid-cols-3 items-center">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-x-yellow text-x-black font-display">X</span>
          <div>
            <p class="font-display">Xplor</p>
            <p class="text-xs text-x-gray2">Virtual tours for everywhere.</p>
          </div>
        </div>

        <div class="text-sm text-x-deep/80 flex gap-4 md:justify-center">
          <NuxtLink to="/terms" class="hover:underline">Terms</NuxtLink>
          <NuxtLink to="/privacy" class="hover:underline">Privacy</NuxtLink>
          <NuxtLink to="/contact" class="hover:underline">Contact</NuxtLink>
        </div>

        <p class="text-right text-sm text-x-gray2 md:text-right">© {{ new Date().getFullYear() }} Xplor</p>
      </div>
    </footer>
  </div>
</template>
