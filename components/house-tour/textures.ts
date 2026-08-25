'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedurally drawn textures, generated on a canvas at runtime.
 *
 * Deliberately not fetched from a CDN: the tour has to render correctly with
 * no network, and an external texture host would be a dependency the deployed
 * site doesn't need. A canvas gets us plank seams and plaster tooth, which is
 * most of what separates "a room" from "a grey box".
 */

function makeCanvas(size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return canvas
}

/** Deterministic value noise, so materials look identical on every load. */
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/**
 * Textures are cached per repeat-setting and shared across every room.
 * Without this each of the sixteen rooms builds its own identical canvas and
 * uploads its own copy to the GPU — sixteen redundant textures, and sixteen
 * canvas draws blocking the first frame.
 */
const textureCache = new Map<string, THREE.CanvasTexture | null>()

function cached(key: string, build: () => THREE.CanvasTexture | null) {
  if (!textureCache.has(key)) textureCache.set(key, build())
  return textureCache.get(key) ?? null
}

/** Warm timber flooring with plank seams and subtle grain. */
export function useWoodFloorTexture(repeatX = 4, repeatY = 4) {
  const key = `wood:${repeatX}x${repeatY}`
  return useMemo(() => cached(key, () => {
    if (typeof document === 'undefined') return null
    const size = 512
    const canvas = makeCanvas(size)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const rand = makeRng(90210)

    const plankRows = 6
    const plankH = size / plankRows
    for (let row = 0; row < plankRows; row++) {
      // stagger the joints row to row like real board flooring
      const offset = (row % 2 === 0 ? 0 : size / 3) + rand() * 40
      const boards = 3
      for (let b = -1; b < boards + 1; b++) {
        const x = offset + b * (size / boards)
        const w = size / boards
        const y = row * plankH
        const base = 168 + rand() * 26
        ctx.fillStyle = `rgb(${base}, ${base - 34}, ${base - 66})`
        ctx.fillRect(x, y, w, plankH)

        // grain
        ctx.globalAlpha = 0.08
        for (let g = 0; g < 14; g++) {
          ctx.strokeStyle = rand() > 0.5 ? '#5b3f28' : '#c69a6f'
          ctx.lineWidth = 0.6 + rand()
          ctx.beginPath()
          const gy = y + rand() * plankH
          ctx.moveTo(x, gy)
          ctx.bezierCurveTo(x + w * 0.3, gy + (rand() - 0.5) * 5, x + w * 0.7, gy + (rand() - 0.5) * 5, x + w, gy)
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // seam
        ctx.strokeStyle = 'rgba(60,40,26,0.5)'
        ctx.lineWidth = 1.6
        ctx.strokeRect(x, y, w, plankH)
      }
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeatX, repeatY)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }), [key, repeatX, repeatY])
}

/** Very soft plaster tooth — keeps big wall planes from reading as flat fill. */
export function usePlasterTexture(tint = '#efe9df', repeatX = 2, repeatY = 2) {
  const key = `plaster:${tint}:${repeatX}x${repeatY}`
  return useMemo(() => cached(key, () => {
    if (typeof document === 'undefined') return null
    const size = 256
    const canvas = makeCanvas(size)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const rand = makeRng(4242)

    ctx.fillStyle = tint
    ctx.fillRect(0, 0, size, size)

    const img = ctx.getImageData(0, 0, size, size)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      const n = (rand() - 0.5) * 13
      d[i] = Math.max(0, Math.min(255, d[i] + n))
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n))
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n))
    }
    ctx.putImageData(img, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeatX, repeatY)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }), [key, tint, repeatX, repeatY])
}

/** Clay roof tiles, drawn as overlapping courses. */
export function useRoofTileTexture(repeatX = 8, repeatY = 4) {
  const key = `roof:${repeatX}x${repeatY}`
  return useMemo(() => cached(key, () => {
    if (typeof document === 'undefined') return null
    const size = 256
    const canvas = makeCanvas(size)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const rand = makeRng(777)

    ctx.fillStyle = '#8d4f36'
    ctx.fillRect(0, 0, size, size)

    const rows = 6
    const rowH = size / rows
    for (let r = 0; r < rows; r++) {
      const y = r * rowH
      const cols = 8
      const stagger = r % 2 === 0 ? 0 : size / (cols * 2)
      for (let c = -1; c <= cols; c++) {
        const x = stagger + c * (size / cols)
        const w = size / cols
        const shade = 128 + rand() * 52
        ctx.fillStyle = `rgb(${shade + 24}, ${shade - 40}, ${shade - 62})`
        ctx.beginPath()
        ctx.moveTo(x, y + rowH)
        ctx.lineTo(x, y + rowH * 0.35)
        ctx.quadraticCurveTo(x + w / 2, y - rowH * 0.15, x + w, y + rowH * 0.35)
        ctx.lineTo(x + w, y + rowH)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = 'rgba(70,32,20,0.45)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeatX, repeatY)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }), [key, repeatX, repeatY])
}
