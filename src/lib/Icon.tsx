// ============================================================
// Icon — Lucide-equivalent line icons ported from the prototype.
// Exact path data preserved for pixel-accurate fidelity.
// 1.5–2px stroke, never filled, color inherits (currentColor).
// ============================================================
import type { CSSProperties } from 'react'

export type IconName =
  | 'hash' | 'search' | 'bell' | 'sun' | 'moon' | 'clip' | 'link'
  | 'plus' | 'x' | 'check' | 'clock' | 'repeat' | 'alert' | 'file'
  | 'users' | 'send' | 'shield' | 'list' | 'chevL' | 'chevR'
  | 'moreH' | 'smile' | 'msg' | 'pin' | 'task' | 'at' | 'home'
  | 'phone' | 'menu' | 'cal' | 'bookmark' | 'edit' | 'arrow' | 'zap'
  | 'film' | 'play'

const PATHS: Record<IconName, string> = {
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M21 21l-4.3-4.3',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  sun: 'M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z',
  clip: 'M21.4 11 12.3 20.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.9l8.5-8.4',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',
  repeat: 'M17 2l4 4-4 4M21 6H8a4 4 0 0 0-4 4v1M7 22l-4-4 4-4M3 18h13a4 4 0 0 0 4-4v-1',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  users: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  chevL: 'M15 18l-6-6 6-6',
  chevR: 'M9 18l6-6-6-6',
  moreH: 'M5 12h.01M12 12h.01M19 12h.01',
  smile: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8.5 14a4 4 0 0 0 7 0M9 9h.01M15 9h.01',
  msg: 'M21 11.5a8 8 0 0 1-11.5 7.2L3 21l2.3-6.5A8 8 0 1 1 21 11.5z',
  pin: 'M12 17v5M8 3h8l-1 7 3 2v2H6v-2l3-2z',
  task: 'M9 11l2 2 4-4M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z',
  at: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8',
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  phone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1M10 19h4',
  menu: 'M3 6h18M3 12h18M3 18h18',
  cal: 'M8 2v3M16 2v3M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1M3 10h18',
  bookmark: 'M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9z',
  film: 'm22 8-6 4 6 4V8zM2 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
  play: 'M8 5v14l11-7z',
}

interface IconProps {
  name: IconName
  size?: number
  sw?: number
  /** override stroke/fill color for the whole glyph */
  color?: string
  fill?: string
  style?: CSSProperties
  title?: string
}

export function Icon({ name, size = 18, sw = 1.8, color = 'currentColor', fill = 'none', style, title }: IconProps) {
  // 'play' is a solid glyph
  const isSolid = name === 'play'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isSolid ? 'currentColor' : fill}
      stroke={isSolid ? 'none' : color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none', display: 'block', ...style }}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  )
}
