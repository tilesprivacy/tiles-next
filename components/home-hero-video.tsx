"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react"
import { Maximize, Minimize, Pause, Play, RotateCcw } from "lucide-react"

const CONTROLS_HIDE_DELAY = 3000

// iPhone Safari has no element fullscreen API, only the native video presentation.
interface WebKitVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void
}

interface WebKitDocument extends Document {
  webkitFullscreenElement?: Element | null
}

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  // A pause from the on-video control must survive the automatic resume paths.
  const userPausedRef = useRef(false)
  const hideTimerRef = useRef(0)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [failed, setFailed] = useState(false)
  const [webmOnly, setWebmOnly] = useState(false)
  const [paused, setPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  const scheduleControlsHide = useCallback(() => {
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      // A paused demo keeps its resume affordance in view.
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false)
    }, CONTROLS_HIDE_DELAY)
  }, [])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    scheduleControlsHide()
  }, [scheduleControlsHide])

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video || userPausedRef.current || document.visibilityState !== "visible") return

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
    // Autoplay can begin before hydration attaches React's play listener.
    if (videoRef.current) {
      setPaused(videoRef.current.paused)
      setDuration(videoRef.current.duration || 0)
    }
    scheduleControlsHide()
    play()
    document.addEventListener("visibilitychange", play)
    window.addEventListener("pageshow", play)
    window.addEventListener("focus", play)
    return () => {
      document.removeEventListener("visibilitychange", play)
      window.removeEventListener("pageshow", play)
      window.removeEventListener("focus", play)
      window.clearTimeout(hideTimerRef.current)
    }
  }, [play, scheduleControlsHide, webmOnly])

  useEffect(() => {
    const syncFullscreen = () => {
      const fullscreenElement =
        document.fullscreenElement ?? (document as WebKitDocument).webkitFullscreenElement
      setFullscreen(!!fullscreenElement && fullscreenElement === frameRef.current)
    }
    document.addEventListener("fullscreenchange", syncFullscreen)
    document.addEventListener("webkitfullscreenchange", syncFullscreen)
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen)
      document.removeEventListener("webkitfullscreenchange", syncFullscreen)
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPausedRef.current = false
      play()
    } else {
      userPausedRef.current = true
      video.pause()
    }
  }

  const toggleFullscreen = () => {
    const frame = frameRef.current
    const video = videoRef.current as WebKitVideoElement | null
    if (!frame || !video) return
    const fullscreenElement =
      document.fullscreenElement ?? (document as WebKitDocument).webkitFullscreenElement
    if (fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
    } else if (frame.requestFullscreen) {
      void frame.requestFullscreen().catch(() => {})
    } else {
      video.webkitEnterFullscreen?.()
    }
  }

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = Number(event.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <figure className="minimal-hero-demo">
      <div
        ref={frameRef}
        className="minimal-hero-video-frame"
        onPointerMove={showControls}
        onPointerDown={showControls}
      >
        <video
          key={webmOnly ? "webm" : "auto"}
          ref={videoRef}
          className="minimal-hero-video"
          poster="/tiles-demo-poster.d7c3964b.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          width={1280}
          height={896}
          aria-label="Tiles desktop app demo"
          onCanPlay={play}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
          onTimeUpdate={() => {
            const video = videoRef.current
            if (!video) return
            setCurrentTime(video.currentTime)
            // Re-sync playback state missed around hydration or suspensions.
            setPaused(video.paused)
          }}
          onPlay={() => {
            setPaused(false)
            showControls()
          }}
          onPlaying={() => {
            setNeedsPlay(false)
            setFailed(false)
          }}
          onPause={() => {
            setPaused(true)
            setControlsVisible(true)
            if (!userPausedRef.current) setNeedsPlay(true)
          }}
          onError={() => {
            // Source selection handles unsupported formats. A decode failure
            // after selection needs an explicit switch to the alternate codec.
            if (!webmOnly) setWebmOnly(true)
            else setFailed(true)
          }}
        >
          {!webmOnly && (
            <source src="/tiles-demo.e8387081.mp4" type="video/mp4" />
          )}
          <source
            src="/tiles-demo.b8dce1a4.webm"
            type="video/webm"
            onError={() => setFailed(true)}
          />
        </video>
        {!needsPlay && !failed && (
          <div
            className="minimal-hero-video-controls"
            data-hidden={controlsVisible || paused ? undefined : ""}
          >
            <button
              type="button"
              className="minimal-hero-video-toggle"
              aria-label={paused ? "Play" : "Pause"}
              onClick={togglePlayback}
            >
              {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            </button>
            <input
              type="range"
              className="minimal-hero-video-scrubber"
              aria-label="Seek through the demo"
              min={0}
              max={duration > 0 ? duration : 100}
              step={0.1}
              value={currentTime}
              onChange={seek}
              style={{ "--progress": `${progress}%` } as CSSProperties}
            />
            <button
              type="button"
              className="minimal-hero-video-toggle"
              aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
              onClick={toggleFullscreen}
            >
              {fullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
            </button>
          </div>
        )}
        {(needsPlay || failed) && (
          <button
            type="button"
            className="minimal-hero-video-play"
            onClick={() => {
              if (failed) {
                setFailed(false)
                videoRef.current?.load()
              }
              userPausedRef.current = false
              play()
            }}
          >
            {failed ? <RotateCcw size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {failed ? "Retry demo" : "Play demo"}
          </button>
        )}
      </div>
      <figcaption className="minimal-hero-video-caption">
        Featuring Tiles Canary release on macOS.
      </figcaption>
    </figure>
  )
}
