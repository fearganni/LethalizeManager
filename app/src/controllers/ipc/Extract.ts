import { BrowserWindow, IpcMainEvent } from 'electron';
import * as extract from 'extract-zip';

export async function ExtractFile(
  event: IpcMainEvent,
  tmpPath: string,
  savePath: string,
  win: BrowserWindow | null
) {
  try {
    // set the progress bar i
    win?.setProgressBar(2);

    // Send updates to the client
    event.sender.send('extract-progress', {
      tmpPath,
      savePath,
      finished: false,
    });

    // Perform the unzip
    await extract(tmpPath, { dir: savePath });

    // Send updates to the client
    event.sender.send('extract-progress', {
      tmpPath,
      savePath,
      finished: true,
    });
  } catch (error: any) {
    console.error(`Error extracting ${tmpPath}:`, error);

    // Send updates to the client
    event.sender.send('extract-error', {
      tmpPath,
      savePath,
      error: error.message,
    });

    throw error;
  }
}
