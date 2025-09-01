// components/uploader/_media.local.ts

/** SSR-safe media helpers for the uploader */

export const isClient = typeof window !== 'undefined'

/** Simple unique id (used by useUploader) */
export function uid(prefix = 'm') {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

/** Create an object URL (client-only) with a safe revoke */
export function objectUrl(file: Blob): { url: string; revoke: () => void } {
  if (!isClient) return { url: '', revoke: () => {} }
  const url = URL.createObjectURL(file)
  const revoke = () => { try { URL.revokeObjectURL(url) } catch {} }
  return { url, revoke }
}

export type ImageDims = { width: number; height: number }
export type VideoInfo = { width: number; height: number; duration: number }

/** Public APIs expected by the uploader */
export async function readImageDims(file: Blob): Promise<ImageDims | null> {
  return getImageDimensions(file)
}
export async function readVideoInfo(file: Blob): Promise<VideoInfo | null> {
  return getVideoInfo(file)
}

/** Optional EXIF stub (keeps imports happy if referenced) */
export async function readExif(_file: Blob) { return null }

/** No-op compression fallback to keep flow smooth */
export async function compressImage(file: File, _opts?: any) { return file }

/** Create a dataURL thumbnail for images or videos */
export async function makeThumbnail(
  file: File,
  opts: { max?: number; quality?: number; videoSeek?: number } = {}
): Promise<string> {
  if (!isClient) return ''
  if (file.type.startsWith('image/')) return await makeImageThumb(file, opts)
  if (file.type.startsWith('video/')) return await makeVideoThumb(file, opts)
  return ''
}

/** Lightweight meta extractor (dims + video duration) */
export async function extractMeta(file: File) {
  const out: { width?: number; height?: number; duration?: number | null } = { duration: null }
  if (file.type.startsWith('image/')) {
    const dims = await getImageDimensions(file)
    if (dims) { out.width = dims.width; out.height = dims.height }
  } else if (file.type.startsWith('video/')) {
    const info = await getVideoInfo(file)
    if (info) { out.width = info.width; out.height = info.height; out.duration = info.duration }
  }
  return out
}

/* ---------------- internal helpers ---------------- */

async function getImageDimensions(file: Blob): Promise<ImageDims | null> {
  if (!isClient) return null
  try {
    const createIB = (window as any).createImageBitmap as undefined | ((b: Blob) => Promise<ImageBitmap>)
    if (createIB) {
      const bmp = await createIB(file)
      const dims = { width: bmp.width, height: bmp.height }
      bmp.close?.()
      return dims
    }
  } catch {}
  return await new Promise((resolve) => {
    const { url, revoke } = objectUrl(file)
    const img = new Image()
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); revoke() }
    img.onerror = () => { resolve(null); revoke() }
    img.src = url
  })
}

async function getVideoInfo(file: Blob): Promise<VideoInfo | null> {
  if (!isClient) return null
  return await new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    const { url, revoke } = objectUrl(file)
    const cleanup = () => { video.pause(); video.src = ''; revoke() }
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        duration: isFinite(video.duration) ? video.duration : 0,
      })
      cleanup()
    }
    video.onerror = () => { cleanup(); resolve(null) }
    video.src = url
  })
}

async function makeImageThumb(file: Blob, opts: { max?: number; quality?: number }) {
  const max = opts.max ?? 512
  const quality = opts.quality ?? 0.85
  const { url, revoke } = objectUrl(file)
  try {
    const createIB = (window as any).createImageBitmap as undefined | ((b: Blob) => Promise<ImageBitmap>)
    if (createIB) {
      const bmp = await createIB(file)
      const s = Math.min(max / bmp.width, max / bmp.height, 1)
      const w = Math.max(1, Math.round(bmp.width * s))
      const h = Math.max(1, Math.round(bmp.height * s))
      const c = document.createElement('canvas'); c.width = w; c.height = h
      c.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
      const out = c.toDataURL('image/jpeg', quality)
      bmp.close?.()
      return out
    }
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image()
      el.onload = () => res(el)
      el.onerror = () => rej()
      el.src = url
    })
    const s = Math.min(max / img.width, max / img.height, 1)
    const w = Math.max(1, Math.round(img.width * s))
    const h = Math.max(1, Math.round(img.height * s))
    const c = document.createElement('canvas'); c.width = w; c.height = h
    c.getContext('2d')!.drawImage(img, 0, 0, w, h)
    return c.toDataURL('image/jpeg', quality)
  } finally {
    revoke()
  }
}

async function makeVideoThumb(file: Blob, opts: { max?: number; quality?: number; videoSeek?: number }): Promise<string> {
  const max = opts.max ?? 512
  const quality = opts.quality ?? 0.85
  const seek = Math.max(0, opts.videoSeek ?? 0)
  if (!isClient) return '';
  try {
    const video = document.createElement('video')
    // ... (rest of your implementation goes here)
    // You must ensure that every code path returns a string.
    // For now, return an empty string as a fallback.
    return '';
  } catch {
    return '';
  }
}