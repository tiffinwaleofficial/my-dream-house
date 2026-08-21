'use client'

import { motion } from 'motion/react'
import { PeacockFeather } from './peacock-feather'

export function SanskritTransition({
  text = 'श्री राधे',
  caption,
}: {
  text?: string
  caption?: string
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-28 text-center md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 0.45, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <PeacockFeather className="h-20 w-auto md:h-24" strokeWidth={0.9} />
      </motion.div>
      <motion.p
        className="font-deva text-3xl text-peacock md:text-4xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {text}
      </motion.p>
      {caption ? (
        <motion.p
          className="max-w-sm text-balance text-sm font-light leading-relaxed text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {caption}
        </motion.p>
      ) : null}
    </section>
  )
}
