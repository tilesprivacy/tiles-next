/**
 * One-off script: extract PNG from wireframe.svg and output WebP for the hero.
 * Run: npm run generate:wireframe
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "wireframe.svg");
const webpPath = path.join(root, "public", "wireframe.webp");

const svg = fs.readFileSync(svgPath, "utf8");
const match = svg.match(/data:image\/png;base64,([^"]+)/);
if (!match) throw new Error("No base64 PNG found in wireframe.svg");
const buffer = Buffer.from(match[1], "base64");

await sharp(buffer)
  .webp({ quality: 82, effort: 4 })
  .toFile(webpPath);
console.log("Wrote", webpPath);
