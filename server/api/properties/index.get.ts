import { serverSupabaseClient } from "#supabase/server"

type Row = {
  id: string
  title: string | null
  city?: string | null
  country?: string | null
  status?: string | null
  created_at?: string | null
  lat?: number | null
  lng?: number | null
  kind?: string | null
  owner_user_id?: string | null
  thumbnail_url?: string | null
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const limit  = Number(q.limit ?? 24)
  const offset = Number(q.offset ?? 0)
  const kind   = (q.kind as string) || ""
  const city   = (q.city as string) || ""
  const status = (q.status as string) || ""
  const text   = (q.q as string) || ""
  const sortCol = "created_at"
  const sortAsc = (q.sort as string) === "old"

  const client = await serverSupabaseClient(event)

  // helper to apply filters to any query
  const applyFilters = (query: any) => {
    if (kind)   query = query.eq("kind", kind)
    if (city)   query = query.ilike("city", city)
    if (status) query = query.eq("status", status)
    if (text)   query = query.or(`title.ilike.%${text}%,city.ilike.%${text}%,country.ilike.%${text}%`)
    return query
  }

  try {
    // 1) Try the view
    let viewQ = client
      .from("properties_with_thumb")
      .select("id,title,city,country,status,created_at,lat,lng,thumbnail_url", { count: "exact" })
      .order(sortCol, { ascending: sortAsc })
      .range(offset, offset + limit - 1)

    viewQ = applyFilters(viewQ)
    const { data: vData, error: vErr, count: vCount } = await viewQ

    if (!vErr && (vData?.length ?? 0) > 0) {
      return { items: vData as Row[], count: vCount ?? vData.length }
    }

    // 2) If view failed or returned nothing, check if base table has anything
    const baseCountQ = applyFilters(
      client.from("properties").select("id", { count: "exact", head: true })
    )
    const { count: baseCount, error: baseCountErr } = await baseCountQ
    if (baseCountErr) {
      console.error("[/api/properties] baseCount error:", baseCountErr)
    }

    // If literally no rows match, return empty
    if ((baseCount ?? 0) === 0) {
      return { items: [], count: 0 }
    }

    // 3) Fallback: fetch props + first media manually
    let propsQ = client
      .from("properties")
      .select("id,title,city,country,status,created_at,lat,lng", { count: "exact" })
      .order(sortCol, { ascending: sortAsc })
      .range(offset, offset + limit - 1)

    propsQ = applyFilters(propsQ)
    const { data: props, error: pErr, count } = await propsQ
    if (pErr) throw pErr

    const ids = (props ?? []).map(p => p.id)
    if (!ids.length) {
      return { items: [], count: count ?? 0 }
    }

    const { data: media, error: mErr } = await client
      .from("property_media")
      .select("property_id,url,position,created_at,kind")
      .in("property_id", ids)
      .eq("kind", "image")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true })

    if (mErr) {
      console.error("[/api/properties] media fallback error:", mErr)
    }

    const firstByProp = new Map<string, string>()
    for (const m of (media || []) as any[]) {
      if (!firstByProp.has(m.property_id)) firstByProp.set(m.property_id, m.url)
    }

    const items: Row[] = (props ?? []).map(p => ({
      ...p,
      thumbnail_url: firstByProp.get(p.id) ?? null
    }))

    return { items, count: count ?? items.length }
  } catch (e: any) {
    console.error("[/api/properties] exception:", e?.message || e)
    return { items: [], count: 0, err: e?.message || "Server error" }
  }
})

