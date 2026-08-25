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
  WALL_THICKNESS,
  STOP_SPACING,
  NEIGHBORHOOD_PROPS,
  corridorFillerSegments,
} from '@/lib/house-tour-layout'
import { RoomBay } from './room-bay'
import { CameraRig } from './camera-rig'
import { FurnitureMesh } from './furniture-mesh'
import { GrassField } from './grass-field'
import { HouseExterior } from './house-exterior'
import { useWoodFloorTexture } from './textures'

export function Scene({
  progress,
  activeIndex,
}: {
  progress: MotionValue<number>
  activeIndex: number
}) {
  const houseHalfWidth = CORRIDOR_HALF_WIDTH + BAY_WIDTH
  const corridorFloorTex = useWoodFloorTexture(2, 26)

  const herStop = TOUR_STOPS[TOUR_STOPS.length - 1]
  const corridorStartZ = -BAY_DEPTH / 2
  const corridorEndZ = herStop.centerZ + STOP_SPACING * 0.5
  const corridorLength = corridorStartZ - corridorEndZ
  const corridorCenterZ = (corridorStartZ + corridorEndZ) / 2

  return (
    <>
      {/* procedural atmospheric sky — no texture, no network fetch */}
      <Sky distance={450} sunPosition={[-14, 18, 26]} turbidity={1.6} rayleigh={1.1} mieCoefficient={0.004} />

      <fog attach="fog" args={['#dfe9f0', 46, 135]} />
      <ambientLight intensity={0.42} color="#eef4f8" />
      <hemisphereLight args={['#cfe4f2', '#b9ab92', 0.75]} />
      {/* the sun: the one shadow-casting light, aimed at the entry */}
      {/* The shadow frustum is kept tight around the entry and yard — the only
          place shadows actually read — rather than stretched over the whole
          100m corridor, which would spend the whole shadow map on nothing. */}
      <directionalLight
        position={[-16, 22, 24]}
        intensity={2.5}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0008}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-17, 17, 17, -14, 1, 62]} />
      </directionalLight>

      {/* ground: grass everywhere outside, timber underfoot inside the corridor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -Math.abs(TOTAL_LENGTH) / 2 + 8]} receiveShadow>
        <planeGeometry args={[220, Math.abs(TOTAL_LENGTH) + 190]} />
        <meshStandardMaterial color="#6f8a63" roughness={1} />
      </mesh>

      <GrassField
        count={26000}
        width={26}
        depth={15}
        center={[0, 0, 6.5]}
        exclude={[
          // the house itself, plus its front step
          { minX: -houseHalfWidth - 0.6, maxX: houseHalfWidth + 0.6, minZ: -60, maxZ: BAY_DEPTH / 2 + 1.2 },
          // the neighbours, so grass doesn't grow up through their walls
          { minX: -10.4, maxX: -6.6, minZ: 3.6, maxZ: 7.4 },
          { minX: 6.4, maxX: 9.6, minZ: 4.9, maxZ: 8.1 },
          { minX: 9.8, maxX: 12.2, minZ: 0.8, maxZ: 3.2 },
        ]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, corridorCenterZ]} receiveShadow>
        <planeGeometry args={[CORRIDOR_HALF_WIDTH * 2, corridorLength]} />
        {corridorFloorTex ? (
          <meshStandardMaterial map={corridorFloorTex} roughness={0.6} />
        ) : (
          <meshStandardMaterial color="#a8794f" roughness={0.6} />
        )}
      </mesh>

      <HouseExterior />

      {NEIGHBORHOOD_PROPS.map((piece, i) => (
        <FurnitureMesh key={i} piece={piece} mirror={1} />
      ))}

      {/* corridor ceiling, open only at the closing threshold */}
      <mesh position={[0, BAY_HEIGHT + CEILING_THICKNESS / 2, corridorCenterZ]} receiveShadow>
        <boxGeometry args={[CORRIDOR_HALF_WIDTH * 2 + 0.4, CEILING_THICKNESS, corridorLength]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.97} />
      </mesh>

      {/* walls closing the stretches of corridor between rooms */}
      {([1, -1] as const).map((side) =>
        corridorFillerSegments(side).map((seg, i) => (
          <mesh
            key={`${side}-${i}`}
            position={[side * CORRIDOR_HALF_WIDTH, BAY_HEIGHT / 2, seg.centerZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[WALL_THICKNESS, BAY_HEIGHT, seg.length]} />
            <meshStandardMaterial color="#ece5da" roughness={0.94} />
          </mesh>
        )),
      )}

      {TOUR_STOPS.map((stop, i) => (
        <RoomBay key={stop.id} stop={stop} lit={Math.abs(i - activeIndex) <= 2} />
      ))}

      <CameraRig progress={progress} />
    </>
  )
}
