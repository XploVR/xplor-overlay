<script setup lang="ts">
definePageMeta({ layout: 'default' })
const items = ref<{id:string; at:string}[]>([])
onMounted(()=>{ try{ const raw=localStorage.getItem("xplor_recent"); items.value = raw? JSON.parse(raw): [] }catch{} })
</script>
<template>
  <div class="container-x py-8 text-white">
    <h1 class="text-3xl font-semibold">Recently Viewed</h1>
    <div class="mt-6" v-if="items.length===0">No recent items yet.</div>
  </div>
</template>


