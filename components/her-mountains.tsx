'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { blurPlaceholders } from '@/lib/blur-placeholders'

const ease = [0.22, 1, 0.36, 1] as const

export function HerMountains() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  // Force playback the moment the video scrolls into view, rather than
  // relying solely on the autoplay attribute — some mobile browsers only
  // honor autoplay once the element is actually visible. Some in-app
  // browsers (e.g. WhatsApp's) go further and reject even a muted play()
  // unless it's called directly inside a genuine user-gesture handler — an
  // IntersectionObserver callback doesn't count as one, even though it
  // fired because the user scrolled. So on rejection, fall back to
  // retrying play() from the next real pointer/touch/scroll/key event,
  // same pattern as the ambient sound toggle uses for its own autoplay.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true

    let cancelled = false
    const attempt = () => {
      if (cancelled) return
      video.play().catch(() => {
        const retry = () => attempt()
        window.addEventListener('pointerdown', retry, { once: true })
        window.addEventListener('touchstart', retry, { once: true })
        window.addEventListener('wheel', retry, { once: true })
        window.addEventListener('keydown', retry, { once: true })
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) attempt()
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(video)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={ref} className="relative h-[110vh] w-full overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          poster="/assets/riya/video/nepal-ropeway-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          onEnded={(e) => {
            // Belt-and-braces: if `loop` ever gets ignored, restart manually.
            const v = e.currentTarget
            v.currentTime = 0
            v.play().catch(() => {})
          }}
        >
          <source src="/assets/riya/video/nepal-ropeway.webm" type="video/webm" />
          <source src="/assets/riya/video/nepal-ropeway.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-foreground/40" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="label-caps text-background/80"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease }}
        >
          The mountain girl
        </motion.p>
        <motion.h2
          className="mt-4 max-w-3xl text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-background md:text-7xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease, delay: 0.05 }}
        >
          She was born to fly.
        </motion.h2>
        <motion.p
          className="mx-auto mt-8 max-w-lg text-balance font-serif text-xl font-light leading-relaxed text-background/90 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          Somewhere in the mountains, she stops performing and just becomes
          herself — a little bit of a bird, wind in her hair, arms out like
          she could take off any second. It was never really about the
          height. It&apos;s about finding the one place she doesn&apos;t
          have to fight to be understood — just held.
        </motion.p>
        <motion.p
          className="mx-auto mt-6 max-w-lg text-balance font-serif text-xl font-light leading-relaxed text-background/90 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease, delay: 0.22 }}
        >
          She carries her devotion to{' '}
          <span className="font-deva">माधव</span> the same way she carries
          everything that matters to her most — quietly, completely, without
          needing anyone to see it. It&apos;s where her determination comes
          from: the same faith that tells her it&apos;s alright to dream
          this big.
        </motion.p>
      </div>
    </section>
  )
}

export function HerMountainMoments() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-10">
        <motion.figure
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1, ease }}
        >
          <div data-cursor="image" className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
            <Image
              src="/assets/riya/collage/her-mountain-kiss.jpg"
              alt="Riya playing in the snow"
              fill
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover"
              placeholder={blurPlaceholders['/assets/riya/collage/her-mountain-kiss.jpg'] ? 'blur' : 'empty'}
              blurDataURL={blurPlaceholders['/assets/riya/collage/her-mountain-kiss.jpg']}
            />
          </div>
          <figcaption className="mt-3 label-caps text-muted-foreground">
            Still a child in the snow
          </figcaption>
        </motion.figure>
        <motion.figure
          className="mt-10 md:mt-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          <div data-cursor="image" className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
            <Image
              src="/assets/riya/collage/her-mountain-fly.jpg"
              alt="Riya with her arms out in a mountain meadow"
              fill
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover"
              placeholder={blurPlaceholders['/assets/riya/collage/her-mountain-fly.jpg'] ? 'blur' : 'empty'}
              blurDataURL={blurPlaceholders['/assets/riya/collage/her-mountain-fly.jpg']}
            />
          </div>
          <figcaption className="mt-3 label-caps text-muted-foreground">
            Arms out, wide open
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
