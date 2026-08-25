'use client'

/**
 * Reusable architectural primitives for the house tour.
 *
 * Everything is authored in a wall-local frame: width runs along X, height
 * along Y (from 0 at the floor), thickness along Z. Callers position/rotate
 * the whole piece, which keeps the per-room code readable.
 */

export type Opening = {
  /** centre of the opening along the wall's width */
  centerX: number
  /** height of the opening's underside above the floor (0 for a doorway) */
  bottomY: number
  width: number
  height: number
}

type WallProps = {
  width: number
  height: number
  thickness: number
  color: string
  roughness?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  /** cut a doorway or window out of the wall */
  opening?: Opening
  children?: React.ReactNode
}

/**
 * A wall, optionally with a rectangular opening cut into it. The opening is
 * built from up to four surrounding pieces (left, right, header, sill) rather
 * than real CSG — cheaper, and indistinguishable for straight rectangular holes.
 */
export function Wall({
  width,
  height,
  thickness,
  color,
  roughness = 0.94,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  opening,
  children,
}: WallProps) {
  const material = <meshStandardMaterial color={color} roughness={roughness} />

  if (!opening) {
    return (
      <group position={position} rotation={rotation}>
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, thickness]} />
          {material}
        </mesh>
        {children}
      </group>
    )
  }

  const openLeft = opening.centerX - opening.width / 2
  const openRight = opening.centerX + opening.width / 2
  const openTop = opening.bottomY + opening.height

  const leftWidth = openLeft - -width / 2
  const rightWidth = width / 2 - openRight
  const headerHeight = height - openTop

  return (
    <group position={position} rotation={rotation}>
      {leftWidth > 0.001 && (
        <mesh position={[-width / 2 + leftWidth / 2, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[leftWidth, height, thickness]} />
          <meshStandardMaterial color={color} roughness={roughness} />
        </mesh>
      )}
      {rightWidth > 0.001 && (
        <mesh position={[width / 2 - rightWidth / 2, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[rightWidth, height, thickness]} />
          <meshStandardMaterial color={color} roughness={roughness} />
        </mesh>
      )}
      {headerHeight > 0.001 && (
        <mesh position={[opening.centerX, openTop + headerHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[opening.width, headerHeight, thickness]} />
          <meshStandardMaterial color={color} roughness={roughness} />
        </mesh>
      )}
      {opening.bottomY > 0.001 && (
        <mesh position={[opening.centerX, opening.bottomY / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[opening.width, opening.bottomY, thickness]} />
          <meshStandardMaterial color={color} roughness={roughness} />
        </mesh>
      )}
      {children}
    </group>
  )
}

/**
 * Skirting board along the foot of a wall — one of the details that most
 * reads as "finished room" rather than "grey box".
 */
export function Baseboard({
  width,
  thickness,
  color = '#f7f4ee',
  height = 0.11,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  width: number
  thickness: number
  color?: string
  height?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]} rotation={rotation} receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  )
}

/** Slim cornice where wall meets ceiling. */
export function CrownMolding({
  width,
  thickness,
  ceilingY,
  color = '#f7f4ee',
  height = 0.08,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  width: number
  thickness: number
  ceilingY: number
  color?: string
  height?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={[position[0], ceilingY - height / 2, position[2]]} rotation={rotation} receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  )
}

/**
 * A real door: cased opening, a slab swung open into the room, and a handle.
 * Authored in the same wall-local frame as `Wall` — the caller positions it
 * to match the opening it belongs to.
 */
export function DoorUnit({
  width,
  height,
  wallThickness,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  /** which jamb the door is hinged on */
  hingeSide = 1,
  /** which way it swings, along the wall's local +Z / -Z */
  openDir = 1,
  openAngle = 1.85,
  slabColor = '#f3efe7',
  casingColor = '#f7f4ee',
}: {
  width: number
  height: number
  wallThickness: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  hingeSide?: 1 | -1
  openDir?: 1 | -1
  openAngle?: number
  slabColor?: string
  casingColor?: string
}) {
  const casing = 0.09
  const casingDepth = wallThickness + 0.05
  const slabThickness = 0.045
  const hingeX = hingeSide * (width / 2)
  // The slab's offset from the hinge and its rotation both depend on which
  // jamb it hangs from; flipping only the hinge cancels out and the door
  // opens the same way regardless, so the swing direction is set separately.
  const slabRotation = openDir * hingeSide * openAngle

  return (
    <group position={position} rotation={rotation}>
      {/* casing / architrave around the opening, on both faces */}
      <mesh position={[-width / 2 - casing / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[casing, height + casing, casingDepth]} />
        <meshStandardMaterial color={casingColor} roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 + casing / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[casing, height + casing, casingDepth]} />
        <meshStandardMaterial color={casingColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + casing / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + casing * 2, casing, casingDepth]} />
        <meshStandardMaterial color={casingColor} roughness={0.5} />
      </mesh>

      {/* the slab itself, hinged at one jamb and standing open into the room */}
      <group position={[hingeX, 0, 0]} rotation={[0, slabRotation, 0]}>
        <group position={[-hingeSide * (width / 2), 0, 0]}>
          <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, slabThickness]} />
            <meshStandardMaterial color={slabColor} roughness={0.6} />
          </mesh>
          {/* two recessed panels, so the door doesn't read as a flat plank */}
          {[height * 0.32, height * 0.7].map((py, i) => (
            <mesh key={i} position={[0, py, slabThickness / 2 + 0.004]}>
              <boxGeometry args={[width * 0.66, height * 0.26, 0.008]} />
              <meshStandardMaterial color={slabColor} roughness={0.45} />
            </mesh>
          ))}
          {/* handle, on the leading edge away from the hinge */}
          <mesh
            position={[-hingeSide * (width / 2 - 0.13), height * 0.44, slabThickness / 2 + 0.035]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.018, 0.018, 0.1, 12]} />
            <meshStandardMaterial color="#b08b52" metalness={0.85} roughness={0.28} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/**
 * A window: cased opening with a sill, glazing bars and a faint glass pane.
 * This is what lets daylight and sky into each room.
 */
export function WindowUnit({
  width,
  height,
  wallThickness,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  frameColor = '#f7f4ee',
}: {
  width: number
  height: number
  wallThickness: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  frameColor?: string
}) {
  const frame = 0.075
  const frameDepth = wallThickness + 0.04
  const bar = 0.028

  return (
    <group position={position} rotation={rotation}>
      {/* frame */}
      <mesh position={[-width / 2 - frame / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[frame, height + frame * 2, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 + frame / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[frame, height + frame * 2, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + frame / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + frame * 2, frame, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>
      {/* sill, slightly proud of the wall */}
      <mesh position={[0, -frame / 2, 0.03]} castShadow receiveShadow>
        <boxGeometry args={[width + frame * 3, frame * 1.3, frameDepth + 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>

      {/* glazing bars */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[bar, height, bar]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, height * 0.55, 0]}>
        <boxGeometry args={[width, bar, bar]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} />
      </mesh>

      {/* glass — barely there, just enough to catch a highlight */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#eaf4fb"
          transparent
          opacity={0.16}
          roughness={0.05}
          metalness={0}
          transmission={0.55}
          thickness={0.02}
        />
      </mesh>
    </group>
  )
}
