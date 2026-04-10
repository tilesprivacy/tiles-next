/**
 * Extract PNG from wireframe.svg, composite the Tiles screen mark, output WebP for the hero.
 * Run `npm run generate:logos` first so `public/lighticon.png` exists.
 * Run: npm run generate:wireframe
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const svgPath = path.join(root, "public", "wireframe.svg")
const webpPath = path.join(root, "public", "wireframe.webp")
const logoPath = path.join(root, "public", "lighticon.png")

/** Screen crop in wireframe asset (3944×2564) — centers the mark on the laptop display */
const SCREEN = { left: 1554, top: 891, width: 820 }

const svg = fs.readFileSync(svgPath, "utf8")
const match = svg.match(/data:image\/png;base64,([^"]+)/)
if (!match) throw new Error("No base64 PNG found in wireframe.svg")
const baseBuffer = Buffer.from(match[1], "base64")

const meta = await sharp(baseBuffer).metadata()
if (!meta.width || !meta.height) throw new Error("Could not read wireframe dimensions")

const scaleX = meta.width / 3944
const scaleY = meta.height / 2564
const left = Math.round(SCREEN.left * scaleX)
const top = Math.round(SCREEN.top * scaleY)
const width = Math.round(SCREEN.width * scaleX)

let pipeline = sharp(baseBuffer)

if (fs.existsSync(logoPath)) {
  const overlay = await sharp(logoPath).resize(width, width).png().toBuffer()
  pipeline = pipeline.composite([{ input: overlay, left, top }])
} else {
  console.warn("Missing", logoPath, "— run npm run generate:logos first; wireframe WebP will omit screen logo.")
}

await pipeline.webp({ quality: 82, effort: 4 }).toFile(webpPath)
console.log("Wrote", webpPath)
