'use client'

import { Suspense } from 'react'
import {
  BAY_WIDTH,
  BAY_DEPTH,
  BAY_HEIGHT,
  WALL_THICKNESS,
  DOOR_WIDTH,
  DOOR_HEIGHT,
  CEILING_THICKNESS,
  type TourStop,
} from '@/lib/house-tour-layout'
import { FurnitureMesh } from './furniture-mesh'
import { PhotoPanel } from './photo-panel'

const ROOF_RISE = 1.05
const ROOF_RUN = 1.5
const ROOF_PITCH = Math.atan2(ROOF_RISE, ROOF_RUN)
const ROOF_SLOPE_LEN = Math.hypot(ROOF_RISE, ROOF_RUN)
const ROOF_WIDTH = BAY_WIDTH + 0.6

export function RoomBay({ stop }: { stop: TourStop }) {
  const isSide = stop.orientation !== 'forward'
  const isEntry = stop.id === 'entry'
  const sideSign = stop.sideSign === 0 ? 1 : stop.sideSign

  const jambDepth = (BAY_DEPTH - DOOR_WIDTH) / 2
  const jambCenterZ = DOOR_WIDTH / 2 + jambDepth / 2
  const headerHeight = BAY_HEIGHT - DOOR_HEIGHT
  const headerCenterY = DOOR_HEIGHT + headerHeight / 2

  const frontJambWidth = (BAY_WIDTH - DOOR_WIDTH) / 2
  const frontJambCenterX = DOOR_WIDTH / 2 + frontJambWidth / 2

  return (
    <group position={[stop.offsetX, 0, stop.centerZ]}>
      {/* far wall, capping the bay */}
      <mesh position={[0, BAY_HEIGHT / 2, -(BAY_DEPTH / 2)]}>
        <boxGeometry args={[BAY_WIDTH, BAY_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
      </mesh>

      {/* ceiling — every bay except the closing threshold, which opens up instead of boxing in */}
      {stop.id !== 'her' && (
        <mesh position={[0, BAY_HEIGHT + CEILING_THICKNESS / 2, 0]}>
          <boxGeometry args={[BAY_WIDTH, CEILING_THICKNESS, BAY_DEPTH]} />
          <meshStandardMaterial color={stop.wallColor} roughness={0.98} />
        </mesh>
      )}

      {isSide && (
        <>
          {/* outer side wall */}
          <mesh position={[sideSign * (BAY_WIDTH / 2), BAY_HEIGHT / 2, 0]}>
            <boxGeometry args={[WALL_THICKNESS, BAY_HEIGHT, BAY_DEPTH]} />
            <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
          </mesh>

          {/* corridor-facing wall, with a real doorway cut into it (two jambs + a header) */}
          <mesh position={[-sideSign * (BAY_WIDTH / 2), BAY_HEIGHT / 2, jambCenterZ]}>
            <boxGeometry args={[WALL_THICKNESS, BAY_HEIGHT, jambDepth]} />
            <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
          </mesh>
          <mesh position={[-sideSign * (BAY_WIDTH / 2), BAY_HEIGHT / 2, -jambCenterZ]}>
            <boxGeometry args={[WALL_THICKNESS, BAY_HEIGHT, jambDepth]} />
            <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
          </mesh>
          <mesh position={[-sideSign * (BAY_WIDTH / 2), headerCenterY, 0]}>
            <boxGeometry args={[WALL_THICKNESS, headerHeight, DOOR_WIDTH]} />
            <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
          </mesh>
        </>
      )}

      {isEntry && (
        <>
          {/* the house's own front facade, with a doorway and a gabled roof over it */}
          <mesh position={[frontJambCenterX, BAY_HEIGHT / 2, BAY_DEPTH / 2]}>
            <boxGeometry args={[frontJambWidth, BAY_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color="#e6dcc8" roughness={0.9} />
          </mesh>
          <mesh position={[-frontJambCenterX, BAY_HEIGHT / 2, BAY_DEPTH / 2]}>
            <boxGeometry args={[frontJambWidth, BAY_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color="#e6dcc8" roughness={0.9} />
          </mesh>
          <mesh position={[0, headerCenterY, BAY_DEPTH / 2]}>
            <boxGeometry args={[DOOR_WIDTH, headerHeight, WALL_THICKNESS]} />
            <meshStandardMaterial color="#e6dcc8" roughness={0.9} />
          </mesh>

          {/* ridge runs left-right (along X) so the pitched surfaces actually face the approaching camera */}
          <mesh
            position={[0, BAY_HEIGHT + ROOF_RISE / 2, BAY_DEPTH / 2 + ROOF_RUN / 2]}
            rotation={[-ROOF_PITCH, 0, 0]}
          >
            <boxGeometry args={[ROOF_WIDTH, WALL_THICKNESS, ROOF_SLOPE_LEN]} />
            <meshStandardMaterial color="#6b4f34" roughness={0.85} />
          </mesh>
          <mesh
            position={[0, BAY_HEIGHT + ROOF_RISE / 2, BAY_DEPTH / 2 - ROOF_RUN / 2]}
            rotation={[ROOF_PITCH, 0, 0]}
          >
            <boxGeometry args={[ROOF_WIDTH, WALL_THICKNESS, ROOF_SLOPE_LEN]} />
            <meshStandardMaterial color="#6b4f34" roughness={0.85} />
          </mesh>
        </>
      )}

      <Suspense fallback={null}>
        <PhotoPanel
          image={stop.image}
          position={
            isSide
              ? [sideSign * (BAY_WIDTH / 2 - 0.25), BAY_HEIGHT / 2, 0]
              : [0, BAY_HEIGHT / 2, -(BAY_DEPTH / 2 - 0.25)]
          }
          rotationY={isSide ? -sideSign * (Math.PI / 2) : 0}
          maxWidth={isSide ? BAY_DEPTH - 1.4 : BAY_WIDTH - 1.4}
          maxHeight={BAY_HEIGHT - 1}
        />
      </Suspense>

      {stop.furniture.map((piece, i) => (
        <FurnitureMesh key={i} piece={piece} mirror={sideSign} />
      ))}

      <pointLight
        position={isSide ? [sideSign * BAY_WIDTH * 0.3, BAY_HEIGHT * 0.75, 0] : [0, BAY_HEIGHT * 0.75, -(BAY_DEPTH / 2 - 1)]}
        color={stop.lightColor}
        intensity={stop.lightIntensity}
        distance={7}
        decay={2}
      />
    </group>
  )
}
