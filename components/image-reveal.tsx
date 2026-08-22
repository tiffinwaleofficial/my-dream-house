'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export function ImageReveal({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  zoom = true,
  rounded = false,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  zoom?: boolean
  rounded?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // gentle parallax zoom as the image passes through the viewport
  const scale = useTransform(scrollYProgress, [0, 1], zoom ? [1.12, 1] : [1, 1])

  return (
    <div
      ref={ref}
      data-cursor="image"
      className={cn('relative overflow-hidden bg-cream', rounded && 'rounded-sm', className)}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
        // a numeric `amount` here never resolves (motion 13.1.1), leaving the
        // reveal permanently clipped — an equivalent `margin` avoids that path
        viewport={{ once: true, margin: '0px 0px -30% 0px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  )
}
