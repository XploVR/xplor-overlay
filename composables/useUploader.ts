// composables/useUploader.ts
import { reactive, ref } from 'vue'

// SSR-safe media helpers (make sure this path exists)
import {
  uid,
  objectUrl,
  readImageDims,
  readVideoInfo,
  makeThumbnail,
  extractMeta,
} from '~/components/uploader/_media.local'

export type CollectionKey =
  | 'primaryPhotos'
  | 'virtualTours'
  | 'videos'
  | 'drone'
  | 'floorPlans'
  | 'documents'
  | 'additional'

export type MediaItem = {
  id: string
  kind: CollectionKey | 'virtualTour' | 'video' | 'doc' | 'image'
  name: string
  type?: string
  size?: number
  url?: string          // object URL or external URL
  thumb?: string        // dataURL thumbnail (images/videos)
  width?: number
  height?: number
  duration?: number | null
  order?: number
  primary?: boolean
  _revoke?: () => void  // cleanup for object URLs
}

type Limits = Partial<Record<CollectionKey, number>>

const DEFAULT_LIMITS: Limits = {
  primaryPhotos: 15,
  virtualTours: 5,
  videos: 5,
  drone: 10,
  floorPlans: 10,
  documents: 20,
  additional: 20,
}

const ACCEPT: Record<CollectionKey, (mime: string) => boolean> = {
  primaryPhotos: (t) => t.startsWith('image/'),
  virtualTours: () => false, // URLs only
  videos: (t) => t.startsWith('video/'),
  drone: (t) => t.startsWith('image/') || t.startsWith('video/'),
  floorPlans: (t) => t === 'application/pdf' || t.startsWith('image/'),
  documents: (t) => t === 'application/pdf',
  additional: (t) => t.startsWith('image/') || t === 'application/pdf',
}

export function useUploader(
  _draftId: string,
  opts?: {
    limits?: Limits
    allowUrl?: Partial<Record<CollectionKey, boolean>>
  }
) {
  const limits = { ...DEFAULT_LIMITS, ...(opts?.limits || {}) }
  const allowUrl: Partial<Record<CollectionKey, boolean>> = {
    virtualTours: true,
    videos: true,
    additional: true,
    ...(opts?.allowUrl || {}),
  }

  // Reactive buckets
  const media = reactive<Record<CollectionKey, MediaItem[]>>({
    primaryPhotos: [],
    virtualTours: [],
    videos: [],
    drone: [],
    floorPlans: [],
    documents: [],
    additional: [],
  })

  // UI status (useful for toasts)
  const status = ref<{ type: 'info' | 'error'; message: string } | null>(null)
  const note = (m: string) => (status.value = { type: 'info', message: m })
  const err = (m: string) => (status.value = { type: 'error', message: m })

  // Per-collection dedupe sigs
  const seenKeys = reactive<Record<CollectionKey, Set<string>>>({
    primaryPhotos: new Set(),
    virtualTours: new Set(),
    videos: new Set(),
    drone: new Set(),
    floorPlans: new Set(),
    documents: new Set(),
    additional: new Set(),
  })

  const remaining = (k: CollectionKey) =>
    Math.max(0, (limits[k] ?? Number.POSITIVE_INFINITY) - media[k].length)

  const setOrder = (k: CollectionKey) => {
    media[k].forEach((it, i) => (it.order = i))
  }

  const sigOf = (f: File) => `${f.name}::${f.type}::${f.size}`

  async function addFiles(k: CollectionKey, files: File[] | FileList) {
    const list = Array.from(files || [])
    if (!list.length) return

    const lim = limits[k] ?? Number.POSITIVE_INFINITY
    if (media[k].length >= lim) {
      err(`Limit reached (${lim}).`)
      return
    }

    let added = 0
    for (const f of list) {
      if (media[k].length >= lim) {
        err(`Limit reached (${lim}).`)
        break
      }
      if (!ACCEPT[k](f.type || '')) continue

      const sig = sigOf(f)
      if (seenKeys[k].has(sig)) continue

      const id = uid(k.slice(0, 2))
      const base: MediaItem = {
        id,
        kind: k,
        name: f.name,
        type: f.type,
        size: f.size,
        order: media[k].length,
      }

      // object URL
      const { url, revoke } = objectUrl(f)
      base.url = url
      base._revoke = revoke

      // enrich previews
      try {
        if (f.type?.startsWith('image/')) {
          const dims = await readImageDims(f).catch(() => null)
          base.width = dims?.width
          base.height = dims?.height
          base.thumb = await makeThumbnail(f, { max: 480, quality: 0.85 }).catch(() => undefined)
        } else if (f.type?.startsWith('video/')) {
          const info = await readVideoInfo(f).catch(() => null)
          base.width = info?.width
          base.height = info?.height
          base.duration = info?.duration ?? null
          base.thumb = await makeThumbnail(f, { max: 480, quality: 0.85, videoSeek: 1 }).catch(() => undefined)
        }
        // optional EXIF/meta (best-effort)
        await extractMeta(f as File).catch(() => null)
      } catch {
        /* non-fatal */
      }

      // auto primary for first photo
      if (k === 'primaryPhotos' && media[k].length === 0) base.primary = true

      media[k].push(base)
      seenKeys[k].add(sig)
      added++
    }

    if (added) {
      setOrder(k)
      note(`Added ${added} file${added > 1 ? 's' : ''}.`)
    }
  }

  function validHttpUrl(u: string) {
    try {
      const x = new URL(u)
      return x.protocol === 'http:' || x.protocol === 'https:'
    } catch {
      return false
    }
  }

  async function addUrl(
    k: CollectionKey,
    url: string,
    kindHint?: 'virtualTour' | 'video' | 'doc' | 'image'
  ) {
    const lim = limits[k] ?? Number.POSITIVE_INFINITY
    if (media[k].length >= lim) {
      err(`Limit reached (${lim}).`)
      return
    }
    if (!allowUrl[k]) {
      err(`URLs are not allowed for this section.`)
      return
    }
    if (!validHttpUrl(url)) {
      err('Please enter a valid URL (http/https).')
      return
    }

    const id = uid(k.slice(0, 2))
    const item: MediaItem = {
      id,
      kind: (kindHint as any) ?? k,
      name: url,
      url,
      order: media[k].length,
    }

    media[k].push(item)
    setOrder(k)
    note(`Added 1 URL.`)
  }

  function remove(k: CollectionKey, id: string) {
    const arr = media[k]
    const idx = arr.findIndex((i) => i.id === id)
    if (idx === -1) return
    try {
      arr[idx]._revoke?.()
    } catch {}
    arr.splice(idx, 1)
    setOrder(k)
    note(`Removed item.`)

    // keep primary photo invariant
    if (k === 'primaryPhotos' && !arr.some((i) => i.primary) && arr[0]) {
      arr[0].primary = true
    }
  }

  function reorder(k: CollectionKey, nextItems: MediaItem[]) {
    media[k].splice(0, media[k].length, ...nextItems)
    setOrder(k)
  }

  function setPrimaryPhoto(id: string) {
    const arr = media.primaryPhotos
    arr.forEach((i) => (i.primary = i.id === id))
  }

  return {
    media,
    limits,
    status,
    remaining,
    addFiles,
    addUrl,
    remove,
    reorder,
    setPrimaryPhoto,
  }
}
