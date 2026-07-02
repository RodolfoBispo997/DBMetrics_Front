export function formatVersion(version: string): string {
  const match = version.match(/^(PostgreSQL\s+\d+(\.\d+)?)/);

  return match ? match[1] : version;
}
