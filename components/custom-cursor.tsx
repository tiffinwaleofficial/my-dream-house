'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<'default' | 'image' | 'enter' | 'hover'>('default')
  const [label, setLabel] = useState('')
  const [hidden, setHidden] = useState(true)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    // Client-only bootstrap: matchMedia isn't available during SSR, so
    // whether the custom cursor is enabled has to be decided post-mount
    // rather than derived at render, right alongside subscribing to the
    // pointer listeners below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true)
    document.documentElement.classList.add('custom-cursor')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]')
      if (target) {
        const kind = target.dataset.cursor as typeof variant
        setVariant(kind)
        setLabel(target.dataset.cursorLabel ?? (kind === 'enter' ? 'Enter' : ''))
      } else {
        setVariant('default')
        setLabel('')
      }
    }
    const leave = () => setHidden(true)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  const ring = variant === 'image' || variant === 'hover' || variant === 'enter'

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full"
        style={{ x: sx, y: sy }}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border"
          style={{ borderColor: 'var(--foreground)', translateX: '-50%', translateY: '-50%' }}
          animate={{
            width: ring ? (label ? 74 : 44) : 8,
            height: ring ? (label ? 74 : 44) : 8,
            backgroundColor: ring ? 'rgba(255,255,255,0.04)' : 'var(--foreground)',
            borderWidth: ring ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {label ? (
            <span
              className="label-caps"
              style={{ color: 'var(--foreground)', fontSize: '0.55rem', letterSpacing: '0.2em' }}
            >
              {label}
            </span>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  )
}
