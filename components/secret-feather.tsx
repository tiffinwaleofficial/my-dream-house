'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { PeacockFeather } from './peacock-feather'

const ease = [0.22, 1, 0.36, 1] as const

// A quiet, time-of-day-aware line — the house feels slightly different
// depending on when she happens to find this secret.
function timeOfDayLine() {
  const hour = new Date().getHours()
  if (hour < 5) return 'And more of it, only she will ever know — even now, this late.'
  if (hour < 12) return 'And more of it, only she will ever know — even this early.'
  if (hour < 17) return 'And more of it, only she will ever know.'
  if (hour < 21) return 'And more of it, only she will ever know — as the light goes soft.'
  return 'And more of it, only she will ever know — even now, this quiet.'
}

export function SecretFeather({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false)
  const [line, setLine] = useState('And more of it, only she will ever know.')

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={() => {
              setLine(timeOfDayLine())
              setOpen(true)
            }}
            data-cursor="hover"
            aria-label="A little secret"
            className="fixed bottom-5 left-5 z-50 md:bottom-8 md:left-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 1, rotate: -6 }}
            transition={{ duration: 0.6 }}
          >
            <PeacockFeather className="h-10 w-auto md:h-12" strokeWidth={1} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-sm overflow-hidden bg-background p-8 text-center"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mx-auto aspect-[3/4] w-40 overflow-hidden bg-cream">
                <Image
                  src="/assets/riya/riya-home.png"
                  alt="A quiet, hidden portrait"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <p className="mt-6 font-deva text-xl text-peacock">श्री राधे</p>
              <p className="mt-4 font-serif text-2xl font-light leading-snug text-foreground">
                There is still more to this house.
              </p>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                {line}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-cursor="hover"
                className="label-caps mt-8 text-muted-foreground transition-colors hover:text-foreground"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
