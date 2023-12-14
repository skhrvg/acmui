import { join } from 'node:path'
import process from 'node:process'
import { BrowserWindow, Menu, Tray, app, ipcMain, nativeImage, shell } from 'electron'
import { checkVPN, connectVPN, disconnectVPN } from './vpn'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// eslint-disable-next-line import/no-mutable-exports
let win: BrowserWindow | null = null
let tray: Electron.Tray
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const trayImage = nativeImage.createFromPath(join(process.env.PUBLIC, 'trayTemplate@2x.png'))
const trayDisconnectedImage = nativeImage.createFromPath(
  join(process.env.PUBLIC, 'trayDisconnectedTemplate@2x.png'),
)

async function createWindow() {
  win = new BrowserWindow({
    width: 270,
    height: 404,
    backgroundColor: '#111827',
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    titleBarStyle: 'hidden',
    hiddenInMissionControl: true,
    webPreferences: {
      preload,
    },
  })

  const position = getWindowPosition()
  win.setPosition(position.x, position.y, false)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({
      mode: 'detach',
    })
  }
  else {
    win.loadFile(indexHtml)
    win.setWindowButtonVisibility(false)
    win.on('blur', () => {
      win.close()
    })
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
}

function createTray() {
  tray = new Tray(trayDisconnectedImage)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit VPN',
      type: 'normal',
      click: async () => {
        app.quit()
      },
    },
  ])
  tray.on('click', () => {
    if (!win)
      createWindow()
    else
      win.close()
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
}

function getWindowPosition() {
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 3)

  return { x, y }
}

app.dock.hide()
const { openAtLogin } = app.getLoginItemSettings()
if (!openAtLogin) {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  })
}

app.on('window-all-closed', () => {
  win = null
})

app.on('before-quit', async () => {
  await disconnectVPN()
})

app.whenReady().then(() => {
  createTray()
  checkVPN()
  setInterval(() => checkVPN(), 15 * 1000)
  ipcMain.handle('disconnect', async () => {
    await disconnectVPN()
  })
  ipcMain.handle('connect', async (event, args: { url: string, username: string, password: string }) => {
    await connectVPN(args.url, args.username, args.password)
  })
  ipcMain.handle('check', async () => {
    await checkVPN()
  })
  ipcMain.handle('quit', () => {
    app.quit()
  })
})

function setTrayOpacity(connected: boolean) {
  tray.setImage(connected ? trayImage : trayDisconnectedImage)
}

export { win, setTrayOpacity }
