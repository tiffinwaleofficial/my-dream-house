'use client'

import { motion } from 'motion/react'
import type { Room } from '@/lib/rooms'
import { ImageReveal } from './image-reveal'
import { RiyaPortrait } from './riya-portrait'

const ease = [0.22, 1, 0.36, 1] as const

function RoomIntro({ room, align = 'left' }: { room: Room; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <motion.p
        className="label-caps text-muted-foreground"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease }}
      >
        {room.number}
      </motion.p>
      <motion.h3
        className="mt-4 font-serif text-4xl font-light leading-[1.02] tracking-tight text-foreground md:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease, delay: 0.08 }}
      >
        {room.title}
      </motion.h3>
      <motion.p
        className={`mt-4 max-w-md font-serif text-xl font-light italic text-muted-foreground md:text-2xl ${
          align === 'center' ? 'mx-auto' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease, delay: 0.16 }}
      >
        {room.subtitle}
      </motion.p>
    </div>
  )
}

function MetaList({ room }: { room: Room }) {
  if (!room.meta) return null
  const rows = [
    ['Light', room.meta.light],
    ['Mood', room.meta.mood],
    ['Element', room.meta.element],
  ]
  return (
    <dl className="flex flex-col gap-4">
      {rows.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3">
          <dt className="label-caps text-muted-foreground/70">{k}</dt>
          <dd className="mt-1 font-serif text-lg font-light text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function RoomSection({ room }: { room: Room }) {
  return (
    <section id={room.id} className="scroll-mt-0 py-20 md:py-28">
      {room.layout === 'full' && (
        <div>
          <div className="mx-auto mb-10 max-w-6xl px-6 md:mb-14">
            <RoomIntro room={room} />
          </div>
          <ImageReveal
            src={room.image}
            alt={room.alt}
            sizes="100vw"
            className="h-[70vh] w-full md:h-[92vh]"
          />
          {room.meta && (
            <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-x-10 gap-y-3 px-6">
              <span className="label-caps text-muted-foreground/70">
                Light — <span className="text-foreground">{room.meta.light}</span>
              </span>
              <span className="label-caps text-muted-foreground/70">
                Mood — <span className="text-foreground">{room.meta.mood}</span>
              </span>
              <span className="label-caps text-muted-foreground/70">
                Element — <span className="text-foreground">{room.meta.element}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {room.layout === 'wide' && (
        <div className="mx-auto max-w-6xl px-6">
          <RoomIntro room={room} />
          <ImageReveal
            src={room.image}
            alt={room.alt}
            sizes="(max-width: 768px) 100vw, 90vw"
            className="mt-10 aspect-[16/10] w-full md:mt-14"
          />
          {room.portrait && (
            <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto]">
              <p className="max-w-lg font-serif text-2xl font-light leading-snug text-foreground md:text-3xl">
                {room.subtitle}
              </p>
              <RiyaPortrait
                src={room.portrait}
                alt={room.portraitAlt ?? room.alt}
                className="w-44 justify-self-end md:w-56"
              />
            </div>
          )}
        </div>
      )}

      {room.layout === 'split' && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <RoomIntro room={room} />
            {room.portrait && (
              <RiyaPortrait
                src={room.portrait}
                alt={room.portraitAlt ?? room.alt}
                className="mt-10 w-40 md:w-52"
              />
            )}
          </div>
          <ImageReveal
            src={room.image}
            alt={room.alt}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="order-1 aspect-[4/5] w-full md:order-2"
          />
        </div>
      )}

      {room.layout === 'meta' && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[1fr_2fr] md:items-end md:gap-16">
          <div className="flex flex-col gap-10">
            <RoomIntro room={room} />
            <MetaList room={room} />
          </div>
          <ImageReveal
            src={room.image}
            alt={room.alt}
            sizes="(max-width: 768px) 100vw, 66vw"
            className="aspect-[4/3] w-full"
          />
        </div>
      )}
    </section>
  )
}
