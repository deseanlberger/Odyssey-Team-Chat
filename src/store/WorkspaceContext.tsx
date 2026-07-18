// ============================================================
// WorkspaceContext — the single source of truth. Ports the
// prototype Component's state + every action 1:1 into a React
// context. setState mirrors class setState (shallow merge, and
// accepts either a patch object or an updater fn).
// ============================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import {
  CH_NAME,
  CH_SLUG,
  INITIAL_BOARD,
  INITIAL_CLASSES,
  INITIAL_MY_TASKS,
  INITIAL_NOTIFS,
  INITIAL_THREADS,
  MSGS,
  PEOPLE,
  buildMembers,
} from '../data/seed'
import type {
  BoardTask,
  ClassForm,
  ClassSession,
  Member,
  Message,
  MyTask,
  Notification,
  PersonId,
  RoleSlot,
  RoleSlotKey,
  Screen,
  TaskForm,
  TaskStatus,
  Theme,
  ThreadReply,
  TopicForm,
} from '../data/types'
import { resolveRole, timeKey, classTime } from './helpers'

// ---- State shape -----------------------------------------------

export interface WorkspaceState {
  theme: Theme
  screen: Screen
  active: string
  rightOpen: boolean
  unread: Record<string, boolean>
  modalOpen: boolean
  threadOpen: boolean
  searchOpen: boolean
  notifOpen: boolean
  mobile: boolean
  mobileView: 'channel' | 'tasks'
  searchQ: string
  completingId: string | null
  toast: string
  form: TaskForm
  threadId: string | null
  composerText: string
  replyText: string
  extraMsgs: Record<string, Message[]>
  schedView: 'day' | 'week'
  saved: string[]
  pinned: Record<string, string[]>
  pinnedPanelOpen: boolean
  collapsedSubjects: Record<string, boolean>
  schedCoach: string
  topicModalOpen: boolean
  tform: TopicForm
  classes: ClassSession[]
  weekIdx: number
  classModalOpen: boolean
  editingId: string | null
  cform: ClassForm
  threads: Record<string, ThreadReply[]>
  board: Record<string, BoardTask[]>
  myTasks: MyTask[]
  members: Member[]
  notifs: Notification[]
}

const emptyForm = (): TaskForm => ({
  title: '', desc: '', assignee: '', due: '', notifyNow: false,
  notifyDate: '', notifyTime: '09:00', repeat: 'None', notifyCycle: false,
})

const emptyClassForm = (): ClassForm => ({
  name: '', time: '5:00 PM', days: ['MON', 'WED', 'FRI'], athletes: 8,
  biweekly: false, varyTime: false, times: {},
  micro: { mode: 'fixed', p: '', list: [] },
  macro: { mode: 'fixed', p: '', list: [] },
  desk: { mode: 'fixed', p: '', list: [] },
})

function initialState(): WorkspaceState {
  return {
    theme: 'dark', screen: 'chat', active: 'sales', rightOpen: true,
    unread: { general: true, front: true, programming: true },
    modalOpen: false, threadOpen: false, searchOpen: false, notifOpen: false,
    mobile: false, mobileView: 'channel', searchQ: '', completingId: null, toast: '',
    form: emptyForm(),
    threadId: null, composerText: '', replyText: '', extraMsgs: {}, schedView: 'day',
    saved: [], pinned: { sales: ['s4'] }, pinnedPanelOpen: false, collapsedSubjects: {},
    schedCoach: '', topicModalOpen: false,
    tform: { title: '', subjectMode: 'existing', subject: 'Acceleration', newSubject: '', mediaType: 'None', mediaLabel: '' },
    classes: INITIAL_CLASSES.map((c) => ({ ...c })),
    weekIdx: 0, classModalOpen: false, editingId: null,
    cform: emptyClassForm(),
    threads: JSON.parse(JSON.stringify(INITIAL_THREADS)),
    board: JSON.parse(JSON.stringify(INITIAL_BOARD)),
    myTasks: INITIAL_MY_TASKS.map((t) => ({ ...t })),
    members: buildMembers(),
    notifs: INITIAL_NOTIFS.map((n) => ({ ...n })),
  }
}

// ---- Reducer (functional setState) -----------------------------

