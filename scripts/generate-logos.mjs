/**
 * Rasterize the Tiles mark for PNG favicons, nav, OG, and email.
 * Source geometry matches `public/icon.svg` (rounded-square T).
 * Run: npm run generate:logos
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const publicDir = path.join(root, "public")

const PATHS = `      <path fill="CURRENT_FG"
        d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" />
      <path fill="CURRENT_FG"
        d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" />`

function svgForMark({ bg, fg }) {
  return `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="37" fill="${bg}"/>
  <g style="transform: scale(95%); transform-origin: center">
${PATHS.replaceAll("CURRENT_FG", fg)}
  </g>
</svg>`
}

async function pngFromSvg(svgString, size) {
  return sharp(Buffer.from(svgString)).resize(size, size).png().toBuffer()
}

async function writePng(buffer, name) {
  const dest = path.join(publicDir, name)
  await fs.promises.writeFile(dest, buffer)
  console.log("Wrote", dest)
}

const onLight = svgForMark({ bg: "#000000", fg: "#FFFFFF" })
const onDark = svgForMark({ bg: "#FFFFFF", fg: "#000000" })

const size1024 = 1024
const size180 = 180
const size32 = 32

const bufLight1024 = await pngFromSvg(onLight, size1024)
const bufDark1024 = await pngFromSvg(onDark, size1024)

await writePng(bufLight1024, "lighticon.png")
await writePng(bufLight1024, "light.png")
await writePng(bufDark1024, "grey.png")
await writePng(bufLight1024, "logo.png")
await writePng(bufLight1024, "og-logo.png")
await writePng(await pngFromSvg(onLight, size180), "apple-icon.png")
await writePng(await pngFromSvg(onLight, size32), "icon-light-32x32.png")
await writePng(await pngFromSvg(onDark, size32), "icon-dark-32x32.png")
