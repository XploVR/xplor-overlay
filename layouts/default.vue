<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <NuxtLink to="/" class="font-bold">Xplor</NuxtLink>
        <nav class="ml-auto flex items-center gap-4">
          <NuxtLink to="/spaces">Explore</NuxtLink>
          <NuxtLink to="/upload">Upload</NuxtLink>
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t">
      <div class="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">© Xplor</div>
    </footer>
  </div>
</template>

