// composables/useGeocode.ts
import { useRuntimeConfig } from '#app'

type GeoResult = {
  title: string
  addressLine1?: string
  city?: string
  country?: string
  lat: number
  lng: number
  raw?: any
}

const debounce = <F extends (...a: any[]) => any>(fn: F, ms = 300) => {
  let t: number | null = null
  return (...args: Parameters<F>) =>
    new Promise<ReturnType<F>>((resolve) => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(async () => resolve(await fn(...args)), ms)
    })
}

export function useGeocode() {
  const config = useRuntimeConfig()
  const token = config.public?.mapboxToken as string | undefined

  async function geocodeMapbox(q: string): Promise<GeoResult[]> {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`)
    url.searchParams.set('access_token', token!)
    url.searchParams.set('limit', '5')
    url.searchParams.set('language', navigator.language || 'en')
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Mapbox geocode failed')
    const json = await res.json()
    return (json.features || []).map((f: any) => {
      const [lng, lat] = f.center || []
      const ctx = Object.fromEntries((f.context || []).map((c: any) => [c.id.split('.')[0], c.text]))
      return {
        title: f.place_name,
        addressLine1: f.text,
        city: f.place_type?.includes('place') ? f.text : (ctx.place || ctx.locality),
        country: ctx.country,
        lat, lng, raw: f,
      } as GeoResult
    })
  }

  async function reverseMapbox(lat: number, lng: number): Promise<GeoResult | null> {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`)
    url.searchParams.set('access_token', token!)
    url.searchParams.set('limit', '1')
    url.searchParams.set('language', navigator.language || 'en')
    const res = await fetch(url.toString())
    if (!res.ok) return null
    const json = await res.json()
    const f = json.features?.[0]
    if (!f) return null
    const [lng2, lat2] = f.center || []
    const ctx = Object.fromEntries((f.context || []).map((c: any) => [c.id.split('.')[0], c.text]))
    return {
      title: f.place_name,
      addressLine1: f.text,
      city: ctx.place || ctx.locality,
      country: ctx.country,
      lat: lat2, lng: lng2, raw: f,
    }
  }

  async function geocodeNominatim(q: string): Promise<GeoResult[]> {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '5')
    url.searchParams.set('accept-language', navigator.language || 'en')
    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
    if (!res.ok) throw new Error('Nominatim geocode failed')
    const json = await res.json()
    return json.map((r: any) => ({
      title: r.display_name,
      addressLine1: r.address?.house_number ? `${r.address.road ?? ''} ${r.address.house_number}`.trim() : (r.address?.road || r.name),
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet,
      country: r.address?.country_code?.toUpperCase?.() || r.address?.country,
      lat: Number(r.lat), lng: Number(r.lon), raw: r,
    }) as GeoResult)
  }

  async function reverseNominatim(lat: number, lng: number): Promise<GeoResult | null> {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('accept-language', navigator.language || 'en')
    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return null
    const r = await res.json()
    if (!r) return null
    return {
      title: r.display_name,
      addressLine1: r.address?.house_number ? `${r.address.road ?? ''} ${r.address.house_number}`.trim() : (r.address?.road || r.name),
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet,
      country: r.address?.country_code?.toUpperCase?.() || r.address?.country,
      lat: Number(r.lat), lng: Number(r.lon), raw: r,
    }
  }

  const geocode = debounce(async (q: string
