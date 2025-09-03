<script setup lang="ts">
const route = useRoute()
const listingId = route.params.id as string

const email = ref('')
const note  = ref('')
const sending = ref(false)
const done = ref(false)
const err = ref<string| null>(null)

async function submit() {
  sending.value = true
  err.value = null
  try {
    const res = await $fetch<{ ok: boolean }>('~/server/api/access-requests', {
      method: 'POST',
      body: { listingId, email: email.value, note: note.value }
    })
    if (!res?.ok) throw new Error('Failed to submit')
    done.value = true
  } catch (e:any) {
    err.value = e?.data?.statusMessage || e?.message || 'Error'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="container-x py-8 max-w-xl">
    <h1 class="text-2xl font-semibold">Request Access</h1>
    <p class="text-white/60 mt-1 text-sm">Listing: <span class="font-mono">{{ listingId }}</span></p>

    <div class="card p-4 mt-4 space-y-3">
      <label class="space-y-1 block">
        <span class="text-xs text-white/60">Email</span>
        <input v-model="email" type="email" class="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" placeholder="you@example.com" />
      </label>

      <label class="space-y-1 block">
        <span class="text-xs text-white/60">Note (optional)</span>
        <textarea v-model="note" rows="3" class="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" placeholder="I am interested in a viewing..." />
      </label>

      <div class="flex items-center gap-2">
        <button class="btn btn-primary" :disabled="sending" @click="submit">
          <span v-if="sending">Sending…</span>
          <span v-else>Send request</span>
        </button>
        <NuxtLink :to="`/spaces/${listingId}`" class="btn btn-ghost">Back</NuxtLink>
      </div>

      <p v-if="done" class="text-emerald-400 text-sm">Request sent. We’ll email you if approved.</p>
      <p v-if="err" class="text-red-400 text-sm">{{ err }}</p>
    </div>
  </div>
</template>
