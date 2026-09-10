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
const phoneViewports = [
  { width: 320, height: 568 },
  { width: 375, height: 547 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]

async function bannerDoesNotResizeDemo(page) {
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForFunction(() =>
    parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--site-announcement-offset')) > 0)
  const before = await page.locator('.minimal-hero-video-frame').boundingBox()

  await page.evaluate(() => scrollTo(0, 1))
  await page.waitForFunction(() =>
    parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--site-announcement-offset')) === 0)
  const after = await page.locator('.minimal-hero-video-frame').boundingBox()

  assert.ok(before && after, 'Demo frame must remain measurable')
  assert.ok(Math.abs(before.width - after.width) < 1,
    'Collapsing the announcement must not change the demo width')
  assert.ok(Math.abs(before.height - after.height) < 1,
    'Collapsing the announcement must not change the demo height')

  await page.evaluate(() => scrollTo(0, 0))
}

async function phoneLayout(page) {
  assert.equal(await page.locator(selector).isVisible(), true, 'Phone demo must be visible')
  // Returning from landscape scrolls back to the top and animates the
  // announcement/header into place. Measure the settled layout, not a frame
  // partway through that existing 140ms transition.
  const snapshot = await page.waitForFunction(selector => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect().toJSON()
    const layout = {
      frame: rect('.minimal-hero-video-frame'),
      demo: rect('.minimal-hero-demo'),
      video: rect(selector),
      copy: rect('.minimal-hero-copy'),
      hero: rect('.minimal-hero'),
      header: rect('.minimal-topbar'),
      gap: parseFloat(getComputedStyle(document.querySelector('.minimal-hero')).gap),
      gutter: parseFloat(getComputedStyle(document.querySelector('.minimal-hero')).paddingLeft),
      overflow: document.documentElement.scrollWidth > innerWidth,
      viewport: { width: innerWidth, height: innerHeight },
    }
    const announcementHeight = rect('.site-announcement').height
    return document.documentElement.dataset.siteAnnouncementReady === 'true' &&
      Math.abs(scrollY) < 1 &&
      Math.abs(layout.header.top - announcementHeight) < 1 &&
      Math.abs(layout.copy.top - layout.header.bottom - 48) < 1 && layout
  }, selector, { timeout: 5000 })
  // Return the same settled snapshot rather than measuring again after another
  // animation frame, which can race with WebKit's post-rotation scroll restore.
  const layout = await snapshot.jsonValue()
  await snapshot.dispose()
  assert.equal(layout.overflow, false, 'No horizontal overflow on phones')
  assert.ok(layout.copy.top >= layout.header.bottom, 'Hero clears the mobile header')
  assert.equal(layout.gap, 40, 'Use the reference mobile gap')
  assert.equal(layout.gutter, 24, 'Use consistent side gutters')
  assert.ok(Math.abs(layout.copy.top - layout.header.bottom - 48) < 1, 'Keep mobile header clearance')
  assert.ok(Math.abs(layout.frame.top - layout.copy.bottom - 40) < 1, 'Keep space above the demo')
  assert.ok(Math.abs(layout.demo.width - layout.frame.width) < 1,
    'Caption wrapper must not change the demo width')
  assert.ok(Math.abs(layout.demo.height - layout.frame.height) < 1,
    'Caption wrapper must not shrink the demo height')
  assert.ok(layout.frame.width >= 120 && layout.frame.height >= 75, 'Demo must not collapse')
  assert.ok(layout.frame.left >= 0 && layout.frame.right <= layout.viewport.width)
  assert.ok(layout.frame.bottom <= layout.viewport.height, 'Entire demo fits the phone viewport')
  assert.ok(layout.hero.bottom <= layout.viewport.height + 1, 'Mobile hero fits one viewport')
  assert.ok(Math.abs(layout.video.width / layout.video.height - 1280 / 832) < 0.04,
    'Show the full recording without cropping')
  await bannerDoesNotResizeDemo(page)
  await playing(page)
}

async function playing(page, extension = 'mp4') {
  await page.waitForFunction(({ selector, extensions }) => {
    const video = document.querySelector(selector)
    return video && !video.paused && video.currentTime > 0.1 &&
      video.readyState >= 2 && extensions.some(ext => video.currentSrc.endsWith(`.${ext}`))
  }, { selector, extensions: [extension].flat() }, { timeout: 20000 })
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
  assert.ok(Math.abs(state.duration - 107.767) < 0.1, 'Load the replacement recording')
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
      // Use the same browser session as playback. Out-of-browser HTTP clients
      // can hit deployment protection even when the actual video plays.
      const response = await page.evaluate(async src => {
        const result = await fetch(src, { headers: { Range: 'bytes=0-1023' } })
        return {
          status: result.status,
          headers: Object.fromEntries(result.headers.entries()),
          bytes: (await result.arrayBuffer()).byteLength,
        }
      }, src)
      assert.equal(response.status, 206, src)
      assert.match(response.headers['content-range'], /^bytes 0-1023\//)
      assert.equal(response.bytes, 1024)
      assert.match(response.headers['content-type'], /video\/(mp4|webm)/)
      assert.match(response.headers['cache-control'], /immutable/)
    }

    // Allow a full, unaccelerated cycle to catch late decode or looping errors.
    const loop = await page.locator(selector).evaluate(video => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { cleanup(); reject(new Error('Video did not loop')) }, (video.duration + 7) * 1000)
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
    for (const width of [600, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1024 })
      const { demoWidth, frameWidth } = await page.evaluate(() => ({
        demoWidth: document.querySelector('.minimal-hero-demo').getBoundingClientRect().width,
        frameWidth: document.querySelector('.minimal-hero-video-frame').getBoundingClientRect().width,
      }))
      assert.ok(Math.abs(demoWidth - frameWidth) < 1,
        `Caption wrapper must preserve the demo width at ${width}px`)
      await bannerDoesNotResizeDemo(page)
    }
    for (const width of [768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1024 })
      const layout = await page.evaluate(() => {
        const copy = document.querySelector('.minimal-hero-copy').getBoundingClientRect()
        const frame = document.querySelector('.minimal-hero-video-frame').getBoundingClientRect()
        const header = document.querySelector('.minimal-topbar').getBoundingClientRect()
        return {
          leftMargin: copy.left,
          rightMargin: innerWidth - frame.right,
          gap: frame.left - copy.right,
          clearance: Math.min(copy.top, frame.top) - header.bottom,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }
      })
      assert.ok(Math.abs(layout.leftMargin - layout.rightMargin) < 1, 'Center the hero with balanced outer margins')
      assert.equal(layout.gap, 48)
      assert.ok(Math.abs(layout.clearance - 80) < 1)
      assert.equal(layout.overflow, false)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await phoneLayout(page)
    assert.deepEqual(errors, [])
    await context.close()

    // Fresh touch-enabled sessions catch mobile autoplay and layout failures
    // that resizing an already-playing desktop video can miss.
    for (const phoneViewport of phoneViewports) {
      const mobile = await browser.newContext({
        viewport: phoneViewport,
        hasTouch: true,
        ...(engine === firefox ? {} : { isMobile: true }),
      })
      const phone = await mobile.newPage()
      await phone.goto(origin, { waitUntil: 'domcontentloaded' })
      await phoneLayout(phone)
      if (process.env.HERO_VIDEO_SCREENSHOTS) {
        await phone.screenshot({
          path: `${process.env.HERO_VIDEO_SCREENSHOTS}/${engine.name()}-${phoneViewport.width}.png`,
        })
      }
      await phone.setViewportSize({ width: phoneViewport.height, height: phoneViewport.width })
      await phone.locator(selector).scrollIntoViewIfNeeded()
      await playing(phone)
      assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      await phone.setViewportSize(phoneViewport)
      await phone.evaluate(() => scrollTo(0, 0))
      await phoneLayout(phone)
      console.log(engine.name(), 'phone playback and rotation', phoneViewport)
      await mobile.close()
    }

    // A failed MP4 request must select the real, decodable WebM alternative.
    const fallback = await browser.newContext({ viewport, serviceWorkers: 'block' })
    await fallback.route('**/tiles-demo.*.mp4', route => route.abort())
    const fallbackPage = await fallback.newPage()
    await fallbackPage.goto(origin, { waitUntil: 'domcontentloaded' })
    await playing(fallbackPage, 'webm')
    await fallback.close()

    // Simulate a browser requiring a trusted user gesture for autoplay.
    const blocked = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      ...(engine === firefox ? {} : { isMobile: true }),
      serviceWorkers: 'block',
    })
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
    // Keep both sources unavailable until a trusted retry click. Unrouting
    // earlier lets a pending WebM remount recover and remove the button first.
    await unavailable.addInitScript(() => {
      window.__heroRetryAllowed = false
      document.addEventListener('click', event => {
        const button = event.target instanceof Element ? event.target.closest('button') : null
        if (event.isTrusted && button?.textContent?.trim() === 'Retry demo') {
          window.__heroRetryAllowed = true
        }
      }, true)
    })
    await unavailable.route('**/tiles-demo.*', async route => {
      const allowed = await route.request().frame().evaluate(() => window.__heroRetryAllowed)
      await (allowed ? route.continue() : route.abort())
    })
    const retryPage = await unavailable.newPage()
    await retryPage.goto(origin, { waitUntil: 'domcontentloaded' })
    await retryPage.getByRole('button', { name: 'Retry demo', exact: true }).waitFor()
    await retryPage.getByRole('button', { name: 'Retry demo', exact: true }).click()
    // A runtime media error can already have selected the WebM-only fallback.
    await playing(retryPage, ['mp4', 'webm'])
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
