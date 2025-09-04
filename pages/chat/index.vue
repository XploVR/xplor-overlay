<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue"
import { useChat } from "~/composables/useChat"
import { useSupabaseClient, useSupabaseUser, useRouter, useRoute } from "#imports"

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

/** unwrap Ref safely */
const val = <T>(maybeRef: any, fallback: T): T =>
  (maybeRef && typeof maybeRef === "object" && "value" in maybeRef)
    ? (maybeRef.value as T)
    : (maybeRef ?? fallback)

/* --- Supabase auth --- */
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()
const myIdDirect = computed<IdLike | null>(() => user.value?.id ?? null)

/* --- Chat store --- */
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

/* --- UI state --- */
const input = ref("")
const email = ref("")
const authBusy = ref(false)
const authMsg = ref<string | null>(null)
const authDebug = ref<string | null>(null) // shows callback status/errors

/* ---------------- Auth: callback handling ---------------- */
function getHashParams() {
  if (typeof window === "undefined") return {}
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : ""
  return Object.fromEntries(new URLSearchParams(hash))
}
function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search))
}

/** Handle Supabase callback variants on /chat */
async function handleSupabaseAuthCallback() {
  try {
    authDebug.value = null
    // New PKCE/magic-link: ?code=...
    const code = typeof route.query.code === "string" ? route.query.code : null
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw new Error("exchangeCodeForSession: " + error.message)
      // strip query
      await router.replace({ path: route.path, query: {} })
      authDebug.value = "Session established via ?code"
      return
    }

    // Legacy hash tokens: #access_token=...
    const hash = getHashParams()
    if (hash["access_token"]) {
      const { error } = await supabase.auth.setSessionFromUrl({ storeSession: true })
      if (error) throw new Error("setSessionFromUrl: " + error.message)
      await router.replace({ path: route.path, hash: "" })
      authDebug.value = "Session established via #access_token"
      return
    }

    // Some older flows put tokens in query (rare)
    const qp = getQueryParams()
    if (qp["access_token"] && qp["refresh_token"]) {
      const { data, error } = await supabase.auth.setSession({
        access_token: qp["access_token"],
        refresh_token: qp["refresh_token"],
      } as any)
      if (error) throw new Error("setSession(query tokens): " + error.message)
      await router.replace({ path: route.path, query: {} })
      authDebug.value = "Session established via query tokens"
      return
    }

    // If nothing matched, leave authDebug as null (no callback present)
  } catch (e: any) {
    authDebug.value = e?.message ?? String(e)
    // don't throw; let the page render the login panel + debug message
  }
}

/* --------------- Auth: actions ---------------- */
async function signInWithProvider(provider: "google" | "github") {
  try {
    authBusy.value = true
    authMsg.value = null
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/chat` : undefined
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
    if (error) throw error
  } catch (e:any) {
    authMsg.value = e?.message ?? String(e)
    authDebug.value = "OAuth error: " + (e?.message ?? e)
  } finally {
    authBusy.value = false
  }
}

async function sendMagicLink() {
  try {
    authBusy.value = true
    authMsg.value = null
    if (!email.value.trim()) {
      authMsg.value = "Please enter your email."
      return
    }
    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/chat` : undefined
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value.trim(),
      options: { emailRedirectTo },
    })
    if (error) throw error
    authMsg.value = "Magic link sent. Check your inbox."
  } catch (e:any) {
    authMsg.value = e?.message ?? String(e)
    authDebug.value = "Magic link error: " + (e?.message ?? e)
  } finally {
    authBusy.value = false
  }
}

async function signOut() {
  try { await supabase.auth.signOut() } catch (e) { console.error("signOut failed", e) }
}

/* --------------- Chat actions ---------------- */
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

/** last message per conv */
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

/* --------------- Init & debug --------------- */
onMounted(async () => {
  await handleSupabaseAuthCallback()

  // optional: quick debug of current user/session
  try {
    const { data: sess } = await supabase.auth.getSession()
    if (!sess?.session) {
      authDebug.value = authDebug.value ?? "No active session after callback."
    }
  } catch (e:any) {
    authDebug.value = "getSession failed: " + (e?.message ?? e)
  }

  // Load chats (only matters when signed in)
  try { await chat.loadConversations?.() } catch (e:any) { console.error("loadConversations failed:", e?.message ?? e) }

  if (!myIdDirect.value) return
  if (!conversations.value.length) {
    await newConversation()
  } else if (!activeId.value) {
    try { await chat.setActive?.(conversations.value[0]?.id as any) } catch (e:any) { console.error("setActive (default) failed:", e?.message ?? e) }
  }
})

// log user changes to help debugging sign-in
watchEffect(() => {
  // comment out after you confirm auth works
  // console.info("Auth user:", user.value?.id ? { id: user.value.id, email: user.value.email } : null)
})
</script>

<template>
  <!-- If signed OUT, show the login panel -->
  <ClientOnly v-if="!myIdDirect">
    <div class="min-h-[70vh] grid place-items-center p-6">
      <div class="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-lg font-semibold">Sign in to Xplor Chat</h1>
          <span class="text-xs text-white/60">Secure • RLS</span>
        </div>

        <div v-if="authDebug" class="mb-3 text-[12px] rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-yellow-200">
          {{ authDebug }}
          <button class="ml-2 underline" @click="handleSupabaseAuthCallback">Try again</button>
        </div>

        <div class="space-y-3">
          <button
            class="w-full rounded-xl border border-white/15 hover:bg-white/[0.06] px-3 py-2"
            :disabled="authBusy"
            @click="signInWithProvider('google')"
          >Continue with Google</button>

          <button
            class="w-full rounded-xl border border-white/15 hover:bg-white/[0.06] px-3 py-2"
            :disabled="authBusy"
            @click="signInWithProvider('github')"
          >Continue with GitHub</button>
        </div>

        <div class="my-5 flex items-center gap-3 text-white/40 text-xs">
          <div class="h-px flex-1 bg-white/10"></div>
          <span>or</span>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <div class="space-y-2">
          <label class="text-xs text-white/70">Email for magic link</label>
          <div class="flex gap-2">
            <input
              v-model="email"
              type="email"
              placeholder="you@company.com"
              class="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 focus:outline-none"
            />
            <button
              class="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/[0.08]"
              :disabled="authBusy"
              @click="sendMagicLink"
            >
              Send link
            </button>
          </div>
          <p v-if="authMsg" class="text-xs mt-1" :class="authMsg.includes('sent') ? 'text-green-300' : 'text-red-300'">
            {{ authMsg }}
          </p>
        </div>

        <p class="mt-6 text-[11px] text-white/50">
          Tip: In Supabase Auth → URL Configuration, add your dev origins and
          <code class="bg-white/10 px-1 rounded">/chat</code> to Redirect URLs.
        </p>
      </div>
    </div>
  </ClientOnly>

  <!-- If signed IN, show the chat UI -->
  <div v-else class="h-full flex">
    <aside class="w-72 border-r border-white/10 bg-white/[0.03] hidden md:flex flex-col">
      <div class="px-3 py-3 border-b border-white/10 flex items-center justify-between">
        <h2 class="text-sm font-medium">Conversations</h2>
        <button class="text-[11px] text-white/60 hover:text-white/90" @click="signOut">Sign out</button>
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

