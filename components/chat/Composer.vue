<!-- /components/chat/Composer.vue -->
<script setup lang="ts">
const emit = defineEmits<{ (e: 'send-text', text: string): void, (e: 'send-file', file: File): void }>()
const text = ref('')
function onKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    doSend()
  }
}
function doSend() {
  const v = text.value.trim()
  if (!v) return
  emit('send-text', v)
  text.value = ''
}
function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) emit('send-file', f)
}
</script>

<template>
  <div class="border-t border-white/10 p-2 flex items-center gap-2">
    <input type="file" class="hidden" id="chat-upload" @change="onFile" />
    <label for="chat-upload" class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 cursor-pointer">
      Upload
    </label>
    <textarea v-model="text" rows="1" @keydown="onKey"
              class="flex-1 bg-transparent border border-white/15 rounded-lg px-3 py-2 resize-none"
              placeholder="Write a messageâ€¦ (âŒ˜/Ctrl + Enter to send)"/>
    <button class="px-4 py-2 rounded-lg bg-xplor-yellow text-black" @click="doSend">Send</button>
  </div>
</template>

