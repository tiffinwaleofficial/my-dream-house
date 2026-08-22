'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

function CollagePhoto({
  src,
  alt,
  caption,
  aspect,
  className,
  delay = 0,
}: {
  src: string
  alt: string
  caption: string
  aspect: string
  className?: string
  delay?: number
}) {
  return (
    <motion.figure
      className={cn('relative', className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1, ease, delay }}
    >
      <div
        data-cursor="image"
        className={cn('relative w-full overflow-hidden bg-cream', aspect)}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover" />
      </div>
      <figcaption className="mt-3 label-caps text-muted-foreground">{caption}</figcaption>
    </motion.figure>
  )
}

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
        <CollagePhoto
          src="/assets/riya/collage/her-baby.jpg"
          alt="Riya as a baby"
          caption="Where it began"
          aspect="aspect-[3/4]"
          className="col-span-2 md:col-span-6"
        />
        <CollagePhoto
          src="/assets/riya/collage/her-toddler.jpg"
          alt="Riya as a toddler with her sibling"
          caption="Learning to stand"
          aspect="aspect-[4/3]"
          className="col-span-2 flex flex-col justify-end md:col-span-5 md:col-start-8"
          delay={0.1}
        />

        <div className="col-span-2 flex items-center justify-center py-10 md:col-span-12 md:py-20">
          <p className="max-w-2xl text-balance text-center font-serif text-2xl font-light italic leading-snug text-muted-foreground md:text-4xl">
            Because the house was never really about the walls.
          </p>
        </div>

        <CollagePhoto
          src="/assets/riya/collage/her-school.jpg"
          alt="Riya in her school uniform"
          caption="Growing up"
          aspect="aspect-[3/4]"
          className="col-span-1 md:col-span-3 md:col-start-1"
        />
        <CollagePhoto
          src="/assets/riya/collage/her-mirror.jpg"
          alt="Riya, a mirror portrait"
          caption="Becoming herself"
          aspect="aspect-square"
          className="col-span-1 mt-10 md:col-span-4 md:col-start-5 md:mt-16"
          delay={0.1}
        />
        <CollagePhoto
          src="/assets/riya/collage/her-temple.jpg"
          alt="Riya at the Krishna temple in Ahmedabad"
          caption="Carrying her faith with her"
          aspect="aspect-[3/4]"
          className="col-span-2 md:col-span-4 md:col-start-9"
          delay={0.2}
        />

        <CollagePhoto
          src="/assets/riya/collage/her-festive.jpg"
          alt="Riya dressed up for a celebration"
          caption="Dressed for joy"
          aspect="aspect-[3/4]"
          className="col-span-1 mt-10 md:col-span-5 md:col-start-2 md:mt-24"
        />
        <CollagePhoto
          src="/assets/riya/collage/her-closeup-pink.jpg"
          alt="A quiet close-up portrait of Riya"
          caption="A quiet kind of beautiful"
          aspect="aspect-[3/4]"
          className="col-span-1 md:col-span-3 md:col-start-8"
          delay={0.1}
        />
        <CollagePhoto
          src="/assets/riya/collage/her-closeup-gold.jpg"
          alt="Riya, unhurried"
          caption="Unhurried"
          aspect="aspect-[3/4]"
          className="col-span-2 mt-6 md:col-span-3 md:col-start-11 md:mt-16"
          delay={0.2}
        />

        <CollagePhoto
          src="/assets/riya/collage/her-snow-heart.jpg"
          alt="Riya making a heart shape with her hands in the snow"
          caption="A heart, even in the snow"
          aspect="aspect-[3/4]"
          className="col-span-1 mt-16 md:col-span-4 md:col-start-1 md:mt-32"
        />
        <CollagePhoto
          src="/assets/riya/collage/her-fearless.jpg"
          alt="Riya, playful and unafraid"
          caption="Not afraid of anything"
          aspect="aspect-[3/4]"
          className="col-span-1 mt-6 md:col-span-4 md:col-start-5 md:mt-16"
          delay={0.1}
        />
        <CollagePhoto
          src="/assets/riya/collage/her-yellow-closeup.jpg"
          alt="Riya on an ordinary evening"
          caption="Warm, even on ordinary days"
          aspect="aspect-[3/4]"
          className="col-span-2 mt-6 md:col-span-3 md:col-start-9 md:mt-40"
          delay={0.2}
        />

        <CollagePhoto
          src="/assets/riya/collage/her-recent.jpg"
          alt="Riya today, smiling"
          caption="Right now"
          aspect="aspect-[4/5]"
          className="col-span-2 mx-auto mt-16 w-full max-w-sm md:col-span-6 md:col-start-4 md:mt-28"
          delay={0.1}
        />
      </div>
    </section>
  )
}
