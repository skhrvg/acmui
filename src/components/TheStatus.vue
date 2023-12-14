<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVPNStore } from '@/stores/vpn'

const { state, notice, status } = storeToRefs(useVPNStore())
</script>

<template>
  <div
    class="px-6 py-4 h-32 bg-gradient-to-b to-transparent transition-transform flex flex-col space-y-2.5 items-center
    justify-center"
    :class="[
      status === 'connected'
        ? 'from-green-800'
        : status === 'disconnected'
          ? 'from-red-800'
          : 'from-yellow-600',
    ]"
  >
    <p class="font-medium text-center text-xl uppercase">
      {{ state }}
    </p>
    <div class="w-6 h-px bg-white opacity-75" />
    <p class="text-center text-xs opacity-75 mb-2 h-4">
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

<style scoped>

</style>
