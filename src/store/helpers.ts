// ============================================================
// Pure helpers ported from the prototype's Component methods.
// No React / no state ownership — everything needed is an arg.
// ============================================================
import type { IconName } from '../lib/Icon'
import { PEOPLE, ROLE_DEFS } from '../data/seed'
import type { ClassSession, PersonId, RoleSlot, TaskStatus } from '../data/types'

export function statusColor(s: TaskStatus | string): string {
  return s === 'overdue'
    ? 'var(--red)'
    : s === 'scheduled'
      ? 'var(--gold)'
      : s === 'recurring'
        ? 'var(--steel-line)'
        : s === 'done'
          ? 'var(--green)'
          : 'var(--faint2)'
}

export function statusIcon(s: TaskStatus | string): IconName | null {
  if (s === 'overdue') return 'alert'
  if (s === 'scheduled') return 'clock'
  if (s === 'recurring') return 'repeat'
  return null
}

export function timeKey(t: string): number {
  const m = (t || '').match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = +m[1] % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + +m[2]
}

export function resolveRole(r: RoleSlot | undefined, weekIdx: number): PersonId | null {
  if (!r) return null
  if (r.mode === 'alt') {
    const l = r.list || []
    if (!l.length) return null
    return l[weekIdx % l.length]
  }
  return r.p || null
}

export function recurLabel(days: string[], biweekly?: boolean): string {
  const d = days || []
  const wd = ['MON', 'TUE', 'WED', 'THU', 'FRI']
  let base: string
  if (d.length === 5 && wd.every((x) => d.indexOf(x) > -1)) base = 'Every weekday'
  else if (d.length >= 7) base = 'Every day'
  else if (d.length === 1) base = 'Weekly · ' + d[0][0] + d[0].slice(1).toLowerCase()
  else base = d.map((x) => x[0] + x.slice(1).toLowerCase()).join(' / ')
  return biweekly ? 'Every other wk · ' + base : base
}

export function classTime(c: ClassSession, day: string): string {
  return c.times && c.times[day] ? c.times[day] : c.time
}

export function coachRoleIn(c: ClassSession, id: PersonId | '', weekIdx: number): string | null {
  if (!id) return null
  for (const rd of ROLE_DEFS) {
    if (resolveRole(c[rd[0]], weekIdx) === id) return rd[1]
  }
  return null
}

export interface MentionPart {
  key: string
  t: string
  mention: boolean
  plain: boolean
}

export function splitMentions(t: string): MentionPart[] {
  return (t || '')
    .split(/(@[A-Za-z]+)/)
    .filter((x) => x !== '')
    .map((x, i) => ({
      key: i + '|' + x,
      t: x,
      mention: x.charAt(0) === '@',
      plain: x.charAt(0) !== '@',
    }))
}

export interface Avatar {
  initials: string
  color: string
  dark?: boolean
  name?: string
  presence?: string
}

export function avatar(id: PersonId): Avatar {
  const p = PEOPLE[id]
  return p
    ? { initials: p.initials, color: p.color, dark: p.dark, name: p.short, presence: p.presence }
    : { initials: '?', color: '#4C5A72' }
}

export function ink(dark?: boolean): string {
  return dark ? '#05101F' : '#fff'
}

export function presenceColor(presence?: string): string {
  return presence === 'online'
    ? 'var(--green)'
    : presence === 'away'
      ? 'var(--gold)'
      : 'var(--faint2)'
}
