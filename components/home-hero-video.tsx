"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react"
import { Maximize, Minimize, Pause, Play } from "lucide-react"

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
  const hasStartedRef = useRef(false)
  const hideTimerRef = useRef(0)
  const [hasStarted, setHasStarted] = useState(false)
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
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    void video.play().catch((error: DOMException) => {
      if (error.name === "NotSupportedError") setFailed(true)
    })
  }, [])

  useEffect(() => {
    // With <source> children, some browsers leave play() pending when every
    // source failed before hydration. Recover that already-settled state too.
    if (videoRef.current?.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setFailed(true)
    }
    if (videoRef.current) {
      videoRef.current.autoplay = false
      videoRef.current.pause()
      setPaused(true)
      setDuration(videoRef.current.duration || 0)
    }
    return () => {
      window.clearTimeout(hideTimerRef.current)
    }
  }, [webmOnly])

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
      hasStartedRef.current = true
      setHasStarted(true)
      play()
    } else {
      video.pause()
    }
  }

  const startPlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (failed) {
      setFailed(false)
      video.load()
    }
    hasStartedRef.current = true
    setHasStarted(true)
    play()
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
          autoPlay={false}
          loop
          muted
          playsInline
          preload="metadata"
          width={1280}
          height={896}
          aria-label="Tiles desktop app demo"
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
            if (!hasStartedRef.current) {
              videoRef.current?.pause()
              if (videoRef.current) videoRef.current.currentTime = 0
              return
            }
            setPaused(false)
            showControls()
          }}
          onPlaying={() => {
            setFailed(false)
          }}
          onPause={() => {
            setPaused(true)
            setControlsVisible(true)
          }}
          onError={() => {
            // Source selection handles unsupported formats. A decode failure
            // after selection needs an explicit switch to the alternate codec.
            if (!webmOnly) setWebmOnly(true)
            else setFailed(true)
          }}
        >
          {!webmOnly && (
            <source src="/tiles-demo.48de4a8b.mp4" type="video/mp4" />
          )}
          <source
            src="/tiles-demo.8492c6fd.webm"
            type="video/webm"
            onError={() => setFailed(true)}
          />
        </video>
        {(!hasStarted || failed) && (
          <button
            type="button"
            className="minimal-hero-video-start"
            aria-label={failed ? "Retry Tiles demo video" : "Play Tiles demo video"}
            onClick={startPlayback}
          >
            <Play size={28} fill="currentColor" aria-hidden="true" />
          </button>
        )}
        {hasStarted && !failed && (
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
      </div>
      <figcaption className="minimal-hero-video-caption">
        Featuring Tiles Canary release on macOS.
      </figcaption>
    </figure>
  )
}
