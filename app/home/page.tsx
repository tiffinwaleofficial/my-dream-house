import type { Metadata } from 'next'
import { HouseTourClient } from './house-tour-client'

export const metadata: Metadata = {
  title: 'The House of Riya — Walk Through in 3D',
  description: 'A scroll-driven 3D walkthrough of the house, room by room.',
}

export default function HouseTourPage() {
  return <HouseTourClient />
}
