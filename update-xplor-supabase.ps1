param(
  [string]$Root = "C:\Users\johnn\projects\xplor-overlay"
)

function Backup-File {
  param([string]$Path)
  if (Test-Path $Path) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $bak = "$Path.bak-$stamp"
    Copy-Item $Path $bak -Force
    Write-Host "Backup created: $bak"
  } else {
    Write-Host "File not found (skip backup): $Path"
  }
}

function Ensure-Dir {
  param([string]$Dir)
  if (-not (Test-Path $Dir)) {
    New-Item -ItemType Directory -Path $Dir | Out-Null
    Write-Host "Created directory: $Dir"
  }
}

# --- Paths ---
$nuxtConfig = Join-Path $Root "nuxt.config.ts"
$useChat    = Join-Path $Root "composables\useChat.ts"
$chatPage   = Join-Path $Root "pages\chat\index.vue"

# --- Validate root ---
if (-not (Test-Path $Root)) {
  Write-Error "Root path not found: $Root"
  exit 1
}

# Ensure folders exist
Ensure-Dir (Split-Path $useChat -Parent)
Ensure-Dir (Split-Path $chatPage -Parent)

# --- 1) Patch nuxt.config.ts ---
if (Test-Path $nuxtConfig) {
  Backup-File $nuxtConfig
  $cfg = Get-Content $nuxtConfig -Raw

  # Remove @supabase/auth-helpers-nuxt if present
  $cfg = $cfg -replace "['""]@supabase/auth-helpers-nuxt['""]\s*,?", ""

  # Ensure @nuxtjs/supabase module is in the modules array
  if ($cfg -notmatch "@nuxtjs/supabase") {
    $cfg = $cfg -replace "(modules:\s*\[)([^]]*)\]", {
      param($m)
      $head = $m.Groups[1].Value
      $body = $m.Groups[2].Value.Trim()
      if ($body -eq "") {
        return "$head'@nuxtjs/supabase']"
      } else {
        # add with comma if needed
        $body2 = $body.TrimEnd()
        if ($body2[-1] -ne ',') { $body2 = "$body2," }
        return "$head$body2 '@nuxtjs/supabase']"
      }
    }
  }

  # Ensure supabase config block exists (non-destructive)
  if ($cfg -notmatch "supabase:\s*\{") {
@"
$cfg

// --- Added by script: Nuxt Supabase configuration ---
export default defineNuxtConfig({
  // (if duplicate export blocks occur, keep the one above; this is just a safety fallback)
  supabase: {
    redirect: false,
    cookieOptions: { sameSite: 'lax' },
  }
})
"@ | Out-Null
    # The above fallback comment warns about duplicates; prefer your main export block.
    # We'll avoid writing a second export by not appending blindly.
    # So instead, we try inserting just the supabase block inside existing export.
    $cfg = $cfg -replace "(export\s+default\s+defineNuxtConfig\(\s*\{)", "`$1`r`n  supabase: { redirect: false, cookieOptions: { sameSite: 'lax' } },"
  }

  Set-Content $nuxtConfig $cfg -Encoding UTF8
  Write-Host "Patched: $nuxtConfig"
} else {
  Write-Warning "nuxt.config.ts not found. Skipping."
}

# --- 2) Write composables/useChat.ts (Nuxt-native Supabase) ---
$useChatContent = @"
// /composables/useChat.ts
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

type Conversation = { id: string; kind: 'dm' | 'group' | 'system'; title: string | null; created_at: string }
type Message = {
  id: string
  conversation_id: string
  sender_id: string | null
  body: string | null
  attachment_url: string | null
  attachment_meta: any | null
  created_at: string
}

