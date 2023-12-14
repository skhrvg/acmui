import IpcRendererEvent = Electron.IpcRendererEvent

export interface VPNElectronAPI {
  check: () => Promise<void>
  connect: (url: string, username: string, password: string) => Promise<void>
  disconnect: () => Promise<void>
  quit: () => Promise<void>
  onOutput: (callback: (event: IpcRendererEvent, type: string, output: string) => void) => void
}

declare global {
  interface Window {
    vpn: VPNElectronAPI
  }
}
