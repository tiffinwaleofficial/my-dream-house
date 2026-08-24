'use client'

import { Suspense } from 'react'
import { BAY_WIDTH, BAY_DEPTH, BAY_HEIGHT, WALL_THICKNESS, type TourStop } from '@/lib/house-tour-layout'
import { FurnitureMesh } from './furniture-mesh'
import { PhotoPanel } from './photo-panel'

export function RoomBay({ stop }: { stop: TourStop }) {
  const isSide = stop.orientation !== 'forward'
  const sideSign = stop.sideSign === 0 ? 1 : stop.sideSign

  return (
    <group position={[stop.offsetX, 0, stop.centerZ]}>
      {/* far wall, capping the bay */}
      <mesh position={[0, BAY_HEIGHT / 2, -(BAY_DEPTH / 2)]}>
        <boxGeometry args={[BAY_WIDTH, BAY_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
      </mesh>

      {isSide && (
        <mesh position={[sideSign * (BAY_WIDTH / 2), BAY_HEIGHT / 2, 0]}>
          <boxGeometry args={[WALL_THICKNESS, BAY_HEIGHT, BAY_DEPTH]} />
          <meshStandardMaterial color={stop.wallColor} roughness={0.95} />
        </mesh>
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
