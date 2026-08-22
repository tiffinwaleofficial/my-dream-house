'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const STORAGE_KEY = 'house-sound-muted'
const TARGET_VOLUME = 0.14
const FADE_MS = 1800

let fadeToken = 0

function fade(audio: HTMLAudioElement, to: number, onDone?: () => void) {
  const token = ++fadeToken
  const from = audio.volume
  const start = performance.now()
  const step = (now: number) => {
    if (token !== fadeToken) return // superseded by a newer fade
    const t = Math.min(1, (now - start) / FADE_MS)
    audio.volume = Math.min(1, Math.max(0, from + (to - from) * t))
    if (t < 1) requestAnimationFrame(step)
    else onDone?.()
  }
  requestAnimationFrame(step)
}

/**
 * Soft, loopable flute track that begins only after a real user gesture
 * (browser autoplay policy) and remembers the mute choice in localStorage.
 */
export function AmbientSound({ visible }: { visible: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playingRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMuted(window.localStorage.getItem(STORAGE_KEY) === 'true')
    setReady(true)
  }, [])

  useEffect(() => {
    if (!visible || !ready || muted) return
    const audio = audioRef.current
    if (!audio) return

    let cancelled = false
    const attempt = () => {
      if (playingRef.current || cancelled) return
      audio.volume = 0
      audio
        .play()
        .then(() => {
          playingRef.current = true
          fade(audio, TARGET_VOLUME)
        })
        .catch(() => {
          const retry = () => attempt()
          window.addEventListener('pointerdown', retry, { once: true })
          window.addEventListener('keydown', retry, { once: true })
          window.addEventListener('wheel', retry, { once: true })
        })
    }
    attempt()
    return () => {
      cancelled = true
    }
  }, [visible, ready, muted])

  const toggle = () => {
    const next = !muted
    setMuted(next)
    window.localStorage.setItem(STORAGE_KEY, String(next))
    const audio = audioRef.current
    if (!audio) return
    if (next) {
      fade(audio, 0, () => audio.pause())
    } else {
      if (!playingRef.current) {
        audio.volume = 0
        audio.play().then(() => {
          playingRef.current = true
        })
      }
      fade(audio, TARGET_VOLUME)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/audio/vrindavan-prayer.mp3" loop preload="none" />
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={toggle}
            data-cursor="hover"
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={!muted}
            className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background/80 backdrop-blur-md md:bottom-8 md:right-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-3.5 items-end gap-[3px]" aria-hidden>
              {[0.4, 1, 0.6].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[2.5px] rounded-full bg-foreground"
                  style={{ opacity: muted ? 0.35 : 1 }}
                  animate={
                    muted
                      ? { height: 4 }
                      : { height: [4, 14 * h, 4] }
                  }
                  transition={
                    muted
                      ? { duration: 0.3 }
                      : { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }
                  }
                />
              ))}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
