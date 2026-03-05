"use client"

import { useRef } from "react"

const galleryItems = [
  { src: "/videos/1.mp4", name: "Kemi O.", job: "Event Planner" },
  { src: "/videos/2.mp4", name: "Amara N.", job: "Travel Blogger" },
  { src: "/videos/3.mp4", name: "Sade M.", job: "Lifestyle Creator" },
  { src: "/videos/4.mp4", name: "Gasabo I.", job: "Tour Guide" },
]

function HoverVideoPanel({
  src,
  index,
  name,
  job,
}: {
  src: string
  index: number
  name: string
  job: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleStart = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.volume = 1
    video.currentTime = 0
    void video.play()
      .then(() => {
        // Try enabling sound after playback starts; browsers may still block this.
        video.muted = false
      })
      .catch(() => {
        // Keep panel visible with fallback background if playback is blocked.
      })
  }

  const handleStop = () => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0
  }

  return (
    <article
      className="relative h-full min-w-[68px] flex-[1_1_0%] overflow-hidden rounded-lg bg-background transition-all duration-300 ease-out hover:min-w-[240px] hover:flex-[7_1_0%]"
      onPointerEnter={handleStart}
      onMouseEnter={handleStart}
      onMouseLeave={handleStop}
      onTouchStart={handleStart}
      onFocus={handleStart}
      onBlur={handleStop}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        preload={index < 2 ? "auto" : "metadata"}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Dark gradient overlay at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg" />

      {/* Testimonial name & job */}
      <div className="absolute bottom-0 left-0 p-3 leading-tight">
        <p className="text-sm font-semibold text-white drop-shadow-sm whitespace-nowrap">{name}</p>
        <p className="text-xs text-white/80 drop-shadow-sm whitespace-nowrap">{job}</p>
      </div>
    </article>
  )
}

export function FilmstripGallery() {
  return (
    <section className="bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="group flex h-[68vh] min-h-[420px] w-full gap-2 overflow-x-auto rounded-xl border border-border bg-card p-3 sm:h-[72vh]">
          {galleryItems.map(({ src, name, job }, index) => (
            <HoverVideoPanel key={src} src={src} index={index} name={name} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
