// Calculate a percentage of how much progress is left.
export function calculateProgress(receivedBytes: number, totalBytes: number) {
  return Math.round((receivedBytes / totalBytes) * 100);
}
