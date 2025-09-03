<!-- /components/chat/MessageBubble.vue -->
<script setup lang="ts">
const props = defineProps<{
  message: any
  isOwn: boolean
}>()
const emit = defineEmits<{ (e: 'share', id: string): void }>()
</script>

<template>
  <div class="flex gap-2 items-end" :class="isOwn ? 'justify-end' : 'justify-start'">
    <div class="max-w-[76%] rounded-2xl p-3"
         :class="isOwn ? 'bg-yellow-300 text-black' : 'bg-white/[0.06] border border-white/10'">
      <div v-if="message.attachment_url" class="mb-2">
        <a :href="message.attachment_url" target="_blank" class="underline">Attachment</a>
      </div>
      <div v-if="message.body" class="whitespace-pre-wrap leading-relaxed">{{ message.body }}</div>
      <div class="mt-2 text-[11px] opacity-70">
        {{ new Date(message.created_at).toLocaleString() }}
        <button class="ml-2 underline opacity-80 hover:opacity-100" @click="emit('share', message.id)">Share</button>
      </div>
    </div>
  </div>
</template>
