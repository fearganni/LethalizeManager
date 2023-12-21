import { app, BrowserWindow, screen } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import { autoUpdater, UpdateDownloadedEvent } from 'electron-updater';
import { Client } from 'discord-rpc';

import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow | null = null;
let client: Client | null = null;
let startTimestamp: Date = new Date();
let discordRetryDuration: number = 15;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function connectDiscord(): any {
  if (client) {
    client.destroy();
  }

  client = new Client({
    transport: 'ipc',
  });

  client.on('ready', async () => {
    console.debug(
      `Successfully authorised as ${client?.user?.username}#${client?.user?.discriminator}`
    );
    onStartup();
  });

  client.once('close', () => {
    console.error(`Connection to Discord closed. Attempting to reconnect...`);
    console.debug(
      `Automatically retrying to connect, please wait ${discordRetryDuration} seconds...`
    );
    connectDiscord();
  });

  setTimeout(() => {
    client?.login({ clientId: '1186462656081698846' });
  }, discordRetryDuration * 1000);
}

function updatePresence(): any {
  console.log(
    `Successfully updated ${client?.user?.username}#${client?.user?.discriminator}'s Rich Presence!`
  );

  return client?.setActivity({
    details: 'Modifying my mods',
    largeImageKey: 'icon',
    largeImageText: 'Lethalize Manager',
    smallImageKey: 'featured',
    smallImageText: 'Made by @FearGanni',
    buttons: [
      {
        label: 'Check the github',
        url: 'https://github.com/fearganni/LethalizeManager',
      },
    ],
    startTimestamp: startTimestamp,
    instance: true,
  });
}

let initialTasks = [updatePresence],
  i = 0;

const onStartup = () => {
  initialTasks[i++]();
  if (i < initialTasks.length) {
    setTimeout(onStartup, 5 * 1000); // 5 seconds
  }
};

// Check for application updates
function checkUpdates(): void {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    console.log('Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.');
  });
  autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater. ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message =
      log_message +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')';

    win?.setProgressBar(progressObj.percent / 100);

    console.log(log_message);
  });
  autoUpdater.on('update-downloaded', (ev: UpdateDownloadedEvent) => {
    console.log('Update downloaded');

    setTimeout(function () {
      autoUpdater.quitAndInstall();
    }, 5000);
  });
}

initialize();
function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    center: true,
    width: size.width / 1.5,
    height: size.height / 1.5,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },

    autoHideMenuBar: true,
    backgroundMaterial: 'mica',
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  enable(win.webContents);

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    checkUpdates();
    connectDiscord();
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
