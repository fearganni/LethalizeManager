import os from 'os';
import path from 'path';

// Create a temporary file location for downloaded files
export function temporaryLocation(fileName: string) {
  return path.join(os.tmpdir(), fileName);
}
