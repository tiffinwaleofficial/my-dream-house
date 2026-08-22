'use client'

import { Fragment, useState } from 'react'
import { rooms } from '@/lib/rooms'
import { SmoothScroll } from '@/components/smooth-scroll'
import { CustomCursor } from '@/components/custom-cursor'
import { IntroExperience } from '@/components/intro-experience'
import { HeroHouse } from '@/components/hero-house'
import { StorySection } from '@/components/story-section'
import { HouseMap } from '@/components/house-map'
import { RoomSection } from '@/components/room-section'
import { SanskritTransition } from '@/components/sanskrit-transition'
import { HerCollage } from '@/components/her-collage'
import { HerHeart } from '@/components/her-heart'
import { HerParents } from '@/components/her-parents'
import { FinalExperience } from '@/components/final-experience'
import { RoomNavigation } from '@/components/room-navigation'
import { SecretFeather } from '@/components/secret-feather'
import { AmbientSound } from '@/components/ambient-sound'

export default function Page() {
  const [entered, setEntered] = useState(false)

  return (
    <SmoothScroll>
      <CustomCursor />
      <IntroExperience onEnter={() => setEntered(true)} />
      <RoomNavigation visible={entered} />
      <SecretFeather visible={entered} />
      <AmbientSound visible={entered} />

      <main className="bg-background">
        <HeroHouse />
        <StorySection />
        <HouseMap />

        {rooms.map((room) => (
          <Fragment key={room.id}>
            {room.id === 'spiritual' && (
              <SanskritTransition caption="A quiet place for strength, gratitude and peace." />
            )}
            <RoomSection room={room} />
          </Fragment>
        ))}

        <HerCollage />
        <HerHeart />
        <HerParents />
        <FinalExperience />
      </main>
    </SmoothScroll>
  )
}
