'use client'

import type { FurniturePiece } from '@/lib/house-tour-layout'

/** Renders one declarative furniture primitive, mirrored on X for left-hand bays. */
export function FurnitureMesh({ piece, mirror }: { piece: FurniturePiece; mirror: 1 | -1 }) {
  const [x, y, z] = piece.position
  const position: [number, number, number] = [x * mirror, y, z]
  const rotationX = piece.rotationX ?? 0
  const rotationY = piece.rotationY ?? 0
  const rotationZ = (piece.rotationZ ?? 0) * mirror

  const materialProps = {
    color: piece.color,
    metalness: piece.metalness ?? 0.05,
    roughness: piece.roughness ?? 0.75,
    emissive: piece.emissive,
    emissiveIntensity: piece.emissiveIntensity ?? 0,
  }

  if (piece.shape === 'box') {
    return (
      <mesh position={position} rotation={[rotationX, rotationY, rotationZ]} castShadow={false}>
        <boxGeometry args={piece.size} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    )
  }

  if (piece.shape === 'cylinder') {
    const [rTop, rBottom, height] = piece.size
    return (
      <mesh position={position} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[rTop, rBottom, height, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    )
  }

  const [radius] = piece.size
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}
