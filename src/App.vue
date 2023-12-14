<script setup lang="ts">
import FInput from '~/components/FInput.vue'

type StatusType = 'notice' | 'state' | 'error'
const status = reactive<Record<StatusType, string>>({
  notice: 'Please wait.',
  state: 'Initializing...',
  error: '',
})
const log = ref('')
const url = useLocalStorage('url', '', {})
const username = useLocalStorage('username', '', {})
const password = useLocalStorage('password', '', {})

window.vpn.onOutput((event, output) => {
  const [key, value] = output.split(': ', 2)
  log.value += `${output}\n`
  switch (key) {
    case 'notice':
      status.notice = value
      break
    case 'state':
      status.state = value
      break
    case 'error':
      setError(value)
      break
  }
})

function setError(error: string) {
  status.error = error
  setTimeout(() => status.error = '', 5 * 1000)
}

async function connect() {
  await window.vpn.connect(url.value, username.value, password.value)
  await check()
}
async function disconnect() {
  await window.vpn.disconnect()
  await check()
}
async function check() {
  status.notice = ''
  await window.vpn.check()
}

function quit() {
  window.vpn.quit()
}

onMounted(() => {
  check()
  setInterval(() => check(), 15 * 1000)
})

const connected = computed(() =>
  status.state.startsWith('Connected')
    ? true
    : status.state.startsWith('Disconnected')
      ? false
      : null)
</script>

<template>
  <div
    class="px-6 py-4 h-32 bg-gradient-to-b to-transparent transition-transform flex flex-col space-y-2.5 items-center justify-center"
    :class="[
      connected
        ? 'from-green-800'
        : connected === false
          ? 'from-red-800'
          : 'from-yellow-600',
    ]"
  >
    <p class="font-medium text-center text-xl uppercase">
      {{ status.state }}
    </p>
    <div class="w-6 h-px bg-white opacity-75" />
    <p class="text-center text-xs opacity-75 mb-2 h-4">
      <span v-if="status.notice">{{ status.notice }}</span>
      <span
        v-else
        style="font-family: 'Times New Roman',serif"
      >
        (*・ω・)ﾉ
      </span>
    </p>
  </div>
  <div class="px-6 flex flex-col space-y-2.5">
    <FInput
      id="url"
      v-model="url"
      label="Server"
      placeholder="vpn.example.com"
      :disabled="connected !== false"
    />
    <FInput
      id="username"
      v-model="username"
      label="Username"
      placeholder="johnsmith"
      :disabled="connected !== false"
    />
    <FInput
      id="password"
      v-model="password"
      label="Password"
      type="password"
      placeholder="••••••"
      :disabled="connected !== false"
    />
    <button
      type="button"
      class="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      :class="
        connected
          ? 'bg-red-700 enabled:hover:bg-red-800 focus-visible:outline-red-800'
          : 'bg-green-700 enabled:hover:bg-green-800 focus-visible:outline-green-800'
      "
      :disabled="connected === null"
      @click="connected ? disconnect() : connect()"
    >
      {{ connected ? 'Disconnect' : 'Connect' }}
    </button>
  </div>
  <div class="grid grid-cols-2 gap-2 px-6 py-2.5 text-xs opacity-75">
    <button @click="check">
      Refresh status
    </button>
    <button @click="quit">
      Quit app
    </button>
  </div>
  <div
    v-if="status.error"
    class="fixed top-0 inset-x-0 text-center px-6 py-2 bg-red-500 text-xs cursor-pointer"
    @click="status.error = ''"
  >
    {{ status.error }}
  </div>
</template>
