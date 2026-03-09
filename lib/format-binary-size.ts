export function formatBinarySize(
  bytes: number,
  options: { unknownLabel?: string } = {}
): string {
  const { unknownLabel = "Unknown" } = options

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return unknownLabel
  }

  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}
