import { BrowserWindow, ipcMain } from 'electron';

import { DownloadFile } from './ipc/Download';

export class IpcMain {
  win: BrowserWindow | null = null;

  constructor(window: BrowserWindow | null) {
    this.win = window;
  }

  listen(): void {
    // Create a download file listener
    ipcMain.on(
      'download-file',
      async (event, fileUrl, savePath) =>
        await DownloadFile(event, fileUrl, savePath, this.win)
    );

    // Create the extract file listener

    // Create the update file listener
  }
}
