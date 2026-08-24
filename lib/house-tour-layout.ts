import * as THREE from 'three'
import { rooms, type Room } from './rooms'

// ---------------------------------------------------------------------------
// Geometry constants — the whole tour is one corridor running along -Z, with
// a "bay" (a room) opening off alternating sides. Units are meters-ish.
// ---------------------------------------------------------------------------
export const BAY_WIDTH = 4.2
export const BAY_DEPTH = 4.6
export const BAY_HEIGHT = 3.2
export const CORRIDOR_HALF_WIDTH = 1.6
export const STOP_SPACING = 6.8
export const EYE_HEIGHT = 1.6
export const WALL_THICKNESS = 0.14
export const DOOR_WIDTH = 1.9
export const DOOR_HEIGHT = 2.35
export const CEILING_THICKNESS = 0.12

export type Orientation = 'left' | 'right' | 'forward'

export type FurniturePiece = {
  shape: 'box' | 'cylinder' | 'sphere'
  /** authored assuming the bay opens to the right (sideSign +1); mirrored automatically for left bays */
  position: [number, number, number]
  size: [number, number, number]
  color: string
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  metalness?: number
  roughness?: number
  emissive?: string
  emissiveIntensity?: number
}

/** Simple abstract neighbor-house / tree props scattered around the entry yard — not the house itself. */
export const NEIGHBORHOOD_PROPS: FurniturePiece[] = [
  // a distant neighbor house, left
  { shape: 'box', position: [-8.5, 1.1, 5.5], size: [3, 2.2, 3], color: '#ded2bd' },
  { shape: 'box', position: [-8.5, 2.55, 5.5], size: [2.3, 1.5, 2.3], rotationY: Math.PI / 4, color: '#a9714f' },
  // a distant neighbor house, right
  { shape: 'box', position: [8, 0.95, 6.5], size: [2.6, 1.9, 2.6], color: '#e2d6c4' },
  { shape: 'box', position: [8, 2.2, 6.5], size: [2, 1.3, 2], rotationY: Math.PI / 4, color: '#8f6446' },
  // a smaller, further one, right
  { shape: 'box', position: [11, 0.75, 2], size: [2, 1.5, 2], color: '#d8cbb6' },
  { shape: 'box', position: [11, 1.85, 2], size: [1.55, 1, 1.55], rotationY: Math.PI / 4, color: '#7f947a' },
  // trees dotted through the yard
  { shape: 'cylinder', position: [-4.2, 0.5, 4.2], size: [0.1, 0.13, 1], color: '#6b4f34' },
  { shape: 'sphere', position: [-4.2, 1.3, 4.2], size: [0.75, 0.75, 0.75], color: '#7f947a' },
  { shape: 'cylinder', position: [4.6, 0.45, 3.6], size: [0.09, 0.12, 0.9], color: '#6b4f34' },
  { shape: 'sphere', position: [4.6, 1.15, 3.6], size: [0.65, 0.65, 0.65], color: '#89a082' },
  { shape: 'cylinder', position: [-6, 0.4, 1.5], size: [0.08, 0.1, 0.8], color: '#6b4f34' },
  { shape: 'sphere', position: [-6, 1.0, 1.5], size: [0.55, 0.55, 0.55], color: '#7f947a' },
  { shape: 'cylinder', position: [6.5, 0.4, 0.8], size: [0.08, 0.1, 0.8], color: '#6b4f34' },
  { shape: 'sphere', position: [6.5, 1.0, 0.8], size: [0.55, 0.55, 0.55], color: '#89a082' },
]

export type TourStop = {
  id: string
  number: string
  title: string
  subtitle: string
  meta?: { light: string; mood: string; element: string }
  image: string
  alt: string
  orientation: Orientation
  sideSign: 1 | -1 | 0
  offsetX: number
  centerZ: number
  furniture: FurniturePiece[]
  lightColor: string
  lightIntensity: number
  wallColor: string
}

// Warm palette derived from the site's own design tokens (app/globals.css),
// with a few hand-picked tints so bays read as distinct rooms, not repeats.
const WOOD = '#8a6a4a'
const WOOD_DARK = '#6b4f34'
const SAND = '#ede7de'
const CREAM = '#f6f2ec'
const GREEN = '#7f947a'
const PEACOCK = '#176b74'
const LINEN = '#e2d8c6'
const STONE = '#e4ddd0'
const TERRACOTTA = '#b3593a'
const NEAR_BLACK = '#2a2420'
const AMBER_GLOW = '#e8b36a'

