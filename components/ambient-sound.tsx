'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const STORAGE_KEY = 'house-sound-muted'
const NUDGE_SEEN_KEY = 'house-sound-nudge-seen'
const TARGET_VOLUME = 0.14
const FADE_MS = 1800
const NUDGE_DELAY_MS = 1400
const NUDGE_AUTO_HIDE_MS = 5000

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
  const [showNudge, setShowNudge] = useState(false)

  useEffect(() => {
    // Client-only bootstrap: localStorage isn't available during SSR, so the
    // mute preference has to be read post-mount rather than derived at render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMuted(window.localStorage.getItem(STORAGE_KEY) === 'true')
    setReady(true)
  }, [])

  // A brief, one-time nudge toward the sound toggle for first-time visitors —
  // many mobile browsers block autoplay outright until a real tap, so this
  // points at the one control that actually needs a gesture to start audio.
  useEffect(() => {
    if (!visible || !ready || muted) return
    if (window.localStorage.getItem(NUDGE_SEEN_KEY) === 'true') return

    const showTimer = window.setTimeout(() => {
      setShowNudge(true)
      window.localStorage.setItem(NUDGE_SEEN_KEY, 'true')
    }, NUDGE_DELAY_MS)

    return () => window.clearTimeout(showTimer)
  }, [visible, ready, muted])

  useEffect(() => {
    if (!showNudge) return
    const hideTimer = window.setTimeout(() => setShowNudge(false), NUDGE_AUTO_HIDE_MS)
    return () => window.clearTimeout(hideTimer)
  }, [showNudge])

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
    setShowNudge(false)
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
        {visible && showNudge && (
          <motion.div
            className="fixed bottom-[4.25rem] right-5 z-50 whitespace-nowrap rounded-full border border-line bg-background/90 px-3.5 py-1.5 text-xs font-light text-muted-foreground shadow-sm backdrop-blur-md md:bottom-[5.25rem] md:right-8"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5 }}
          >
            tap for sound
          </motion.div>
        )}
      </AnimatePresence>
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
            animate={{
              opacity: 1,
              y: 0,
              scale: showNudge ? [1, 1.08, 1] : 1,
            }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, scale: { duration: 1.1, repeat: showNudge ? Infinity : 0, ease: 'easeInOut' } }}
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
