const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;

let mainWindow, settingsWindow;
let settingsOpen = false;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));

    // mainWindow.openDevTools();
}

function showSettingsWindow() {
    if (settingsOpen) {
        console.log("Settings window already open");
        return;
    }
    settingsOpen = true;
    settingsWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        parent: mainWindow,
        show: true
    });

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, "settings.html"),
        protocol: "file",
        slashes: true
    }));

    settingsWindow.on("closed", function () {
        settingsOpen = false;
    });
    // settingsWindow.openDevTools();

}

app.on("ready", createMainWindow);
ipc.on("openSettings", function (event) {
    showSettingsWindow();
});

// For macs
app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on("activate", () => {
    if (win1 === null) {
        createMainWindow();
    }
});
