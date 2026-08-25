'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import {
  buildCameraPath,
  DOOR_WIDTH,
  stopLookPoint,
  stopProgressPoints,
  TOUR_STOPS,
} from '@/lib/house-tour-layout'

/** How far either side of a doorway the camera still turns to look inside. */
const DOORWAY_REACH = DOOR_WIDTH / 2 + 0.75

/**
 * Eases scroll so the walk lingers at each doorway and covers the blank
 * stretches of corridor more briskly. Without it the camera spends most of the
 * scroll drifting past shut sections of hallway and only glances into a room.
 */
function dwellAtStops(t: number, stops: number[]): number {
  if (stops.length < 2) return t
  if (t <= stops[0] || t >= stops[stops.length - 1]) return t
  let i = 0
  while (i < stops.length - 2 && t > stops[i + 1]) i++
  const span = stops[i + 1] - stops[i]
  if (span <= 0) return t
  const s = (t - stops[i]) / span
  const eased = s * s * s * (s * (s * 6 - 15) + 10) // smootherstep
  return stops[i] + eased * span
}

/**
 * Drives the camera from scroll progress.
 *
 * Position follows a smooth Catmull-Rom path down the corridor. The look
 * direction is *not* taken from a matching curve: because the rooms alternate
 * sides, smoothing between a left-hand and a right-hand target averages back
 * to straight down the hallway, so the camera never actually looks into any
 * room. Instead it blends between looking down the corridor while walking and
 * looking into a room as it arrives — which is also just what a person does.
 */
export function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree()

  const { path, lookPoints, stopPoints } = useMemo(
    () => ({
      path: buildCameraPath(TOUR_STOPS),
      lookPoints: TOUR_STOPS.map(stopLookPoint),
      stopPoints: stopProgressPoints(),
    }),
    [],
  )

  const currentPos = useRef(path.positionCurve.getPointAt(0).clone())
  const currentTarget = useRef(new THREE.Vector3(0, 1.6, 0))
  const desiredPos = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const corridorAhead = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const raw = THREE.MathUtils.clamp(progress.get(), 0, 1)
    const t = dwellAtStops(raw, stopPoints)
    path.positionCurve.getPointAt(t, desiredPos.current)

    // Which room are we actually standing outside, and are we far enough
    // into its doorway to see in? Measured in world space rather than in
    // scroll progress: a room is only worth turning toward while the doorway
    // is genuinely in front of you. Judging it by progress alone leaves the
    // camera still turned into a room it has already walked past, staring at
    // the solid wall beside the door.
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < TOUR_STOPS.length; i++) {
      const d = Math.abs(TOUR_STOPS[i].centerZ - desiredPos.current.z)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    }
    const closeness = THREE.MathUtils.smoothstep(
      1 - THREE.MathUtils.clamp(nearestDist / DOORWAY_REACH, 0, 1),
      0,
      1,
    )

    // where the corridor carries on, for the walking-between-rooms look
    const ahead = Math.min(t + 0.035, 1)
    path.positionCurve.getPointAt(ahead, corridorAhead.current)
    if (corridorAhead.current.distanceToSquared(desiredPos.current) < 0.0001) {
      corridorAhead.current.set(desiredPos.current.x, desiredPos.current.y, desiredPos.current.z - 6)
    }
    corridorAhead.current.y = desiredPos.current.y

    desiredTarget.current.copy(corridorAhead.current).lerp(lookPoints[nearest], closeness)

    const damp = 1 - Math.exp(-3.4 * delta)
    currentPos.current.lerp(desiredPos.current, damp)
    currentTarget.current.lerp(desiredTarget.current, damp)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}