export function useChat() {
  const supabase = useSupabaseClient<SupabaseClient>()
  const user = useSupabaseUser()

  const conversations = ref<Conversation[]>([])
  const activeId = ref<string | null>(null)
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const uploading = ref(false)
  const lastError = ref<string | null>(null)

  const myUserId = computed(() => user.value?.id ?? null)
  const lastReadByConv = reactive<Record<string, string | null>>({})
  const unreadCounts = reactive<Record<string, number>>({})
  const totalUnread = computed(() => Object.values(unreadCounts).reduce((a,b)=>a+(b||0),0))
  const currentMessages = computed(() => messages.value)

  let activeConvChannel: RealtimeChannel | null = null
  let inboxChannel: RealtimeChannel | null = null

  function requireAuth() {
    if (!myUserId.value) {
      const msg = 'You must be signed in to use chat.'
      lastError.value = msg
      throw new Error(msg)
    }
  }

  async function loadConversations() {
    loading.value = true
    lastError.value = null
    if (!myUserId.value) { conversations.value = []; loading.value = false; return }

    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`conversation:conversations ( id, kind, title, created_at ), conversation_id, last_read_at`)
      .eq('user_id', myUserId.value)
      .order('conversation(created_at)', { ascending: false })

    if (error) { lastError.value = error.message; loading.value = false; throw new Error(error.message) }

    const rows = data ?? []
    conversations.value = rows.map((r:any)=>r.conversation).filter(Boolean)

    for (const r of rows) lastReadByConv[r.conversation_id] = r.last_read_at ?? null
    for (const c of conversations.value) if (!(c.id in lastReadByConv)) lastReadByConv[c.id] = null

    await Promise.all(conversations.value.map(c => refreshUnreadFor(c.id)))

    attachInboxRealtime()
    loading.value = false
  }

  function attachInboxRealtime() {
    if (inboxChannel) supabase.removeChannel(inboxChannel)
    inboxChannel = supabase
      .channel('chat:inbox')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = payload.new as Message
          if (m.sender_id && myUserId.value && m.sender_id === myUserId.value) return
          if (activeId.value === m.conversation_id) { messages.value = [...messages.value, m]; return }
          const last = lastReadByConv[m.conversation_id]
          if (!last || new Date(m.created_at).getTime() > new Date(last).getTime()) {
            unreadCounts[m.conversation_id] = (unreadCounts[m.conversation_id] || 0) + 1
          }
        }
      ).subscribe()
  }

  async function openConversation(id: string) {
    activeId.value = id
    lastError.value = null
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
      .limit(1000)
    if (error) { lastError.value = error.message; throw new Error(error.message) }
    messages.value = data ?? []

    if (activeConvChannel) supabase.removeChannel(activeConvChannel)
    activeConvChannel = supabase
      .channel(\`chat:conv:\${id}\`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: \`conversation_id=eq.\${id}\` },
        (payload) => { messages.value = [...messages.value, payload.new as Message] }
      ).subscribe()

    await markConversationRead(id)
  }

  async function markConversationRead(conversationId: string) {
    if (!myUserId.value) return
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('conversation_participants')
      .upsert({ conversation_id: conversationId, user_id: myUserId.value, last_read_at: now }, { onConflict: 'conversation_id,user_id' })
    if (error) { lastError.value = error.message; throw new Error(error.message) }
    lastReadByConv[conversationId] = now
    unreadCounts[conversationId] = 0
  }

  async function refreshUnreadFor(conversationId: string) {
    if (!myUserId.value) { unreadCounts[conversationId] = 0; return }
    const last = lastReadByConv[conversationId]
    let q = supabase.from('messages').select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', myUserId.value)
    if (last) q = q.gt('created_at', last)
    const { count, error } = await q
    if (error) { lastError.value = error.message; throw new Error(error.message) }
    unreadCounts[conversationId] = count ?? 0
  }

  async function sendMessage(body: string) {
    if (!activeId.value || !body.trim()) return
    requireAuth()
    const { error } = await supabase.from('messages').insert({
      conversation_id: activeId.value,
      sender_id: myUserId.value,
      body
    })
    if (error) { lastError.value = error.message; throw new Error(error.message) }
    await markConversationRead(activeId.value)
  }

  async function sendAttachment(file: File) {
    if (!activeId.value) return
    requireAuth()
    uploading.value = true
    try {
      const path = \`\${myUserId.value}/\${activeId.value}/\${Date.now()}_\${file.name}\`
      const { error: upErr } = await supabase.storage.from('chat-uploads').upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr
      const { data: signed, error: signErr } = await supabase.storage.from('chat-uploads').createSignedUrl(path, 3600)
      if (signErr) throw signErr
      const { error: msgErr } = await supabase.from('messages').insert({
        conversation_id: activeId.value, sender_id: myUserId.value,
        body: null, attachment_url: signed.signedUrl,
        attachment_meta: { name: file.name, size: file.size, type: file.type, storage_path: path }
      })
      if (msgErr) throw msgErr
      await markConversationRead(activeId.value)
    } catch (e:any) {
      lastError.value = e?.message ?? String(e)
      throw e
    } finally {
      uploading.value = false
    }
  }

  async function startConversation(kind: 'dm' | 'group' = 'group', title = 'New Chat') {
    requireAuth()
    const { data, error } = await supabase
      .from('conversations')
      .insert({ kind, title })
      .select('id, kind, title, created_at')
      .single()
    if (error) { lastError.value = error.message; throw new Error(error.message) }

    const now = new Date().toISOString()
    const { error: pErr } = await supabase
      .from('conversation_participants')
      .upsert({ conversation_id: data.id, user_id: myUserId.value, last_read_at: now }, { onConflict: 'conversation_id,user_id' })
    if (pErr) { lastError.value = pErr.message; throw new Error(pErr.message) }

    conversations.value = [data as Conversation, ...conversations.value]
    lastReadByConv[data.id] = now
    unreadCounts[data.id] = 0
    await openConversation(data.id)
    return data.id
  }

  async function setActive(id: string) { return openConversation(id) }
  function buildMessageDeepLink(messageId: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://xplor.io'
    return \`\${origin}/chat/c/\${activeId.value}?m=\${messageId}\`
  }

  onMounted(() => {})
  onUnmounted(() => {
    if (activeConvChannel) supabase.removeChannel(activeConvChannel)
    if (inboxChannel) supabase.removeChannel(inboxChannel)
  })

  return {
    conversations, activeId, messages, currentMessages,
    loading, uploading, myUserId, lastError,
    unreadCounts, totalUnread,
    loadConversations, openConversation, setActive, startConversation,
    sendMessage, sendAttachment, buildMessageDeepLink, refreshUnreadFor, markConversationRead
  }
}
"@

Backup-File $useChat
Set-Content $useChat $useChatContent -Encoding UTF8
Write-Host "Wrote: $useChat"

# --- 3) Write pages/chat/index.vue (hardened) ---
$chatPageContent = @"
<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useChat } from "~/composables/useChat"

type IdLike = string | number
type Conv = { id: IdLike; title?: string; [k: string]: any }
type Msg = {
  id: IdLike
  body?: string
  created_at?: string | Date
  sender_id?: IdLike
  conversation_id?: IdLike
  attachment_url?: string
  attachment_meta?: { name?: string } | null
}

const val = <T>(maybeRef: any, fallback: T): T =>
  (maybeRef && typeof maybeRef === "object" && "value" in maybeRef)
    ? (maybeRef.value as T)
    : (maybeRef ?? fallback)

const chat = useChat()

const activeId = computed<IdLike | null>(() => val<IdLike | null>(chat.activeId, null))
const myId = computed<IdLike | null>(() => val<IdLike | null>(chat.myUserId, null))
const lastError = computed<string | null>(() => val<string | null>(chat.lastError, null))

const conversations = computed<Conv[]>(() => {
  const c = val<any>(chat.conversations, [])
  if (Array.isArray(c)) return c as Conv[]
  if (Array.isArray(c?.items)) return c.items as Conv[]
  return []
})

const allMessages = computed<Msg[]>(() => {
  const m = val<any>(chat.currentMessages, [])
  if (Array.isArray(m)) return m as Msg[]
  if (Array.isArray(m?.items)) return m.items as Msg[]
  return []
})

const input = ref("")

function pick(id: IdLike) {
  try { chat.setActive?.(id as any) } catch (e) { console.error("setActive failed:", e) }
}

async function send() {
  const text = input.value.trim()
  if (!text) return
  input.value = ""
  try { await chat.sendMessage?.(text) } catch (e:any) { console.error("sendMessage failed:", e?.message ?? e) }
}

async function newConversation() {
  try {
    const id = await chat.startConversation?.("group", "General")
    if (id) await chat.setActive?.(id as any)
  } catch (e:any) {
    console.error("startConversation failed:", e?.message ?? e)
  }
}

const conversationsWithLastMessage = computed(() => {
  const convs = conversations.value
  const msgs = allMessages.value
  return convs.map((conv) => {
    const lastMsg = msgs
      .filter(m => String(m.conversation_id ?? "") === String(conv.id ?? ""))
      .sort((a, b) => {
        const at = new Date(a?.created_at ?? 0).getTime()
        const bt = new Date(b?.created_at ?? 0).getTime()
        return bt - at
      })[0]
    return { ...conv, lastMessage: lastMsg?.body || "No messages yet" }
  })
})

onMounted(async () => {
  try { await chat.loadConversations?.() } catch (e:any) { console.error("loadConversations failed:", e?.message ?? e) }

  if (!conversations.value.length) {
    await newConversation()
  } else if (!activeId.value) {
    try { await chat.setActive?.(conversations.value[0]?.id as any) } catch (e:any) { console.error("setActive (default) failed:", e?.message ?? e) }
  }
})
</script>

<template>
  <div class="h-full flex">
    <aside class="w-72 border-r border-white/10 bg-white/[0.03] hidden md:flex flex-col">
      <div class="px-3 py-3 border-b border-white/10">
        <h2 class="text-sm font-medium">Conversations</h2>
      </div>

      <div class="flex-1 overflow-y-auto thin-scroll p-2">
        <ul class="space-y-1">
          <li v-for="c in conversationsWithLastMessage" :key="String(c.id)">
            <button
              @click="pick(c.id)"
              class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.08]"
              :class="String(c.id) === String(activeId ?? '') ? 'bg-white/[0.08]' : ''"
            >
              <div class="text-sm font-medium truncate">{{ c.title || 'Untitled' }}</div>
              <div class="text-xs text-white/60 truncate">{{ c.lastMessage }}</div>
            </button>
          </li>

          <li v-if="!conversationsWithLastMessage.length" class="px-3 py-2 text-xs text-white/60">
            No conversations yet.
          </li>
        </ul>
      </div>

      <div class="p-2 border-t border-white/10">
        <button
          class="w-full px-3 py-2 rounded-lg border border-white/15 hover:bg-white/[0.06] text-sm"
          @click="newConversation"
        >
          + New conversation
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <div class="px-3 py-3 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium">
            {{ (conversations.find(c => String(c.id) === String(activeId ?? ''))?.title) || 'Chat' }}
          </div>
          <div class="text-xs text-white/60">
            {{ allMessages.length }} message<span v-if="allMessages.length !== 1">s</span>
          </div>
        </div>

        <div v-if="lastError" class="mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-2 py-1">
          {{ lastError }}
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-2 thin-scroll">
        <template v-if="activeId">
          <div
            v-for="m in allMessages"
            :key="String(m.id)"
            class="max-w-[72ch] px-3 py-2 rounded-xl border border-white/10"
            :class="String(m.sender_id ?? '') === String(myId ?? '') ? 'ml-auto bg-white/[0.06]' : 'mr-auto bg-white/[0.03]'"
          >
            <div class="text-xs uppercase tracking-wide text-white/50 mb-1">
              {{ String(m.sender_id ?? '') === String(myId ?? '') ? 'You' : 'Other' }}
            </div>

            <div class="whitespace-pre-wrap leading-relaxed text-sm">
              {{ m.body || 'No content' }}
            </div>

            <div v-if="m.attachment_url" class="mt-2">
              <a :href="m.attachment_url" target="_blank" class="text-xs hover:underline">
                📎 {{ m.attachment_meta?.name || 'Attachment' }}
              </a>
            </div>
          </div>

          <div v-if="!allMessages.length" class="text-xs text-white/60 px-3">
            No messages in this conversation yet.
          </div>
        </template>

        <template v-else>
          <div class="h-full grid place-items-center text-sm text-white/60">
            Pick or start a conversation
          </div>
        </template>
      </div>

      <div class="p-3 border-t border-white/10">
        <form class="flex gap-2" @submit.prevent="send">
          <input
            v-model="input"
            placeholder="Type a message…"
            class="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 focus:outline-none"
          />
          <button class="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/[0.08]">
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thin-scroll { 
  scrollbar-width: thin; 
  scrollbar-color: rgba(255,255,255,.25) transparent; 
}
.thin-scroll::-webkit-scrollbar { width: 8px; }
.thin-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,.22); border-radius: 8px; }
.thin-scroll::-webkit-scrollbar-track { background: transparent; }
</style>
"@

Backup-File $chatPage
Set-Content $chatPage $chatPageContent -Encoding UTF8
Write-Host "Wrote: $chatPage"

Write-Host "`nAll done! Next steps:"
Write-Host "1) npm i @nuxtjs/supabase"
Write-Host "2) Add to your .env (or Vercel env):"
Write-Host "   NUXT_PUBLIC_SUPABASE_URL=your-url"
Write-Host "   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
Write-Host "3) Ensure font is at public/fonts/typografix-demo.otf and referenced as /fonts/typografix-demo.otf"
