// ============================================================
// ScheduleView — full-screen Schedule with a coach "My Day"
// picker, week stepper, DAY/WEEK toggle, and day/week bodies.
// Ported 1:1 from the hi-fi prototype markup (lines 435-535).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived, type Derived } from '../store/useDerived'

type Session = Derived['sessions'][number]
type Slot = Session['slots'][number]
type SlotOpt = Slot['options'][number]
type CoachOpt = Derived['coachPickOpts'][number]
type WeekDay = Derived['weekDays'][number]
type WeekSession = WeekDay['sessions'][number]
type StaffChip = NonNullable<WeekSession['staff'][number]>

export function ScheduleView() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--app-bg)' }}>
      {/* ---- header ---- */}
      <div
        style={{
          height: 60,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 28px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <span style={{ color: 'var(--gold)', display: 'flex' }}>
          <Icon name="cal" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="perf" style={{ fontSize: 18, color: 'var(--text-strong)', lineHeight: 1 }}>
            Schedule
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', marginTop: 2 }}>
            {d.scheduleDate} · {d.sessionCount}
          </div>
        </div>

        {/* my-day coach picker */}
        <div
          className="border-gold-hover"
          title="View one coach's day"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--input)',
            border: '1px solid var(--line)',
            borderRadius: 2,
            padding: '0 4px 0 11px',
          }}
        >
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--muted)' }}>
            MY DAY
          </span>
          <select
            value={d.schedCoach}
            onChange={(e) => w.setSchedCoach(e.target.value)}
            style={{ background: 'transparent', border: 0, color: 'var(--text)', padding: '8px 4px', fontSize: 12.5, cursor: 'pointer' }}
          >
            {d.coachPickOpts.map((o: CoachOpt) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* week stepper */}
        <div
          title="Preview rotation week"
          style={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid var(--line)', borderRadius: 2, padding: 2 }}
        >
          <button
            onClick={() => w.stepWeek(-1)}
            className="ghost-gold"
            style={{
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 0,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            ‹
          </button>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--gold-ink)', minWidth: 38, textAlign: 'center', letterSpacing: '.06em' }}>
            {d.weekLabel}
          </span>
          <button
            onClick={() => w.stepWeek(1)}
            className="ghost-gold"
            style={{
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 0,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            ›
          </button>
        </div>

        {/* day/week toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
          <button
            onClick={() => w.setState({ schedView: 'day' })}
            className="mono"
            style={{
              padding: '8px 16px',
              background: d.dayBg,
              color: d.dayFg,
              border: 0,
              cursor: 'pointer',
              fontSize: 11,
              letterSpacing: '.12em',
              fontWeight: 600,
            }}
          >
            DAY
          </button>
          <button
            onClick={() => w.setState({ schedView: 'week' })}
            className="mono"
            style={{
              padding: '8px 16px',
              background: d.weekBg,
              color: d.weekFg,
              border: 0,
              borderLeft: '1px solid var(--line)',
              cursor: 'pointer',
              fontSize: 11,
              letterSpacing: '.12em',
              fontWeight: 600,
            }}
          >
            WEEK
          </button>
        </div>

        {d.isAdminUser ? (
          <button
            onClick={w.postSchedule}
            title="Admin · post to #coaching-staff"
            className="ghost-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--input)',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              padding: '8px 14px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Icon name="send" size={16} />
            Post to #coaching
          </button>
        ) : null}

        <button
          onClick={w.openAddClass}
          className="gold-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--gold)',
            border: 0,
            color: '#05101F',
            padding: '8px 14px',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <Icon name="plus" size={16} />
          Add Class
        </button>
      </div>

      {/* ---- day view ---- */}
      {d.isDayView ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {d.sessions.map((se: Session) => (
              <div key={se.id} style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 2 }}>
                <div style={{ height: 4, background: 'var(--gold)' }} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '15px 18px',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div style={{ minWidth: 92 }}>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold-ink)' }}>
                      {se.time}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="perf" style={{ fontSize: 15, color: 'var(--text-strong)' }}>
                      {se.name}
                    </div>
                  </div>
                  {se.showMyRole ? (
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: '.06em',
                        color: '#05101F',
                        background: 'var(--gold)',
                        padding: '3px 9px',
                        borderRadius: 2,
                        textTransform: 'uppercase',
                      }}
                    >
                      {se.myRole}
                    </span>
                  ) : null}
                  <span
                    className="mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 10.5,
                      color: 'var(--gold-ink)',
                      background: 'var(--chip)',
                      border: '1px solid var(--line)',
                      padding: '3px 9px',
                      borderRadius: 2,
                    }}
                  >
                    <Icon name="repeat" size={12} sw={1.9} />
                    {se.recur}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {se.athletes}
                  </span>
                  <button
                    onClick={se.edit}
                    title="Edit class"
                    className="ghost-gold"
                    style={{
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: '1px solid var(--line)',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      borderRadius: 2,
                    }}
                  >
                    <Icon name="edit" size={15} sw={1.8} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '15px 18px' }}>
                  {se.slots.map((sl: Slot) => (
                    <div key={sl.key} style={{ flex: 1, minWidth: 190 }}>
                      <div
                        className="mono"
                        style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' }}
                      >
                        {sl.role}
                      </div>
                      {sl.isFixed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div
                            className="border-gold-hover"
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 9,
                              background: 'var(--input)',
                              border: '1px solid var(--line)',
                              borderRadius: 2,
                              padding: '0 10px',
                            }}
                          >
                            <span style={{ width: 15, height: 15, borderRadius: 2, background: sl.color, flex: 'none' }} />
                            <select
                              value={sl.value}
                              onChange={(e) => sl.onChange(e.target.value)}
                              style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--text)', padding: '10px 0', fontSize: 13.5, cursor: 'pointer' }}
                            >
                              {sl.options.map((o: SlotOpt) => (
                                <option key={o.v} value={o.v}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={sl.makeAlt}
                            title="Set weekly rotation"
                            className="ghost-gold"
                            style={{
                              flex: 'none',
                              width: 34,
                              height: 38,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'var(--input)',
                              border: '1px solid var(--line)',
                              color: 'var(--muted)',
                              cursor: 'pointer',
                              borderRadius: 2,
                            }}
                          >
                            <Icon name="repeat" size={15} sw={1.8} />
                          </button>
                        </div>
                      ) : null}
                      {sl.isAlt ? (
                        <button
                          onClick={sl.makeAlt}
                          className="border-gold-hover"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                            width: '100%',
                            textAlign: 'left',
                            background: 'var(--input)',
                            border: '1px solid var(--gold-ink)',
                            borderRadius: 2,
                            padding: '8px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ width: 15, height: 15, borderRadius: 2, background: sl.color, flex: 'none' }} />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-strong)', fontWeight: 600 }}>{sl.curName}</span>
                            <span className="mono" style={{ display: 'block', fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
                              ALT · {sl.altSummary}
                            </span>
                          </span>
                          <span style={{ color: 'var(--gold-ink)', display: 'flex' }}>
                            <Icon name="repeat" size={14} sw={1.9} />
                          </span>
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ---- week view ---- */}
      {d.isWeekView ? (
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(148px,1fr))', gap: 10, minWidth: 1120 }}>
            {d.weekDays.map((day: WeekDay) => (
              <div
                key={day.day}
                style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 2, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 11px', borderBottom: '1px solid var(--line)' }}>
                  <span className="perf" style={{ fontSize: 12, color: day.dayColor }}>
                    {day.day}
                  </span>
                  {day.isToday ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} /> : null}
                  <span style={{ flex: 1 }} />
                  <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.04em' }}>
                    {day.count}
                  </span>
                </div>
                <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 7, minHeight: 90 }}>
                  {day.closed ? (
                    <div
                      className="mono"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint2)', fontSize: 10, letterSpacing: '.14em' }}
                    >
                      CLOSED
                    </div>
                  ) : null}
                  {day.sessions.map((se: WeekSession) => (
                    <div
                      key={se.key}
                      style={{
                        border: '1px solid var(--line)',
                        borderLeft: '3px solid var(--gold)',
                        borderRadius: 2,
                        padding: '7px 8px',
                        background: 'var(--panel-2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--gold-ink)', fontWeight: 600 }}>
                          {se.time}
                        </span>
                        {se.recurAlt ? (
                          <span title="Has an alternating assignment" style={{ color: 'var(--gold-ink)', display: 'flex' }}>
                            <Icon name="repeat" size={11} sw={2} />
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.25, margin: '2px 0 6px' }}>
                        {se.name}
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {se.staff.map(
                          (st: WeekSession['staff'][number], i: number) =>
                            st && (
                              <span
                                key={(st as StaffChip).key ?? i}
                                title={(st as StaffChip).title}
                                style={{
                                  width: 19,
                                  height: 19,
                                  borderRadius: 3,
                                  background: (st as StaffChip).color,
                                  color: (st as StaffChip).ink,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 9,
                                  fontWeight: 700,
                                  boxShadow: (st as StaffChip).ring,
                                }}
                              >
                                {(st as StaffChip).initials}
                              </span>
                            ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
