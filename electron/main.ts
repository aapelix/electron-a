import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { autoUpdater, AppUpdater } from 'electron-updater'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, '32x32.png'),
    width: 1000,
    height: 700,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    maximizable: false,
    title: "Project A",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  autoUpdater.checkForUpdates();
}

app.on('window-all-closed', () => {
  win = null
})

ipcMain.on("close", () => {
  app.quit();
})

ipcMain.on("minimize", () => {
  win?.minimize();
})

app.whenReady().then(createWindow)
