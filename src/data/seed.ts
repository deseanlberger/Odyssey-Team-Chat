// ============================================================
// Seed data — ported 1:1 from the hi-fi prototype's Component.
// ============================================================
import type {
  BoardTask,
  Channel,
  ClassSession,
  Message,
  MyTask,
  Notification,
  Person,
  PersonId,
  Role,
  RoleSlotKey,
  ThreadReply,
} from './types'

export const PEOPLE: Record<PersonId, Person> = {
  annie: { name: 'Annie Fisher', short: 'Annie', role: 'Sales', initials: 'AF', color: '#FFD700', dark: true, presence: 'online' },
  jake: { name: 'Jake Morrow', short: 'Jake', role: 'Sales', initials: 'JM', color: '#FF9F45', presence: 'online' },
  ty: { name: 'Ty Coleman', short: 'Ty', role: 'Coach', initials: 'TC', color: '#3DD67A', presence: 'online' },
  matthew: { name: 'Matthew Reyes', short: 'Matthew', role: 'Coach', initials: 'MR', color: '#5B8DEF', presence: 'away' },
  michael: { name: 'Michael Grant', short: 'Michael', role: 'Programming', initials: 'MG', color: '#C77DFF', presence: 'online' },
  megan: { name: 'Megan Doyle', short: 'Megan', role: 'Front Desk', initials: 'MD', color: '#3DD67A', presence: 'online' },
  delaney: { name: 'Delaney Cruz', short: 'Delaney', role: 'Intern', initials: 'DC', color: '#8A99B0', presence: 'offline' },
  desean: { name: 'Desean Berger', short: 'Desean', role: 'Owner', initials: 'DB', color: '#FFD700', dark: true, presence: 'away' },
  kayla: { name: 'Kayla Brooks', short: 'Kayla', role: 'Front Desk', initials: 'KB', color: '#4CC9F0', presence: 'online' },
  grace: { name: 'Grace Lin', short: 'Grace', role: 'Front Desk', initials: 'GL', color: '#F72585', presence: 'away' },
  chris: { name: 'Chris Vance', short: 'Chris', role: 'Coach', initials: 'CV', color: '#B5E48C', presence: 'online' },
}

export const CH: Channel[] = [
  { id: 'general', name: 'general' },
  { id: 'sales', name: 'sales' },
  { id: 'front', name: 'front-desk' },
  { id: 'coaching', name: 'coaching-staff' },
  { id: 'programming', name: 'programming' },
  { id: 'interns', name: 'interns' },
  { id: 'research', name: 'research' },
  { id: 'policies', name: 'policies' },
]

export const CH_NAME: Record<string, string> = {
  general: 'general', sales: 'sales', front: 'front-desk', coaching: 'coaching-staff',
  programming: 'programming', interns: 'interns', research: 'research', policies: 'policies',
}
export const CH_SLUG: Record<string, string> = {
  general: 'general', sales: 'sales', 'front-desk': 'front', 'coaching-staff': 'coaching',
  programming: 'programming', interns: 'interns', research: 'research', policies: 'policies',
}

export const SESS_COACH: PersonId[] = ['ty', 'matthew', 'michael', 'chris', 'delaney']
export const SESS_DESK: PersonId[] = ['megan', 'kayla', 'grace']

/** [key, label, pool] priority order: Head → Secondary → Support */
export const ROLE_DEFS: [RoleSlotKey, string, 'coach' | 'desk'][] = [
  ['macro', 'Head Coach', 'coach'],
  ['micro', 'Secondary Coach', 'coach'],
  ['desk', 'Support · Front Desk', 'desk'],
]

export const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export const TOPIC: Record<string, string> = {
  general: 'Whole-staff announcements',
  sales: 'Leads, follow-ups & memberships',
  front: 'Front desk ops & facility',
  coaching: 'Session prep & floor coverage',
  programming: 'Training blocks & VBT data',
  interns: 'Floor setup & onboarding',
  research: 'Programming topics & research — organized by thread',
  policies: 'Handbook, waivers & facility policy',
}

export const DMS: PersonId[] = ['ty', 'matthew', 'michael', 'jake', 'megan', 'delaney']

