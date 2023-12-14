import { contextBridge, ipcRenderer } from 'electron'
import IpcRendererEvent = Electron.IpcRendererEvent

contextBridge.exposeInMainWorld(
  'vpn',
  {
    check: async () => await ipcRenderer.invoke('check'),
    connect: async (url: string, username: string, password: string) => await ipcRenderer.invoke('connect', {
      url,
      username,
      password,
    }),
    disconnect: async () => await ipcRenderer.invoke('disconnect'),
    onOutput: async (callback: (event: IpcRendererEvent, output: string) => void) => ipcRenderer.on('output', callback),
    quit: async () => await ipcRenderer.invoke('quit'),
  },
)
