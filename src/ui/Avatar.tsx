// Avatar — initials on the person's color. 3px radius. dark:true
// people render ink (#05101F) on gold; others white.
import type { CSSProperties } from 'react'
import { ink } from '../store/helpers'

interface AvatarProps {
  initials: string
  color: string
  dark?: boolean
  size?: number
  radius?: number
  fontSize?: number
  style?: CSSProperties
}

export function Avatar({ initials, color, dark, size = 40, radius = 3, fontSize, style }: AvatarProps) {
  return (
    <span
      style={{
        flex: 'none',
        width: size,
        height: size,
        borderRadius: radius,
        background: color,
        color: ink(dark),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize ?? Math.round(size * 0.35),
        fontWeight: 700,
        ...style,
      }}
    >
      {initials}
    </span>
  )
}
