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
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_SILL,
  type TourStop,
} from '@/lib/house-tour-layout'
import { FurnitureMesh } from './furniture-mesh'
import { PhotoPanel } from './photo-panel'
import { Wall, Baseboard, CrownMolding, DoorUnit, WindowUnit } from './architecture'
import { useWoodFloorTexture } from './textures'

const TRIM = '#faf7f1'

/**
 * One room of the house: four walls, a ceiling, a finished floor, a real
 * cased door standing open onto the corridor, and a window to the outside.
 *
 * The camera views this from the corridor through the doorway, so the photo
 * panel goes on the wall opposite the door (the one you look straight at),
 * and the window goes on the far wall where it side-lights the room and
 * shows sky without competing with the photo.
 */
export function RoomBay({ stop, lit }: { stop: TourStop; lit: boolean }) {
  const isSide = stop.orientation !== 'forward'
  const sideSign = stop.sideSign === 0 ? 1 : stop.sideSign
  const floorTex = useWoodFloorTexture(3, 3)

  if (!isSide) return <ThresholdBay stop={stop} lit={lit} />

  const halfW = BAY_WIDTH / 2
  const halfD = BAY_DEPTH / 2
  const ceilingY = BAY_HEIGHT

  return (
    <group position={[stop.offsetX, 0, stop.centerZ]}>
      {/* finished floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[BAY_WIDTH, BAY_DEPTH]} />
        {floorTex ? (
          <meshStandardMaterial map={floorTex} roughness={0.62} />
        ) : (
          <meshStandardMaterial color="#a8794f" roughness={0.62} />
        )}
      </mesh>

      {/* ceiling */}
      <mesh position={[0, ceilingY + CEILING_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[BAY_WIDTH, CEILING_THICKNESS, BAY_DEPTH]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.97} />
      </mesh>

      {/* far wall — carries the window, so daylight rakes across the room */}
      <Wall
        width={BAY_WIDTH}
        height={BAY_HEIGHT}
        thickness={WALL_THICKNESS}
        color={stop.wallColor}
        position={[0, 0, -halfD]}
        opening={{
          centerX: 0,
          bottomY: WINDOW_SILL,
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
        }}
      >
        <WindowUnit
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          wallThickness={WALL_THICKNESS}
          position={[0, WINDOW_SILL, 0]}
          frameColor={TRIM}
        />
      </Wall>

      {/* near wall — the piece that was missing before, and the reason the
          tour read as a row of open stage sets instead of separate rooms */}
      <Wall
        width={BAY_WIDTH}
        height={BAY_HEIGHT}
        thickness={WALL_THICKNESS}
        color={stop.wallColor}
        position={[0, 0, halfD]}
      />

      {/* outer wall — faces the doorway, so it's what you look straight at */}
      <Wall
        width={BAY_DEPTH}
        height={BAY_HEIGHT}
        thickness={WALL_THICKNESS}
        color={stop.wallColor}
        position={[sideSign * halfW, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* corridor wall, with the cased doorway and its open door */}
      <Wall
        width={BAY_DEPTH}
        height={BAY_HEIGHT}
        thickness={WALL_THICKNESS}
        color={stop.wallColor}
        position={[-sideSign * halfW, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        opening={{ centerX: 0, bottomY: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT }}
      >
        {/* The wall is rotated the same way on both sides of the corridor, so
            the room interior lies toward opposite local directions for a left-
            hand and a right-hand bay. The swing has to flip with the side or
            the door opens out into the hallway and blocks the doorway. */}
        <DoorUnit
          width={DOOR_WIDTH}
          height={DOOR_HEIGHT}
          wallThickness={WALL_THICKNESS}
          hingeSide={1}
          openDir={sideSign === 1 ? 1 : -1}
          openAngle={2.7}
          casingColor={TRIM}
        />
      </Wall>

      {/* skirting + cornice around the room */}
      <Baseboard width={BAY_WIDTH} thickness={0.05} color={TRIM} position={[0, 0, -halfD + WALL_THICKNESS / 2 + 0.02]} />
      <Baseboard width={BAY_WIDTH} thickness={0.05} color={TRIM} position={[0, 0, halfD - WALL_THICKNESS / 2 - 0.02]} />
      <Baseboard
        width={BAY_DEPTH}
        thickness={0.05}
        color={TRIM}
        position={[sideSign * (halfW - WALL_THICKNESS / 2 - 0.02), 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CrownMolding
        width={BAY_WIDTH}
        thickness={0.045}
        ceilingY={ceilingY}
        color={TRIM}
        position={[0, 0, -halfD + WALL_THICKNESS / 2 + 0.02]}
      />
      <CrownMolding
        width={BAY_DEPTH}
        thickness={0.045}
        ceilingY={ceilingY}
        color={TRIM}
        position={[sideSign * (halfW - WALL_THICKNESS / 2 - 0.02), 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <Suspense fallback={null}>
        <PhotoPanel
          image={stop.image}
          position={[sideSign * (halfW - WALL_THICKNESS / 2 - 0.06), BAY_HEIGHT / 2 + 0.1, 0]}
          rotationY={-sideSign * (Math.PI / 2)}
          maxWidth={BAY_DEPTH - 1.5}
          maxHeight={BAY_HEIGHT - 1.35}
        />
      </Suspense>

      {stop.furniture.map((piece, i) => (
        <FurnitureMesh key={i} piece={piece} mirror={sideSign} />
      ))}

      {/* Warm fill from inside, plus cool daylight spilling in at the window.
          Only mounted for rooms near the camera: forward rendering evaluates
          every light on every lit fragment, so lighting all sixteen rooms at
          once costs far more than it shows. */}
      {lit && (
        <>
          <pointLight
            position={[sideSign * BAY_WIDTH * 0.15, BAY_HEIGHT * 0.8, 0]}
            color={stop.lightColor}
            intensity={stop.lightIntensity * 1.5}
            distance={9}
            decay={2}
          />
          <pointLight
            position={[0, WINDOW_SILL + WINDOW_HEIGHT * 0.6, -halfD + 0.7]}
            color="#dceaf6"
            intensity={1.6}
            distance={7}
            decay={2}
          />
        </>
      )}
    </group>
  )
}

/**
 * The two forward-facing stops: the entry (a real facade you approach from
 * the yard) and the closing threshold (deliberately open to the sky).
 */
function ThresholdBay({ stop, lit }: { stop: TourStop; lit: boolean }) {
  const isEntry = stop.id === 'entry'
  const halfW = BAY_WIDTH / 2
  const halfD = BAY_DEPTH / 2
  const floorTex = useWoodFloorTexture(3, 3)

  return (
    <group position={[stop.offsetX, 0, stop.centerZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[BAY_WIDTH, BAY_DEPTH]} />
        {floorTex ? (
          <meshStandardMaterial map={floorTex} roughness={0.62} />
        ) : (
          <meshStandardMaterial color="#a8794f" roughness={0.62} />
        )}
      </mesh>

      {isEntry && (
        <>
          {/* the front door you walk through, in the facade wall */}
          <Wall
            width={BAY_WIDTH}
            height={BAY_HEIGHT}
            thickness={WALL_THICKNESS}
            color="#efe7d8"
            position={[0, 0, halfD]}
            opening={{ centerX: 0, bottomY: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT }}
          >
            <DoorUnit
              width={DOOR_WIDTH}
              height={DOOR_HEIGHT}
              wallThickness={WALL_THICKNESS}
              hingeSide={1}
              openDir={-1}
              openAngle={1.32}
              slabColor="#8a6a4a"
              casingColor={TRIM}
            />
          </Wall>

          {/* side walls of the entry hall */}
          <Wall
            width={BAY_DEPTH}
            height={BAY_HEIGHT}
            thickness={WALL_THICKNESS}
            color="#efe7d8"
            position={[halfW, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Wall
            width={BAY_DEPTH}
            height={BAY_HEIGHT}
            thickness={WALL_THICKNESS}
            color="#efe7d8"
            position={[-halfW, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          <mesh position={[0, BAY_HEIGHT + CEILING_THICKNESS / 2, 0]} receiveShadow>
            <boxGeometry args={[BAY_WIDTH, CEILING_THICKNESS, BAY_DEPTH]} />
            <meshStandardMaterial color="#f6f2ea" roughness={0.97} />
          </mesh>

          <Suspense fallback={null}>
            <PhotoPanel
              image={stop.image}
              position={[0, BAY_HEIGHT / 2 + 0.1, -halfD + 0.12]}
              rotationY={0}
              maxWidth={BAY_WIDTH - 1.4}
              maxHeight={BAY_HEIGHT - 1.3}
            />
          </Suspense>
        </>
      )}

      {stop.furniture.map((piece, i) => (
        <FurnitureMesh key={i} piece={piece} mirror={1} />
      ))}

      {lit && (
        <pointLight
          position={[0, BAY_HEIGHT * 0.78, isEntry ? 0 : -0.5]}
          color={stop.lightColor}
          intensity={stop.lightIntensity * 1.6}
          distance={10}
          decay={2}
        />
      )}
    </group>
  )
}
