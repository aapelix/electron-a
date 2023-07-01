import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import path from 'node:path'
const fs = require('fs');
const http = require('https');
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
  if (store.get("firsti") == true) {
  const folderPath = path.resolve(__dirname, "../instances")

  const folderContent = fs.readdirSync(folderPath)
  const folders = folderContent.filter((res: string) => fs.lstatSync(path.resolve(folderPath, res)).isDirectory())

  return folders;
} else {
  return false;
}})

ipcMain.handle("launchMc", (_, name) => {
  const version = store.get(name + ".version")
  const authManager = new Auth("select_account");
  const client = store.get(name + ".client")

  win?.hide();

  const tray = new Tray(path.join(__dirname, '../public/32x32.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        win?.show();
        win?.reload();
      }
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      }
    }
  ]))

    authManager.launch("raw").then(async (xboxManager: { getMinecraft: () => any; }) => {

      const token = await xboxManager.getMinecraft();
      
      if (client == "forge") {
      let opts = {
          clientPackage: null,
      
          authorization: token.mclc(),
          root: "./instances/" + name,
          version: {
              number: version,
              type: "release"
          },
          forge: "./instances/" + name + "/forge.jar",
          memory: {
              max: "6G",
              min: "4G"
          }
      };

        console.log("Starting!");
        launcher.launch(opts);

      } else if (client == "fabric") {
        let opts = {
          clientPackage: null,

          authorization: token.mclc(),
          root: "./instances/" + name,
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

      } else if (client == "vanilla") {
        let opts = {
          clientPackage: null,

          authorization: token.mclc(),
          root: "./instances/" + name,
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
      
      } else {
        console.log("Error: Client not found!")
      }
    });
})

ipcMain.handle("deleteInstance", async (_, name) => {
  fs.rmSync(path.join(__dirname, "../instances/" + name), { recursive: true, force: true });
  store.delete(name)
});

ipcMain.handle("clearStorage", () => {
  store.clear();
})

ipcMain.handle("firstlaunch", () => {
  if (store.get("firstlaunch") == undefined) {
      store.set("firstlaunch", true);
      return true;
  } else {
      return false;
  }
})

var download = function(url: any, dest: any) {
  var file = fs.createWriteStream(dest);
  http.get(url, function(response: { pipe: (arg0: any) => void; }) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log("Downloaded!");
    });
  }).on('error', function(err: { message: any; }) {
    fs.unlink(dest);
    console.log(err.message);
  });
}

