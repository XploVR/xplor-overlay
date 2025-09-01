// utils/filtering.ts
export type Filters = {
  q: string
  city: string | null
  status: string | null
  priceMin: number | null
  priceMax: number | null
  sort: '' | 'new' | 'old' | 'price_asc' | 'price_desc'
}

export function makeDefaultFilters(): Filters {
  return { q: '', city: null, status: null, priceMin: null, priceMax: null, sort: '' }
}

export function buildFacets(items: any[]) {
  const cities = [...new Set(items.map(i => i?.city).filter(Boolean))].sort()
  const statuses = [...new Set(items.map(i => i?.status).filter(Boolean))].sort()
  return { cities, statuses }
}

export function applyFilters(items: any[], f: Filters) {
  let out = items.slice()

  if (f.q) {
    const q = f.q.toLowerCase()
    out = out.filter(i =>
      String(i?.title ?? '').toLowerCase().includes(q) ||
      String(i?.city ?? '').toLowerCase().includes(q) ||
      String(i?.description ?? '').toLowerCase().includes(q)
    )
  }

  if (f.city) out = out.filter(i => i?.city === f.city)
  if (f.status) out = out.filter(i => i?.status === f.status)

  if (f.priceMin != null) out = out.filter(i => (i?.price ?? 0) >= f.priceMin!)
  if (f.priceMax != null) out = out.filter(i => (i?.price ?? 0) <= f.priceMax!)

  switch (f.sort) {
    case 'new':
      out.sort((a, b) => new Date(b?.created_at ?? 0).getTime() - new Date(a?.created_at ?? 0).getTime())
      break
    case 'old':
      out.sort((a, b) => new Date(a?.created_at ?? 0).getTime() - new Date(b?.created_at ?? 0).getTime())
      break
    case 'price_asc':
      out.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0))
      break
    case 'price_desc':
      out.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0))
      break
  }

  return out
}
