// ============================================================
// SavedView — full-screen "Saved Items" list of bookmarked
// messages, with an empty state.
// Ported 1:1 from the hi-fi prototype markup (lines 538-562).
// ============================================================
import { Icon } from '../lib/Icon'
import { useDerived, type Derived } from '../store/useDerived'

type SavedItem = Derived['savedItems'][number]

export function SavedView() {
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
          <Icon name="bookmark" size={17} />
        </span>
        <div style={{ flex: 1 }}>
          <div className="perf" style={{ fontSize: 18, color: 'var(--text-strong)', lineHeight: 1 }}>
            Saved Items
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', marginTop: 2 }}>
            BOOKMARKED MESSAGES
          </div>
        </div>
      </div>

      {/* ---- body ---- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {d.savedEmpty ? (
            <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: 'var(--faint2)' }}>
                <Icon name="bookmark" size={34} sw={1.5} />
              </div>
              <div style={{ fontSize: 14 }}>Nothing saved yet.</div>
              <div style={{ fontSize: 12.5, marginTop: 4, color: 'var(--faint2)' }}>
                Hover any message and hit the bookmark to save it here.
              </div>
            </div>
          ) : null}
          {d.savedItems.map((si: SavedItem) => (
            <div
              key={si.key}
              style={{
                display: 'flex',
                gap: 13,
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: 2,
                padding: '14px 16px',
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  flex: 'none',
                  width: 36,
                  height: 36,
                  borderRadius: 3,
                  background: si.color,
                  color: si.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {si.initials}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-strong)' }}>{si.name}</span>
                  <button
                    onClick={si.open}
                    className="mono border-gold-hover"
                    style={{
                      fontSize: 10,
                      color: 'var(--gold-ink)',
                      background: 'var(--chip)',
                      border: '1px solid var(--line)',
                      padding: '1px 7px',
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    {si.channel}
                  </button>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {si.time}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)' }}>{si.text}</div>
              </div>
              <button
                onClick={si.unsave}
                title="Remove"
                className="border-gold-hover"
                style={{
                  flex: 'none',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: '1px solid var(--line)',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
              >
                <Icon name="bookmark" size={15} sw={1.8} fill="var(--gold)" color="var(--gold)" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
