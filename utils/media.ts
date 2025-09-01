// components/uploader/_media.local.ts

/** =========================
 *  SSR-SAFE MEDIA UTILITIES
 *  =========================
 *  Exports:
 *   - uid(prefix?)
 *   - objectUrl(file)  ← NEW (wraps URL.createObjectURL with safe revoke)
 *   - readExif(file)
 *   - compressImage(file, opts?)
 *   - extractMeta(file)
 *   - makeThumbnail(file, opts?)
 */

export const isClient = typeof window !== 'undefined'

/** Simple unique id */
export function uid(prefix = 'm') {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

/** Create an object URL (client-only) and a safe revoke callback */
export function objectUrl(file: Blob): { url: string; revoke: () => void } {
  if (!isClient) return { url: '', revoke: () => {} }
  const url = URL.createObjectURL(file)
  const revoke = () => {
    try { URL.revokeObjectURL(url) } catch {}
  }
  return { url, revoke }
}

/** Lazy EXIF read on client */
export async function readExif(file: Blob) {
  if (!isClient) return null
  try {
    const mod = await import('exifr')
    const exifr: any = (mod as any).default ?? mod
    if (!exifr) return null
    return exifr.parse ? await exifr.parse(file) : await exifr(file)
  } catch {
    return null
  }
}

/** Lazy image compression on client */
export async function compressImage(
  file: File,
  opts: Partial<{ maxWidthOrHeight: number; maxSizeMB: number }> = {}
) {
  if (!isClient) return file
  try {
    const mod = await import('browser-image-compression')
    const imageCompression: any = (mod as any).default ?? mod
    return imageCompression(file, {
      maxSizeMB: opts.maxSizeMB ?? 1,
      maxWidthOrHeight: opts.maxWidthOrHeight ?? 2560,
      useWebWorker: true,
    }) as Promise<File>
  } catch {
    return file
  }
}

export type ExtractedMeta = {
  width?: number
  height?: number
  gps?: { lat: number; lng: number } | null
  takenAt?: string | null
  orientation?: number | null
  duration?: number | null // videos
}

const isImage = (t: string) => t.startsWith('image/')
const isVideo = (t: string) => t.startsWith('video/')

/** Get image dimensions using ImageBitmap or HTMLImageElement */
async function getImageDimensions(file: Blob): Promise<{ width: number; height: number } | null> {
  if (!isClient) return null
  try {
    const createIB = (window as any).createImageBitmap as
      | ((blob: Blob) => Promise<ImageBitmap>)
      | undefined
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

/** Get video dimensions + duration */
async function getVideoInfo(
  file: Blob
): Promise<{ width: number; height: number; duration: number } | null> {
  if (!isClient) return null
  return await new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    const { url, revoke } = objectUrl(file)
    const cleanup = () => { video.pause(); video.src = ''; revoke() }
    video.onloadedmetadata = () => {
      const info = {
        width: video.videoWidth,
        height: video.videoHeight,
        duration: isFinite(video.duration) ? video.duration : 0,
      }
      cleanup()
      resolve(info)
    }
    video.onerror = () => { cleanup(); resolve(null) }
    video.src = url
  })
}

/** Extract basic metadata (SSR-safe) */
export async function extractMeta(file: File): Promise<ExtractedMeta> {
  const meta: ExtractedMeta = { gps: null, takenAt: null, orientation: null }
  if (isImage(file.type)) {
    const dims = await getImageDimensions(file)
    if (dims) { meta.width = dims.width; meta.height = dims.height }
    const exif = await readExif(file)
    if (exif) {
      const lat = exif.latitude ?? exif.Latitude ?? exif.GPSLatitude
      const lng = exif.longitude ?? exif.Longitude ?? exif.GPSLongitude
      if (typeof lat === 'number' && typeof lng === 'number') meta.gps = { lat, lng }
      const dt =
        exif.DateTimeOriginal ?? exif.CreateDate ?? exif.ModifyDate ?? exif.datetimeOriginal ?? null
      try {
        meta.takenAt = dt instanceof Date ? dt.toISOString() : (typeof dt === 'string' ? dt : null)
      } catch { meta.takenAt = null }
      meta.orientation = (exif.Orientation as number | undefined) ?? null
    }
  } else if (isVideo(file.type)) {
    const info = await getVideoInfo(file)
    if (info) { meta.width = info.width; meta.height = info.height; meta.duration = info.duration }
  }
  return meta
}

export type ThumbnailOptions = {
  max?: number          // longest side
  quality?: number      // JPEG quality 0..1
  videoSeek?: number    // video seek time in seconds
}

/** Create a dataURL thumbnail for images or videos (client-only) */
export async function makeThumbnail(file: File, opts: ThumbnailOptions = {}): Promise<string> {
  if (!isClient) return ''
  if (isImage(file.type)) return await makeImageThumbnail(file, opts)
  if (isVideo(file.type)) return await makeVideoThumbnail(file, opts)
  return ''
}

export type ImageDims = { width: number; height: number }

/** Public alias used by useUploader.ts */
export async function readImageDims(file: Blob): Promise<ImageDims | null> {
  return await getImageDimensions(file)
}

export type VideoInfo = { width: number; height: number; duration: number }

/** Optional: if your uploader imports/read video info by name */
export async function readVideoInfo(file: Blob): Promise<VideoInfo | null> {
  return await getVideoInfo(file)

async function makeImageThumbnail(file: Blob, opts: ThumbnailOptions): Promise<string> {
  const max = opts.max ?? 512
  const quality = opts.quality ?? 0.85
  const { url, revoke } = objectUrl(file)
  try {
    const createIB = (window as any).createImageBitmap as
      | ((blob: Blob) => Promise<ImageBitmap>)
      | undefined
    if (createIB) {
      const bmp = await createIB(file)
      const scale = Math.min(max / bmp.width, max / bmp.height, 1)
      const w = Math.max(1, Math.round(bmp.width * scale))
      const h = Math.max(1, Math.round(bmp.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bmp, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      bmp.close?.()
      return dataUrl
    }
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    const scale = Math.min(max / img.width, max / img.height, 1)
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    revoke()
  }
}

async function makeVideoThumbnail(file: Blob, opts: ThumbnailOptions): Promise<string> {
  const max = opts.max ?? 512
  const quality = opts.quality ?? 0.85
  const seek = Math.max(0, opts.videoSeek ?? 0)
  const video = document.createElement('video')
  video.muted = true; video.playsInline = true; video.preload = 'metadata'
  const { url, revoke } = objectUrl(file)
  const cleanup = () => { video.pause(); video.src = ''; revoke() }
  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        const t = Math.min(seek, Math.max(0, (isFinite(video.duration) ? video.duration : 0) - 0.1))
        const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve() }
        video.addEventListener('seeked', onSeeked, { once: true })
        try { video.currentTime = t } catch (e) { video.play().then(() => { video.pause(); video.currentTime = t }).catch(reject) }
      }
      video.onerror = () => reject(new Error('Failed to load video metadata'))
      video.src = url
    })
    const vw = video.videoWidth || 1, vh = video.videoHeight || 1
    const scale = Math.min(max / vw, max / vh, 1)
    const w = Math.max(1, Math.round(vw * scale)), h = Math.max(1, Math.round(vh * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    return ''
  } finally {
    cleanup()
  }
}
