'use client'

import Image from 'next/image'
import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export function HerParents() {
  return (
    <section id="her-parents" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <motion.div
          className="relative order-2 mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-cream md:order-1"
          data-cursor="image"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
          transition={{ duration: 1.1, ease }}
        >
          <Image
            src="/assets/riya/parents.jpg"
            alt="Riya's parents, together"
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            className="object-cover"
          />
        </motion.div>

        <div className="order-1 md:order-2">
          <motion.p
            className="label-caps text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease }}
          >
            Her roots
          </motion.p>
          <motion.h2
            className="mt-4 max-w-lg text-balance font-serif text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease, delay: 0.08 }}
          >
            Before her, there was them.
          </motion.h2>
          <motion.p
            className="mt-6 max-w-md font-serif text-xl font-light leading-relaxed text-muted-foreground md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease, delay: 0.16 }}
          >
            Every home starts long before its walls do. Hers started with two
            people who loved without needing to be asked, who built something
            out of very little and made it feel like everything, and who
            gave her a childhood steady enough to dream from.
          </motion.p>
          <motion.p
            className="mt-4 max-w-md font-serif text-xl font-light italic leading-relaxed text-muted-foreground md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease, delay: 0.24 }}
          >
            Whatever warmth lives in this house, she learned it first from
            them.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
