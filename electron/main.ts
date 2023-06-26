import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
const fs = require('fs');
const rimraf = require("rimraf");
const Store = require('electron-store');
const { Client } = require("minecraft-launcher-core");
const launcher = new Client();

const { Auth } = require("msmc");


const store = new Store();

import { autoUpdater } from 'electron-updater'

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

ipcMain.handle("loopInstances", () => {
  const folderPath = path.resolve(__dirname, "../instances")

  const folderContent = fs.readdirSync(folderPath)
  const folders = folderContent.filter((res: string) => fs.lstatSync(path.resolve(folderPath, res)).isDirectory())

  return folders;
})

ipcMain.handle("launchMc", (_, version) => {

  const authManager = new Auth("select_account");

    authManager.launch("raw").then(async (xboxManager: { getMinecraft: () => any; }) => {

      const token = await xboxManager.getMinecraft();
      
      let opts = {
          clientPackage: null,
      
          authorization: token.mclc(),
          root: "./instances/" + version,
          version: {
              number: version,
              type: "release"
          },
          memory: {
              max: "6G",
              min: "4G"
          }
      };
      console.log("Starting!");
      launcher.launch(opts);
    
      launcher.on('debug', (e: any) => console.log(e));
      launcher.on('data', (e: any) => console.log(e));
    });
})

ipcMain.handle("deleteInstance", (_, version) => {
  rimraf(path.join(__dirname, "../instances/" + version), function() { console.log("done"); });
});

ipcMain.on("createInstance", (name, version) => {
  if (store.get("firsti") == undefined) {
    store.set("firsti", true)
    localStorage.setItem("firstinstance", "true")
    fs.mkdir(path.join(__dirname, "../instances"), (err: any) => {
      if (err) {
        return console.error(err);
      }
      fs.mkdir(path.join(__dirname, "../instances/" + version), (err: any) => {
      if (err) {
        return console.error(err);
      }
      console.log("Directory created successfully!");
      });
    });
    
  } else {
    fs.mkdir(path.join(__dirname, "../instances/" + version), (err: any) => {
      if (err) {
        return console.error(err);
      }
      console.log("Directory created successfully!");
  });
}
})

app.whenReady().then(createWindow)
