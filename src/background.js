"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
const { spawn } = require("child_process");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
app.commandLine.appendSwitch(
  "disable-features",
  "same-site-by-default-cookies"
);
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true, //process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,
      webSecurity: false,
      devTools: false,
      webviewTag: true,
    },
  });

  // win.webContents.openDevTools();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  ipcMain.on("getPrinterList", (event) => {
    //在主线程中获取打印机列表
    const list = win.webContents.getPrinters();

    //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
    win.webContents.send("getPrinterList", list);
  });

  //tts在win7上不可用，可能是阉割了，也可能是命令行在win7上有问题
  // ipcMain.on("tts-play", (_, message) => {
  //   const child = spawn("powershell.exe", [
  //     "-command",
  //     `Add-Type -AssemblyName System.speech; $synth = New-Object -TypeName System.Speech.Synthesis.SpeechSynthesizer; $synth.Speak('${message}');`,
  //   ]);

  //   child.on("error", (err) => {
  //     console.error(err);
  //   });

  //   child.on("close", (code) => {
  //     console.log(`子进程已退出，返回代码 ${code}`);
  //   });
  // });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
