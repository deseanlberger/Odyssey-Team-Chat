// ============================================================
// Domain types for the Odyssey Performance staff workspace.
// ============================================================

export type Presence = 'online' | 'away' | 'offline'

export type Role =
  | 'Owner'
  | 'Coach'
  | 'Sales'
  | 'Front Desk'
  | 'Intern'
  | 'Programming'

export interface Person {
  name: string
  short: string
  role: Role
  initials: string
  color: string
  /** dark:true people render ink (#05101F) on their color, others white */
  dark?: boolean
  presence: Presence
}

export type PersonId = string

export interface Channel {
  id: string
  name: string
}

export interface Reaction {
  e: string
  n: number
}

export interface Attachment {
  name: string
  meta: string
}

export interface DocCard {
  title: string
  meta: string
}

export type MediaType = 'Video' | 'Doc' | 'Link'

export interface Media {
  type: MediaType
  label: string
}

export interface ThreadMeta {
  count: number
  who?: PersonId[]
}

export interface ScheduleLine {
  key?: string
  time: string
  name: string
  staff: string
}

export interface SchedulePost {
  title: string
  lines: ScheduleLine[]
}

export interface Message {
  id: string
  who?: PersonId
  time: string
  text?: string
  react?: Reaction[]
  attach?: Attachment
  doc?: DocCard
  pinned?: boolean
  thread?: ThreadMeta
  subject?: string
  media?: Media | null
  actionable?: boolean
  /** runtime system line (task completion backlink) */
  system?: boolean
  icon?: string
  /** runtime schedule-post card */
  schedule?: SchedulePost
}

export interface ThreadReply {
  who: PersonId
  text: string
  time: string
}

export type TaskStatus =
  | 'open'
  | 'scheduled'
  | 'recurring'
  | 'overdue'
  | 'done'

export interface BoardTask {
  id: string
  title: string
  assignee: PersonId | null
  status: TaskStatus
  sched?: string
  repeat?: string
  due?: string
  done?: boolean
  isNew?: boolean
}

export type TaskGroup =
  | 'today'
  | 'upcoming'
  | 'recurring'
  | 'overdue'
  | 'done'

export interface MyTask {
  id: string
  title: string
  channel: string
  group: TaskGroup
  status: TaskStatus
  sched?: string
  repeat?: string
  meta?: string
  done?: boolean
  justAdded?: boolean
}

export interface Notification {
  id: string
  icon: string
  text: string
  time: string
  unread: boolean
}

// ---- Scheduler -------------------------------------------------

export type RoleSlotKey = 'macro' | 'micro' | 'desk'

export interface RoleSlotFixed {
  mode: 'fixed'
  p: PersonId | null
  list?: PersonId[]
}
export interface RoleSlotAlt {
  mode: 'alt'
  list: PersonId[]
  p?: PersonId | null
}
export type RoleSlot = RoleSlotFixed | RoleSlotAlt

export interface ClassSession {
  id: string
  time: string
  name: string
  athletes: number
  days: string[]
  biweekly?: boolean
  weekParity?: number
  times?: Record<string, string>
  micro: RoleSlot
  macro: RoleSlot
  desk: RoleSlot
}

// ---- Admin -----------------------------------------------------

export interface Member {
  id: string
  name: string
  role: Role
  initials: string
  access: Record<string, boolean>
}

// ---- Forms -----------------------------------------------------

export interface TaskForm {
  title: string
  desc: string
  assignee: string
  due: string
  notifyNow: boolean
  notifyDate: string
  notifyTime: string
  repeat: string
  notifyCycle: boolean
}

export interface ClassRoleForm {
  mode: 'fixed' | 'alt'
  p: string
  list: PersonId[]
}

export interface ClassForm {
  name: string
  time: string
  days: string[]
  athletes: number
  biweekly: boolean
  varyTime: boolean
  times: Record<string, string>
  micro: ClassRoleForm
  macro: ClassRoleForm
  desk: ClassRoleForm
}

export interface TopicForm {
  title: string
  subjectMode: 'existing' | 'new'
  subject: string
  newSubject: string
  mediaType: 'None' | MediaType
  mediaLabel: string
}

export type Screen = 'chat' | 'mytasks' | 'schedule' | 'saved' | 'admin'
export type Theme = 'dark' | 'light'
