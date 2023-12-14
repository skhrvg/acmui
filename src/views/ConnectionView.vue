<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVPNStore } from '../stores/vpn'
import FInput from '../components/FInput.vue'

const vpnStore = useVPNStore()
const { status } = storeToRefs(vpnStore)

const url = useLocalStorage('url', '', {})
const username = useLocalStorage('username', '', {})
const password = useLocalStorage('password', '', {})

function quit() {
  window.vpn.quit()
}
</script>

<template>
  <div class="px-6 flex flex-col space-y-2.5">
    <FInput
      id="url"
      v-model="url"
      label="Server"
      placeholder="vpn.example.com"
      :disabled="status !== 'disconnected'"
    />
    <FInput
      id="username"
      v-model="username"
      label="Username"
      placeholder="johnsmith"
      :disabled="status !== 'disconnected'"
    />
    <FInput
      id="password"
      v-model="password"
      label="Password"
      type="password"
      placeholder="••••••"
      :disabled="status !== 'disconnected'"
    />
    <button
      type="button"
      class="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-200 focus-visible:outline
      focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      :class="
        status === 'connected'
          ? 'bg-red-700 enabled:hover:bg-red-800 focus-visible:outline-red-800'
          : 'bg-green-700 enabled:hover:bg-green-800 focus-visible:outline-green-800'
      "
      :disabled="status === 'other'"
      @click="status === 'connected' ? vpnStore.disconnect() : vpnStore.connect(url, username, password)"
    >
      {{ status === 'connected' ? 'Disconnect' : 'Connect' }}
    </button>
  </div>
  <div class="grid grid-cols-2 gap-2 px-6 py-2.5 text-xs opacity-75">
    <button @click="vpnStore.check()">
      Refresh status
    </button>
    <button @click="quit">
      Quit app
    </button>
  </div>
</template>

<style scoped>

</style>
