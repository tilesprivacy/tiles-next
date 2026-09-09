"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Play, RotateCcw } from "lucide-react"

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [failed, setFailed] = useState(false)
  const [webmOnly, setWebmOnly] = useState(false)

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video || document.visibilityState !== "visible") return

    // Set the DOM properties before play(), including after client navigation.
    video.muted = true
    video.defaultMuted = true
    void video.play().catch((error: DOMException) => {
      if (error.name === "NotAllowedError") setNeedsPlay(true)
      // Source errors can fire before hydration attaches React's listeners.
      if (error.name === "NotSupportedError") setFailed(true)
      // load() and browser suspension can abort a pending play request.
    })
  }, [])

  useEffect(() => {
    // With <source> children, some browsers leave play() pending when every
    // source failed before hydration. Recover that already-settled state too.
    if (videoRef.current?.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setFailed(true)
    }
    play()
    document.addEventListener("visibilitychange", play)
    window.addEventListener("pageshow", play)
    window.addEventListener("focus", play)
    return () => {
      document.removeEventListener("visibilitychange", play)
      window.removeEventListener("pageshow", play)
      window.removeEventListener("focus", play)
    }
  }, [play, webmOnly])

  return (
    <div className="minimal-hero-video-frame">
      <video
        key={webmOnly ? "webm" : "auto"}
        ref={videoRef}
        className="minimal-hero-video"
        poster="/tiles-demo-poster.c215d606.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        width={1280}
        height={832}
        aria-label="Tiles desktop app demo"
        onCanPlay={play}
        onPlaying={() => {
          setNeedsPlay(false)
          setFailed(false)
        }}
        onPause={() => setNeedsPlay(true)}
        onError={() => {
          // Source selection handles unsupported formats. A decode failure
          // after selection needs an explicit switch to the alternate codec.
          if (!webmOnly) setWebmOnly(true)
          else setFailed(true)
        }}
      >
        {!webmOnly && (
          <source src="/tiles-demo.db8739e8.mp4" type="video/mp4" />
        )}
        <source
          src="/tiles-demo.65c19254.webm"
          type="video/webm"
          onError={() => setFailed(true)}
        />
      </video>
      {(needsPlay || failed) && (
        <button
          type="button"
          className="minimal-hero-video-play"
          onClick={() => {
            if (failed) {
              setFailed(false)
              videoRef.current?.load()
            }
            play()
          }}
        >
          {failed ? <RotateCcw size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          {failed ? "Retry demo" : "Play demo"}
        </button>
      )}
    </div>
  )
}