type Patch = Partial<WorkspaceState> | ((s: WorkspaceState) => Partial<WorkspaceState>)

function reducer(s: WorkspaceState, patch: Patch): WorkspaceState {
  return { ...s, ...(typeof patch === 'function' ? patch(s) : patch) }
}

let uid = 0
const nid = (p: string) => p + Date.now() + '_' + uid++

// ---- Provider --------------------------------------------------

function useProvideWorkspace() {
  const [state, setState] = useReducer(reducer, undefined, initialState)
  const stateRef = useRef(state)
  stateRef.current = state
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()
  const completeTimer = useRef<ReturnType<typeof setTimeout>>()

  const toastLater = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setState({ toast: '' }), 2800)
  }, [])

  const toast = useCallback((msg: string) => {
    setState({ toast: msg })
    toastLater()
  }, [toastLater])

  // ---- form setters
  const setForm = useCallback(
    <K extends keyof TaskForm>(k: K) =>
      (v: TaskForm[K]) => setState((s) => ({ form: { ...s.form, [k]: v } })),
    [],
  )
  const togForm = useCallback(
    (k: keyof TaskForm) => () => setState((s) => ({ form: { ...s.form, [k]: !s.form[k] } })),
    [],
  )

  // ---- navigation
  const selectChannel = useCallback((id: string) => {
    setState((s) => {
      const u = { ...s.unread }
      delete u[id]
      return { active: id, screen: 'chat', unread: u, searchOpen: false, threadOpen: false }
    })
  }, [])

  const setScreen = useCallback((screen: Screen) => setState({ screen }), [])

  // ---- create task modal
  const openModal = useCallback((prefill?: string, assignee?: string) => {
    setState({ modalOpen: true, form: { ...emptyForm(), title: prefill || '', assignee: assignee || '' } })
  }, [])
  const closeModal = useCallback(() => setState({ modalOpen: false }), [])

  const submitTask = useCallback(() => {
    const f = stateRef.current.form
    if (!f.title.trim()) return
    const status: TaskStatus = f.repeat !== 'None' ? 'recurring' : f.notifyDate ? 'scheduled' : 'open'
    const t: BoardTask = {
      id: nid('new'), title: f.title.trim(), assignee: f.assignee || null, status,
      repeat: f.repeat !== 'None' ? 'Repeats ' + f.repeat.toLowerCase() : undefined,
      sched: f.notifyDate ? 'Notify ' + f.notifyDate + ' ' + f.notifyTime : undefined,
      due: f.due ? 'Due ' + f.due : undefined, isNew: true,
    }
    setState((s) => {
      const board = { ...s.board }
      const act = s.active
      if (board[act]) board[act] = [t, ...board[act]]
      let my = s.myTasks
      if (f.assignee === 'annie') {
        my = [
          {
            id: t.id, title: t.title, channel: '#' + (CH_NAME[act] || act),
            group: status === 'recurring' ? 'recurring' : f.due ? 'upcoming' : 'today',
            status, sched: t.sched, repeat: f.repeat !== 'None' ? f.repeat : undefined, meta: f.due || undefined,
          },
          ...s.myTasks,
        ]
      }
      return {
        board, myTasks: my, modalOpen: false,
        toast: f.notifyNow ? 'Task created — notification sent now' : 'Task created — added silently, no ping',
      }
    })
    toastLater()
  }, [toastLater])

  // ---- task completion
  const completeMy = useCallback((id: string) => {
    const t = stateRef.current.myTasks.find((x) => x.id === id)
    if (!t) return
    if (t.done) {
      setState((s) => ({
        myTasks: s.myTasks.map((x) =>
          x.id === id ? { ...x, done: false, group: 'today', status: x.status === 'done' ? 'open' : x.status } : x,
        ),
      }))
      return
    }
    setState({ completingId: id })
    if (completeTimer.current) clearTimeout(completeTimer.current)
    completeTimer.current = setTimeout(() => {
      setState((s) => {
        const list = s.myTasks.map((x) => ({ ...x }))
        const i = list.findIndex((x) => x.id === id)
        const task = list[i]
        const slug = CH_SLUG[(task.channel || '').replace('#', '')]
        const ex = { ...s.extraMsgs }
        if (slug) {
          ex[slug] = [
            ...(ex[slug] || []),
            { id: nid('sys'), system: true, text: 'Annie completed “' + task.title + '”', time: 'Now', icon: 'check' },
          ]
        }
        if (task.status === 'recurring') {
          list.push({
            id: nid('r'), title: task.title, channel: task.channel, group: 'recurring',
            status: 'recurring', repeat: task.repeat, justAdded: true,
          })
          task.done = true
          task.group = 'done'
          task.status = 'done'
          return {
            myTasks: list, completingId: null, extraMsgs: ex,
            toast: 'Completed — next occurrence rescheduled (' + (task.repeat || '') + ')',
          }
        }
        task.done = true
        task.group = 'done'
        task.status = 'done'
        return { myTasks: list, completingId: null, extraMsgs: ex }
      })
      toastLater()
    }, 360)
  }, [toastLater])

  const completeBoard = useCallback((id: string) => {
    setState((s) => {
      const b = { ...s.board }
      let title = ''
      let became = false
      b[s.active] = b[s.active].map((x) => {
        if (x.id === id) {
          const nd = !x.done
          if (nd) {
            became = true
            title = x.title
          }
          return { ...x, done: nd, status: (nd ? 'done' : x.repeat ? 'recurring' : 'open') as TaskStatus }
        }
        return x
      })
      let ex = s.extraMsgs
      if (became) {
        ex = { ...s.extraMsgs }
        ex[s.active] = [
          ...(ex[s.active] || []),
          { id: nid('sys'), system: true, text: 'Annie completed “' + title + '”', time: 'Now', icon: 'check' },
        ]
      }
      return { board: b, extraMsgs: ex }
    })
  }, [])

  // ---- admin / notifications
  const toggleAccess = useCallback((uidv: string, ch: string) => {
    setState((s) => ({
      members: s.members.map((m) => (m.id === uidv ? { ...m, access: { ...m.access, [ch]: !m.access[ch] } } : m)),
    }))
  }, [])
  const markAllNotifs = useCallback(() => {
    setState((s) => ({ notifs: s.notifs.map((n) => ({ ...n, unread: false })) }))
  }, [])

  // ---- messages / threads
  const findMsg = useCallback((id: string): Message | null => {
    for (const k in MSGS) {
      const f = MSGS[k].find((m) => m.id === id)
      if (f) return f
    }
    for (const k in stateRef.current.extraMsgs) {
      const f = (stateRef.current.extraMsgs[k] || []).find((m) => m.id === id)
      if (f) return f
    }
    return null
  }, [])

  const openThread = useCallback((id: string) => {
    setState({ threadOpen: true, threadId: id, rightOpen: false })
  }, [])
  const closeThread = useCallback(() => setState({ threadOpen: false, rightOpen: true }), [])

  const clearComposer = useCallback(() => setState({ composerText: '' }), [])
  const setComposer = useCallback((v: string) => setState({ composerText: v }), [])
  const setReplyText = useCallback((v: string) => setState({ replyText: v }), [])

  const sendReply = useCallback(() => {
    const txt = (stateRef.current.replyText || '').trim()
    const id = stateRef.current.threadId
    if (!txt || !id) return
    setState((s) => {
      const th = { ...s.threads }
      th[id] = [...(th[id] || []), { who: 'annie', text: txt, time: 'Now' }]
      return { threads: th, replyText: '' }
    })
  }, [])

  const threadLabelFor = useCallback((m: Message): string => {
    const rl = stateRef.current.threads && stateRef.current.threads[m.id]
    const c = rl ? rl.length : m.thread ? m.thread.count : 0
    return c + ' replies'
  }, [])

  // ---- save / pin / subjects
  const toggleSave = useCallback((id: string) => {
    setState((s) => {
      const has = s.saved.indexOf(id) > -1
      return { saved: has ? s.saved.filter((x) => x !== id) : [...s.saved, id], toast: has ? 'Removed from Saved' : 'Saved to your items' }
    })
    toastLater()
  }, [toastLater])

  const togglePin = useCallback((ch: string, id: string) => {
    setState((s) => {
      const cur = s.pinned[ch] || []
      const has = cur.indexOf(id) > -1
      return {
        pinned: { ...s.pinned, [ch]: has ? cur.filter((x) => x !== id) : [...cur, id] },
        toast: has ? 'Unpinned' : 'Pinned to channel',
      }
    })
    toastLater()
  }, [toastLater])

  const togglePinnedPanel = useCallback(() => setState((s) => ({ pinnedPanelOpen: !s.pinnedPanelOpen })), [])
  const toggleSubject = useCallback((sub: string) => {
    setState((s) => ({ collapsedSubjects: { ...s.collapsedSubjects, [sub]: !s.collapsedSubjects[sub] } }))
  }, [])
  const setSchedCoach = useCallback((v: string) => setState({ schedCoach: v }), [])

  // ---- topics
  const researchSubjects = useCallback((): string[] => {
    const set: string[] = []
    ;(MSGS.research || []).concat(stateRef.current.extraMsgs.research || []).forEach((m) => {
      if (m.subject && set.indexOf(m.subject) < 0) set.push(m.subject)
    })
    return set
  }, [])

  const setTForm = useCallback(
    <K extends keyof TopicForm>(k: K) =>
      (v: TopicForm[K]) => setState((s) => ({ tform: { ...s.tform, [k]: v } })),
    [],
  )
  const setTopicMode = useCallback((mode: 'existing' | 'new') => {
    setState((s) => ({ tform: { ...s.tform, subjectMode: mode } }))
  }, [])
  const openTopicModal = useCallback(() => {
    setState({
      topicModalOpen: true,
      tform: { title: '', subjectMode: 'existing', subject: researchSubjects()[0] || '', newSubject: '', mediaType: 'None', mediaLabel: '' },
    })
  }, [researchSubjects])
  const closeTopicModal = useCallback(() => setState({ topicModalOpen: false }), [])

  const submitTopic = useCallback(() => {
    const f = stateRef.current.tform
    const title = (f.title || '').trim()
    if (!title) return
    const subject = (f.subjectMode === 'new' ? (f.newSubject || '').trim() : f.subject) || 'General'
    const id = nid('tp')
    const media = f.mediaType !== 'None' ? { type: f.mediaType, label: (f.mediaLabel || '').trim() || f.mediaType + ' attachment' } : null
    setState((s) => {
      const ex = { ...s.extraMsgs }
      ex.research = [...(ex.research || []), { id, who: 'annie', time: 'Now', text: title, subject, media, thread: { count: 0 } }]
      const cs = { ...s.collapsedSubjects }
      delete cs[subject]
      return {
        extraMsgs: ex, collapsedSubjects: cs, topicModalOpen: false,
        active: 'research', screen: 'chat', threadOpen: true, threadId: id, rightOpen: false,
        toast: 'Topic filed under ' + subject,
      }
    })
    toastLater()
  }, [toastLater])

  // ---- composer send / mentions
  const pickMention = useCallback((id: PersonId) => {
    const name = PEOPLE[id].short
    setState((s) => {
      const ct = s.composerText
      const idx = ct.lastIndexOf('@')
      const next = (idx >= 0 ? ct.slice(0, idx) : ct) + '@' + name + ' '
      return { composerText: next }
    })
  }, [])

  const sendMessage = useCallback(() => {
    const txt = (stateRef.current.composerText || '').trim()
    if (!txt) return
    const ch = stateRef.current.active
    setState((s) => {
      const ex = { ...s.extraMsgs }
      ex[ch] = [...(ex[ch] || []), { id: nid('u'), who: 'annie', time: 'Now', text: txt }]
      const mn = txt.match(/@[A-Za-z]+/g) || []
      let notifs = s.notifs
      if (mn.length) {
        notifs = [
          { id: nid('n'), icon: 'at', text: 'You mentioned ' + mn.join(', ') + ' in #' + (CH_NAME[ch] || ch), time: 'Now', unread: true },
          ...s.notifs,
        ]
      }
      return { extraMsgs: ex, composerText: '', notifs }
    })
  }, [])

  // ---- schedule posting
  const postSchedule = useCallback(() => {
    const s = stateRef.current
    const day = 'THU'
    const list = s.classes
      .filter((c) => c.days.indexOf(day) > -1 && (!c.biweekly || s.weekIdx % 2 === (c.weekParity || 0)))
      .slice()
      .sort((a, b) => timeKey(classTime(a, day)) - timeKey(classTime(b, day)))
    const nm = (c: ClassSession, k: RoleSlotKey) => {
      const cur = resolveRole(c[k], s.weekIdx)
      return cur && PEOPLE[cur] ? PEOPLE[cur].short : '—'
    }
    const lines = list.map((c) => ({
      key: c.id, time: classTime(c, day), name: c.name,
      staff: 'Head ' + nm(c, 'macro') + ' · 2nd ' + nm(c, 'micro') + ' · Desk ' + nm(c, 'desk'),
    }))
    setState((st) => {
      const ex = { ...st.extraMsgs }
      ex.coaching = [
        ...(ex.coaching || []),
        { id: nid('sch'), who: 'annie', time: 'Now', schedule: { title: 'Thursday · Session Staffing (WK ' + (st.weekIdx + 1) + ')', lines } },
      ]
      return { extraMsgs: ex, active: 'coaching', screen: 'chat', toast: 'Schedule posted to #coaching-staff' }
    })
    toastLater()
  }, [toastLater])

  // ---- class form
  const setCForm = useCallback(
    <K extends keyof ClassForm>(k: K) =>
      (v: ClassForm[K]) => setState((s) => ({ cform: { ...s.cform, [k]: v } })),
    [],
  )
  const toggleBiweekly = useCallback(() => setState((s) => ({ cform: { ...s.cform, biweekly: !s.cform.biweekly } })), [])
  const toggleVaryTime = useCallback(() => setState((s) => ({ cform: { ...s.cform, varyTime: !s.cform.varyTime } })), [])
  const setDayTime = useCallback((day: string, v: string) => {
    setState((s) => ({ cform: { ...s.cform, times: { ...s.cform.times, [day]: v } } }))
  }, [])
  const stepWeek = useCallback((dir: number) => setState((s) => ({ weekIdx: Math.max(0, s.weekIdx + dir) })), [])
  const assignFixedInline = useCallback((id: string, role: RoleSlotKey, val: string) => {
    setState((s) => ({
      classes: s.classes.map((c) => (c.id === id ? { ...c, [role]: { mode: 'fixed', p: val || null } } : c)),
    }))
  }, [])

  const openAddClass = useCallback(() => setState({ classModalOpen: true, editingId: null, cform: emptyClassForm() }), [])
  const openEditClass = useCallback((id: string) => {
    const c = stateRef.current.classes.find((x) => x.id === id)
    if (!c) return
    const cv = (r: RoleSlot) => ({
      mode: r.mode,
      p: r.mode === 'fixed' ? r.p || '' : '',
      list: r.mode === 'alt' ? [...(r.list || [])] : [],
    })
    setState({
      classModalOpen: true, editingId: id,
      cform: {
        name: c.name, time: c.time, days: [...c.days], athletes: c.athletes || 8,
        biweekly: !!c.biweekly, varyTime: !!(c.times && Object.keys(c.times).length),
        times: c.times ? { ...c.times } : {},
        micro: cv(c.micro), macro: cv(c.macro), desk: cv(c.desk),
      },
    })
  }, [])
  const closeClassModal = useCallback(() => setState({ classModalOpen: false }), [])

  const toggleCDay = useCallback((day: string) => {
    setState((s) => {
      const has = s.cform.days.indexOf(day) > -1
      const days = has ? s.cform.days.filter((d) => d !== day) : [...s.cform.days, day]
      return { cform: { ...s.cform, days } }
    })
  }, [])
  const setRoleMode = useCallback((role: RoleSlotKey, mode: 'fixed' | 'alt') => {
    setState((s) => ({ cform: { ...s.cform, [role]: { ...s.cform[role], mode } } }))
  }, [])
  const setRoleFixed = useCallback((role: RoleSlotKey, v: string) => {
    setState((s) => ({ cform: { ...s.cform, [role]: { ...s.cform[role], p: v } } }))
  }, [])
  const addRotate = useCallback((role: RoleSlotKey, v: string) => {
    if (!v) return
    setState((s) => {
      const r = s.cform[role]
      if ((r.list || []).indexOf(v) > -1) return {}
      return { cform: { ...s.cform, [role]: { ...r, list: [...(r.list || []), v] } } }
    })
  }, [])
  const removeRotate = useCallback((role: RoleSlotKey, idx: number) => {
    setState((s) => {
      const r = s.cform[role]
      return { cform: { ...s.cform, [role]: { ...r, list: (r.list || []).filter((_, i) => i !== idx) } } }
    })
  }, [])

  const submitClass = useCallback(() => {
    const f = stateRef.current.cform
    if (!f.name.trim()) return
    const mk = (r: ClassForm['micro']): RoleSlot =>
      r.mode === 'alt' ? { mode: 'alt', list: r.list || [] } : { mode: 'fixed', p: r.p || null }
    const cls = {
      name: f.name.trim(), time: f.time || '5:00 PM', days: f.days.length ? f.days : ['MON'],
      athletes: f.athletes || 8, biweekly: !!f.biweekly, weekParity: 0,
      times: f.varyTime ? f.times || {} : {},
      micro: mk(f.micro), macro: mk(f.macro), desk: mk(f.desk),
    }
    setState((s) => {
      let list: ClassSession[]
      if (s.editingId) list = s.classes.map((c) => (c.id === s.editingId ? { ...c, ...cls } : c))
      else list = [...s.classes, { id: nid('cx'), ...cls }]
      return { classes: list, classModalOpen: false, toast: s.editingId ? 'Class updated' : 'Class added to the schedule' }
    })
    toastLater()
  }, [toastLater])

  const deleteClass = useCallback(() => {
    const id = stateRef.current.editingId
    if (!id) return
    setState((s) => ({ classes: s.classes.filter((c) => c.id !== id), classModalOpen: false, toast: 'Class removed' }))
    toastLater()
  }, [toastLater])

  // ---- overlays
  const toggleTheme = useCallback(() => setState((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })), [])
  const toggleRight = useCallback(() => setState((s) => ({ rightOpen: !s.rightOpen })), [])
  const openSearch = useCallback(() => setState({ searchOpen: true, searchQ: '' }), [])
  const closeSearch = useCallback(() => setState({ searchOpen: false }), [])
  const setSearchQ = useCallback((v: string) => setState({ searchQ: v }), [])
  const openNotif = useCallback(() => setState({ notifOpen: true }), [])
  const closeNotif = useCallback(() => setState({ notifOpen: false }), [])
  const toggleMobile = useCallback(() => setState((s) => ({ mobile: !s.mobile })), [])
  const setMobileView = useCallback((mobileView: 'channel' | 'tasks') => setState({ mobileView }), [])

  // ---- keyboard shortcuts (⌘K, Esc)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setState({ searchOpen: true, searchQ: '' })
      }
      if (e.key === 'Escape') {
        setState({ modalOpen: false, searchOpen: false, notifOpen: false, threadOpen: false, topicModalOpen: false, classModalOpen: false, pinnedPanelOpen: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- apply theme to <html> for global token switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return useMemo(
    () => ({
      state,
      setState,
      toast,
      // form
      setForm, togForm,
      // nav
      selectChannel, setScreen,
      // create task
      openModal, closeModal, submitTask,
      // completion
      completeMy, completeBoard,
      // admin / notif
      toggleAccess, markAllNotifs,
      // messages / threads
      findMsg, openThread, closeThread, clearComposer, setComposer, setReplyText, sendReply, threadLabelFor,
      // save / pin / subjects
      toggleSave, togglePin, togglePinnedPanel, toggleSubject, setSchedCoach,
      // topics
      researchSubjects, setTForm, setTopicMode, openTopicModal, closeTopicModal, submitTopic,
      // composer
      pickMention, sendMessage,
      // schedule
      postSchedule, setCForm, toggleBiweekly, toggleVaryTime, setDayTime, stepWeek,
      assignFixedInline, openAddClass, openEditClass, closeClassModal, toggleCDay,
      setRoleMode, setRoleFixed, addRotate, removeRotate, submitClass, deleteClass,
      // overlays
      toggleTheme, toggleRight, openSearch, closeSearch, setSearchQ, openNotif, closeNotif,
      toggleMobile, setMobileView,
    }),
    // state drives the memo; callbacks are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  )
}

export type WorkspaceCtx = ReturnType<typeof useProvideWorkspace>

const Ctx = createContext<WorkspaceCtx | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useProvideWorkspace()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace(): WorkspaceCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return v
}
