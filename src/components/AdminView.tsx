// ============================================================
// AdminView — full-screen "Member Management" table with
// per-channel access toggles.
// Ported 1:1 from the hi-fi prototype markup (lines 400-432).
// ============================================================
import { Icon } from '../lib/Icon'
import { useDerived, type Derived } from '../store/useDerived'

type Member = Derived['members'][number]
type Cell = Member['cells'][number]
type Col = Derived['chCols'][number]

export function AdminView() {
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
          <Icon name="shield" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="perf" style={{ fontSize: 18, color: 'var(--text-strong)', lineHeight: 1 }}>
            Member Management
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', marginTop: 2 }}>
            20 MEMBERS · CHANNEL ACCESS
          </div>
        </div>
      </div>

      {/* ---- body ---- */}
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px 40px' }}>
        <div style={{ minWidth: 820, border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(6,1fr)',
              background: 'var(--panel-2)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ padding: '11px 16px' }} className="eyb">
              Member
            </div>
            {d.chCols.map((col: Col) => (
              <div key={col.id} style={{ padding: '11px 6px', textAlign: 'center', borderLeft: '1px solid var(--line)' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.05em' }}>
                  #{col.name}
                </span>
              </div>
            ))}
          </div>
          {d.members.map((m: Member) => (
            <div
              key={m.id}
              className="row-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr repeat(6,1fr)',
                borderBottom: '1px solid var(--line)',
                background: 'var(--panel)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 16px' }}>
                <span
                  style={{
                    flex: 'none',
                    width: 28,
                    height: 28,
                    borderRadius: 3,
                    background: 'var(--chip)',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {m.initials}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: m.roleColor }}>
                    {m.role}
                  </div>
                </div>
              </div>
              {m.cells.map((cell: Cell) => (
                <div
                  key={cell.key}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--line)' }}
                >
                  <button
                    onClick={cell.toggle}
                    className="ghost-gold"
                    style={{
                      position: 'relative',
                      width: 20,
                      height: 20,
                      border: '1.5px solid var(--line)',
                      borderRadius: 3,
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.checked ? (
                      <span
                        style={{
                          position: 'absolute',
                          inset: -1,
                          background: 'var(--gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 3,
                        }}
                      >
                        <Icon name="check" size={12} sw={3} color="#05101F" />
                      </span>
                    ) : null}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
