import { BrowserWindow, ipcMain } from 'electron';

import { DownloadFile, ExtractFile } from './ipc';

export class IpcMain {
  win: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.win = window;
  }

  listen(): void {
    // Create a download file listener
    ipcMain.on(
      'download-file',
      async (event, fileUrl, fileName) =>
        await DownloadFile(event, fileUrl, fileName, this.win)
    );

    // Create the extract file listener
    ipcMain.on(
      'extract-file',
      async (event, tmpPath, savePath) =>
        await ExtractFile(event, tmpPath, savePath, this.win)
    );

    // Create the update file listener
  }
}
