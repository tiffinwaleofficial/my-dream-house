'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { buildCameraPath, TOUR_STOPS } from '@/lib/house-tour-layout'

/** Reads scroll progress each frame and glides the camera along the tour's curve, damped for smoothness. */
export function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree()
  const path = useMemo(() => buildCameraPath(TOUR_STOPS), [])
  const currentPos = useRef(path.positionCurve.getPointAt(0).clone())
  const currentTarget = useRef(path.targetCurve.getPointAt(0).clone())
  const desiredPos = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1)
    path.positionCurve.getPointAt(t, desiredPos.current)
    path.targetCurve.getPointAt(t, desiredTarget.current)

    const damp = 1 - Math.exp(-4 * delta)
    currentPos.current.lerp(desiredPos.current, damp)
    currentTarget.current.lerp(desiredTarget.current, damp)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}
