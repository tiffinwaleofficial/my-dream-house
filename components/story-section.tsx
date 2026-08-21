'use client'

import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

const places = [
  'A place for childhood memories.',
  'A place for adulthood.',
  'A place for music.',
  'A place for books.',
  'A place for faith.',
  'A place for quiet mornings.',
  'A place for people to stay a little longer.',
]

export function StorySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <motion.h2
        className="text-balance font-serif text-4xl font-light leading-[1.08] tracking-tight text-foreground md:text-7xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease }}
      >
        She didn&apos;t want a perfect house.
        <br />
        She wanted a place that felt like her.
      </motion.h2>

      <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-3 md:mt-24 md:grid-cols-2">
        {places.map((line, i) => (
          <motion.p
            key={line}
            className="border-t border-line py-4 font-serif text-xl font-light text-muted-foreground md:text-2xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease, delay: i * 0.05 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
