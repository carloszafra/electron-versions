const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { autoUpdater } = require('electron-updater');
const menu = require('./menu');
const path = require("path");
const fs = require("fs");

let win;




async function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        }
    });

    // Load app
    win.loadFile("index.html");

    // rest of code..
    Menu.setApplicationMenu(menu);

    autoUpdater.checkForUpdatesAndNotify();
}

app.on("ready", createWindow);

ipcMain.on("toMain", (event, args) => {
    fs.readFile("path/to/file", (error, data) => {
        // Do something with file contents

        // Send result back to renderer process
      //  win.webContents.send("fromMain", responseObj);
    });
});