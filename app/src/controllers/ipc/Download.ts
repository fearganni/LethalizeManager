import { BrowserWindow, IpcMainEvent } from 'electron';
import fs from 'fs';
import axios from 'axios';

import { calculateProgress, temporaryLocation } from '../../modules';

export async function DownloadFile(
  event: IpcMainEvent,
  fileUrl: string,
  savePath: string,
  win: BrowserWindow | null
) {
  // Create a temporary location for our saved files
  const tmpLoc = temporaryLocation(savePath);

  try {
    // Download the file
    const file = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream',
    });

    // Write the file into the temporary location
    const write = fs.createWriteStream(tmpLoc);
    file.data.pipe(write);

    // Keep track of download progress
    let receivedBytes = 0;
    file.data.on('data', (chunk: any[]) => {
      // How many bytes have we gotten so far?
      receivedBytes += chunk.length;

      // Calculate the progress as a percentage
      const progress = calculateProgress(
        receivedBytes,
        parseInt(file.headers['Content-Length'] as string)
      );

      // Set the browser downloading state
      win?.setProgressBar(progress / 100);

      // Send updates to the client
      event.sender.send('download-progress', {
        fileUrl,
        savePath,
        progress,
        finished: false,
      });
    });

    // Once the file is complete
    write.on('finish', () => {
      event.sender.send('download-progress', {
        fileUrl,
        savePath,
        progress: 100,
        finished: true,
      });
    });

    // Handle any stream errors
    write.on('error', (err) => {
      event.sender.send('download-error', {
        fileUrl,
        savePath,
        error: err.message,
      });

      fs.unlink(tmpLoc, () => {}); // Delete the temporary file on error
    });
  } catch (error: any) {
    event.sender.send('download-error', {
      fileUrl,
      savePath,
      error: error.message,
    });
  }
}
