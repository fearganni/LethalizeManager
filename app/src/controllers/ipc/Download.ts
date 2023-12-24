import { BrowserWindow, IpcMainEvent } from 'electron';
import * as fs from 'fs';
import axios from 'axios';

import { calculateProgress, temporaryLocation } from '../../modules';

export async function DownloadFile(
  event: IpcMainEvent,
  fileUrl: string,
  fileName: string,
  win: BrowserWindow | null
) {
  // Create a temporary location for our saved files
  const tmpLoc = temporaryLocation(fileName);
  console.log(tmpLoc);

  try {
    win?.setProgressBar(0);

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
        parseInt(file.headers['content-length'])
      );

      // Set the browser downloading state
      win?.setProgressBar(progress / 100);

      // Send updates to the client
      event.sender.send('download-progress', {
        fileUrl,
        fileName,
        tmpLoc,
        progress,
        finished: false,
      });
    });

    // Once the file is complete
    write.on('finish', () => {
      // Remove progress bar
      win?.setProgressBar(-1);

      // Let the client know the download is 100%
      event.sender.send('download-progress', {
        fileUrl,
        fileName,
        tmpLoc,
        progress: 100,
        finished: true,
      });
    });

    // Handle any stream errors
    write.on('error', (err) => {
      win?.setProgressBar(2, {
        mode: 'error',
      });

      event.sender.send('download-error', {
        fileUrl,
        fileName,
        tmpLoc,
        error: err.message,
      });

      // Delete the temporary file on error
      fs.unlink(tmpLoc, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
      });
    });
  } catch (error: any) {
    win?.setProgressBar(2, {
      mode: 'error',
    });

    event.sender.send('download-error', {
      fileUrl,
      fileName,
      tmpLoc,
      error: error.message,
    });

    // Delete the temporary file on error
    fs.unlink(tmpLoc, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    });
  }
}
