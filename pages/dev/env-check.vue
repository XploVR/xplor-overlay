<script setup lang="ts">
const cfg = useRuntimeConfig()
const publicVars = {
  supabaseUrl: cfg.public.supabaseUrl || '(not set)',
  supabaseAnonKey: cfg.public.supabaseAnonKey ? cfg.public.supabaseAnonKey.slice(0, 8) + '…' : '(not set)',
  mapboxToken: cfg.public.mapboxToken ? cfg.public.mapboxToken.slice(0, 8) + '…' : '(not set)',
}
const serverVars = {
  supabaseServiceRole: !!cfg.supabaseServiceRole ? '(set)' : '(not set)',
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">🔍 Runtime Config Debug</h1>

    <div class="p-4 rounded bg-gray-100 border">
      <h2 class="font-semibold mb-2">Public Vars</h2>
      <pre class="text-sm">{{ publicVars }}</pre>
    </div>

    <div class="p-4 rounded bg-gray-100 border">
      <h2 class="font-semibold mb-2">Server-only Vars</h2>
      <pre class="text-sm">{{ serverVars }}</pre>
    </div>

    <p class="text-xs text-gray-500">
      These values come from <code>useRuntimeConfig()</code>. No Supabase client is created here.
    </p>
  </div>
</template>

