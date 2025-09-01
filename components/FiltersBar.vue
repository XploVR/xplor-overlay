<script setup lang="ts">
type SortKey = '' | 'new' | 'old' | 'price_asc' | 'price_desc'
type Filters = {
  q: string
  city: string | null
  status: string | null
  priceMin: number | null
  priceMax: number | null
  sort: SortKey
}

const props = defineProps<{
  modelValue: Filters
  cities?: string[]
  statuses?: string[]
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Filters): void
  (e: 'reset'): void
}>()

function update<K extends keyof Filters>(k: K, v: Filters[K]) {
  emit('update:modelValue', { ...props.modelValue, [k]: v })
}

function onReset() {
  emit('reset')
}
</script>

<template>
  <div class="card p-3 md:p-4">
    <div class="grid md:grid-cols-6 gap-3">
      <!-- Search -->
      <div class="md:col-span-2">
        <label class="text-xs text-x-gray2">Search</label>
        <input
          :value="modelValue.q"
          @input="update('q', ($event.target as HTMLInputElement).value)"
          placeholder="Title, city, description…"
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <!-- City -->
      <div v-if="cities?.length" class="">
        <label class="text-xs text-x-gray2">City</label>
        <select
          class="w-full rounded-xl border px-3 py-2"
          :value="modelValue.city ?? ''"
          @change="update('city', ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">All</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Status -->
      <div v-if="statuses?.length" class="">
        <label class="text-xs text-x-gray2">Status</label>
        <select
          class="w-full rounded-xl border px-3 py-2"
          :value="modelValue.status ?? ''"
          @change="update('status', ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">All</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- Price Min -->
      <div>
        <label class="text-xs text-x-gray2">Min €</label>
        <input
          type="number"
          inputmode="numeric"
          :value="modelValue.priceMin ?? ''"
          @input="update('priceMin', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null)"
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <!-- Price Max -->
      <div>
        <label class="text-xs text-x-gray2">Max €</label>
        <input
          type="number"
          inputmode="numeric"
          :value="modelValue.priceMax ?? ''"
          @input="update('priceMax', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null)"
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <!-- Sort -->
      <div>
        <label class="text-xs text-x-gray2">Sort</label>
        <select
          class="w-full rounded-xl border px-3 py-2"
          :value="modelValue.sort"
          @change="update('sort', ($event.target as HTMLSelectElement).value as any)"
        >
          <option value="">Relevance</option>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-3">
      <button class="btn btn-ghost" @click="onReset">Reset</button>
    </div>
  </div>
</template>