const roomFurniture: Record<string, FurniturePiece[]> = {
  living: [
    { shape: 'box', position: [1.55, 0.28, 0], size: [0.85, 0.55, 2.1], color: LINEN },
    { shape: 'box', position: [0.75, 0.14, 0.85], size: [0.65, 0.28, 0.5], color: WOOD },
    { shape: 'cylinder', position: [0.35, 0.25, -1.55], size: [0.05, 0.06, 0.5], color: WOOD_DARK },
    { shape: 'sphere', position: [0.35, 0.62, -1.55], size: [0.32, 0.32, 0.32], color: GREEN },
  ],
  balcony: [
    { shape: 'box', position: [-1.85, 0.45, 0], size: [0.08, 0.9, BAY_DEPTH - 0.7], color: WOOD },
    { shape: 'box', position: [0.55, 0.2, -0.8], size: [0.4, 0.4, 0.4], color: WOOD },
    { shape: 'box', position: [0.55, 0.2, 0.8], size: [0.4, 0.4, 0.4], color: WOOD },
    { shape: 'cylinder', position: [0.55, 0.175, 0], size: [0.24, 0.24, 0.35], color: WOOD_DARK },
    { shape: 'cylinder', position: [1.7, 0.15, -1.6], size: [0.13, 0.15, 0.3], color: TERRACOTTA },
    { shape: 'sphere', position: [1.7, 0.42, -1.6], size: [0.22, 0.22, 0.22], color: GREEN },
  ],
  spiritual: [
    { shape: 'box', position: [1.6, 0.3, 0], size: [0.5, 0.6, 0.5], color: WOOD },
    {
      shape: 'sphere',
      position: [1.6, 0.68, 0],
      size: [0.08, 0.08, 0.08],
      color: AMBER_GLOW,
      emissive: AMBER_GLOW,
      emissiveIntensity: 2.4,
    },
  ],
  music: [
    { shape: 'cylinder', position: [1.4, 0.55, 0.25], size: [0.05, 0.3, 1.05], color: WOOD_DARK, rotationY: 0.3 },
    { shape: 'cylinder', position: [0.95, 0.22, -0.6], size: [0.22, 0.22, 0.44], color: WOOD },
  ],
  piano: [
    { shape: 'box', position: [1.5, 0.45, 0], size: [1.35, 0.85, 0.65], color: NEAR_BLACK },
    { shape: 'box', position: [0.8, 0.16, 0.6], size: [0.6, 0.32, 0.3], color: WOOD_DARK },
  ],
  library: [
    { shape: 'box', position: [1.85, 1.2, 0], size: [0.35, 2.3, 1.8], color: WOOD },
    { shape: 'box', position: [1.72, 1.9, -0.6], size: [0.14, 0.35, 0.3], color: PEACOCK },
    { shape: 'box', position: [1.72, 1.9, -0.15], size: [0.14, 0.35, 0.3], color: WOOD_DARK },
    { shape: 'box', position: [1.72, 1.9, 0.3], size: [0.14, 0.35, 0.3], color: GREEN },
    { shape: 'box', position: [1.72, 1.9, 0.75], size: [0.14, 0.35, 0.3], color: SAND },
    { shape: 'box', position: [0.9, 0.25, -1.15], size: [0.6, 0.5, 0.6], color: LINEN },
  ],
  kitchen: [
    { shape: 'box', position: [0.95, 0.25, 0], size: [1.55, 0.5, 0.8], color: CREAM },
    { shape: 'box', position: [1.85, 0.9, -1.55], size: [0.5, 1.75, 0.4], color: WOOD },
  ],
  herb: [
    { shape: 'box', position: [1.9, 0.85, 0], size: [0.25, 0.1, 1.95], color: WOOD },
    { shape: 'cylinder', position: [1.9, 0.95, -0.85], size: [0.1, 0.1, 0.18], color: TERRACOTTA },
    { shape: 'sphere', position: [1.9, 1.08, -0.85], size: [0.13, 0.13, 0.13], color: GREEN },
    { shape: 'cylinder', position: [1.9, 0.95, -0.28], size: [0.1, 0.1, 0.18], color: TERRACOTTA },
    { shape: 'sphere', position: [1.9, 1.08, -0.28], size: [0.13, 0.13, 0.13], color: GREEN },
    { shape: 'cylinder', position: [1.9, 0.95, 0.28], size: [0.1, 0.1, 0.18], color: TERRACOTTA },
    { shape: 'sphere', position: [1.9, 1.08, 0.28], size: [0.13, 0.13, 0.13], color: GREEN },
    { shape: 'cylinder', position: [1.9, 0.95, 0.85], size: [0.1, 0.1, 0.18], color: TERRACOTTA },
    { shape: 'sphere', position: [1.9, 1.08, 0.85], size: [0.13, 0.13, 0.13], color: GREEN },
  ],
  dining: [
    { shape: 'box', position: [1.2, 0.25, 0], size: [1.5, 0.5, 0.95], color: WOOD },
    { shape: 'box', position: [0.6, 0.18, -0.55], size: [0.32, 0.36, 0.32], color: WOOD_DARK },
    { shape: 'box', position: [0.6, 0.18, 0.55], size: [0.32, 0.36, 0.32], color: WOOD_DARK },
    { shape: 'box', position: [1.8, 0.18, -0.55], size: [0.32, 0.36, 0.32], color: WOOD_DARK },
    { shape: 'box', position: [1.8, 0.18, 0.55], size: [0.32, 0.36, 0.32], color: WOOD_DARK },
    {
      shape: 'sphere',
      position: [1.2, 2.55, 0],
      size: [0.1, 0.1, 0.1],
      color: AMBER_GLOW,
      emissive: AMBER_GLOW,
      emissiveIntensity: 2,
    },
  ],
  bedroom: [
    { shape: 'box', position: [1.3, 0.2, 0], size: [1.55, 0.4, 1.95], color: SAND },
    { shape: 'box', position: [1.3, 0.47, -0.72], size: [1.35, 0.14, 0.4], color: CREAM },
    { shape: 'box', position: [0.35, 0.2, -1.55], size: [0.4, 0.4, 0.4], color: WOOD },
  ],
  cozy: [
    { shape: 'box', position: [1.45, 0.3, 0.25], size: [0.7, 0.6, 0.7], color: WOOD_DARK },
    { shape: 'cylinder', position: [0.7, 0.175, -0.55], size: [0.22, 0.22, 0.35], color: WOOD },
    { shape: 'cylinder', position: [1.75, 0.25, -1.6], size: [0.05, 0.06, 0.5], color: WOOD_DARK },
    { shape: 'sphere', position: [1.75, 0.62, -1.6], size: [0.3, 0.3, 0.3], color: GREEN },
  ],
  wardrobe: [
    { shape: 'box', position: [1.9, 1.3, 0], size: [0.4, 2.55, 2.2], color: WOOD },
    {
      shape: 'box',
      position: [0.85, 1.1, -1.65],
      size: [0.04, 1.7, 0.65],
      color: '#cfd6d6',
      metalness: 0.6,
      roughness: 0.15,
    },
  ],
  bathroom: [
    { shape: 'box', position: [1.5, 0.22, 0], size: [0.8, 0.45, 1.6], color: STONE },
    { shape: 'cylinder', position: [0.55, 0.25, -1.6], size: [0.05, 0.06, 0.5], color: WOOD_DARK },
    { shape: 'sphere', position: [0.55, 0.62, -1.6], size: [0.28, 0.28, 0.28], color: GREEN },
  ],
  terrace: [
    { shape: 'box', position: [-1.85, 0.42, 0], size: [0.08, 0.85, BAY_DEPTH - 0.7], color: WOOD },
    { shape: 'cylinder', position: [1.75, 0.15, -1.5], size: [0.14, 0.16, 0.3], color: TERRACOTTA },
    { shape: 'sphere', position: [1.75, 0.45, -1.5], size: [0.26, 0.26, 0.26], color: GREEN },
    { shape: 'cylinder', position: [1.75, 0.15, 0.5], size: [0.14, 0.16, 0.3], color: TERRACOTTA },
    { shape: 'sphere', position: [1.75, 0.45, 0.5], size: [0.26, 0.26, 0.26], color: GREEN },
    ...[-1.4, -0.5, 0.4, 1.3].map((z, i): FurniturePiece => ({
      shape: 'sphere',
      position: [0.4, 2.55 - Math.sin((z + 1.4) * 1.1) * 0.18, z],
      size: [0.035, 0.035, 0.035],
      color: i % 2 === 0 ? AMBER_GLOW : PEACOCK,
      emissive: i % 2 === 0 ? AMBER_GLOW : PEACOCK,
      emissiveIntensity: 2.2,
    })),
  ],
}

