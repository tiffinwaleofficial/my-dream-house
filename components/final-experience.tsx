'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { PeacockFeather } from './peacock-feather'

const ease = [0.22, 1, 0.36, 1] as const

export function FinalExperience() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1])

  return (
    <>
      <section ref={ref} className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image
            src="/assets/home/exterior.png"
            alt="A final view of the home at golden hour"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
        </motion.div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.h2
            className="font-serif text-5xl font-light tracking-tight text-background md:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease }}
          >
            Radha&apos;s House
          </motion.h2>
          <motion.p
            className="mt-6 font-serif text-2xl font-light italic text-background/90 md:text-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          >
            Her little dreamland.
          </motion.p>
          <motion.p
            className="mt-14 max-w-md text-balance font-serif text-xl font-light text-background md:text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease, delay: 0.5 }}
          >
            &ldquo;Yes. Finally. I&apos;m home.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* return to white — closing blessing */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-32 text-center">
        <motion.div
          className="pointer-events-none absolute top-1/3"
          initial={{ x: '-30vw', opacity: 0, rotate: -12 }}
          whileInView={{ x: '30vw', opacity: 0.4, rotate: -8 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 3.4, ease }}
        >
          <PeacockFeather className="h-40 w-auto md:h-52" strokeWidth={0.8} />
        </motion.div>

        <motion.p
          className="relative font-deva text-3xl text-peacock md:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
        >
          श्री राधे
        </motion.p>
        <motion.p
          className="relative mt-8 font-serif text-2xl font-light leading-snug text-foreground md:text-3xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease, delay: 0.6 }}
        >
          A dream imagined.
          <br />
          A place waiting to exist.
        </motion.p>
      </section>
    </>
  )
}
