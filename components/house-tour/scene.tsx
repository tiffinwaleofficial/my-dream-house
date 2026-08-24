'use client'

import type { MotionValue } from 'motion/react'
import { TOUR_STOPS, TOTAL_LENGTH, CORRIDOR_HALF_WIDTH, BAY_WIDTH } from '@/lib/house-tour-layout'
import { RoomBay } from './room-bay'
import { CameraRig } from './camera-rig'

export function Scene({ progress }: { progress: MotionValue<number> }) {
  const floorWidth = (CORRIDOR_HALF_WIDTH + BAY_WIDTH) * 2 + 2
  const floorLength = Math.abs(TOTAL_LENGTH) + 20

  return (
    <>
      <fog attach="fog" args={['#f3ece0', 10, 42]} />
      <ambientLight intensity={0.6} color="#f6f2ec" />
      <directionalLight position={[8, 16, 8]} intensity={0.35} color="#ffffff" />
      <hemisphereLight args={['#fff6e8', '#c9bfa8', 0.4]} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, -Math.abs(TOTAL_LENGTH) / 2 + 8]}
      >
        <planeGeometry args={[floorWidth, floorLength]} />
        <meshStandardMaterial color="#ede7de" roughness={0.95} />
      </mesh>

      {TOUR_STOPS.map((stop) => (
        <RoomBay key={stop.id} stop={stop} />
      ))}

      <CameraRig progress={progress} />
    </>
  )
}
