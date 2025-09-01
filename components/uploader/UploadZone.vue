<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  accept?: string
  multiple?: boolean
}>(), {
  label: 'Drop files here or click to choose',
  accept: '',
  multiple: false,
})

const emit = defineEmits<{
  (e: 'files', files: FileList | File[]): void
}>()

const over = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

function onChoose(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) emit('files', files)
  // allow picking the same file again
  if (inputEl.value) inputEl.value.value = ''
}
function openPicker() { inputEl.value?.click() }

function onDragOver(e: DragEvent) { e.preventDefault(); over.value = true }
function onDragLeave(e: DragEvent) { e.preventDefault(); over.value = false }
function onDrop(e: DragEvent) {
  e.preventDefault(); over.value = false
  const files = e.dataTransfer?.files
  if (files && files.length) emit('files', files)
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer select-none transition"
    :class="over ? 'bg-gray-50 border-gray-400' : 'border-gray-300 hover:bg-gray-50'"
    tabindex="0"
    @click="openPicker"
    @keyup.enter="openPicker"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <p class="font-medium">{{ label }}</p>
    <p class="text-xs text-x-gray2 mt-1">
      Drag & drop files here, or click to browse
    </p>

    <input
      ref="inputEl"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onChoose"
    />
  </div>
</template>
