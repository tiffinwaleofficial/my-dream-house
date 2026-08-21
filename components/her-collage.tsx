'use client'

import { motion } from 'motion/react'
import { RiyaPortrait } from './riya-portrait'

const ease = [0.22, 1, 0.36, 1] as const

export function HerCollage() {
  return (
    <section id="her" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <motion.p
        className="label-caps text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease }}
      >
        16 — Her
      </motion.p>
      <motion.h2
        className="mt-4 max-w-3xl text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-7xl"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.05 }}
      >
        And then, there is her.
      </motion.h2>

      <div className="mt-16 grid grid-cols-2 gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <RiyaPortrait src="/assets/riya/riya-main.png" alt="Placeholder portrait of Riya" />
        </div>

        <div className="flex flex-col justify-end md:col-span-4 md:col-start-8">
          <RiyaPortrait src="/assets/riya/riya-tea.png" alt="Placeholder portrait — at the balcony" className="w-full" />
        </div>

        <div className="col-span-2 flex items-center justify-center py-10 md:col-span-12 md:py-20">
          <p className="max-w-2xl text-balance text-center font-serif text-2xl font-light italic leading-snug text-muted-foreground md:text-4xl">
            Because the house was never really about the walls.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-2">
          <RiyaPortrait src="/assets/riya/riya-reading.png" alt="Placeholder portrait — reading" />
        </div>
        <div className="flex flex-col justify-end md:col-span-5 md:col-start-7">
          <RiyaPortrait src="/assets/riya/riya-music.png" alt="Placeholder portrait — at the piano" />
        </div>
      </div>
    </section>
  )
}
