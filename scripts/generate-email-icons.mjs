import sharp from "sharp";
import { fileURLToPath } from "node:url";

const publicDirectory = new URL("../public/", import.meta.url);
const icons = [
  ...[
    "x",
    "bluesky",
    "linkedin",
    "discord",
    "github",
    "tangled",
    "huggingface",
  ].map((name) => ({ source: `email-social-${name}.png`, name, size: 40 })),
  { source: "icon-download-ffffff.svg", name: "download", size: 54 },
  { source: "icon-manual-111111.svg", name: "manual", size: 54 },
  { source: "icon-discord-111111.svg", name: "discord-cta", size: 54 },
];

// A single transparent, neutral glyph stays legible even when a mail client
// recolors the email but ignores image swaps, filters, or dark-mode CSS.
// #888 has at least 3:1 non-text contrast on #fbfbfb, #333, and #1f1f1f.
for (const { source, name, size } of icons) {
  const { data, info } = await sharp(
    fileURLToPath(new URL(source, publicDirectory)),
  )
    .resize(size, size, { fit: "contain", background: "transparent" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let offset = 0; offset < data.length; offset += info.channels) {
    data[offset] = data[offset + 1] = data[offset + 2] = 136;
  }

  // Recolored channels are straight RGB, even if resizing premultiplied the input.
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toFile(fileURLToPath(new URL(`email-icon-${name}.png`, publicDirectory)));
}

console.log(`Generated ${icons.length} transparent email icons.`);
