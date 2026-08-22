'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'

export function HeroHouse() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const overlay = useTransform(scrollYProgress, [0, 1], [0.28, 0.5])

  return (
    <section id="entry" ref={ref} className="relative h-[130vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale, y }} className="absolute inset-0">
          <Image
            src="/assets/home/exterior.png"
            alt="A serene modern Indian home at golden hour, surrounded by soft green hills"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-foreground"
            style={{ opacity: overlay }}
          />
        </motion.div>

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="label-caps text-background/80">01 — Arrival</p>
          <h2 className="mt-6 font-serif text-6xl font-light leading-[0.95] tracking-tight text-background md:text-8xl">
            The House of Riya
          </h2>
          <p className="mt-8 max-w-md text-balance font-serif text-2xl font-light italic text-background/90 md:text-3xl">
            Not just a house. A feeling.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="label-caps text-background/80">Scroll to enter</span>
          <motion.span
            className="block h-10 w-px bg-background/60"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
