export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const sign = bytes < 0 ? "-" : "";
  const absoluteBytes = Math.abs(bytes);
  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.floor(Math.log(absoluteBytes) / Math.log(1024));
  const value = absoluteBytes / Math.pow(1024, index);

  return `${sign}${value.toFixed(2)} ${units[index]}`;
}
