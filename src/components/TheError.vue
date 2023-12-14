<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVPNStore } from '@/stores/vpn'

const { error } = storeToRefs(useVPNStore())
</script>

<template>
  <div
    v-if="error"
    class="fixed top-0 inset-x-0 text-center px-6 py-2 bg-red-500 text-xs cursor-pointer"
    @click="error = ''"
  >
    {{ error }}
  </div>
</template>

<style scoped>

</style>
