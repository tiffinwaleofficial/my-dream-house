'use client'

import { Sky } from '@react-three/drei'
import type { MotionValue } from 'motion/react'
import {
  TOUR_STOPS,
  TOTAL_LENGTH,
  CORRIDOR_HALF_WIDTH,
  BAY_WIDTH,
  BAY_DEPTH,
  BAY_HEIGHT,
  CEILING_THICKNESS,
  STOP_SPACING,
  NEIGHBORHOOD_PROPS,
} from '@/lib/house-tour-layout'
import { RoomBay } from './room-bay'
import { CameraRig } from './camera-rig'
import { FurnitureMesh } from './furniture-mesh'

export function Scene({ progress }: { progress: MotionValue<number> }) {
  const floorWidth = (CORRIDOR_HALF_WIDTH + BAY_WIDTH) * 2 + 2
  const floorLength = Math.abs(TOTAL_LENGTH) + 20

  // a continuous ceiling over the corridor walkway itself — each room bay only
  // ceils its own footprint, which left the walkway between them open to sky.
  // Runs from just past the entry threshold to just before the closing "her"
  // stop, which stays open-topped on purpose for the final emotional beat.
  const herStop = TOUR_STOPS[TOUR_STOPS.length - 1]
  const corridorCeilingStartZ = -(BAY_DEPTH / 2 - 0.3)
  const corridorCeilingEndZ = herStop.centerZ + STOP_SPACING * 0.5
  const corridorCeilingLength = corridorCeilingStartZ - corridorCeilingEndZ
  const corridorCeilingCenterZ = (corridorCeilingStartZ + corridorCeilingEndZ) / 2

  return (
    <>
      {/* fully procedural, no external HDRI/textures — safe to render offline */}
      <Sky distance={500} sunPosition={[-10, 22, 18]} turbidity={2} rayleigh={1.4} mieCoefficient={0.003} />

      <fog attach="fog" args={['#f3ece0', 12, 46]} />
      <ambientLight intensity={0.6} color="#f6f2ec" />
      <directionalLight position={[8, 16, 8]} intensity={0.35} color="#ffffff" />
      <hemisphereLight args={['#e6f1f6', '#c9bfa8', 0.45]} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, -Math.abs(TOTAL_LENGTH) / 2 + 8]}
      >
        <planeGeometry args={[floorWidth * 3, floorLength]} />
        <meshStandardMaterial color="#ede7de" roughness={0.95} />
      </mesh>

      {/* the yard: a patch of grass around the entry facade, with a small neighborhood beyond it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 6]}>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#8fa688" roughness={1} />
      </mesh>
      {NEIGHBORHOOD_PROPS.map((piece, i) => (
        <FurnitureMesh key={i} piece={piece} mirror={1} />
      ))}

      {/* generously overwide so no camera angle from inside a room can see past its edge to the sky —
          the Z span stays tight to the corridor so it never floats visibly above the entry yard */}
      <mesh position={[0, BAY_HEIGHT + CEILING_THICKNESS / 2, corridorCeilingCenterZ]}>
        <boxGeometry args={[floorWidth * 3, CEILING_THICKNESS, corridorCeilingLength]} />
        <meshStandardMaterial color="#ede7de" roughness={0.98} />
      </mesh>

      {/* an outer perimeter wall, well past every room's own outer wall, so a level sightline out of a
          room never slips sideways past its wall's finite edge into open sky — a plain, mostly-unseen shell */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (floorWidth / 2 + 3), BAY_HEIGHT / 2, corridorCeilingCenterZ]}>
          <boxGeometry args={[0.3, BAY_HEIGHT, corridorCeilingLength]} />
          <meshStandardMaterial color="#ede7de" roughness={0.95} />
        </mesh>
      ))}

      {TOUR_STOPS.map((stop) => (
        <RoomBay key={stop.id} stop={stop} />
      ))}

      <CameraRig progress={progress} />
    </>
  )
}
