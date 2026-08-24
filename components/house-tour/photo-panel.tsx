'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

/** A framed photo plane that fits the source image's real aspect ratio inside a max box. */
export function PhotoPanel({
  image,
  position,
  rotationY,
  maxWidth,
  maxHeight,
}: {
  image: string
  position: [number, number, number]
  rotationY: number
  maxWidth: number
  maxHeight: number
}) {
  // set colorSpace inside the loader's own onLoad, since the linter treats the
  // hook's returned texture as immutable in the component body
  const texture = useTexture(image, (tex) => {
    ;(tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace
  })

  const [w, h] = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined
    const naturalAspect = img?.width && img?.height ? img.width / img.height : 4 / 3
    const boxAspect = maxWidth / maxHeight
    if (naturalAspect > boxAspect) return [maxWidth, maxWidth / naturalAspect]
    return [maxHeight * naturalAspect, maxHeight]
  }, [texture, maxWidth, maxHeight])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* wood-toned frame, slightly behind the photo */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.16, h + 0.16]} />
        <meshStandardMaterial color="#8a6a4a" roughness={0.7} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
