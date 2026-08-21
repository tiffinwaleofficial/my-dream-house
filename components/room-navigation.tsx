'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { roomIndex } from '@/lib/rooms'

const ease = [0.22, 1, 0.36, 1] as const

export function RoomNavigation({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(roomIndex[0])

  useEffect(() => {
    const sections = roomIndex
      .map((r) => document.getElementById(r.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visibleEntry) {
          const found = roomIndex.find((r) => r.id === visibleEntry.target.id)
          if (found) setActive(found)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback((id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="hover"
            className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-full border border-line bg-background/80 px-4 py-2.5 backdrop-blur-md md:right-8 md:top-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Open house index"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-px w-4 bg-foreground" />
              <span className="block h-px w-4 bg-foreground" />
            </span>
            <span className="label-caps text-foreground">
              House · {active.number} {active.label}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
              <span className="font-serif text-2xl font-light text-foreground">The House</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-cursor="hover"
                className="label-caps text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close house index"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-12 md:px-10">
              <ul className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-x-16 sm:grid-cols-2">
                {roomIndex.map((room, i) => (
                  <motion.li
                    key={room.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.04 * i }}
                  >
                    <button
                      type="button"
                      onClick={() => goTo(room.id)}
                      data-cursor="enter"
                      data-cursor-label="Go"
                      className="group flex w-full items-baseline gap-5 border-b border-line py-4 text-left"
                    >
                      <span className="label-caps w-8 shrink-0 text-muted-foreground/70">
                        {room.number}
                      </span>
                      <span className="font-serif text-2xl font-light text-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-peacock md:text-3xl">
                        {room.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
