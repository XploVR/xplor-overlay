// composables/useAutosave.ts
import { useLocalStorage, useDebounceFn } from '@vueuse/core'


export function useAutosave<T>(key: string, initial: T) {
const state = useLocalStorage<T>(key, initial, { writeDefaults: true })
const dirty = ref(false)
const savedAt = ref<string | null>(null)


const save = useDebounceFn(() => {
state.value = state.value // trigger write
dirty.value = false
savedAt.value = new Date().toISOString()
}, 600)


watch(state, () => { dirty.value = true; save() }, { deep: true })


return { state, dirty, savedAt, saveNow: () => { state.value = state.value; savedAt.value = new Date().toISOString(); dirty.value=false } }
}