function lightForRoom(room: Room): { color: string; intensity: number } {
  if (room.dark) return { color: AMBER_GLOW, intensity: 1.6 }
  if (room.meta?.mood === 'Still' || room.meta?.mood === 'Quiet') return { color: PEACOCK, intensity: 0.7 }
  return { color: '#fff6e8', intensity: 1.1 }
}

export function buildTourStops(): TourStop[] {
  const stops: TourStop[] = []

  // 01 — Entry (forward-facing, centered on the corridor axis)
  stops.push({
    id: 'entry',
    number: '01',
    title: 'The House of Riya',
    subtitle: 'Not just a house. A feeling.',
    image: '/assets/home/exterior.png',
    alt: 'The house at golden hour',
    orientation: 'forward',
    sideSign: 0,
    offsetX: 0,
    centerZ: 0,
    furniture: [
      { shape: 'cylinder', position: [-1.5, 0.25, 0.6], size: [0.06, 0.07, 0.5], color: WOOD_DARK },
      { shape: 'sphere', position: [-1.5, 0.62, 0.6], size: [0.34, 0.34, 0.34], color: GREEN },
      { shape: 'cylinder', position: [1.5, 0.25, 0.6], size: [0.06, 0.07, 0.5], color: WOOD_DARK },
      { shape: 'sphere', position: [1.5, 0.62, 0.6], size: [0.34, 0.34, 0.34], color: GREEN },
    ],
    lightColor: '#ffdfb0',
    lightIntensity: 1.3,
    wallColor: SAND,
  })

  rooms.forEach((room, i) => {
    const sideSign: 1 | -1 = i % 2 === 0 ? 1 : -1
    const light = lightForRoom(room)
    stops.push({
      id: room.id,
      number: room.number,
      title: room.title,
      subtitle: room.subtitle,
      meta: room.meta,
      image: room.image,
      alt: room.alt,
      orientation: sideSign === 1 ? 'right' : 'left',
      sideSign,
      offsetX: sideSign * (CORRIDOR_HALF_WIDTH + BAY_WIDTH / 2),
      centerZ: -(i + 1) * STOP_SPACING,
      furniture: roomFurniture[room.id] ?? [],
      lightColor: light.color,
      lightIntensity: light.intensity,
      wallColor: room.dark ? '#dcd2c2' : SAND,
    })
  })

  // 16 — Her (closing threshold, forward-facing, no furniture — just light)
  stops.push({
    id: 'her',
    number: '16',
    title: 'Yes. Finally. I’m home.',
    subtitle: 'श्री राधे',
    image: '/assets/riya/riya-main.png',
    alt: 'Riya, home',
    orientation: 'forward',
    sideSign: 0,
    offsetX: 0,
    centerZ: -(rooms.length + 1) * STOP_SPACING,
    furniture: [],
    lightColor: PEACOCK,
    lightIntensity: 1.4,
    wallColor: CREAM,
  })

  return stops
}

