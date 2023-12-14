import { acceptHMRUpdate, defineStore } from 'pinia'

export const useVPNStore = defineStore('vpn', () => {
  const state = ref('Initializing...')
  const notice = ref('Please wait.')
  const error = ref('')
  const log = ref('')

  window.vpn.onOutput((_event, type, output) => {
    switch (type) {
      case 'notice':
        notice.value = output
        break
      case 'state':
        state.value = output
        break
      case 'error':
        setError(output)
        break
      default:
        output = type
        type = 'info'
    }
    console.log(`[${type}] ${output}`)
  })

  // noinspection JSIgnoredPromiseFromCall
  check()

  const status = computed(() =>
    state.value.startsWith('Connected')
      ? 'connected'
      : state.value.startsWith('Disconnected')
        ? 'disconnected'
        : 'other')

  function setError(e: string) {
    error.value = e
    setTimeout(() => error.value = '', 10 * 1000)
  }

  async function check() {
    notice.value = ''
    await window.vpn.check()
  }

  async function connect(url: string, username: string, password: string) {
    await window.vpn.connect(url, username, password)
    await check()
  }

  async function disconnect() {
    await window.vpn.disconnect()
    await check()
  }

  return {
    state,
    notice,
    error,
    log,
    status,
    check,
    connect,
    disconnect,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useVPNStore, import.meta.hot))