ipcMain.handle("createInstance", async (_, args) => {

  const client = args.client;
  const version = args.version;
  const name = args.name;

   if (store.get("firsti") == undefined) {
     store.set("firsti", true)
     fs.mkdir(path.join(__dirname, "../instances"), (err: any) => {
       if (err) {
         return console.error(err);
       }
       fs.mkdir(path.join(__dirname, "../instances/" + name), (err: any) => {
         if (err) {
           return console.error(err);
         }
         store.set(name + ".version", version)
         store.set(name + ".client", client)
         let launcherVersion;

         if (version == "1.20.1") {
           launcherVersion = "47.0.35"
         } else if (version == "1.20") {
           launcherVersion = "46.0.14"
         } else if (version == "1.19.4") {
           launcherVersion = "45.1.0"
         } else if (version == "1.19.3") {
           launcherVersion = "44.1.0"
         } else if (version == "1.19.2") {
           launcherVersion = "43.2.14"
         } else if (version == "1.19.1") {
           launcherVersion = "42.0.9"
         } else if (version == "1.19") {
           launcherVersion = "41.1.0"
         } else if (version == "1.18.2") {
           launcherVersion = "40.2.0"
         } else if (version == "1.18.1") {
           launcherVersion = "39.1.0"
         } else if (version == "1.18") {
           launcherVersion = "38.0.17"
         } else if (version == "1.17.1") {
           launcherVersion = "37.0.17"
         } else if (version == "1.16.5") {
           launcherVersion = "36.2.34"
         } else if (version == "1.16.4") {
           launcherVersion = "35.1.37"
         } else if (version == "1.16.3") {
           launcherVersion = "34.1.0"
         } else if (version == "1.16.2") {
           launcherVersion = "33.0.61"
         } else if (version == "1.16.1") {
           launcherVersion = "32.0.108"
         } else if (version == "1.15.2") {
           launcherVersion = "31.2.57"
         } else if (version == "1.15.1") {
           launcherVersion = "30.0.51"
         } else if (version == "1.15") {
           launcherVersion = "29.0.4"
         } else if (version == "1.14.4") {
           launcherVersion = "28.2.26"
         } else if (version == "1.14.3") {
           launcherVersion = "27.0.60"
         } else if (version == "1.14.2") {
           launcherVersion = "26.0.63"
         } else if (version == "1.13.2") {
           launcherVersion = "25.0.223"
         } else if (version == "1.12.2") {
           launcherVersion = "14.23.2859"
         } else if (version == "1.12.1") {
           launcherVersion = "14.22.1.2478"
         } else if (version == "1.12") {
           launcherVersion = "14.21.1.2443"
         } else if (version == "1.11.2") {
           launcherVersion = "13.20.1.2588"
         } else if (version == "1.11.1") {
           launcherVersion = "13.19.1.2199"
         } else if (version == "1.10.2") {
           launcherVersion = "12.18.3.2511"
         } else if (version == "1.10") {
           launcherVersion = "12.18.0.2000"
         } else if (version == "1.9.4") {
           launcherVersion = "12.17.0.2317"
         } else if (version == "1.9") {
           launcherVersion = "12.16.1.1887"
         } else if (version == "1.8.9") {
           launcherVersion = "11.15.1.2318"
         } else if (version == "1.8.8") {
           launcherVersion = "11.15.0.1655"
         } else if (version == "1.8") {
           launcherVersion = "11.14.4.1577"
         } else if (version == "1.7.10") {
           launcherVersion = "10.13.4.1614"
         } else if (version == "1.7.2") {
           launcherVersion = "10.12.2.1161"
         } else if (version == "1.6.4") {
           launcherVersion = "9.11.1.1345"
         } else if (version == "1.6.3") {
           launcherVersion = "9.11.0.871"
         } else if (version == "1.6.2") {
           launcherVersion = "9.10.1.871"
         } else if (version == "1.6.1") {
           launcherVersion = "8.9.0.755"
         } else if (version == "1.5.2") {
           launcherVersion = "7.8.1.738"
         } else if (version == "1.5.1") {
           launcherVersion = "7.7.2.682"
         } else if (version == "1.5") {
           launcherVersion = "7.7.0.598"
         } else if (version == "1.4.7") {
           launcherVersion = "6.6.0.516"
         } else if (version == "1.4.6") {
           launcherVersion = "6.5.0.471"
         } else if (version == "1.4.5") {
           launcherVersion = "6.4.1.396"
         } else if (version == "1.4.4") {
           launcherVersion = "6.4.0.396"
         } else if (version == "1.4.2") {
           launcherVersion = "6.3.1.361"
         } else if (version == "1.3.2") {
           launcherVersion = "5.1.0.365"
         } else if (version == "1.3.1") {
           launcherVersion = "5.0.0.342"
         } else if (version == "1.2.5") {
           launcherVersion = "4.1.1.364"
         } else if (version == "1.2.4") {
           launcherVersion = ""
         } else if (version == "1.2.3") {
           launcherVersion = ""
         } else if (version == "1.2.2") {
           launcherVersion = ""
         } else if (version == "1.2.1") {
           launcherVersion = ""
         } else if (version == "1.1") {
           launcherVersion = ""
         } else if (version == "1.0") {
           launcherVersion = ""
         }

         if (client == "forge") {
           download("https://maven.minecraftforge.net/net/minecraftforge/forge/" + version + "-" + launcherVersion + "/forge-" + version + "-" + launcherVersion + "-installer.jar", path.join(__dirname, "../instances/" + name + "/forge.jar"))
         } else if (client == "fabric") {
           win?.webContents.send("error", "Fabric is not supported yet!");
         } else if (client == "quilt") {
             win?.webContents.send("error", "Quilt is not supported yet!");
         }
       });
     });
  
   } else {
     fs.mkdir(path.join(__dirname, "../instances/" + name), (err: any) => {
       if (err) {
         return console.error(err);
       }
       store.set(name + ".version", version)
       store.set(name + ".client", client)

       let launcherVersion;

       if (version == "1.20.1") {
         launcherVersion = "47.0.35"
       } else if (version == "1.20") {
         launcherVersion = "46.0.14"
       } else if (version == "1.19.4") {
         launcherVersion = "45.1.0"
       } else if (version == "1.19.3") {
         launcherVersion = "44.1.0"
       } else if (version == "1.19.2") {
         launcherVersion = "43.2.14"
       } else if (version == "1.19.1") {
         launcherVersion = "42.0.9"
       } else if (version == "1.19") {
         launcherVersion = "41.1.0"
       } else if (version == "1.18.2") {
         launcherVersion = "40.2.0"
       } else if (version == "1.18.1") {
         launcherVersion = "39.1.0"
       } else if (version == "1.18") {
         launcherVersion = "38.0.17"
       } else if (version == "1.17.1") {
         launcherVersion = "37.0.17"
       } else if (version == "1.16.5") {
         launcherVersion = "36.2.34"
       } else if (version == "1.16.4") {
         launcherVersion = "35.1.37"
       } else if (version == "1.16.3") {
         launcherVersion = "34.1.0"
       } else if (version == "1.16.2") {
         launcherVersion = "33.0.61"
       } else if (version == "1.16.1") {
         launcherVersion = "32.0.108"
       } else if (version == "1.15.2") {
         launcherVersion = "31.2.57"
       } else if (version == "1.15.1") {
         launcherVersion = "30.0.51"
       } else if (version == "1.15") {
         launcherVersion = "29.0.4"
       } else if (version == "1.14.4") {
         launcherVersion = "28.2.26"
       } else if (version == "1.14.3") {
         launcherVersion = "27.0.60"
       } else if (version == "1.14.2") {
         launcherVersion = "26.0.63"
       } else if (version == "1.13.2") {
         launcherVersion = "25.0.223"
       } else if (version == "1.12.2") {
         launcherVersion = "14.23.2859"
       } else if (version == "1.12.1") {
         launcherVersion = "14.22.1.2478"
       } else if (version == "1.12") {
         launcherVersion = "14.21.1.2443"
       } else if (version == "1.11.2") {
         launcherVersion = "13.20.1.2588"
       } else if (version == "1.11.1") {
         launcherVersion = "13.19.1.2199"
       } else if (version == "1.10.2") {
         launcherVersion = "12.18.3.2511"
       } else if (version == "1.10") {
         launcherVersion = "12.18.0.2000"
       } else if (version == "1.9.4") {
         launcherVersion = "12.17.0.2317"
       } else if (version == "1.9") {
         launcherVersion = "12.16.1.1887"
       } else if (version == "1.8.9") {
         launcherVersion = "11.15.1.2318"
       } else if (version == "1.8.8") {
         launcherVersion = "11.15.0.1655"
       } else if (version == "1.8") {
         launcherVersion = "11.14.4.1577"
       } else if (version == "1.7.10") {
         launcherVersion = "10.13.4.1614"
       } else if (version == "1.7.2") {
         launcherVersion = "10.12.2.1161"
       } else if (version == "1.6.4") {
         launcherVersion = "9.11.1.1345"
       } else if (version == "1.6.3") {
         launcherVersion = "9.11.0.871"
       } else if (version == "1.6.2") {
         launcherVersion = "9.10.1.871"
       } else if (version == "1.6.1") {
         launcherVersion = "8.9.0.755"
       } else if (version == "1.5.2") {
         launcherVersion = "7.8.1.738"
       } else if (version == "1.5.1") {
         launcherVersion = "7.7.2.682"
       } else if (version == "1.5") {
         launcherVersion = "7.7.0.598"
       } else if (version == "1.4.7") {
         launcherVersion = "6.6.0.516"
       } else if (version == "1.4.6") {
         launcherVersion = "6.5.0.471"
       } else if (version == "1.4.5") {
         launcherVersion = "6.4.1.396"
       } else if (version == "1.4.4") {
         launcherVersion = "6.4.0.396"
       } else if (version == "1.4.2") {
         launcherVersion = "6.3.1.361"
       } else if (version == "1.3.2") {
         launcherVersion = "5.1.0.365"
       } else if (version == "1.3.1") {
         launcherVersion = "5.0.0.342"
       } else if (version == "1.2.5") {
         launcherVersion = "4.1.1.364"
       } else if (version == "1.2.4") {
         launcherVersion = ""
       } else if (version == "1.2.3") {
         launcherVersion = ""
       } else if (version == "1.2.2") {
         launcherVersion = ""
       } else if (version == "1.2.1") {
         launcherVersion = ""
       } else if (version == "1.1") {
         launcherVersion = ""
       } else if (version == "1.0") {
         launcherVersion = ""
       }

       if (client == "forge") {
         download("https://maven.minecraftforge.net/net/minecraftforge/forge/" + version + "-" + launcherVersion + "/forge-" + version + "-" + launcherVersion + "-installer.jar", path.join(__dirname, "../instances/" + name + "/forge.jar"))
       } else if (client == "fabric") {
         win?.webContents.send("error", "Fabric is not supported yet!");
       }
 });
} 
})

app.whenReady().then(createWindow)
