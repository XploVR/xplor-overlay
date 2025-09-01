// plugins/mapbox.client.ts
export default defineNuxtPlugin(async () => {
  const token = useRuntimeConfig().public.mapboxToken as string | undefined

  const [{ default: MapboxGL }, { default: MapLibreGL }] = await Promise.all([
    import('mapbox-gl'),
    import('maplibre-gl'),
  ])
  await Promise.all([
    import('mapbox-gl/dist/mapbox-gl.css'),
    import('maplibre-gl/dist/maplibre-gl.css'),
  ])

  if (token) (MapboxGL as any).accessToken = token

  const MAPBOX_STYLE   = 'mapbox://styles/mapbox/streets-v12'
  const MAPLIBRE_STYLE = 'https://demotiles.maplibre.org/style.json'

  function createMap(opts: { container: string | HTMLElement; center?: [number, number]; zoom?: number; style?: string }) {
    const { container, center = [0, 0], zoom = 2 } = opts
    if (token) {
      try {
        return new (MapboxGL as any).Map({ container, style: opts.style || MAPBOX_STYLE, center, zoom, attributionControl: true })
      } catch (e) {
        console.warn('[Map] Mapbox failed, falling back to MapLibre:', e)
      }
    }
    return new (MapLibreGL as any).Map({ container, style: opts.style || MAPLIBRE_STYLE, center, zoom, attributionControl: true })
  }

  return {
    provide: {
      createMap,
      mapbox: token ? MapboxGL : MapLibreGL, // unified API (Marker/Popup etc.)
      maplibre: MapLibreGL,
      map: token ? MapboxGL : MapLibreGL,
    },
  }
})
