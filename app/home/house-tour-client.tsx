'use client'

import dynamic from 'next/dynamic'

const TourExperience = dynamic(
  () => import('@/components/house-tour/tour-experience').then((m) => m.TourExperience),
  { ssr: false },
)

export function HouseTourClient() {
  return <TourExperience />
}
