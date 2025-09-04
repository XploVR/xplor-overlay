<script setup lang="ts">
const { $supabase } = useNuxtApp()
const user = ref<any | null>(null)

// Development bypass - fake user when in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

onMounted(() => {
  if (isDevelopment) {
    // Set fake user for development
    user.value = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User'
    }
    return
  }

  // Production authentication logic
  $supabase.auth.getUser().then(({ data }) => {
    user.value = data.user || null
  })
  
  $supabase.auth.onAuthStateChange((_e, session) => {
    user.value = session?.user || null
  })
})

async function signOut() {
  if (isDevelopment) {
    // Just clear the fake user in development
    user.value = null
    return
  }
  
  // Production sign out
  await $supabase.auth.signOut()
  navigateTo('/auth')
}

// Mock sign in for development
function devSignIn() {
  if (isDevelopment) {
    user.value = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User'
    }
  }
}
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Development mode indicators -->
    <span v-if="isDevelopment" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
      DEV MODE
    </span>
    
    <!-- Sign in link (only shows in production or when user is null in dev) -->
    <template v-if="!user">
      <NuxtLink v-if="!isDevelopment" to="/auth" class="underline">Sign in</NuxtLink>
      <button v-else @click="devSignIn" class="underline text-sm">
        Sign in (Dev)
      </button>
    </template>
    
    <!-- User info when signed in -->
    <div v-else class="flex items-center gap-2">
      <span class="text-sm text-gray-600 truncate max-w-[16ch]">
        {{ user.email }}
      </span>
      <button @click="signOut" class="text-sm underline">
        {{ isDevelopment ? 'Sign out (Dev)' : 'Sign out' }}
      </button>
    </div>
  </div>
</template>

