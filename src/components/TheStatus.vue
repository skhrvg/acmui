<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVPNStore } from '@/stores/vpn'

const { state, notice, status } = storeToRefs(useVPNStore())
</script>

<template>
  <div
    class="px-6 py-4 h-32 flex flex-col items-center justify-center relative overflow-hidden"
  >
    <TransitionGroup
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-to-class="opacity-0"
      leave-from-class="opacity-0"
    >
      <div v-if="status === 'connected'" class="background from-green-800" />
      <div v-else-if="status === 'disconnected'" class="background from-red-800" />
      <div v-else class="background from-yellow-800" />
    </TransitionGroup>
    <p class="font-medium text-center text-xl uppercase z-10 mt-3 tracking-wide">
      {{ state }}
    </p>
    <div class="w-6 h-px bg-white opacity-25 z-10 my-2" />
    <p class="text-center text-xs opacity-75 mb-2 h-4 z-10">
      <span v-if="notice">{{ notice }}</span>
      <span
        v-else
        style="font-family: 'Times New Roman',serif"
      >
        (*・ω・)ﾉ
      </span>
    </p>
  </div>
</template>

<style scoped lang="postcss">
.background {
  @apply absolute inset-0 bg-gradient-to-b to-transparent duration-500
}
</style>
