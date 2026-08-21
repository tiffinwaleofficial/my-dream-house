'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * A portrait placeholder that sits inside the house story.
 * Swap the image file at `src` with a real photo of Riya — the layout,
 * framing and animation stay exactly the same.
 */
export function RiyaPortrait({
  src,
  alt,
  caption,
  className,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
}) {
  return (
    <motion.figure
      className={cn('relative', className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        data-cursor="image"
        className="relative aspect-[3/4] w-full overflow-hidden bg-cream"
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 60vw, 30vw" className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-3 label-caps text-muted-foreground">{caption}</figcaption>
      ) : null}
    </motion.figure>
  )
}
