// composables/useSidebar.ts
import { useState } from '#app'

const STORAGE_KEY = 'xplor:sidebar:expanded'

export function useSidebar() {
  // default: expanded on desktop, collapsed on mobile (SSR-safe guess)
  const initial = process.client
    ? (localStorage.getItem(STORAGE_KEY) ?? '1') === '1'
    : true

  const expanded = useState<boolean>('sidebar-expanded', () => initial)
  const mobileOpen = useState<boolean>('sidebar-mobile-open', () => false)

  function setExpanded(v: boolean) {
    expanded.value = v
    if (process.client) localStorage.setItem(STORAGE_KEY, v ? '1' : '0')
  }
  function toggleExpanded() { setExpanded(!expanded.value) }

  function openMobile() { mobileOpen.value = true }
  function closeMobile() { mobileOpen.value = false }
  function toggleMobile() { mobileOpen.value = !mobileOpen.value }

  return { expanded, setExpanded, toggleExpanded, mobileOpen, openMobile, closeMobile, toggleMobile }
}
