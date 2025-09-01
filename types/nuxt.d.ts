// types/nuxt.d.ts
export {}

declare module '#app' {
  interface NuxtApp {
    $createMap: (opts: { container: string | HTMLElement; center?: [number, number]; zoom?: number; style?: string }) => any
    $mapbox: any
    $maplibre: any
    $map: any
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $createMap: NuxtApp['$createMap']
    $mapbox: any
    $maplibre: any
    $map: any
  }
}