export const RES: Record<string, { n: string; t: string }[]> = {
  sales: [{ n: 'Lead Follow-Up Script', t: 'Docs' }, { n: 'July Leads Tracker', t: 'Sheets' }, { n: 'Pricing Sheet 2026', t: 'PDF' }],
  programming: [{ n: 'Summer Block — Phase 02', t: 'Docs' }, { n: 'VBT Velocity Targets', t: 'Sheets' }],
  coaching: [{ n: 'Session Prep Checklist', t: 'Docs' }],
  general: [{ n: 'Staff Handbook', t: 'PDF' }],
  front: [{ n: 'Front Desk SOP', t: 'Docs' }, { n: 'Facility Issue Log', t: 'Sheets' }],
  interns: [{ n: 'Intern Onboarding', t: 'Docs' }],
  research: [{ n: 'Research Index', t: 'Docs' }, { n: 'VBT Data Log', t: 'Sheets' }],
  policies: [{ n: 'Staff Handbook', t: 'PDF' }, { n: 'Liability Waivers', t: 'PDF' }, { n: 'Facility SOP', t: 'Docs' }, { n: 'Emergency Action Plan', t: 'PDF' }],
}

export const MSGS: Record<string, Message[]> = {
  sales: [
    { id: 's1', who: 'jake', time: '8:58 AM', text: 'Morning — 3 new leads came in overnight off the summer-camp form. Splitting them now.' },
    { id: 's2', who: 'annie', time: '9:02 AM', text: 'I’ll take the two middle-schoolers. Can you follow up with the HS sprinter (Marcus)?', react: [{ e: '👍', n: 2 }] },
    { id: 's3', who: 'jake', time: '9:04 AM', text: 'Deal. Dropping the tracker here so we’re not double-calling anyone.', attach: { name: 'July_Leads_Tracker.xlsx', meta: 'XLSX · 84 KB' } },
    { id: 's4', who: 'desean', time: '9:10 AM', text: 'Reminder: every trial session gets a Blueprint assessment booked before they leave the building. No exceptions.', react: [{ e: '✅', n: 4 }], thread: { count: 4, who: ['ty', 'annie', 'megan'] } },
    { id: 's5', who: 'megan', time: '9:22 AM', text: 'Walk-in at the desk asking about college-prep pricing — sending them your way, Annie.' },
    { id: 's6', who: 'ty', time: '9:41 AM', text: 'Can someone turn my “call back Thursday” note into a task? Don’t want it buried in here.', actionable: true },
  ],
  programming: [
    { id: 'p0', who: 'michael', time: '7:30 AM', text: 'Phase 02 block is live for the summer group. Read this before Monday’s sessions.', doc: { title: 'Summer Block — Phase 02 Programming', meta: 'Google Docs · shared by Michael' }, pinned: true },
    { id: 'p1', who: 'ty', time: '8:12 AM', text: 'Velocity targets look aggressive for the 13U group — capping bar speed at 0.9 m/s for now?' },
    { id: 'p2', who: 'michael', time: '8:15 AM', text: 'Agreed. I’ll flag it in the doc under Acceleration.', react: [{ e: '👍', n: 1 }] },
  ],
  coaching: [
    { id: 'c1', who: 'matthew', time: 'Yesterday', text: '4:00 group is at 11 athletes today. Need a second coach on the platform.' },
    { id: 'c2', who: 'ty', time: 'Yesterday', text: 'I’ve got it. Warmup starts 3:55.', react: [{ e: '💪', n: 2 }] },
  ],
  front: [
    { id: 'f1', who: 'megan', time: '8:30 AM', text: 'Fob scanner at the front is glitching again — logging a task for facilities.' },
    { id: 'f2', who: 'delaney', time: '8:34 AM', text: 'Reset it, working for now. Might need a real fix though.' },
  ],
  general: [
    { id: 'g1', who: 'desean', time: 'Mon', text: 'Big week — 2 commitments announced and the 8-week summer block kicks off. Proud of this staff.', react: [{ e: '🔥', n: 6 }, { e: '🎉', n: 3 }] },
    { id: 'g2', who: 'annie', time: 'Mon', text: 'Let’s go 🙌' },
  ],
  interns: [
    { id: 'i1', who: 'delaney', time: '9:00 AM', text: 'Floor is reset and platforms are chalked. Anything else before the 10:00?' },
    { id: 'i2', who: 'ty', time: '9:05 AM', text: 'Grab the VBT units off the charger and pair them to the tablets.' },
  ],
  research: [
    { id: 'rs4', who: 'michael', time: 'Jan 8', text: 'Sprint mechanics — cueing library', subject: 'Acceleration', thread: { count: 1 } },
    { id: 'rs5', who: 'ty', time: 'Apr 12', text: '10-yard start — video breakdown', subject: 'Acceleration', media: { type: 'Video', label: '10-yard start — sideline cam.mp4' }, thread: { count: 1 } },
    { id: 'rs1', who: 'michael', time: 'Mon', text: 'Velocity targets by age group (VBT)', subject: 'Velocity (VBT)', thread: { count: 3 } },
    { id: 'rs2', who: 'ty', time: 'Mon', text: 'Tri-Phasic loading — eccentric emphasis notes', subject: 'Tri-Phasic Loading', thread: { count: 2 } },
    { id: 'rs3', who: 'matthew', time: 'Tue', text: 'Return-to-play criteria after lower-limb injury', subject: 'Return-to-Play', thread: { count: 2 } },
  ],
  policies: [
    { id: 'pol1', who: 'desean', time: 'Mon', text: 'Updated the Emergency Action Plan — everyone review before Friday. It’s pinned in Resources.', doc: { title: 'Emergency Action Plan 2026', meta: 'Google Docs · updated by Desean' } },
    { id: 'pol2', who: 'megan', time: 'Tue', text: 'New liability waiver is live at the front desk. Recycle any old printed copies.' },
  ],
  dm_ty: [
    { id: 'dt1', who: 'ty', time: '9:41 AM', text: 'Hey — did that Marcus lead ever call back?' },
    { id: 'dt2', who: 'annie', time: '9:45 AM', text: 'Calling him at 2. Made a task so it won’t slip.' },
  ],
}

