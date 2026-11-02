// QR code for the share link, drawn as one SVG path. It matches the code the
// viewer showed before (react-qr-code, level M): the same byte encoding and
// the same choice of mask, which that library scores differently from the
// `qrcode` package's own pick.
import QRCode from "qrcode"

export interface QrMatrix {
  size: number
  /** Dark modules as horizontal runs, in module units. */
  path: string
}

type Modules = { size: number; get: (row: number, col: number) => number | boolean }

// Penalty from the original QR generator react-qr-code descends from. The
// format and version areas are scored as light, as it did.
function penalty(modules: Modules, reserved: (row: number, col: number) => boolean): number {
  const n = modules.size
  const dark = (r: number, c: number) => !reserved(r, c) && !!modules.get(r, c)
  let score = 0

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      let same = 0
      const d = dark(r, c)
      for (let dr = -1; dr <= 1; dr++) {
        if (r + dr < 0 || r + dr >= n) continue
        for (let dc = -1; dc <= 1; dc++) {
          if (c + dc < 0 || c + dc >= n || (dr === 0 && dc === 0)) continue
          if (d === dark(r + dr, c + dc)) same++
        }
      }
      if (same > 5) score += 3 + same - 5
    }
  }
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const count = +dark(r, c) + +dark(r + 1, c) + +dark(r, c + 1) + +dark(r + 1, c + 1)
      if (count === 0 || count === 4) score += 3
    }
  }
  const finderLike = (at: (i: number) => boolean) => at(0) && !at(1) && at(2) && at(3) && at(4) && !at(5) && at(6)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n - 6; c++) if (finderLike((i) => dark(r, c + i))) score += 40
  }
  for (let c = 0; c < n; c++) {
    for (let r = 0; r < n - 6; r++) if (finderLike((i) => dark(r + i, c))) score += 40
  }
  let darkCount = 0
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) darkCount++
  return score + (Math.abs((100 * darkCount) / n / n - 50) / 5) * 10
}

function formatAndVersionAreas(n: number, version: number) {
  return (r: number, c: number) => {
    // Format information around the finder patterns, and the fixed dark module.
    if (r === 8 && (c <= 8 || c >= n - 8) && c !== 6) return true
    if (c === 8 && (r <= 8 || r >= n - 8) && r !== 6) return true
    // Version information, from version 7.
    if (version >= 7 && ((r < 6 && c >= n - 11 && c < n - 8) || (c < 6 && r >= n - 11 && r < n - 8))) return true
    return false
  }
}

export function qrMatrix(text: string): QrMatrix {
  const segments = [{ data: new TextEncoder().encode(text), mode: "byte" as const }]
  let best: ReturnType<typeof QRCode.create> | null = null
  let bestScore = Infinity

  for (let mask = 0; mask < 8; mask++) {
    const code = QRCode.create(segments, { errorCorrectionLevel: "M", maskPattern: mask as QRCode.QRCodeMaskPattern })
    const score = penalty(code.modules, formatAndVersionAreas(code.modules.size, code.version))
    if (score < bestScore) {
      best = code
      bestScore = score
    }
  }

  const { modules } = best!
  let path = ""
  for (let r = 0; r < modules.size; r++) {
    for (let c = 0; c < modules.size; c++) {
      if (!modules.get(r, c)) continue
      let end = c
      while (end + 1 < modules.size && modules.get(r, end + 1)) end++
      path += `M${c} ${r}h${end - c + 1}v1H${c}z`
      c = end
    }
  }
  return { size: modules.size, path }
}