export const TOUR_STOPS = buildTourStops()
export const TOTAL_LENGTH = TOUR_STOPS[TOUR_STOPS.length - 1].centerZ - STOP_SPACING
export const NUM_STOPS = TOUR_STOPS.length

/** Approximate mapping from 0..1 scroll progress to the nearest tour stop, for the text panel. */
export function stopIndexFromProgress(t: number): number {
  const totalPoints = NUM_STOPS + 2 // includes the lead-in / lead-out buffer waypoints
  const raw = t * (totalPoints - 1) - 1
  return THREE.MathUtils.clamp(Math.round(raw), 0, NUM_STOPS - 1)
}

export type CameraPath = {
  positionCurve: THREE.CatmullRomCurve3
  targetCurve: THREE.CatmullRomCurve3
}

/** Builds the smooth camera path: a gentle weave down the corridor, glancing into each bay. */
export function buildCameraPath(stops: TourStop[]): CameraPath {
  const positions: THREE.Vector3[] = []
  const targets: THREE.Vector3[] = []

  // lead-in, standing in the yard for a full establishing view of the house — facade, roof and sky
  positions.push(new THREE.Vector3(0, EYE_HEIGHT + 0.3, STOP_SPACING * 2.1))
  targets.push(new THREE.Vector3(0, BAY_HEIGHT * 0.55, STOP_SPACING * 0.5))

  stops.forEach((stop) => {
    // kept small and well inside the corridor half-width so the curve's natural
    // overshoot on alternating left/right stops never swings the camera into a wall
    const weave = stop.sideSign !== 0 ? stop.offsetX * 0.12 : 0
    positions.push(new THREE.Vector3(weave, EYE_HEIGHT, stop.centerZ))

    const panelX = stop.sideSign !== 0 ? stop.sideSign * (BAY_WIDTH / 2 - 0.3) + stop.offsetX : 0
    const panelZ = stop.orientation === 'forward' ? stop.centerZ - (BAY_DEPTH / 2 - 0.4) : stop.centerZ
    targets.push(new THREE.Vector3(panelX * 0.75, EYE_HEIGHT + 0.15, panelZ))
  })

  // lead-out, past the closing threshold
  const last = stops[stops.length - 1]
  positions.push(new THREE.Vector3(0, EYE_HEIGHT, last.centerZ - STOP_SPACING * 0.7))
  targets.push(new THREE.Vector3(0, EYE_HEIGHT, last.centerZ - STOP_SPACING * 1.4))

  return {
    positionCurve: new THREE.CatmullRomCurve3(positions, false, 'catmullrom', 0.5),
    targetCurve: new THREE.CatmullRomCurve3(targets, false, 'catmullrom', 0.5),
  }
}
