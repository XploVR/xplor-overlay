// composables/useSidebar.ts
import { ref, watch } from 'vue'

const _isOpen = ref(false)       // mobile drawer
const _isCollapsed = ref(false)  // desktop collapsed
let initialized = false

export function useSidebar() {
  if (import.meta.client && !initialized) {
    initialized = true

    // restore persisted state
    try {
      const stored = localStorage.getItem('xplor_sidebar_collapsed')
      if (stored !== null) _isCollapsed.value = stored === '1'
    } catch {}

    // optional query override: ?sidebar=collapsed|expanded
    try {
      const q = new URLSearchParams(location.search).get('sidebar')
      if (q === 'collapsed') _isCollapsed.value = true
      if (q === 'expanded')  _isCollapsed.value = false
    } catch {}

    // persist on change
    watch(_isCollapsed, v => {
      try { localStorage.setItem('xplor_sidebar_collapsed', v ? '1' : '0') } catch {}
    })
  }

  const toggleMobile = () => { _isOpen.value = !_isOpen.value }
  const closeMobile   = () => { _isOpen.value = false }
  const toggleCollapsed = () => { _isCollapsed.value = !_isCollapsed.value }

  return { isOpen: _isOpen, isCollapsed: _isCollapsed, toggleMobile, closeMobile, toggleCollapsed }
}
