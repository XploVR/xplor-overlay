// /composables/useShare.ts
export type SharePayload = {
  title?: string
  text?: string
  url?: string
}

export function useShare() {
  const canNativeShare = (p: SharePayload) =>
    typeof navigator !== 'undefined' &&
    typeof (navigator as any).share === 'function' &&
    (!!p.text || !!p.url)

  async function nativeShare(p: SharePayload) {
    // @ts-ignore
    return navigator.share?.(p)
  }

  function buildIntents(p: SharePayload) {
    const url = encodeURIComponent(p.url || '')
    const text = encodeURIComponent(p.text || '')
    const title = encodeURIComponent(p.title || '')

    return {
      whatsapp: `https://wa.me/?text=${text || title}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text || title}`,
      x:        `https://twitter.com/intent/tweet?text=${text || title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email:    `mailto:?subject=${title}&body=${text}%0A${p.url || ''}`,
      messenger:`fb-messenger://share?link=${url}`,
      copy:     p.url || p.text || ''
    }
  }

  async function copyToClipboard(s: string) {
    try {
      await navigator.clipboard.writeText(s)
      return true
    } catch { return false }
  }

  return { canNativeShare, nativeShare, buildIntents, copyToClipboard }
}
