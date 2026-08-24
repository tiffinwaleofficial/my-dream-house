'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { NUM_STOPS, TOUR_STOPS, stopIndexFromProgress } from '@/lib/house-tour-layout'
import { Scene } from './scene'

const ease = [0.22, 1, 0.36, 1] as const
const VH_PER_STOP = 110

export function TourExperience() {
  const [reduced, setReduced] = useState<boolean | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  const { scrollYProgress } = useScroll()
  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = stopIndexFromProgress(v)
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx
      setActiveIndex(idx)
    }
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (reduced === null) return null
  if (reduced) return <ReducedMotionFallback />

  const stop = TOUR_STOPS[activeIndex]
  const label = stop.id === 'entry' ? 'Entry' : stop.id === 'her' ? 'Her' : stop.title

  return (
    <div className="relative bg-[#f3ece0]">
      <Link
        href="/"
        data-cursor="hover"
        className="label-caps fixed left-5 top-5 z-50 rounded-full border border-line bg-background/80 px-3 py-2 text-foreground backdrop-blur-md transition-colors hover:text-peacock md:left-8 md:top-8 md:px-4"
      >
        ← <span className="hidden sm:inline">The house</span>
      </Link>

      <div className="pointer-events-none fixed right-5 top-5 z-50 rounded-full border border-line bg-background/80 px-3 py-2 backdrop-blur-md md:right-8 md:top-8 md:px-4">
        <span className="label-caps text-muted-foreground">
          {stop.number} / {String(NUM_STOPS).padStart(2, '0')}
          <span className="hidden md:inline"> — {label}</span>
        </span>
      </div>

      <div className="fixed inset-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 55, near: 0.1, far: 700, position: [0, 1.6, 6] }}
        >
          <Scene progress={scrollYProgress} />
        </Canvas>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] bg-gradient-to-r from-background/75 via-background/35 to-transparent md:block"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 flex items-end md:items-center">
          <div className="w-full px-6 pb-24 md:w-[44%] md:px-16 md:pb-0">
            <AnimatePresence>
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
                className="rounded-sm bg-background/85 p-6 backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none"
              >
                <p className="label-caps text-muted-foreground">{stop.number} — {label}</p>
                <h2 className="mt-3 text-balance font-serif text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl">
                  {stop.title}
                </h2>
                {stop.id === 'her' ? (
                  <p className="mt-4 font-deva text-2xl text-peacock">{stop.subtitle}</p>
                ) : (
                  <p className="mt-4 max-w-sm font-serif text-lg font-light italic leading-relaxed text-muted-foreground md:text-xl">
                    {stop.subtitle}
                  </p>
                )}
                {stop.meta && (
                  <p className="label-caps mt-5 text-muted-foreground/70">
                    {stop.meta.light} · {stop.meta.mood} · {stop.meta.element}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 md:right-8 md:block">
          <div className="relative h-56 w-px bg-line">
            <motion.div className="absolute left-0 top-0 w-px bg-peacock" style={{ height: railHeight }} />
          </div>
        </div>

        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.p
              className="label-caps pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              Scroll to walk in
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div style={{ height: `${NUM_STOPS * VH_PER_STOP}vh` }} />
    </div>
  )
}

function ReducedMotionFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="label-caps text-muted-foreground">The 3D tour</p>
      <h1 className="max-w-xl text-balance font-serif text-3xl font-light leading-tight text-foreground md:text-5xl">
        This tour moves the camera through the house as you scroll.
      </h1>
      <p className="max-w-md text-balance font-serif text-lg font-light leading-relaxed text-muted-foreground">
        Your device has reduced motion turned on, so we&apos;ve kept this page still instead. The
        classic walk-through has all sixteen rooms too.
      </p>
      <Link
        href="/"
        data-cursor="hover"
        className="label-caps mt-2 border-b border-foreground pb-1 text-foreground transition-colors hover:text-peacock"
      >
        Take the classic tour →
      </Link>
    </div>
  )
}
