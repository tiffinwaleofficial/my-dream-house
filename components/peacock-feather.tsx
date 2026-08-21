import { cn } from '@/lib/utils'

/**
 * Elegant, minimal peacock-feather motif drawn as an SVG so it can be
 * tinted, scaled and animated without any background artifacts.
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
      viewBox="0 0 120 320"
      fill="none"
      className={cn('block', className)}
      aria-hidden="true"
    >
      {/* rachis / stem */}
      <path
        d="M60 316 C60 240 58 190 60 150"
        stroke="var(--wood)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* fine barbs along the lower stem */}
      {Array.from({ length: 10 }).map((_, i) => {
        const y = 300 - i * 15
        const len = 6 + i * 1.6
        return (
          <g key={i} stroke="var(--green)" strokeWidth={strokeWidth * 0.7} strokeLinecap="round" opacity={0.55}>
            <path d={`M60 ${y} C${60 - len} ${y - 2}, ${60 - len - 4} ${y - 8}, ${60 - len - 6} ${y - 14}`} />
            <path d={`M60 ${y} C${60 + len} ${y - 2}, ${60 + len + 4} ${y - 8}, ${60 + len + 6} ${y - 14}`} />
          </g>
        )
      })}
      {/* outer plume */}
      <path
        d="M60 150 C24 132 22 74 60 20 C98 74 96 132 60 150 Z"
        fill="var(--peacock)"
        opacity={0.1}
      />
      <path
        d="M60 150 C24 132 22 74 60 20 C98 74 96 132 60 150 Z"
        stroke="var(--peacock)"
        strokeWidth={strokeWidth}
        opacity={0.5}
      />
      {/* the eye */}
      <ellipse cx="60" cy="78" rx="24" ry="34" fill="var(--peacock)" opacity={0.14} />
      <ellipse cx="60" cy="80" rx="15" ry="21" fill="var(--green)" opacity={0.22} />
      <ellipse cx="60" cy="82" rx="8" ry="12" fill="var(--wood)" opacity={0.4} />
      <ellipse cx="60" cy="84" rx="3.4" ry="5.4" fill="var(--peacock)" />
    </svg>
  )
}
