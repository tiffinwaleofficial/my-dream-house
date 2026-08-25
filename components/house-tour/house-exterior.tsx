'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import {
  BAY_WIDTH,
  BAY_DEPTH,
  BAY_HEIGHT,
  CORRIDOR_HALF_WIDTH,
  ROOF_RISE,
  ROOF_OVERHANG,
} from '@/lib/house-tour-layout'
import { useRoofTileTexture, usePlasterTexture } from './textures'

/** How far back along -Z the exterior shell and roof are built. */
const EXTERIOR_DEPTH = 26

/**
 * The outside of the house, as seen on the approach to the front door.
 *
 * The roof spans the *whole* house footprint (corridor plus the rooms either
 * side) and runs deep along -Z — an earlier version only roofed the entry bay,
 * which left the rooms beside and behind it standing out in the open as bare
 * slabs. The ridge runs along Z so the gable end faces the camera; rotating
 * that the other way renders a pitched roof edge-on as a paper-thin line.
 */
export function HouseExterior() {
  const tiles = useRoofTileTexture(10, 14)
  const plaster = usePlasterTexture('#efe7d8', 3, 2)

  const halfW = CORRIDOR_HALF_WIDTH + BAY_WIDTH
  const frontZ = BAY_DEPTH / 2
  const entryHalf = BAY_WIDTH / 2

  const eaveY = BAY_HEIGHT - 0.1
  const ridgeY = eaveY + ROOF_RISE
  const run = halfW + ROOF_OVERHANG
  const pitch = Math.atan2(ROOF_RISE, run)
  const slope = Math.hypot(run, ROOF_RISE)
  const roofDepth = EXTERIOR_DEPTH + ROOF_OVERHANG * 2
  const roofCenterZ = frontZ + ROOF_OVERHANG - roofDepth / 2

  const gable = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-halfW, 0)
    shape.lineTo(halfW, 0)
    shape.lineTo(0, ROOF_RISE)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false })
  }, [halfW])

  const wallMaterial = plaster ? (
    <meshStandardMaterial map={plaster} roughness={0.92} />
  ) : (
    <meshStandardMaterial color="#efe7d8" roughness={0.92} />
  )

  return (
    <group>
      {/* front facade either side of the entry, so the house has one continuous face */}
      {([1, -1] as const).map((side) => {
        const wingWidth = halfW - entryHalf
        return (
          <mesh
            key={side}
            position={[side * (entryHalf + wingWidth / 2), BAY_HEIGHT / 2, frontZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wingWidth, BAY_HEIGHT, 0.16]} />
            {wallMaterial}
          </mesh>
        )
      })}

      {/* outer side walls running the length of the visible house */}
      {([1, -1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * halfW, BAY_HEIGHT / 2, frontZ - EXTERIOR_DEPTH / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.16, BAY_HEIGHT, EXTERIOR_DEPTH]} />
          {wallMaterial}
        </mesh>
      ))}

      {/* the gable end facing the approach */}
      <mesh geometry={gable} position={[0, eaveY, frontZ - 0.09]} castShadow receiveShadow>
        {wallMaterial}
      </mesh>

      {/* the two pitched roof planes, spanning the full width of the house */}
      {([1, -1] as const).map((side) => (
        <group key={side}>
          <mesh
            position={[side * (run / 2), eaveY + ROOF_RISE / 2, roofCenterZ]}
            rotation={[0, 0, side * -pitch]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[slope, 0.16, roofDepth]} />
            {tiles ? (
              <meshStandardMaterial map={tiles} roughness={0.85} />
            ) : (
              <meshStandardMaterial color="#8d4f36" roughness={0.85} />
            )}
          </mesh>
          {/* fascia along the eave, so the roof edge has real thickness */}
          <mesh position={[side * run, eaveY - 0.12, roofCenterZ]} castShadow>
            <boxGeometry args={[0.12, 0.26, roofDepth]} />
            <meshStandardMaterial color="#6b4f34" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ridge cap */}
      <mesh position={[0, ridgeY + 0.05, roofCenterZ]} castShadow>
        <boxGeometry args={[0.3, 0.14, roofDepth]} />
        <meshStandardMaterial color="#7a4230" roughness={0.8} />
      </mesh>

      {/* chimney */}
      <mesh position={[halfW * 0.42, ridgeY + 0.45, frontZ - 5.5]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.5, 0.62]} />
        <meshStandardMaterial color="#c8b9a2" roughness={0.9} />
      </mesh>
      <mesh position={[halfW * 0.42, ridgeY + 1.24, frontZ - 5.5]} castShadow>
        <boxGeometry args={[0.76, 0.12, 0.76]} />
        <meshStandardMaterial color="#8d7f6b" roughness={0.85} />
      </mesh>

      {/* a shallow step up to the threshold */}
      <mesh position={[0, 0.07, frontZ + 0.6]} receiveShadow castShadow>
        <boxGeometry args={[BAY_WIDTH * 0.8, 0.14, 1.1]} />
        <meshStandardMaterial color="#d8cdb8" roughness={0.9} />
      </mesh>

      {/* a pair of windows on the front face, so the facade isn't a blank plane */}
      {([1, -1] as const).map((side) => (
        <group key={side} position={[side * (entryHalf + 1.35), 1.55, frontZ + 0.09]}>
          {/* glazing, sitting proud of the wall so it actually catches light */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.15, 0.06]} />
            <meshStandardMaterial color="#31485a" roughness={0.1} metalness={0.6} />
          </mesh>
          {/* a surrounding frame reads better at this distance than a cross of bars */}
          {[
            { p: [0, 0.62, 0.02], s: [1.5, 0.1, 0.1] },
            { p: [0, -0.62, 0.02], s: [1.5, 0.1, 0.1] },
            { p: [-0.7, 0, 0.02], s: [0.1, 1.34, 0.1] },
            { p: [0.7, 0, 0.02], s: [0.1, 1.34, 0.1] },
          ].map((bar, i) => (
            <mesh key={i} position={bar.p as [number, number, number]} castShadow>
              <boxGeometry args={bar.s as [number, number, number]} />
              <meshStandardMaterial color="#faf7f1" roughness={0.5} />
            </mesh>
          ))}
          {/* one central glazing bar, and a sill below */}
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.06, 1.24, 0.09]} />
            <meshStandardMaterial color="#faf7f1" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.72, 0.04]} castShadow>
            <boxGeometry args={[1.66, 0.11, 0.2]} />
            <meshStandardMaterial color="#faf7f1" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
