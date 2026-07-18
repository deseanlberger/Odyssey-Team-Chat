// ============================================================
// ClassModal — Add / Edit recurring class session. 560px modal
// card. Ported 1:1 from the hi-fi prototype markup (lines 705-795).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function ClassModal() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.s.classModalOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 62,
        background: 'var(--scrim)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 20px',
        overflow: 'auto',
        animation: 'fadein .16s ease',
      }}
    >
      <div
        style={{
          width: 560,
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
            <Icon name="cal" size={18} sw={1.8} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="perf" style={{ fontSize: 15, color: 'var(--text-strong)' }}>{d.classModalTitle}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>RECURRING SESSION</div>
          </div>
          <button
            onClick={w.closeClassModal}
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

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '66vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Class name</label>
              <input
                value={d.cf.name}
                onChange={(e) => w.setCForm('name')(e.target.value)}
                placeholder="e.g. HS Speed & Power"
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
            <div style={{ width: 150, flex: 'none' }}>
              <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Time</label>
              <input
                value={d.cf.time}
                onChange={(e) => w.setCForm('time')(e.target.value)}
                placeholder="5:00 PM"
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
          </div>

          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 7 }}>
              Repeats on <span style={{ color: 'var(--faint2)' }}>· runs these days every week</span>
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {d.dayChips.map((dc) => (
                <button
                  key={dc.day}
                  onClick={dc.toggle}
                  className="mono"
                  style={{
                    width: 52,
                    padding: '8px 0',
                    textAlign: 'center',
                    background: dc.bg,
                    color: dc.fg,
                    border: '1px solid var(--line)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 11,
                    letterSpacing: '.06em',
                    fontWeight: 600,
                  }}
                >
                  {dc.day}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>Every other week</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                Runs only on alternating weeks — use the week stepper to see which.
              </div>
            </div>
            <button
              onClick={w.toggleBiweekly}
              role="switch"
              style={{
                position: 'relative',
                flex: 'none',
                width: 44,
                height: 24,
                borderRadius: 2,
                border: '1px solid var(--line)',
                background: d.biwBg,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: d.biwKnob,
                  width: 18,
                  height: 18,
                  background: d.biwKnobBg,
                  borderRadius: 1,
                  transition: 'left .18s cubic-bezier(.2,.7,.2,1)',
                }}
              />
            </button>
          </div>

          {d.hasMultiDay ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>Different time per day</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                    Override the start time for individual days.
                  </div>
                </div>
                <button
                  onClick={w.toggleVaryTime}
                  role="switch"
                  style={{
                    position: 'relative',
                    flex: 'none',
                    width: 44,
                    height: 24,
                    borderRadius: 2,
                    border: '1px solid var(--line)',
                    background: d.varyBg,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: d.varyKnob,
                      width: 18,
                      height: 18,
                      background: d.varyKnobBg,
                      borderRadius: 1,
                      transition: 'left .18s cubic-bezier(.2,.7,.2,1)',
                    }}
                  />
                </button>
              </div>
              {d.varyTimeOn ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                    background: 'var(--panel-2)',
                    border: '1px solid var(--line)',
                    borderRadius: 2,
                    padding: 12,
                  }}
                >
                  {d.dayTimeRows.map((dr) => (
                    <div key={dr.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', minWidth: 40, letterSpacing: '.06em' }}>
                        {dr.day}
                      </span>
                      <input
                        value={dr.value}
                        onChange={(e) => dr.onChange(e.target.value)}
                        placeholder="5:00 PM"
                        style={{
                          flex: 1,
                          background: 'var(--input)',
                          border: '1px solid var(--line)',
                          color: 'var(--text)',
                          padding: '8px 11px',
                          borderRadius: 2,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}

          <div style={{ height: 1, background: 'var(--line)' }} />

          {d.roleEditors.map((re) => (
            <div key={re.role}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span className="eyb" style={{ flex: 1 }}>{re.label}</span>
                <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                  <button
                    onClick={re.setFixed}
                    className="mono"
                    style={{
                      padding: '5px 12px',
                      background: re.fixedBg,
                      color: re.fixedFg,
                      border: 0,
                      cursor: 'pointer',
                      fontSize: 10,
                      letterSpacing: '.06em',
                      fontWeight: 600,
                    }}
                  >
                    FIXED
                  </button>
                  <button
                    onClick={re.setAlt}
                    className="mono"
                    style={{
                      padding: '5px 12px',
                      background: re.altBg,
                      color: re.altFg,
                      border: 0,
                      borderLeft: '1px solid var(--line)',
                      cursor: 'pointer',
                      fontSize: 10,
                      letterSpacing: '.06em',
                      fontWeight: 600,
                    }}
                  >
                    ALTERNATING
                  </button>
                </div>
              </div>

              {re.isFixed ? (
                <select
                  value={re.fixedValue}
                  onChange={(e) => re.onFixed(e.target.value)}
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
                  {re.options.map((o) => (
                    <option key={o.v} value={o.v}>{o.label}</option>
                  ))}
                </select>
              ) : null}

              {re.isAlt ? (
                <div style={{ background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 2, padding: 12 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 9, lineHeight: 1.4 }}>
                    Rotates in order — one coach per week. Use the week stepper up top to preview each rotation.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                    {re.chips.map((ch) => (
                      <div
                        key={ch.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          background: 'var(--input)',
                          border: '1px solid var(--line)',
                          borderRadius: 2,
                          padding: '7px 10px',
                        }}
                      >
                        <span className="mono" style={{ fontSize: 9.5, color: 'var(--gold-ink)', minWidth: 34 }}>{ch.order}</span>
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--text-strong)' }}>{ch.name}</span>
                        <button
                          onClick={ch.remove}
                          title="Remove"
                          className="ghost-gold"
                          style={{
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 0,
                            color: 'var(--muted)',
                            cursor: 'pointer',
                          }}
                        >
                          <Icon name="x" size={14} sw={1.8} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    value=""
                    onChange={(e) => re.onAdd(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--input)',
                      border: '1px dashed var(--steel-line)',
                      color: 'var(--text)',
                      padding: '9px 12px',
                      borderRadius: 2,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {re.addOptions.map((o) => (
                      <option key={o.v} value={o.v}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line)' }}>
          {d.isEditClass ? (
            <button
              onClick={w.deleteClass}
              className="ghost-gold"
              style={{
                background: 'none',
                border: '1px solid var(--line)',
                color: 'var(--red)',
                padding: '9px 16px',
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          ) : null}
          <div style={{ flex: 1 }} />
          <button
            onClick={w.closeClassModal}
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
            onClick={w.submitClass}
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
            Save Class
          </button>
        </div>
      </div>
    </div>
  )
}
