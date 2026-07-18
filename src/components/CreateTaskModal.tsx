// ============================================================
// CreateTaskModal — 540px modal card to create a task on the
// active channel's board. Ported 1:1 from the hi-fi prototype
// markup (lines 632-703).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function CreateTaskModal() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.s.modalOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'var(--scrim)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 20px',
        overflow: 'auto',
        animation: 'fadein .16s ease',
      }}
    >
      <div
        style={{
          width: 540,
          maxWidth: '100%',
          background: 'var(--panel)',
          border: '2px solid var(--gold)',
          borderRadius: 2,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,.8)',
          animation: 'pop .22s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div style={{ height: 4, background: 'var(--gold)' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 20px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <Icon name="task" size={18} sw={1.8} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="perf" style={{ fontSize: 15, color: 'var(--text-strong)' }}>Create Task</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>#{d.activeName}</div>
          </div>
          <button
            onClick={w.closeModal}
            className="ghost"
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
            <Icon name="x" size={16} sw={1.8} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Task title</label>
            <input
              value={d.f.title}
              onChange={(e) => w.setForm('title')(e.target.value)}
              placeholder="e.g. Call back Marcus about camp"
              style={{
                width: '100%',
                background: 'var(--input)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                padding: '10px 12px',
                borderRadius: 2,
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>
              Description <span style={{ color: 'var(--faint2)' }}>· optional</span>
            </label>
            <textarea
              value={d.f.desc}
              onChange={(e) => w.setForm('desc')(e.target.value)}
              placeholder="Add context…"
              rows={2}
              style={{
                width: '100%',
                background: 'var(--input)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                padding: '10px 12px',
                borderRadius: 2,
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Assign to</label>
              <select
                value={d.f.assignee}
                onChange={(e) => w.setForm('assignee')(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  padding: '10px 12px',
                  borderRadius: 2,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                {d.assignOpts.map((o) => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
            </div>
            <div style={{ width: 170, flex: 'none' }}>
              <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>
                Due date <span style={{ color: 'var(--faint2)' }}>· opt</span>
              </label>
              <input
                type="date"
                value={d.f.due}
                onChange={(e) => w.setForm('due')(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  padding: '9px 11px',
                  borderRadius: 2,
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: 'var(--panel-2)',
              border: '1px solid var(--line)',
              borderRadius: 2,
              padding: '14px 15px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>Notify now</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4, marginTop: 2 }}>
                  Off = the task just appears on their list. No ping.
                </div>
              </div>
              <button
                onClick={w.togForm('notifyNow')}
                role="switch"
                style={{
                  position: 'relative',
                  flex: 'none',
                  width: 44,
                  height: 24,
                  borderRadius: 2,
                  border: '1px solid var(--line)',
                  background: d.nowBg,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: d.nowKnob,
                    width: 18,
                    height: 18,
                    background: d.nowKnobBg,
                    borderRadius: 1,
                    transition: 'left .18s cubic-bezier(.2,.7,.2,1)',
                  }}
                />
              </button>
            </div>
            <div style={{ height: 1, background: 'var(--line)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <span style={{ color: 'var(--gold)', display: 'flex' }}>
                  <Icon name="clock" size={16} sw={1.8} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Notify on</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>· separate reminder, independent of due date</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="date"
                  value={d.f.notifyDate}
                  onChange={(e) => w.setForm('notifyDate')(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--input)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    padding: '9px 11px',
                    borderRadius: 2,
                    fontSize: 13,
                  }}
                />
                <input
                  type="time"
                  value={d.f.notifyTime}
                  onChange={(e) => w.setForm('notifyTime')(e.target.value)}
                  style={{
                    width: 120,
                    background: 'var(--input)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    padding: '9px 11px',
                    borderRadius: 2,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Repeat</label>
            <select
              value={d.f.repeat}
              onChange={(e) => w.setForm('repeat')(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--input)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                padding: '10px 12px',
                borderRadius: 2,
                fontSize: 13.5,
                cursor: 'pointer',
              }}
            >
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Weekly on Monday">Weekly on Monday</option>
              <option value="Monthly">Monthly</option>
            </select>
            {d.showCycle ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 12,
                  background: 'var(--panel-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 2,
                  padding: '12px 14px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Notify each cycle</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>
                    Off = it quietly reappears on the list each time, no ping.
                  </div>
                </div>
                <button
                  onClick={w.togForm('notifyCycle')}
                  role="switch"
                  style={{
                    position: 'relative',
                    flex: 'none',
                    width: 44,
                    height: 24,
                    borderRadius: 2,
                    border: '1px solid var(--line)',
                    background: d.cycleBg,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: d.cycleKnob,
                      width: 18,
                      height: 18,
                      background: d.cycleKnobBg,
                      borderRadius: 1,
                      transition: 'left .18s cubic-bezier(.2,.7,.2,1)',
                    }}
                  />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '14px 20px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <button
            onClick={w.closeModal}
            className="ghost"
            style={{
              background: 'none',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              padding: '9px 18px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={w.submitTask}
            className="perf gold-btn"
            style={{
              background: 'var(--gold)',
              border: 0,
              color: '#05101F',
              padding: '9px 20px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}
