// ============================================================
// MyTasksView — full-screen "My Tasks" list, grouped by
// Today / Upcoming / Recurring / Overdue / Done.
// Ported 1:1 from the hi-fi prototype markup (lines 356-397).
// ============================================================
import type { CSSProperties } from 'react'
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived, type Derived } from '../store/useDerived'

type TaskGroup = Derived['myGroups'][number]
type TaskItem = TaskGroup['items'][number]

export function MyTasksView() {
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
          <Icon name="list" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="perf" style={{ fontSize: 18, color: 'var(--text-strong)', lineHeight: 1 }}>
            My Tasks
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', marginTop: 2 }}>
            {d.meName} · SALES
          </div>
        </div>
        <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
          {d.myCountStr} open
        </span>
        <button
          onClick={() => w.openModal('', 'annie')}
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
          New Task
        </button>
      </div>

      {/* ---- body ---- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {d.myGroups.map((g: TaskGroup) => (
            <div key={g.key} style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <span className="perf" style={{ fontSize: 13, color: 'var(--text-strong)' }}>
                  {g.label}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    background: 'var(--chip)',
                    border: '1px solid var(--line)',
                    padding: '0 7px',
                    borderRadius: 2,
                  }}
                >
                  {g.count}
                </span>
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>
              {g.items.map((t: TaskItem) => {
                const animStyle: CSSProperties = {
                  transition:
                    'opacity .34s cubic-bezier(.9,0,.1,1), transform .34s cubic-bezier(.9,0,.1,1)',
                  ...(t.completing ? { opacity: 0, transform: 'translateX(26px)' } : { opacity: 1 }),
                }
                return (
                  <div key={t.id} style={animStyle}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 13,
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderLeft: `3px solid ${t.barColor}`,
                        padding: '13px 15px',
                        marginBottom: 8,
                        borderRadius: 2,
                      }}
                    >
                      <button
                        onClick={t.onCheck}
                        className="ghost-gold"
                        style={{
                          position: 'relative',
                          flex: 'none',
                          width: 21,
                          height: 21,
                          border: `1.6px solid ${t.barColor}`,
                          borderRadius: 3,
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {t.checked ? (
                          <span
                            style={{
                              position: 'absolute',
                              inset: -1,
                              background: 'var(--green)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 3,
                            }}
                          >
                            <Icon name="check" size={13} sw={3} color="#05101F" />
                          </span>
                        ) : null}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.3 }}>
                          {t.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 5, flexWrap: 'wrap' }}>
                          <span
                            className="mono"
                            style={{
                              fontSize: 10.5,
                              color: 'var(--muted)',
                              background: 'var(--chip)',
                              border: '1px solid var(--line)',
                              padding: '1px 6px',
                              borderRadius: 2,
                            }}
                          >
                            {t.channel}
                          </span>
                          {t.isScheduled ? (
                            <span
                              className="mono"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--gold-ink)', fontSize: 11.5 }}
                            >
                              <Icon name="clock" size={13} />
                              {t.metaLine}
                            </span>
                          ) : null}
                          {t.isRecurring ? (
                            <span
                              className="mono"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--steel-line)', fontSize: 11.5 }}
                            >
                              <Icon name="repeat" size={13} />
                              {t.metaLine}
                            </span>
                          ) : null}
                          {t.isOverdue ? (
                            <span
                              className="mono"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--red)', fontSize: 11.5, fontWeight: 600 }}
                            >
                              {t.metaLine}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
