// mocks/supabase-server.ts
// DEV-ONLY MOCK of '#supabase/server' so server/api files run with no DB.

type Result = { data: any; error: any; count?: number }

const makeQB = () => {
  // A chainable, thenable mock
  const api: any = {
    // common PostgREST-ish chainers; all return `api` so you can chain
    select: (_cols?: any, _opts?: any) => api,
    insert: (_val?: any) => Promise.resolve({ data: [], error: null } as Result),
    update: (_val?: any) => Promise.resolve({ data: [], error: null } as Result),
    delete: () => Promise.resolve({ data: [], error: null } as Result),

    eq: (_k?: any, _v?: any) => api,
    ilike: (_k?: any, _v?: any) => api,
    or: (_expr?: any) => api,
    in: (_k?: any, _vals?: any) => api,
    order: (_k?: any, _opts?: any) => api,
    range: (_from?: any, _to?: any) => api,
    limit: (_n?: any) => api,
    single: async () => ({ data: null, error: null } as Result),

    // make it awaitable: `await qb` resolves to a fake result
    then: (resolve: (res: Result) => void) => resolve({ data: [], error: null, count: 0 }),
    catch: () => api,
    finally: () => api,
  }
  return api
}

export const serverSupabaseClient = <T = any>(_event?: any) => ({
  from: (_table: string) => makeQB(),
}) as unknown as T

export const serverSupabaseServiceRole = serverSupabaseClient

export const serverSupabaseUser = async (_event?: any) => null
