'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/** Deterministic RNG, defined outside the component so the scatter is stable. */
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/**
 * Instanced grass blades for the entry yard. Real geometry rather than a flat
 * green plane — from the approach shot you can actually see individual blades
 * catching the light. One draw call, so it stays cheap.
 */
export function GrassField({
  count = 14000,
  /** area covered, centred on `center` */
  width = 30,
  depth = 17,
  center = [0, 0, 6] as [number, number, number],
  /** blades are kept out of these axis-aligned boxes (building footprints) */
  exclude = [],
}: {
  count?: number
  width?: number
  depth?: number
  center?: [number, number, number]
  exclude?: { minX: number; maxX: number; minZ: number; maxZ: number }[]
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // a single tapered blade, pivoted at its base — kept genuinely lawn-sized;
  // anything taller reads as a field of spikes rather than grass
  const geometry = useMemo(() => {
    const g = new THREE.ConeGeometry(0.012, 0.15, 3, 1)
    g.translate(0, 0.075, 0)
    return g
  }, [])

  const { matrices, colors } = useMemo(() => {
    const m: THREE.Matrix4[] = []
    const c: THREE.Color[] = []
    const dummy = new THREE.Object3D()
    // deterministic scatter, so the field doesn't reshuffle between renders
    const rand = makeRng(20260824)

    const base = new THREE.Color('#7f9a6f')
    const warm = new THREE.Color('#a8bb84')
    const deep = new THREE.Color('#5c7355')

    let guard = 0
    while (m.length < count && guard < count * 6) {
      guard++
      const x = center[0] + (rand() - 0.5) * width
      const z = center[2] + (rand() - 0.5) * depth
      if (exclude.some((b) => x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ)) continue

      const h = 0.6 + rand() * 0.75
      dummy.position.set(x, 0, z)
      // a good lean, so the lawn catches light unevenly the way real grass does
      dummy.rotation.set((rand() - 0.5) * 0.6, rand() * Math.PI * 2, (rand() - 0.5) * 0.6)
      dummy.scale.set(0.8 + rand() * 0.5, h, 0.8 + rand() * 0.5)
      dummy.updateMatrix()
      m.push(dummy.matrix.clone())

      const t = rand()
      const col = base.clone().lerp(t > 0.62 ? warm : deep, rand() * 0.75)
      c.push(col)
    }
    return { matrices: m, colors: c }
  }, [count, width, depth, center, exclude])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    matrices.forEach((mat, i) => mesh.setMatrixAt(i, mat))
    colors.forEach((col, i) => mesh.setColorAt(i, col))
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [matrices, colors])

  return (
    // deliberately does not cast shadows: re-rendering every blade into the
    // shadow map roughly doubles its cost for a detail nobody can resolve
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, matrices.length]}
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial roughness={0.85} />
    </instancedMesh>
  )
}
