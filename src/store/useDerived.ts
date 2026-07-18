// ============================================================
// useDerived — the renderVals() equivalent. Turns state + actions
// into ready-to-render view-model objects with callbacks bound.
// View components are thin templates over this hook.
// ============================================================
import { useMemo } from 'react'
import {
  CH,
  CH_NAME,
  DMS,
  DOW,
  MSGS,
  PEOPLE,
  RES,
  ROLE_DEFS,
  SESS_COACH,
  SESS_DESK,
  TOPIC,
} from '../data/seed'
import type { Message, RoleSlotKey } from '../data/types'
import {
  avatar,
  classTime,
  coachRoleIn,
  ink,
  presenceColor,
  recurLabel,
  resolveRole,
  splitMentions,
  statusColor,
  statusIcon,
  timeKey,
} from './helpers'
import { useWorkspace } from './WorkspaceContext'

export function useDerived() {
  const w = useWorkspace()
  const s = w.state

  return useMemo(() => {
    const isLight = s.theme === 'light'
    const isDM = s.active.indexOf('dm_') === 0
    const dmId = isDM ? s.active.slice(3) : null
    const activeName = isDM
      ? PEOPLE[dmId!]
        ? PEOPLE[dmId!].name
        : 'Direct message'
      : CH_NAME[s.active] || s.active

    // ---- message shaping
    const threadLabelFor = (m: Message) => {
      const rl = s.threads && s.threads[m.id]
      const c = rl ? rl.length : m.thread ? m.thread.count : 0
      return c + ' replies'
    }
    const shapeMsg = (m: Message, ch = s.active) => {
      if (m.schedule) {
        const pp = PEOPLE[m.who!] || ({} as (typeof PEOPLE)[string])
        return {
          id: m.id, isSchedulePost: true, isNormal: false, isSystem: false,
          initials: pp.initials, avColor: pp.color, avInk: ink(pp.dark), name: pp.name, role: pp.role, time: m.time,
          schedTitle: m.schedule.title, schedLines: m.schedule.lines || [],
        }
      }
      if (m.system) {
        return { id: m.id, isSystem: true, isNormal: false, isSchedulePost: false, text: m.text, time: m.time }
      }
      const p = PEOPLE[m.who!] || ({} as (typeof PEOPLE)[string])
      const hasTh = !!(m.thread || (s.threads && s.threads[m.id] && s.threads[m.id].length))
      const saved = s.saved.indexOf(m.id) > -1
      const pinned = (s.pinned[ch] || []).indexOf(m.id) > -1
      return {
        id: m.id, isSystem: false, isNormal: true, isSchedulePost: false,
        initials: p.initials, avColor: p.color, avInk: ink(p.dark), name: p.name, role: p.role, time: m.time, text: m.text,
        parts: splitMentions(m.text || ''),
        hasReact: !!(m.react && m.react.length),
        react: (m.react || []).map((r, i) => ({ e: r.e, n: r.n, key: m.id + 'r' + i })),
        hasAttach: !!m.attach, attachName: m.attach ? m.attach.name : '', attachMeta: m.attach ? m.attach.meta : '',
        hasDoc: !!m.doc, docTitle: m.doc ? m.doc.title : '', docMeta: m.doc ? m.doc.meta : '',
        hasThread: hasTh, threadLabel: threadLabelFor(m),
        isSaved: saved, saveColor: saved ? 'var(--gold)' : 'var(--muted)',
        isPinned: pinned, pinColor: pinned ? 'var(--gold)' : 'var(--muted)',
        openThread: () => w.openThread(m.id),
        toggleSave: () => w.toggleSave(m.id),
        togglePin: () => w.togglePin(ch, m.id),
        turnIntoTask: () => w.openModal(m.text, ''),
      }
    }

    const msgs = (MSGS[s.active] || (isDM ? MSGS.dm_ty : [])).concat(s.extraMsgs[s.active] || []).map((m) => shapeMsg(m))
    const resList = (RES[s.active] || []).map((r, i) => ({ n: r.n, t: r.t, key: s.active + i }))

    // ---- board
    const shapeBoard = (t: (typeof s.board)[string][number]) => {
      const a = t.assignee ? avatar(t.assignee) : null
      return {
        id: t.id, title: t.title, checked: !!t.done,
        isScheduled: t.status === 'scheduled', isRecurring: t.status === 'recurring',
        isOverdue: t.status === 'overdue', isDone: !!t.done,
        metaLine: t.sched || t.repeat || t.due || '',
        iconName: statusIcon(t.status), barColor: statusColor(t.status),
        hasAssignee: !!a, assigneeInitials: a ? a.initials : '', assigneeColor: a ? a.color : '',
        assigneeInk: a && a.dark ? '#05101F' : '#fff', assigneeName: a ? a.name : 'Channel-wide',
        assigneeDark: !!(a && a.dark),
        onCheck: () => w.completeBoard(t.id),
      }
    }
    const board = (s.board[s.active] || []).map(shapeBoard)

    // ---- research topics
    const isResearch = s.active === 'research'
    const rmsgs = (MSGS.research || []).concat(s.extraMsgs.research || []).filter((m) => !m.system && !m.schedule)
    const subjMap: Record<string, ReturnType<typeof buildTopic>[]> = {}
    const subjOrder: string[] = []
    function buildTopic(m: Message) {
      const rl = s.threads[m.id] || []
      const pp = PEOPLE[m.who!] || ({} as (typeof PEOPLE)[string])
      return {
        key: m.id, title: m.text, when: m.time,
        countLabel: rl.length + (rl.length === 1 ? ' note' : ' notes'),
        initials: pp.initials || '', color: pp.color, ink: ink(pp.dark),
        hasMedia: !!m.media, mediaType: m.media ? m.media.type : '',
        open: () => w.openThread(m.id),
      }
    }
    rmsgs.forEach((m) => {
      const subj = m.subject || 'General'
      if (!subjMap[subj]) {
        subjMap[subj] = []
        subjOrder.push(subj)
      }
      subjMap[subj].push(buildTopic(m))
    })
    const topicGroups = subjOrder.map((sub) => {
      const collapsed = !!s.collapsedSubjects[sub]
      return {
        key: sub, subject: sub, count: String(subjMap[sub].length), items: subjMap[sub],
        collapsed, expanded: !collapsed, chevron: collapsed ? '›' : '⌄',
        toggle: () => w.toggleSubject(sub),
      }
    })

    // ---- sidebar channels / dms
    const chans = CH.map((c) => {
      const on = s.active === c.id
      const un = !!s.unread[c.id]
      return {
        id: c.id, name: c.name, select: () => w.selectChannel(c.id), isUnread: un,
        rowBg: on ? 'var(--raised)' : 'transparent',
        barColor: on ? 'var(--gold)' : 'transparent',
        nameStyle: on
          ? { fontWeight: 600, color: 'var(--text-strong)' }
          : un
            ? { fontWeight: 700, color: 'var(--text-strong)' }
            : { fontWeight: 500, color: 'var(--muted)' },
      }
    })
    const dms = DMS.map((id) => {
      const p = PEOPLE[id]
      const on = s.active === 'dm_' + id
      return {
        id, name: p.short, initials: p.initials, color: p.color, ink: ink(p.dark),
        presenceColor: presenceColor(p.presence), isOnline: p.presence !== 'offline',
        select: () => w.selectChannel('dm_' + id),
        rowBg: on ? 'var(--raised)' : 'transparent',
        nameStyle: on ? { color: 'var(--text-strong)', fontWeight: 600 } : { color: 'var(--muted)', fontWeight: 500 },
      }
    })

    // ---- my tasks
    const shapeMy = (t: (typeof s.myTasks)[number]) => ({
      id: t.id, title: t.title, channel: t.channel, checked: !!t.done,
      metaLine: t.sched || t.repeat || t.meta || '',
      isScheduled: t.status === 'scheduled', isRecurring: t.status === 'recurring',
      isOverdue: t.status === 'overdue', isDone: !!t.done,
      iconName: statusIcon(t.status), barColor: statusColor(t.status),
      onCheck: () => w.completeMy(t.id),
      completing: s.completingId === t.id,
    })
    const order: [string, string][] = [
      ['today', 'Today'], ['upcoming', 'Upcoming'], ['recurring', 'Recurring'], ['overdue', 'Overdue'], ['done', 'Done'],
    ]
    const myGroups = order
      .map(([k, label]) => {
        const items = s.myTasks.filter((t) => t.group === k).map(shapeMy)
        return { key: k, label, count: items.length, items, hasItems: items.length > 0, isDone: k === 'done' }
      })
      .filter((g) => g.hasItems)
    const myCount = s.myTasks.filter((t) => t.group !== 'done' && !t.done).length

    // ---- admin
    const chCols = CH.slice(0, 6).map((c) => ({ id: c.id, name: c.name }))
    const members = s.members.map((m) => ({
      id: m.id, name: m.name, role: m.role, initials: m.initials,
      roleColor: m.role === 'Owner' ? 'var(--gold)' : 'var(--chip-fg)',
      cells: CH.slice(0, 6).map((c) => ({
        key: m.id + c.id, checked: m.access[c.id], toggle: () => w.toggleAccess(m.id, c.id),
      })),
    }))

    // ---- create task modal
    const f = s.form
    const assignOpts = [{ v: '', label: 'Channel-wide (everyone in #' + activeName + ')' }].concat(
      Object.keys(PEOPLE).map((id) => ({ v: id, label: PEOPLE[id].name + ' · ' + PEOPLE[id].role })),
    )

    // ---- search
    const q = s.searchQ.toLowerCase()
    const searchCh = CH.filter((c) => !q || c.name.indexOf(q) > -1).map((c) => ({ id: c.id, name: c.name, select: () => w.selectChannel(c.id) }))
    const searchPl = Object.keys(PEOPLE)
      .filter((id) => !q || PEOPLE[id].short.toLowerCase().indexOf(q) > -1)
      .map((id) => ({
        id, name: PEOPLE[id].name, role: PEOPLE[id].role, initials: PEOPLE[id].initials,
        color: PEOPLE[id].color, ink: ink(PEOPLE[id].dark), select: () => w.selectChannel('dm_' + id),
      }))
    const navAll = [
      { id: 'g-tasks', label: 'My Tasks', hint: 'View', go: () => w.setState({ screen: 'mytasks', searchOpen: false }) },
      { id: 'g-sched', label: 'Schedule', hint: 'View', go: () => w.setState({ screen: 'schedule', searchOpen: false }) },
      { id: 'g-saved', label: 'Saved Items', hint: 'View', go: () => w.setState({ screen: 'saved', searchOpen: false }) },
      { id: 'g-admin', label: 'Admin · Members', hint: 'View', go: () => w.setState({ screen: 'admin', searchOpen: false }) },
    ]
    const actAll = [
      { id: 'a-task', label: 'Create a task', hint: 'Action', go: () => { w.setState({ searchOpen: false }); w.openModal('', '') } },
      { id: 'a-topic', label: 'New research topic', hint: 'Action', go: () => { w.setState({ searchOpen: false }); w.openTopicModal() } },
      { id: 'a-post', label: 'Post schedule to #coaching', hint: 'Admin', go: () => { w.setState({ searchOpen: false }); w.postSchedule() } },
      { id: 'a-theme', label: 'Toggle light / dark', hint: 'Action', go: () => w.toggleTheme() },
    ]
    const searchNav = navAll.filter((x) => !q || x.label.toLowerCase().indexOf(q) > -1)
    const searchAct = actAll.filter((x) => !q || x.label.toLowerCase().indexOf(q) > -1)

    // ---- notifications
    const notifs = s.notifs.map((n) => ({
      id: n.id, text: n.text, time: n.time, unread: n.unread, iconName: n.icon,
      dotColor: n.unread ? 'var(--gold)' : 'transparent',
    }))
    const unreadNotif = s.notifs.some((n) => n.unread)

    // ---- schedule
    const selDay = 'THU'
    const runs = (c: (typeof s.classes)[number]) => !c.biweekly || s.weekIdx % 2 === (c.weekParity || 0)
    const coachSel = s.schedCoach
    const inView = (c: (typeof s.classes)[number]) => !coachSel || coachRoleIn(c, coachSel, s.weekIdx)
    const dsort = (day: string) => (a: (typeof s.classes)[number], b: (typeof s.classes)[number]) =>
      timeKey(classTime(a, day)) - timeKey(classTime(b, day))

    const daySessions = s.classes
      .filter((c) => c.days.indexOf(selDay) > -1 && runs(c) && inView(c))
      .slice()
      .sort(dsort(selDay))
      .map((c) => ({
        id: c.id, time: classTime(c, selDay), name: c.name, athletes: c.athletes + ' athletes',
        recur: recurLabel(c.days, c.biweekly), edit: () => w.openEditClass(c.id),
        myRole: coachSel ? coachRoleIn(c, coachSel, s.weekIdx) || '' : '', showMyRole: !!coachSel,
        slots: ROLE_DEFS.map((rd) => {
          const r = c[rd[0]]
          const isAlt = r && r.mode === 'alt'
          const cur = resolveRole(r, s.weekIdx)
          const pp = cur ? PEOPLE[cur] : null
          const pool = rd[2] === 'coach' ? SESS_COACH : SESS_DESK
          const opts: { v: string; label: string }[] = []
          if (cur && PEOPLE[cur]) opts.push({ v: cur, label: PEOPLE[cur].name })
          opts.push({ v: '', label: '— Unassigned —' })
          pool.filter((x) => x !== cur).forEach((x) => opts.push({ v: x, label: PEOPLE[x].name }))
          return {
            key: c.id + rd[0], role: rd[1], isAlt, isFixed: !isAlt, value: cur || '',
            color: pp ? pp.color : 'var(--faint2)', curName: pp ? pp.name : 'Unassigned',
            altSummary: isAlt ? (r.list || []).map((x) => (PEOPLE[x] ? PEOPLE[x].short : x)).join(' / ') : '',
            onChange: (v: string) => w.assignFixedInline(c.id, rd[0], v),
            makeAlt: () => w.openEditClass(c.id), options: opts,
          }
        }),
      }))

    const weekDays = DOW.map((day) => {
      const list = s.classes.filter((c) => c.days.indexOf(day) > -1 && runs(c) && inView(c)).slice().sort(dsort(day))
      return {
        day, isToday: day === selDay, closed: list.length === 0, count: list.length + ' sess.',
        dayColor: day === selDay ? 'var(--gold-ink)' : 'var(--text-strong)',
        sessions: list.map((c) => ({
          key: day + c.id, time: classTime(c, day), name: c.name,
          recurAlt: c.micro.mode === 'alt' || c.macro.mode === 'alt' || c.desk.mode === 'alt' || !!c.biweekly,
          staff: ROLE_DEFS.map((rd) => {
            const cur = resolveRole(c[rd[0]], s.weekIdx)
            if (!cur || !PEOPLE[cur]) return null
            const pp = PEOPLE[cur]
            const isAlt = c[rd[0]].mode === 'alt'
            return {
              key: day + c.id + rd[0], initials: pp.initials, color: pp.color, ink: ink(pp.dark),
              title: rd[1] + ' · ' + pp.name + (isAlt ? ' (alternating)' : ''),
              ring: isAlt ? '0 0 0 1.5px var(--gold-ink)' : 'none',
            }
          }).filter(Boolean),
        })),
      }
    })

    const coachPickOpts = [{ v: '', label: 'Everyone' }].concat(
      SESS_COACH.concat(SESS_DESK).map((x) => ({ v: x, label: PEOPLE[x].name })),
    )

    // ---- class modal
    const cf = s.cform
    const coachOpts = [{ v: '', label: 'Select coach…' }].concat(SESS_COACH.map((x) => ({ v: x, label: PEOPLE[x].name })))
    const deskOpts = [{ v: '', label: 'Select staff…' }].concat(SESS_DESK.map((x) => ({ v: x, label: PEOPLE[x].name })))
    const dayChips = DOW.map((d) => {
      const on = cf.days.indexOf(d) > -1
      return { day: d, on, bg: on ? 'var(--gold)' : 'var(--input)', fg: on ? '#05101F' : 'var(--muted)', toggle: () => w.toggleCDay(d) }
    })
    const mkEditor = (role: RoleSlotKey, label: string, kind: 'coach' | 'desk') => {
      const r = cf[role]
      const pool = kind === 'coach' ? coachOpts : deskOpts
      const alt = r.mode === 'alt'
      return {
        role, label, isAlt: alt, isFixed: !alt,
        fixedBg: !alt ? 'var(--gold)' : 'transparent', fixedFg: !alt ? '#05101F' : 'var(--muted)',
        altBg: alt ? 'var(--gold)' : 'transparent', altFg: alt ? '#05101F' : 'var(--muted)',
        setFixed: () => w.setRoleMode(role, 'fixed'), setAlt: () => w.setRoleMode(role, 'alt'),
        fixedValue: r.p || '', onFixed: (v: string) => w.setRoleFixed(role, v),
        options: pool, addOptions: pool, onAdd: (v: string) => w.addRotate(role, v),
        chips: (r.list || []).map((x, i) => ({ key: role + i, name: PEOPLE[x] ? PEOPLE[x].name : x, order: 'WK ' + (i + 1), remove: () => w.removeRotate(role, i) })),
        hasChips: (r.list || []).length > 0,
      }
    }
    const roleEditors = [
      mkEditor('macro', 'Head Coach', 'coach'),
      mkEditor('micro', 'Secondary Coach', 'coach'),
      mkEditor('desk', 'Support · Front Desk', 'desk'),
    ]
    const dayTimeRows = cf.varyTime
      ? cf.days.slice().sort((a, b) => DOW.indexOf(a) - DOW.indexOf(b)).map((d) => ({
          key: 'dt' + d, day: d, value: (cf.times && cf.times[d]) || cf.time, onChange: (v: string) => w.setDayTime(d, v),
        }))
      : []

    // ---- composer slash / mention
    const allCmds = [
      { cmd: '/task', desc: 'Create a task', run: () => { w.clearComposer(); w.openModal('', '') } },
      { cmd: '/remind', desc: 'Create a task with a scheduled reminder', run: () => { w.clearComposer(); w.openModal('', '') } },
      { cmd: '/assign', desc: 'Assign a task to a teammate', run: () => { w.clearComposer(); w.openModal('', '') } },
      { cmd: '/schedule', desc: 'Open today’s schedule', run: () => { w.clearComposer(); w.setScreen('schedule') } },
    ]
    const ct = s.composerText || ''
    const typed = ct.trim().toLowerCase()
    const slashOpen = ct.trim().charAt(0) === '/'
    const slashCmds = allCmds.filter((c) => typed === '/' || c.cmd.indexOf(typed) === 0)
    const lastTok = ct.split(/\s/).pop() || ''
    const mentionOpen = lastTok.charAt(0) === '@'
    const mq = lastTok.slice(1).toLowerCase()
    const mentionPeople = mentionOpen
      ? Object.keys(PEOPLE)
          .filter((id) => !mq || PEOPLE[id].short.toLowerCase().indexOf(mq) > -1)
          .map((id) => ({
            id, name: PEOPLE[id].name, role: PEOPLE[id].role, initials: PEOPLE[id].initials,
            color: PEOPLE[id].color, ink: ink(PEOPLE[id].dark), pick: () => w.pickMention(id),
          }))
      : []

    // ---- saved / pinned
    const allMsgs: { m: Message; ch: string }[] = []
    for (const k in MSGS) (MSGS[k] || []).forEach((m) => allMsgs.push({ m, ch: k }))
    for (const k in s.extraMsgs) (s.extraMsgs[k] || []).forEach((m) => allMsgs.push({ m, ch: k }))
    const savedItems = s.saved
      .map((id) => {
        const found = allMsgs.find((x) => x.m.id === id)
        if (!found || found.m.system || found.m.schedule) return null
        const pp = PEOPLE[found.m.who!] || ({} as (typeof PEOPLE)[string])
        return {
          key: id, initials: pp.initials, color: pp.color, ink: ink(pp.dark), name: pp.name, time: found.m.time,
          text: found.m.text, channel: '#' + (CH_NAME[found.ch] || found.ch),
          open: () => w.selectChannel(found.ch), unsave: () => w.toggleSave(id),
        }
      })
      .filter(Boolean) as {
      key: string; initials: string; color: string; ink: string; name: string; time: string; text?: string; channel: string; open: () => void; unsave: () => void
    }[]

    const pinnedList = (s.pinned[s.active] || [])
      .map((id) => {
        const m = (MSGS[s.active] || []).concat(s.extraMsgs[s.active] || []).find((x) => x.id === id)
        if (!m || m.system || m.schedule) return null
        const pp = PEOPLE[m.who!] || ({} as (typeof PEOPLE)[string])
        return {
          key: id, initials: pp.initials, color: pp.color, ink: ink(pp.dark), name: pp.name, time: m.time, text: m.text,
          unpin: () => w.togglePin(s.active, id),
        }
      })
      .filter(Boolean) as {
      key: string; initials: string; color: string; ink: string; name: string; time: string; text?: string; unpin: () => void
    }[]

    // ---- thread drawer
    let threadParent: {
      initials: string; color: string; ink: string; name: string; role?: string; time: string; text?: string
      hasMedia: boolean; mediaType: string; mediaLabel: string; mediaIsVideo: boolean
    } | null = null
    let threadReplies: { key: string; initials: string; color: string; ink: string; name: string; time: string; text: string }[] = []
    let threadCount = 0
    if (s.threadId) {
      const pm = w.findMsg(s.threadId)
      if (pm) {
        const pp = PEOPLE[pm.who!] || ({} as (typeof PEOPLE)[string])
        const md = pm.media
        threadParent = {
          initials: pp.initials, color: pp.color, ink: ink(pp.dark), name: pp.name, role: pp.role, time: pm.time, text: pm.text,
          hasMedia: !!md, mediaType: md ? md.type : '', mediaLabel: md ? md.label : '', mediaIsVideo: !!(md && md.type === 'Video'),
        }
      }
      const rl = s.threads[s.threadId] || []
      threadCount = rl.length
      threadReplies = rl.map((r, i) => {
        const pp = PEOPLE[r.who] || ({} as (typeof PEOPLE)[string])
        return { key: s.threadId + 'rp' + i, initials: pp.initials, color: pp.color, ink: ink(pp.dark), name: pp.name, time: r.time, text: r.text }
      })
    }

    const me = PEOPLE.annie
    const tf = s.tform
    const subjExisting = (() => {
      const set: string[] = []
      ;(MSGS.research || []).concat(s.extraMsgs.research || []).forEach((m) => {
        if (m.subject && set.indexOf(m.subject) < 0) set.push(m.subject)
      })
      return set
    })()
    const topicSubjOpts = subjExisting.map((x) => ({ v: x, label: x }))
    const mediaTypeOpts = (['None', 'Video', 'Doc', 'Link'] as const).map((x) => ({ v: x, label: x === 'None' ? 'No attachment' : x }))

    return {
      s, isLight,
      // screens
      isChat: s.screen === 'chat', isMyTasks: s.screen === 'mytasks', isAdmin: s.screen === 'admin',
      isSchedule: s.screen === 'schedule', isSaved: s.screen === 'saved',
      isDesktop: !s.mobile, isMobile: s.mobile,
      // identity
      meName: me.name, meInitials: me.initials,
      // sidebar
      chans, dms, myCount, myCountStr: String(myCount),
      unreadNotif, notifDot: unreadNotif ? 'var(--gold)' : 'transparent',
      // channel
      isDM, activeName, activePrefix: isDM ? '' : '#',
      topic: isDM ? (PEOPLE[dmId!] ? PEOPLE[dmId!].role : '') : TOPIC[s.active] || '',
      msgs, hasMsgs: msgs.length > 0, resList, hasRes: resList.length > 0 && !isDM,
      composerPh: (isDM ? '' : '#') + activeName,
      // right panel
      board, hasBoard: !isDM, boardEmpty: board.length === 0, boardTitle: activeName,
      isResearch, notResearch: !isResearch, topicGroups, rightTitle: isResearch ? 'Topics' : 'Task Board',
      rightOpen: s.rightOpen,
      // composer
      slashOpen, slashCmds, mentionOpen, mentionPeople, composerText: s.composerText,
      // my tasks
      myGroups,
      // admin
      chCols, members,
      // create task modal
      f, assignOpts, showCycle: f.repeat !== 'None',
      // schedule
      sessions: daySessions, scheduleDate: 'THURSDAY · JULY 17', sessionCount: daySessions.length + ' sessions',
      isDayView: s.schedView === 'day', isWeekView: s.schedView === 'week',
      weekDays, weekLabel: 'WK ' + (s.weekIdx + 1), schedCoach: s.schedCoach, coachPickOpts,
      dayBg: s.schedView === 'day' ? 'var(--gold)' : 'transparent', dayFg: s.schedView === 'day' ? '#05101F' : 'var(--muted)',
      weekBg: s.schedView === 'week' ? 'var(--gold)' : 'transparent', weekFg: s.schedView === 'week' ? '#05101F' : 'var(--muted)',
      isAdminUser: true,
      // class modal
      cf, classModalTitle: s.editingId ? 'Edit Class' : 'Add Class', isEditClass: !!s.editingId,
      dayChips, roleEditors, dayTimeRows, hasMultiDay: cf.days.length > 1,
      biwBg: cf.biweekly ? 'var(--gold)' : 'var(--input)', biwKnob: cf.biweekly ? 22 : 3, biwKnobBg: cf.biweekly ? '#05101F' : 'var(--faint2)',
      varyBg: cf.varyTime ? 'var(--gold)' : 'var(--input)', varyKnob: cf.varyTime ? 22 : 3, varyKnobBg: cf.varyTime ? '#05101F' : 'var(--faint2)',
      varyTimeOn: cf.varyTime,
      // topic modal
      tf, topicSubjOpts, mediaTypeOpts, hasExistingSubjects: subjExisting.length > 0,
      tSubExisting: tf.subjectMode === 'existing', tSubNew: tf.subjectMode === 'new', tHasMedia: tf.mediaType !== 'None',
      tExBg: tf.subjectMode === 'existing' ? 'var(--gold)' : 'transparent', tExFg: tf.subjectMode === 'existing' ? '#05101F' : 'var(--muted)',
      tNewBg: tf.subjectMode === 'new' ? 'var(--gold)' : 'transparent', tNewFg: tf.subjectMode === 'new' ? '#05101F' : 'var(--muted)',
      // thread
      threadShow: s.threadOpen && s.screen === 'chat', threadParent, threadReplies, threadCount,
      threadChannel: '#' + activeName, threadReplyText: s.replyText,
      // saved / pinned
      savedItems, savedCount: String(savedItems.length), hasSaved: savedItems.length > 0, savedEmpty: savedItems.length === 0,
      pinnedList, pinnedCount: pinnedList.length, pinnedEmpty: pinnedList.length === 0, pinnedPanelOpen: s.pinnedPanelOpen,
      // search
      searchOpen: s.searchOpen, searchQ: s.searchQ, searchCh, searchPl, searchNav, searchAct,
      hasSearchNav: searchNav.length > 0, hasSearchAct: searchAct.length > 0,
      // notifications
      notifOpen: s.notifOpen, notifs,
      // toast
      toast: s.toast, toastShow: !!s.toast,
      // create-task toggle knob styles
      nowKnob: f.notifyNow ? 22 : 3, nowBg: f.notifyNow ? 'var(--gold)' : 'var(--input)', nowKnobBg: f.notifyNow ? '#05101F' : 'var(--faint2)',
      cycleKnob: f.notifyCycle ? 22 : 3, cycleBg: f.notifyCycle ? 'var(--gold)' : 'var(--input)', cycleKnobBg: f.notifyCycle ? '#05101F' : 'var(--faint2)',
      // mobile
      mobIsChan: s.mobileView === 'channel', mobIsTasks: s.mobileView === 'tasks',
      mobChanColor: s.mobileView === 'channel' ? 'var(--gold)' : 'var(--muted)',
      mobTasksColor: s.mobileView === 'tasks' ? 'var(--gold)' : 'var(--muted)',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, w])
}

export type Derived = ReturnType<typeof useDerived>