/** [name, role, channels-with-access] */
export const ADMIN: [string, Role, string[]][] = [
  ['Desean Berger', 'Owner', ['general', 'sales', 'front', 'coaching', 'programming', 'interns']],
  ['Annie Fisher', 'Sales', ['general', 'sales', 'front']],
  ['Jake Morrow', 'Sales', ['general', 'sales']],
  ['Ty Coleman', 'Coach', ['general', 'coaching', 'programming', 'interns']],
  ['Matthew Reyes', 'Coach', ['general', 'coaching', 'programming']],
  ['Michael Grant', 'Programming', ['general', 'programming', 'coaching']],
  ['Megan Doyle', 'Front Desk', ['general', 'front', 'sales']],
  ['Delaney Cruz', 'Intern', ['general', 'interns']],
  ['Chris Vance', 'Coach', ['general', 'coaching']],
  ['Priya Nair', 'Coach', ['general', 'coaching', 'programming']],
  ['Sam Okafor', 'Programming', ['general', 'programming']],
  ['Kayla Brooks', 'Front Desk', ['general', 'front']],
  ['Marcus Webb', 'Intern', ['general', 'interns']],
  ['Sofia Ramos', 'Intern', ['general', 'interns']],
  ['Devin Hale', 'Coach', ['general', 'coaching']],
  ['Ruby Chen', 'Sales', ['general', 'sales']],
  ['Noah Pratt', 'Intern', ['general', 'interns']],
  ['Grace Lin', 'Front Desk', ['general', 'front']],
  ['Leo Santos', 'Coach', ['general', 'coaching', 'interns']],
  ['Owen Diaz', 'Intern', ['general', 'interns']],
]

