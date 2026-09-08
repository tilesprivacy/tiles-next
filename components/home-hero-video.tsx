export function HomeHeroVideo() {
  return (
    <div className="minimal-hero-video-frame">
      <video
        className="minimal-hero-video"
        poster="/tiles-demo-poster.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Tiles desktop app demo"
      >
        <source src="/tiles-demo.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
