<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVPNStore } from '@/stores/vpn'

const { error } = storeToRefs(useVPNStore())
</script>

<template>
  <transition
    enter-from-class="-translate-y-[100%]"
    leave-to-class="-translate-y-[100%]"
  >
    <div
      v-if="error"
      class="fixed top-0 inset-x-0 text-center px-6 py-2 bg-red-500 text-xs cursor-pointer duration-200 z-20"
      @click="error = ''"
    >
      {{ error }}
    </div>
  </transition>
</template>

<style scoped>

</style>
