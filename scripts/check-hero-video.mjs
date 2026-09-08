// Requires Playwright and its browser engines. Set PLAYWRIGHT_MODULE to an
// existing installation if Playwright is not installed in this checkout.
// Usage: node scripts/check-hero-video.mjs http://localhost:3000
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = process.argv[2] || 'http://localhost:3000'
const viewport = { width: 1440, height: 1000 }
const selector = 'video[aria-label="Tiles desktop app demo"]'

async function playing(page, extension = 'mp4') {
  await page.waitForFunction(({ selector, extension }) => {
    const video = document.querySelector(selector)
    return video && !video.paused && video.currentTime > 0.1 &&
      video.readyState >= 2 && video.currentSrc.endsWith(`.${extension}`)
  }, { selector, extension }, { timeout: 20000 })
  const state = await page.locator(selector).evaluate(video => ({
    error: video.error?.message,
    loop: video.loop,
    muted: video.muted,
    inline: video.hasAttribute('playsinline'),
    width: video.videoWidth,
    height: video.videoHeight,
    duration: video.duration,
  }))
  assert.equal(state.error, undefined)
  assert.equal(state.loop, true)
  assert.equal(state.muted, true)
  assert.equal(state.inline, true)
  assert.equal(state.width, 1280)
  assert.equal(state.height, 832)
  assert.ok(Math.abs(state.duration - 40.033) < 0.1)
  // Check decoded frames, not just an advancing clock or the poster image.
  await page.locator(selector).evaluate(video => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('No decoded video frames')), 5000)
    let frames = 0
    const frame = () => {
      if (++frames === 10) {
        clearTimeout(timer)
        resolve()
      } else video.requestVideoFrameCallback(frame)
    }
    video.requestVideoFrameCallback(frame)
  }))
}

async function check(engine) {
  const browser = await engine.launch(engine === chromium ? { channel: 'chrome' } : {})
  try {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(origin, { waitUntil: 'domcontentloaded' })
    await playing(page)
    assert.equal(await page.getByRole('button', { name: 'Play demo', exact: true }).count(), 0)

    const sources = await page.locator(`${selector} source`).evaluateAll(nodes => nodes.map(node => node.src))
    for (const src of sources) {
      const response = await context.request.get(src, { headers: { Range: 'bytes=0-1023' } })
      assert.equal(response.status(), 206, src)
      assert.match(response.headers()['content-range'], /^bytes 0-1023\//)
      assert.equal((await response.body()).length, 1024)
      assert.match(response.headers()['content-type'], /video\/(mp4|webm)/)
      assert.match(response.headers()['cache-control'], /immutable/)
    }

    // Allow a full, unaccelerated cycle to catch late decode or looping errors.
    const loop = await page.locator(selector).evaluate(video => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { cleanup(); reject(new Error('Video did not loop')) }, 47000)
      let previous = video.currentTime
      const progress = () => {
        const current = video.currentTime
        if (previous > video.duration - 1 && current < 1) {
          cleanup()
          resolve({ from: previous, to: current })
        }
        previous = current
      }
      const failed = () => { cleanup(); reject(new Error(video.error?.message || 'Playback failed')) }
      function cleanup() {
        clearTimeout(timer)
        video.removeEventListener('timeupdate', progress)
        video.removeEventListener('error', failed)
      }
      video.addEventListener('timeupdate', progress)
      video.addEventListener('error', failed)
    }))
    await playing(page)
    console.log(engine.name(), 'full playback and natural loop', loop)

    // A paused demo remains actionable, and regaining focus resumes playback.
    await page.locator(selector).evaluate(video => video.pause())
    await page.getByRole('button', { name: 'Play demo', exact: true }).waitFor()
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await playing(page)

    // Reload also tests a returning visitor after the production worker claims.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await playing(page)
    console.log(engine.name(), 'reload, focus recovery, service worker',
      await page.evaluate(() => navigator.serviceWorker?.controller?.scriptURL || 'none (development)'))
    await page.setViewportSize({ width: 768, height: 1024 })
    assert.equal(await page.locator(selector).isVisible(), true)
    await playing(page)
    await page.setViewportSize({ width: 390, height: 844 })
    assert.equal(await page.locator(selector).isVisible(), false, 'Preserve the existing mobile layout')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.deepEqual(errors, [])
    await context.close()

    // A failed MP4 request must select the real, decodable WebM alternative.
    const fallback = await browser.newContext({ viewport, serviceWorkers: 'block' })
    await fallback.route('**/tiles-demo.*.mp4', route => route.abort())
    const fallbackPage = await fallback.newPage()
    await fallbackPage.goto(origin, { waitUntil: 'domcontentloaded' })
    await playing(fallbackPage, 'webm')
    await fallback.close()

    // Simulate a browser requiring a trusted user gesture for autoplay.
    const blocked = await browser.newContext({ viewport, serviceWorkers: 'block' })
    await blocked.addInitScript(() => {
      const original = HTMLMediaElement.prototype.play
      let allowed = false
      document.addEventListener('click', event => {
        if (event.isTrusted && event.target.closest('button')) allowed = true
      }, true)
      document.addEventListener('play', event => {
        if (!allowed && event.target instanceof HTMLVideoElement) event.target.pause()
      }, true)
      HTMLMediaElement.prototype.play = function () {
        return allowed ? original.call(this) : Promise.reject(new DOMException('Autoplay blocked by test', 'NotAllowedError'))
      }
    })
    const blockedPage = await blocked.newPage()
    await blockedPage.goto(origin, { waitUntil: 'domcontentloaded' })
    await blockedPage.getByRole('button', { name: 'Play demo', exact: true }).click()
    await playing(blockedPage)
    await blocked.close()

    const unavailable = await browser.newContext({ viewport, serviceWorkers: 'block' })
    await unavailable.route('**/tiles-demo.*', route => route.abort())
    const retryPage = await unavailable.newPage()
    await retryPage.goto(origin, { waitUntil: 'domcontentloaded' })
    await retryPage.getByRole('button', { name: 'Retry demo', exact: true }).waitFor()
    await unavailable.unroute('**/tiles-demo.*')
    await retryPage.getByRole('button', { name: 'Retry demo', exact: true }).click()
    await playing(retryPage)
    await unavailable.close()
    console.log(engine.name(), 'PASS: delivery, playback, loop, responsive layout, format fallback, autoplay fallback, retry')
  } finally {
    await browser.close()
  }
}

const results = await Promise.allSettled([chromium, firefox, webkit].map(check))
for (const result of results) {
  if (result.status === 'rejected') {
    console.error(result.reason)
    process.exitCode = 1
  }
}