export const INITIAL_CLASSES: ClassSession[] = [
  { id: 'c1', time: '6:00 AM', name: 'Adult Strength', athletes: 8, days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], micro: { mode: 'alt', list: ['ty', 'chris'] }, macro: { mode: 'fixed', p: 'matthew' }, desk: { mode: 'fixed', p: 'megan' } },
  { id: 'c2', time: '3:00 PM', name: 'Middle School', athletes: 12, days: ['MON', 'WED', 'FRI'], micro: { mode: 'fixed', p: 'delaney' }, macro: { mode: 'alt', list: ['ty', 'matthew'] }, desk: { mode: 'fixed', p: 'kayla' } },
  { id: 'c3', time: '3:30 PM', name: 'Youth Athletic', athletes: 9, days: ['TUE', 'THU'], micro: { mode: 'fixed', p: 'delaney' }, macro: { mode: 'fixed', p: 'matthew' }, desk: { mode: 'fixed', p: 'kayla' } },
  { id: 'c4', time: '4:00 PM', name: 'HS Speed & Power', athletes: 11, days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], micro: { mode: 'alt', list: ['matthew', 'ty'] }, macro: { mode: 'fixed', p: 'michael' }, desk: { mode: 'fixed', p: 'megan' } },
  { id: 'c5', time: '5:30 PM', name: 'College Prep', athletes: 6, days: ['MON', 'WED', 'FRI'], micro: { mode: 'fixed', p: 'ty' }, macro: { mode: 'fixed', p: 'michael' }, desk: { mode: 'fixed', p: 'grace' } },
  { id: 'c6', time: '7:00 PM', name: 'Private', athletes: 3, days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], micro: { mode: 'alt', list: ['matthew', 'chris'] }, macro: { mode: 'fixed', p: null }, desk: { mode: 'fixed', p: 'kayla' } },
  { id: 'c7', time: '9:00 AM', name: 'Open Gym', athletes: 14, days: ['SAT'], micro: { mode: 'fixed', p: 'chris' }, macro: { mode: 'fixed', p: null }, desk: { mode: 'fixed', p: 'kayla' } },
  { id: 'c8', time: '10:30 AM', name: 'Weekend Speed', athletes: 7, days: ['SAT'], micro: { mode: 'fixed', p: 'ty' }, macro: { mode: 'fixed', p: null }, desk: { mode: 'fixed', p: 'grace' } },
]

export const INITIAL_THREADS: Record<string, ThreadReply[]> = {
  s4: [
    { who: 'ty', text: 'On it — I’ll make sure the 4:00 group all have theirs booked.', time: '9:12 AM' },
    { who: 'megan', text: 'Front desk will double-check at checkout.', time: '9:14 AM' },
    { who: 'annie', text: 'Marcus is booked for a Blueprint right after his trial.', time: '9:15 AM' },
    { who: 'desean', text: 'Perfect. That’s the standard.', time: '9:18 AM' },
  ],
  rs1: [
    { who: 'ty', text: 'Capping 13U at 0.9 m/s until technique is clean.', time: 'Mon' },
    { who: 'michael', text: 'Agreed. HS group 0.8–1.0 m/s for strength-speed.', time: 'Mon' },
    { who: 'matthew', text: 'Added the force-velocity chart to the Research Index.', time: 'Mon' },
  ],
  rs2: [
    { who: 'michael', text: '3s eccentric / 1s iso / explosive concentric, wks 1–3.', time: 'Mon' },
    { who: 'ty', text: 'Holding 70–80% during the eccentric blocks.', time: 'Mon' },
  ],
  rs3: [
    { who: 'matthew', text: 'Hop-test symmetry >90% before any sprint work.', time: 'Tue' },
    { who: 'michael', text: 'Adding the checklist to the athlete app.', time: 'Tue' },
  ],
  rs4: [{ who: 'ty', text: '“Punch the ground, don’t reach” — best cue for overstriding.', time: 'Jan 8' }],
  rs5: [{ who: 'michael', text: 'First 3 steps: shin angle ~45°, aggressive arm drive. Clip added to Research Index.', time: 'Apr 12' }],
}

