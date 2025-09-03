<!-- /components/chat/ConversationList.vue -->
<script setup lang="ts">
defineProps<{ items: any[], activeId: string | null }>()
const emit = defineEmits<{ (e: 'open', id: string): void }>()
</script>

<template>
  <aside class="w-full md:w-80 border-r border-white/10 h-full overflow-y-auto thin-scroll">
    <div class="p-3">
      <h3 class="text-sm uppercase tracking-wide text-white/50 mb-2">Chats</h3>
      <div class="space-y-1">
        <button v-for="c in items" :key="c.id" @click="emit('open', c.id)"
                class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 border border-transparent"
                :class="activeId===c.id ? 'bg-white/10 border-white/10' : ''">
          <div class="font-medium truncate">{{ c.title || 'Conversation' }}</div>
          <div class="text-[12px] text-white/60">{{ new Date(c.created_at).toLocaleDateString() }}</div>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.thin-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.25) transparent; }
.thin-scroll::-webkit-scrollbar { width: 8px; }
.thin-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,.22); border-radius: 8px; }
.thin-scroll::-webkit-scrollbar-track { background: transparent; }
</style>
