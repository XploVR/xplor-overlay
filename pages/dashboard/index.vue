<script setup lang="ts">
type Row = { id:string; title:string; city?:string; country?:string; status?:string; created_at?:string; thumbnail_url?:string|null }

const { $supabase } = useNuxtApp()
const user = ref<any | null>(null)
const items = ref<Row[]>([])
const loading = ref(true)
const err = ref<string | null>(null)

onMounted(async () => {
  const { data } = await $supabase.auth.getUser()
  user.value = data.user || null
  if (!user.value) { loading.value = false; return }

  // Use the view so we get thumbnail_url
  const { data: rows, error } = await $supabase
    .from('properties_with_thumb')
    .select('id,title,city,country,status,created_at,thumbnail_url')
    .eq('owner_user_id', user.value.id)        // requires column in view; see SQL below
    .order('created_at', { ascending: false })

  if (error) err.value = error.message
  items.value = rows || []
  loading.value = false
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">My Listings</h1>
      <NavAuth />
    </div>

    <div v-if="loading">Loading…</div>

    <div v-else-if="!user" class="p-4 border rounded bg-yellow-50">
      Please <NuxtLink to="/auth" class="underline">sign in</NuxtLink> to see your listings.
    </div>

    <template v-else>
      <div v-if="!items.length" class="p-4 border rounded text-gray-600">You have no listings yet.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="it in items" :key="it.id" :to="`/spaces/${it.id}`" class="block border rounded overflow-hidden hover:shadow">
          <div class="aspect-[4/3] bg-gray-100">
            <img v-if="it.thumbnail_url" :src="it.thumbnail_url" alt="" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500">No image</div>
          </div>
          <div class="p-3">
            <div class="font-medium truncate">{{ it.title }}</div>
            <div class="text-sm text-gray-600 truncate">
              {{ it.city }}<span v-if="it.city && it.country"> · </span>{{ it.country }}
            </div>
            <div class="text-xs text-gray-500 mt-1 uppercase">{{ it.status }}</div>
          </div>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
