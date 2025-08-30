<script setup lang="ts">
const { $supabase } = useNuxtApp()
const user = ref<any | null>(null)

onMounted(() => {
  $supabase.auth.getUser().then(({ data }) => { user.value = data.user || null })
  $supabase.auth.onAuthStateChange((_e, session) => { user.value = session?.user || null })
})

async function signOut() {
  await $supabase.auth.signOut()
  navigateTo('/auth')
}
</script>

<template>
  <div class="flex items-center gap-3">
    <NuxtLink v-if="!user" to="/auth" class="underline">Sign in</NuxtLink>
    <div v-else class="flex items-center gap-2">
      <span class="text-sm text-gray-600 truncate max-w-[16ch]">
        {{ user.email }}
      </span>
      <button @click="signOut" class="text-sm underline">Sign out</button>
    </div>
  </div>
</template>
