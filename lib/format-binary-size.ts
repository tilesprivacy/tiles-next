export function formatBinarySize(
  bytes: number,
  options: { unknownLabel?: string } = {}
): string {
  const { unknownLabel = "Unknown" } = options

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return unknownLabel
  }

  const kb = bytes / 1024
  const mb = kb / 1024
  const gb = mb / 1024

  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`
  }
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`
  }
  if (kb >= 1) {
    return `${kb.toFixed(2)} KB`
  }

  return `${bytes.toFixed(0)} B`
}
