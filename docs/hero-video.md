# Landing page demo

The hero uses the complete replacement recording from September 9, 2026, without audio. Its playback duration is 107.767 seconds.

The layout follows Ollama's 24 px side gutters and 48 px desktop column gap, with 80 px of clearance below the site header. The side-by-side columns use a 46:54 split, making the video about 12% smaller than the reference proportions for a more balanced pairing with the copy. Below 768 px, the video sits beneath the copy with a 40 px gap and 48 px header clearance. The next content section starts 64 px below the mobile hero and 80 px below the desktop hero. Short phones scale the full recording to the remaining viewport height without cropping it. The download button and centered body-content stack are unchanged.

| Asset | Encoding | Bytes |
| --- | --- | ---: |
| `tiles-demo.db8739e8.mp4` | H.264 Main, level 4.0, 8-bit YUV 4:2:0 | 2,925,926 |
| `tiles-demo.65c19254.webm` | VP9, 8-bit YUV 4:2:0 | 3,323,177 |
| `tiles-demo-poster.c215d606.webp` | WebP still from 12 seconds into the recording | 68,970 |

Both video versions are 1280 × 832 at a constant 30 fps. The MP4 is selected first because it is smaller. Its metadata precedes the media data (`faststart`), so playback does not need to wait for the complete download. The original recording was 82,699,827 bytes. The MP4 is 96.5% smaller, with no cuts or speed changes.

Autoplay is muted and inline, and native looping remains enabled. Browsers may still suspend playback or require a user gesture. The player resumes on focus, visibility, and page restoration, and exposes a Play demo button if paused. Failed requests can be retried. Unsupported MP4 and runtime decoding failures can fall back to WebM.

## Re-encode

Use the original recording, not an already compressed web copy. These commands require FFmpeg with libx264 and libvpx-vp9:

```sh
ffmpeg -i source.mov -map 0:v:0 -an \
  -vf 'fps=30,scale=1280:-2:flags=lanczos,setsar=1' \
  -c:v libx264 -preset slow -crf 23 -profile:v main -level 4.0 \
  -pix_fmt yuv420p -movflags +faststart -map_metadata -1 tiles-demo.mp4

ffmpeg -i source.mov -map 0:v:0 -an \
  -vf 'fps=30,scale=1280:-2:flags=lanczos,setsar=1' \
  -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -cpu-used 3 \
  -pix_fmt yuv420p -map_metadata -1 tiles-demo.webm

ffmpeg -ss 12 -i source.mov -frames:v 1 \
  -vf 'scale=1280:-2:flags=lanczos,setsar=1' \
  -c:v libwebp -quality 82 -map_metadata -1 tiles-demo-poster.webp
```

After encoding, append the first eight SHA-256 characters to each filename, including the poster. Update the sources in `components/home-hero-video.tsx` and the exact cache-header paths in `next.config.mjs` together. Never overwrite a hashed asset with different bytes: these URLs have one-year immutable caching. The site service worker leaves video requests to the browser, preserving byte-range delivery.

## Browser regression check

Install Playwright in a separate tooling directory if it is not already available, then install its Firefox and WebKit engines. The check uses installed Google Chrome for Chromium. Set `PLAYWRIGHT_MODULE` to the Playwright package directory when using an external installation.

```sh
node scripts/check-hero-video.mjs http://localhost:3000
node scripts/check-hero-video.mjs https://your-preview.example
```

The check covers decoded frames, the replacement recording's duration, a complete unaccelerated loop, byte-range responses, cache headers, reload with the production service worker, desktop/tablet spacing, visible inline playback on phone-sized viewports, focus recovery, a failed MP4 request, simulated autoplay denial, and retry after both media requests fail. The retry check keeps requests blocked until a trusted click, avoiding a race with automatic format recovery.

Phone checks include five fresh mobile sessions, 24 px gutters, header clearance, the 40 px copy-to-video gap, short and tall portrait layouts, rotation, and returning to portrait. These are browser-emulated checks, not a substitute for testing a physical phone, where Low Power Mode or data-saving settings can block autoplay. Also inspect the actual in-app browser: its lifecycle can pause media even when a standalone browser plays normally.
