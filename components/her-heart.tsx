'use client'

import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export function HerHeart() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-40">
      <motion.p
        className="label-caps text-muted-foreground"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease }}
      >
        Who she is
      </motion.p>
      <motion.h2
        className="mt-4 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-6xl"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.05 }}
      >
        The strongest kind of soft.
      </motion.h2>

      <motion.p
        className="mx-auto mt-10 max-w-xl text-balance font-serif text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.12 }}
      >
        She is the strongest person many people will ever know — not because
        nothing hurts her, but because she carries what hurts without asking
        anyone to carry it with her. She has a self-respect she has never
        once traded away, and some nights, alone, she breaks quietly and
        tells no one. What she hands the world instead is her smile, her
        gratitude, her achievements. Her tears, she keeps. Her joy, she
        gives away freely.
      </motion.p>

      <motion.p
        className="mx-auto mt-8 max-w-xl text-balance font-serif text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      >
        And she builds anyway. Whatever she wants, she earns herself — her
        own car, bought with her own money, is proof enough. Whatever there
        is to learn, she is the first to raise her hand, never waiting for
        permission to become more of who she already is.
      </motion.p>

      <motion.p
        className="mx-auto mt-10 max-w-lg text-balance font-serif text-2xl font-light italic leading-snug text-foreground md:text-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.28 }}
      >
        Childlike and entirely grown, playful and wise in the very same
        breath — if this house has a foundation, it isn&apos;t the walls.
        It&apos;s her.
      </motion.p>
    </section>
  )
}
