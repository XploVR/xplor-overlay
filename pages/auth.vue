<script setup lang="ts">
const { $supabase } = useNuxtApp()
const email = ref('')
const sent = ref(false)
const err = ref<string | null>(null)

async function sendLink() {
  err.value = null
  try {
    const { error } = await $supabase.auth.signInWithOtp({
      email: email.value,
      options: { emailRedirectTo: window.location.origin + '/dashboard' }
    })
    if (error) throw error
    sent.value = true
  } catch (e: any) {
    err.value = e?.message || 'Failed to send link'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-semibold">Sign in</h1>

    <div v-if="sent" class="p-3 rounded border text-green-700 bg-green-50">
      Check your email for the sign-in link.
    </div>

    <div class="space-y-2">
      <label class="block">
        <div class="text-sm font-medium">Email</div>
        <input v-model="email" type="email" class="mt-1 w-full border rounded px-3 py-2" placeholder="you@example.com" />
      </label>
      <button @click="sendLink" class="px-4 py-2 rounded bg-black text-white">Send magic link</button>
    </div>

    <p v-if="err" class="text-red-600">{{ err }}</p>
  </div>
</template>
