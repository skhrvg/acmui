import IpcRendererEvent = Electron.IpcRendererEvent

export interface VPNElectronAPI {
  check: () => Promise<void>
  connect: (url: string, username: string, password: string) => Promise<void>
  disconnect: () => Promise<void>
  onOutput: (callback: (event: IpcRendererEvent, output: string) => void) => Promise<void>
  quit: () => Promise<void>
}

declare global {
  interface Window {
    vpn: VPNElectronAPI
  }
}
