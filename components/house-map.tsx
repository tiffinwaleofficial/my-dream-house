'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { roomIndex } from '@/lib/rooms'

const ease = [0.22, 1, 0.36, 1] as const

// Column spans compose a stylized architectural plan on desktop.
const spanMap: Record<string, string> = {
  entry: 'md:col-span-3 md:row-span-1',
  living: 'md:col-span-6 md:row-span-2',
  balcony: 'md:col-span-3 md:row-span-1',
  spiritual: 'md:col-span-3 md:row-span-1',
  music: 'md:col-span-4',
  piano: 'md:col-span-4',
  library: 'md:col-span-4',
  kitchen: 'md:col-span-4',
  herb: 'md:col-span-3',
  dining: 'md:col-span-5',
  bedroom: 'md:col-span-4',
  cozy: 'md:col-span-4',
  wardrobe: 'md:col-span-4',
  bathroom: 'md:col-span-4',
  terrace: 'md:col-span-12',
}

const plan = roomIndex.filter((r) => r.id !== 'her')

export function HouseMap() {
  const [hovered, setHovered] = useState<string | null>(null)

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="mb-12 flex flex-col gap-3 md:mb-16">
        <motion.h2
          className="font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease }}
        >
          Explore the house
        </motion.h2>
        <motion.p
          className="font-serif text-xl font-light italic text-muted-foreground md:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          Every room has a story.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease, delay: 0.18 }}
        >
          <Link
            href="/home"
            data-cursor="hover"
            className="label-caps mt-1 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-peacock"
          >
            Walk through it in 3D <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-2 md:auto-rows-[112px] md:grid-cols-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        onMouseLeave={() => setHovered(null)}
      >
        {plan.map((room) => {
          const isDim = hovered !== null && hovered !== room.id
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => goTo(room.id)}
              onMouseEnter={() => setHovered(room.id)}
              data-cursor="enter"
              data-cursor-label="Enter"
              className={`group relative flex min-h-[92px] flex-col justify-between border border-line p-3 text-left transition-all duration-500 md:min-h-0 ${spanMap[room.id] ?? 'md:col-span-4'}`}
              style={{
                backgroundColor: hovered === room.id ? 'var(--cream)' : 'transparent',
                opacity: isDim ? 0.4 : 1,
                borderColor: hovered === room.id ? 'var(--peacock)' : 'var(--line)',
              }}
            >
              <span className="label-caps text-muted-foreground/70">{room.number}</span>
              <span
                className="font-serif text-lg font-light leading-tight text-foreground transition-colors duration-300 group-hover:text-peacock md:text-xl"
              >
                {room.label}
              </span>
            </button>
          )
        })}
      </motion.div>
    </section>
  )
}