export const INITIAL_BOARD: Record<string, BoardTask[]> = {
  sales: [
    { id: 'ct1', title: 'Follow up: HS sprinter lead (Marcus)', assignee: 'annie', status: 'scheduled', sched: 'Notify 2:00 PM', due: 'Due today' },
    { id: 'ct2', title: 'Send July lead tracker to Desean', assignee: 'jake', status: 'overdue', due: '2 days overdue' },
    { id: 'ct3', title: 'Book trial → Blueprint assessment', assignee: null, status: 'recurring', repeat: 'Weekly · Mon' },
    { id: 'ct4', title: 'Update pricing sheet for fall', assignee: 'annie', status: 'open', due: 'Due Fri' },
    { id: 'ct5', title: 'Prep college-prep call script', assignee: 'jake', status: 'done', done: true },
  ],
  programming: [
    { id: 'pt1', title: 'Publish Phase 02 to athlete app', assignee: 'michael', status: 'scheduled', sched: 'Notify Mon 6:00 AM', due: 'Due Mon' },
    { id: 'pt2', title: 'Cap 13U bar speed at 0.9 m/s', assignee: 'ty', status: 'open', due: 'Due today' },
    { id: 'pt3', title: 'Weekly VBT data export', assignee: null, status: 'recurring', repeat: 'Weekly · Fri' },
  ],
  coaching: [
    { id: 'cot1', title: 'Assign 2nd coach to 4:00 group', assignee: 'matthew', status: 'open', due: 'Due today' },
    { id: 'cot2', title: 'Session prep checklist', assignee: null, status: 'recurring', repeat: 'Daily' },
  ],
  front: [
    { id: 'ft1', title: 'Fix front-desk fob scanner', assignee: 'delaney', status: 'overdue', due: '1 day overdue' },
    { id: 'ft2', title: 'Restock waivers at desk', assignee: 'megan', status: 'recurring', repeat: 'Weekly · Mon' },
  ],
  general: [],
  interns: [
    { id: 'nt1', title: 'Reset platforms before 10:00', assignee: 'delaney', status: 'recurring', repeat: 'Daily' },
  ],
}

export const INITIAL_MY_TASKS: MyTask[] = [
  { id: 'm1', title: 'Follow up: HS sprinter lead (Marcus)', channel: '#sales', group: 'today', status: 'scheduled', sched: 'Notify 2:00 PM' },
  { id: 'm2', title: 'Prep notes for 4:00 group session', channel: '#coaching-staff', group: 'today', status: 'open' },
  { id: 'm3', title: 'Tour with the Johnson family', channel: '#front-desk', group: 'upcoming', status: 'scheduled', sched: 'Notify Thu 9:00 AM', meta: 'Thu' },
  { id: 'm4', title: 'Q3 membership renewal calls', channel: '#sales', group: 'upcoming', status: 'open', meta: 'Fri' },
  { id: 'm5', title: 'Weekly lead pipeline review', channel: '#sales', group: 'recurring', status: 'recurring', repeat: 'Weekly · Mon' },
  { id: 'm6', title: 'Log new trial bookings', channel: '#sales', group: 'recurring', status: 'recurring', repeat: 'Daily' },
  { id: 'm7', title: 'Send July lead tracker to Desean', channel: '#sales', group: 'overdue', status: 'overdue', meta: '2 days overdue' },
  { id: 'm8', title: 'Confirm summer-camp waitlist', channel: '#front-desk', group: 'done', status: 'done', done: true },
  { id: 'm9', title: 'Call back — Reyes family', channel: '#sales', group: 'done', status: 'done', done: true },
]

export const INITIAL_NOTIFS: Notification[] = [
  { id: 'n1', icon: 'clock', text: 'Reminder scheduled — follow up with Marcus at 2:00 PM', time: 'in 3h', unread: true },
  { id: 'n2', icon: 'at', text: 'Jake mentioned you in #sales', time: '22m', unread: true },
  { id: 'n3', icon: 'pin', text: 'Desean pinned a doc in #programming', time: '1h', unread: false },
  { id: 'n4', icon: 'clock', text: 'Tour with Johnson family — reminder set Thu 9:00 AM', time: 'Thu', unread: false },
]

export function buildMembers() {
  const chIds = CH.map((c) => c.id)
  return ADMIN.map((m, i) => {
    const access: Record<string, boolean> = {}
    chIds.forEach((c) => (access[c] = m[2].indexOf(c) > -1))
    return {
      id: 'u' + i,
      name: m[0],
      role: m[1],
      initials: m[0].split(' ').map((w) => w[0]).slice(0, 2).join(''),
      access,
    }
  })
}
