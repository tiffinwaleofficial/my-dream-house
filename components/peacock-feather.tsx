import { cn } from '@/lib/utils'

/**
 * Elegant peacock-feather motif drawn as an SVG so it can be tinted, scaled
 * and animated without any raster/background artifacts. The plume is built
 * from individually curved barb strokes (not a single smooth outline) and
 * the eye uses layered gradients, matching how the real feather reads:
 * a soft bronze halo, an iridescent green ring, and a deep glossy core.
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
        <radialGradient id="pf-eye-core" cx="42%" cy="38%" r="65%">
          <stop offset="0%" style={{ stopColor: 'var(--green)' }} stopOpacity={0.9} />
          <stop offset="45%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={0.95} />
          <stop offset="100%" style={{ stopColor: 'var(--peacock)' }} stopOpacity={1} />
        </radialGradient>
        <radialGradient id="pf-eye-ring" cx="50%" cy="45%" r="60%">
          <stop offset="55%" style={{ stopColor: 'var(--green)' }} stopOpacity={0} />
          <stop offset="80%" style={{ stopColor: 'var(--green)' }} stopOpacity={0.55} />
          <stop offset="100%" style={{ stopColor: 'var(--wood)' }} stopOpacity={0.5} />
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

      {/* the fan of fine barbs framing the eye — replaces a single smooth outline */}
      {Array.from({ length: 17 }).map((_, i) => {
        const t = i / 16
        const angle = -102 + t * 204 // degrees, sweeping around the top
        const rad = (angle * Math.PI) / 180
        const baseLen = 82 + Math.sin(t * Math.PI) * 32
        const originX = 70
        const originY = 118
        const tipX = originX + Math.sin(rad) * baseLen * 0.42
        const tipY = originY - Math.cos(rad) * baseLen
        const midX = originX + Math.sin(rad) * baseLen * 0.24
        const midY = originY - Math.cos(rad) * baseLen * 0.55
        return (
          <path
            key={i}
            d={`M${originX} ${originY} Q${midX} ${midY} ${tipX} ${tipY}`}
            stroke={i % 2 === 0 ? 'var(--peacock)' : 'var(--green)'}
            strokeWidth={strokeWidth * 0.7}
            strokeLinecap="round"
            opacity={0.32 + (1 - Math.abs(t - 0.5) * 2) * 0.4}
          />
        )
      })}

      {/* the eye (ocellus) — bronze halo, iridescent ring, glossy core */}
      <ellipse cx="70" cy="90" rx="34" ry="46" fill="url(#pf-eye-ring)" />
      <ellipse
        cx="70"
        cy="90"
        rx="33.5"
        ry="45.5"
        stroke="var(--wood)"
        strokeWidth={strokeWidth * 0.6}
        opacity={0.4}
      />
      <ellipse cx="70" cy="92" rx="21" ry="30" fill="url(#pf-eye-core)" />
      <ellipse
        cx="70"
        cy="92"
        rx="20.5"
        ry="29.5"
        stroke="var(--green)"
        strokeWidth={strokeWidth * 0.5}
        opacity={0.5}
      />
      {/* dark pupil, slightly offset for a glossy, dimensional feel */}
      <ellipse cx="68" cy="96" rx="7" ry="10.5" fill="var(--wood)" opacity={0.75} />
      <ellipse cx="66.5" cy="93.5" rx="3" ry="4.4" fill="var(--peacock)" opacity={0.9} />
      {/* soft highlight for gloss */}
      <ellipse cx="61" cy="78" rx="5" ry="8" fill="var(--background, #fff)" opacity={0.25} />
    </svg>
  )
}
