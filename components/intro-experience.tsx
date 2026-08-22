'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PeacockFeather } from './peacock-feather'

export function IntroExperience({ onEnter }: { onEnter: () => void }) {
  const [open, setOpen] = useState(true)
  const reduced = useReducedMotion()

  // lock scroll while the intro is visible
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const enter = () => {
    setOpen(false)
    onEnter()
  }

  // A scroll/swipe attempt is a valid way to dismiss the intro too — not
  // just the button — so a visitor is never stuck here if a tap doesn't
  // register (e.g. a slow first paint on mobile).
  useEffect(() => {
    if (!open) return
    let touchStartY = 0
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 4) enter()
    }
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY)
      if (Math.abs(dy) > 10) enter()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6"
          exit={{ opacity: 0, transition: { duration: 1.1, ease } }}
        >
          {/* feather drifts in from the side */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -260, y: -180, rotate: -18 }}
            animate={{ opacity: 0.5, x: -150, y: -150, rotate: -14 }}
            transition={{ duration: 2.4, ease, delay: 0.2 }}
          >
            <PeacockFeather className="h-40 w-auto md:h-56" strokeWidth={0.9} />
          </motion.div>

          <div className="relative flex flex-col items-center text-center">
            <motion.p
              className="font-deva text-2xl text-peacock md:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.9 }}
            >
              श्री राधे
            </motion.p>

            <motion.h1
              className="mt-6 font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease, delay: 1.7 }}
            >
              The House of Riya
            </motion.h1>

            <motion.p
              className="mt-4 text-sm font-light tracking-wide text-muted-foreground md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease, delay: 2.5 }}
            >
              A home imagined from the heart.
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              data-cursor="enter"
              data-cursor-label="Enter"
              className="group mt-14 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease, delay: 3.2 }}
            >
              <span className="label-caps text-foreground/80 transition-colors group-hover:text-foreground">
                Come inside
              </span>
              <motion.span
                className="block h-10 w-px bg-line"
                animate={reduced ? {} : { scaleY: [0.4, 1, 0.4] }}
                style={{ transformOrigin: 'top' }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.button>
          </div>

          <motion.span
            className="label-caps absolute bottom-8 text-muted-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 3.6 }}
          >
            The House of Riya
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
