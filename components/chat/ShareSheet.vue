<!-- /components/chat/ShareSheet.vue -->
<script setup lang="ts">
import { useShare } from '~/composables/useShare'
import { useChat } from '~/composables/useChat'

const props = defineProps<{
  open: boolean
  onClose: () => void
  messageId: string
  title?: string
  text?: string
}>()

const { buildIntents, canNativeShare, nativeShare, copyToClipboard } = useShare()
const { conversations, forwardMessage, buildMessageDeepLink } = useChat()

const link = computed(() => buildMessageDeepLink(props.messageId))
const intents = computed(() => buildIntents({ title: props.title || 'Check this out on Xplor', text: props.text, url: link.value }))

const forwardTarget = ref<string | null>(null)
const forwarding = ref(false)

async function doForward() {
  if (!forwardTarget.value) return
  forwarding.value = true
  try {
    await forwardMessage(props.messageId, forwardTarget.value)
    props.onClose()
  } finally {
    forwarding.value = false
  }
}

async function doNativeShare() {
  await nativeShare({ title: props.title, text: props.text, url: link.value })
  props.onClose()
}
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[70] bg-black/60" @click.self="onClose">
      <div class="absolute bottom-0 left-0 right-0 bg-[#0b0b0b] border-t border-white/10 rounded-t-2xl p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Share</h3>
          <button class="px-3 py-1 rounded-lg border border-white/15" @click="onClose">Close</button>
        </div>

        <div v-if="canNativeShare({ url: link })" class="flex">
          <button class="px-4 py-2 rounded-lg bg-yellow-300 text-black" @click="doNativeShare">Share via device…</button>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.whatsapp" target="_blank">WhatsApp</a>
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.telegram" target="_blank">Telegram</a>
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.x" target="_blank">X</a>
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.facebook" target="_blank">Facebook</a>
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.linkedin" target="_blank">LinkedIn</a>
          <a class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-center" :href="intents.email">Email</a>
        </div>

        <div class="flex items-center gap-2">
          <input class="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2" :value="link" readonly />
          <button class="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10"
                  @click="copyToClipboard(link).then(() => $toast?.success?.('Copied'))">
            Copy
          </button>
        </div>

        <div class="border-t border-white/10 pt-3">
          <div class="text-sm text-white/70 mb-2">Forward to another chat</div>
          <div class="flex items-center gap-2">
            <select v-model="forwardTarget" class="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2">
              <option :value="null" disabled>Select conversation…</option>
              <option v-for="c in conversations" :key="c.id" :value="c.id">{{ c.title || c.id }}</option>
            </select>
            <button class="px-3 py-2 rounded-lg bg-yellow-300 text-black disabled:opacity-60"
                    :disabled="!forwardTarget || forwarding" @click="doForward">
              {{ forwarding ? 'Forwarding…' : 'Forward' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .15s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
