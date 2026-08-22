import { cn } from '@/lib/utils'

/**
 * Elegant peacock-feather motif drawn as an SVG so it can be tinted, scaled
 * and animated without any raster/background artifacts. The eye (ocellus)
 * is built from four nested teardrop bands — bronze rim, deep iridescent
 * band, green-gold band, dark glossy core — matching the real anatomy of
 * a peacock eye rather than a plain circle. The plume is built from many
 * individually curved barb strokes fanning from the rachis, not one
 * smooth outline, layered over a soft filled body for mass.
 */
export function PeacockFeather({
  className,
  strokeWidth = 1,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 140 340"
      fill="none"
      className={cn('block', className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pf-eye-band1" cx="46%" cy="34%" r="70%">
          <stop offset="0%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={0.55} />
          <stop offset="60%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={0.85} />
          <stop offset="100%" style={{ stopColor: 'color-mix(in srgb, var(--peacock) 60%, black)' }} stopOpacity={0.9} />
        </radialGradient>
        <radialGradient id="pf-eye-band2" cx="44%" cy="32%" r="70%">
          <stop offset="0%" style={{ stopColor: 'var(--green)' }} stopOpacity={0.85} />
          <stop offset="55%" style={{ stopColor: 'color-mix(in srgb, var(--green) 70%, var(--wood))' }} stopOpacity={0.9} />
          <stop offset="100%" style={{ stopColor: 'var(--wood)' }} stopOpacity={0.75} />
        </radialGradient>
        <radialGradient id="pf-eye-core" cx="42%" cy="30%" r="75%">
          <stop offset="0%" style={{ stopColor: 'color-mix(in srgb, var(--peacock) 55%, white)' }} stopOpacity={0.9} />
          <stop offset="45%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={0.95} />
          <stop offset="100%" style={{ stopColor: 'color-mix(in srgb, var(--peacock) 45%, black)' }} stopOpacity={1} />
        </radialGradient>
        <linearGradient id="pf-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--wood)' }} stopOpacity={0.85} />
          <stop offset="100%" style={{ stopColor: 'var(--wood)' }} stopOpacity={0.45} />
        </linearGradient>
        <radialGradient id="pf-plume-fill" cx="50%" cy="70%" r="75%">
          <stop offset="0%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={0.16} />
          <stop offset="60%" style={{ stopColor: 'var(--green)' }} stopOpacity={0.1} />
          <stop offset="100%" style={{ stopColor: 'var(--green)' }} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* soft filled body behind the fan — gives the feather visible mass, not just lines */}
      <path
        d="M70 116 C28 100 14 46 42 4 C56 30 64 62 70 96 C76 62 84 30 98 4 C126 46 112 100 70 116 Z"
        fill="url(#pf-plume-fill)"
      />
      {/* soft filled body behind the lower barbs */}
      <path
        d="M70 118 C40 130 26 170 32 240 C38 300 50 326 70 336 C90 326 102 300 108 240 C114 170 100 130 70 118 Z"
        fill="var(--green)"
        opacity={0.06}
      />

      {/* rachis / stem — a gentle natural taper, not a straight line */}
      <path
        d="M70 334 C68 260 71 210 68 168 C66.5 148 69 132 71 116"
        stroke="url(#pf-stem)"
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
      />

      {/* lower barbs — individually curved, alternating length/angle for a hand-drawn feel */}
      {[
        [318, 50, 0.55], [300, 44, 0.62], [281, 56, 0.68], [261, 48, 0.74],
        [240, 62, 0.8], [218, 54, 0.86], [195, 66, 0.9], [172, 58, 0.94], [149, 68, 0.98],
      ].map(([y, len, weight], i) => {
        const x = 69 - i * 0.3
        const tilt = 6 + (i % 3) * 3
        return (
          <g key={y} stroke="var(--green)" strokeWidth={strokeWidth * 0.85} strokeLinecap="round" opacity={weight * 0.65}>
            <path
              d={`M${x} ${y} C${x - len * 0.5} ${y - tilt}, ${x - len * 0.85} ${y - tilt - len * 0.35}, ${x - len} ${y - tilt - len * 0.7}`}
            />
            <path
              d={`M${x} ${y} C${x + len * 0.5} ${y - tilt}, ${x + len * 0.85} ${y - tilt - len * 0.35}, ${x + len} ${y - tilt - len * 0.7}`}
            />
          </g>
        )
      })}

      {/* the fan of fine barbs framing the eye — two layers for density, replaces a single smooth outline */}
      {Array.from({ length: 23 }).map((_, i) => {
        const t = i / 22
        const angle = -104 + t * 208
        const rad = (angle * Math.PI) / 180
        const baseLen = 80 + Math.sin(t * Math.PI) * 34
        const originX = 70
        const originY = 120
        const tipX = originX + Math.sin(rad) * baseLen * 0.42
        const tipY = originY - Math.cos(rad) * baseLen
        const midX = originX + Math.sin(rad) * baseLen * 0.24
        const midY = originY - Math.cos(rad) * baseLen * 0.55
        return (
          <path
            key={`outer-${i}`}
            d={`M${originX} ${originY} Q${midX} ${midY} ${tipX} ${tipY}`}
            stroke={i % 2 === 0 ? 'var(--peacock)' : 'var(--green)'}
            strokeWidth={strokeWidth * 0.55}
            strokeLinecap="round"
            opacity={0.22 + (1 - Math.abs(t - 0.5) * 2) * 0.32}
          />
        )
      })}
      {Array.from({ length: 15 }).map((_, i) => {
        const t = i / 14
        const angle = -88 + t * 176
        const rad = (angle * Math.PI) / 180
        const baseLen = 58 + Math.sin(t * Math.PI) * 20
        const originX = 70
        const originY = 122
        const tipX = originX + Math.sin(rad) * baseLen * 0.4
        const tipY = originY - Math.cos(rad) * baseLen
        const midX = originX + Math.sin(rad) * baseLen * 0.22
        const midY = originY - Math.cos(rad) * baseLen * 0.5
        return (
          <path
            key={`inner-${i}`}
            d={`M${originX} ${originY} Q${midX} ${midY} ${tipX} ${tipY}`}
            stroke="var(--wood)"
            strokeWidth={strokeWidth * 0.5}
            strokeLinecap="round"
            opacity={0.14 + (1 - Math.abs(t - 0.5) * 2) * 0.2}
          />
        )
      })}

      {/* the eye (ocellus) — four nested teardrop bands, matching real peacock-feather anatomy */}
      <path
        d="M70 36 C47 53 34 76 33 98 C32 126 49 153 70 156 C91 153 108 126 107 98 C106 76 93 53 70 36 Z"
        stroke="var(--wood)"
        strokeWidth={strokeWidth * 0.6}
        opacity={0.45}
      />
      <path
        d="M70 45 C51 59 40 79 39 98 C38 121 52 143 70 146 C88 143 102 121 101 98 C100 79 89 59 70 45 Z"
        fill="url(#pf-eye-band1)"
      />
      <path
        d="M70 58 C55 69 46 84 45 99 C44 117 55 134 70 137 C85 134 96 117 95 99 C94 84 85 69 70 58 Z"
        fill="url(#pf-eye-band2)"
      />
      <path
        d="M70 71 C59 79 52 90 51 100 C50 113 58 126 70 128 C82 126 90 113 89 100 C88 90 81 79 70 71 Z"
        fill="url(#pf-eye-core)"
      />
      {/* dark pupil, slightly offset for a glossy, dimensional feel */}
      <ellipse cx="68" cy="103" rx="6.5" ry="9.5" fill="color-mix(in srgb, var(--peacock) 35%, black)" opacity={0.8} />
      {/* soft highlight for gloss */}
      <ellipse cx="62" cy="86" rx="4.5" ry="7" fill="var(--background, #fff)" opacity={0.3} />
      <ellipse cx="76" cy="112" rx="2.5" ry="3.5" fill="var(--background, #fff)" opacity={0.16} />
    </svg>
  )
}
