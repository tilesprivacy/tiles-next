# Landing page demo

The hero uses the supplied 40-second screen recording, without audio. The layout and mobile visibility rules are unchanged.

| Asset | Encoding | Bytes |
| --- | --- | ---: |
| `tiles-demo.00969530.mp4` | H.264 Main, level 4.0, 8-bit YUV 4:2:0 | 1,000,086 |
| `tiles-demo.ed5052d2.webm` | VP9, 8-bit YUV 4:2:0 | 1,119,126 |

Both versions are 1280 × 832 at a constant 30 fps. The MP4 is selected first because it is smaller. Its metadata precedes the media data (`faststart`), so playback does not need to wait for the complete download. The previous MP4 was 9,379,697 bytes.

Autoplay is muted and inline, and native looping remains enabled. Browsers may still suspend playback or require a user gesture. The player resumes on focus, visibility, and page restoration, and exposes a Play demo button if paused. Failed requests can be retried. Unsupported MP4 and runtime decoding failures can fall back to WebM.

## Re-encode

Use the original recording, not an already compressed web copy. These commands require FFmpeg with libx264 and libvpx-vp9:

```sh
ffmpeg -i tilesdemo.mov -map 0:v:0 -an \
  -vf 'fps=30,scale=1280:-2:flags=lanczos,setsar=1' \
  -c:v libx264 -preset slow -crf 23 -profile:v main -level 4.0 \
  -pix_fmt yuv420p -movflags +faststart -map_metadata -1 tiles-demo.mp4

ffmpeg -i tilesdemo.mov -map 0:v:0 -an \
  -vf 'fps=30,scale=1280:-2:flags=lanczos,setsar=1' \
  -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -cpu-used 3 \
  -pix_fmt yuv420p -map_metadata -1 tiles-demo.webm
```

After encoding, append the first eight SHA-256 characters to each filename. Update the sources in `components/home-hero-video.tsx` and the exact cache-header paths in `next.config.mjs` together. Never overwrite a hashed asset with different bytes: these URLs have one-year immutable caching. The site service worker leaves video requests to the browser, preserving byte-range delivery.

## Browser regression check

Install Playwright in a separate tooling directory if it is not already available, then install its Firefox and WebKit engines. The check uses installed Google Chrome for Chromium. Set `PLAYWRIGHT_MODULE` to the Playwright package directory when using an external installation.

```sh
node scripts/check-hero-video.mjs http://localhost:3000
node scripts/check-hero-video.mjs https://your-preview.example
```

The check covers decoded frames, a complete unaccelerated loop, byte-range responses, cache headers, reload with the production service worker, tablet playback, preserved mobile layout, focus recovery, a failed MP4 request, simulated autoplay denial, and retry after both media requests fail. Also inspect the actual in-app browser: its lifecycle can pause media even when a standalone browser plays normally.
