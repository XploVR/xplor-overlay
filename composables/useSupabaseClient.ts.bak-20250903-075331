// /composables/useSupabaseClient.ts
// Minimal stub so existing code that calls client won't explode.
// You can expand with no-op methods you call frequently (from,to,select,insert, etc.)
export const useSupabaseClient = <T = any>() => {
  return {
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
      eq: () => ({
        select: async () => ({ data: [], error: null })
      })
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'dev-user' } }, error: null }),
      signOut: async () => ({ error: null })
    }
  } as unknown as T
}
