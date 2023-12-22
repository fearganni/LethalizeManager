import { BrowserWindow } from 'electron';
import { autoUpdater, UpdateDownloadedEvent } from 'electron-updater';

export class AppUpdates {
  win: BrowserWindow | null = null;

  constructor(window: BrowserWindow | null) {
    this.win = window;
  }

  check(): void {
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

      this.win?.setProgressBar(progressObj.percent / 100);

      console.log(log_message);
    });

    autoUpdater.on('update-downloaded', (ev: UpdateDownloadedEvent) => {
      console.log('Update downloaded');

      setTimeout(function () {
        autoUpdater.quitAndInstall();
      }, 5000);
    });
  }
}
