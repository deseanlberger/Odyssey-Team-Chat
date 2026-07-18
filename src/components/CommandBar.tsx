// ============================================================
// CommandBar — ⌘K jump-to search: channels, people, nav targets,
// actions. Ported 1:1 from the hi-fi prototype markup
// (lines 849-882).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function CommandBar() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.searchOpen) return null

  return (
    <div
      onClick={w.closeSearch}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'var(--scrim)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 90,
        animation: 'fadein .14s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '92%',
          background: 'var(--panel)',
          border: '1px solid var(--gold)',
          borderRadius: 2,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,.8)',
          overflow: 'hidden',
          animation: 'pop .2s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <Icon name="search" size={18} sw={1.8} />
          </span>
          <input
            autoFocus
            value={d.searchQ}
            onChange={(e) => w.setSearchQ(e.target.value)}
            placeholder="Jump to a channel or person…"
            style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--text)', fontSize: 15 }}
          />
          <span
            className="mono"
            style={{ fontSize: 10, color: 'var(--muted)', border: '1px solid var(--line)', padding: '1px 5px', borderRadius: 2 }}
          >
            ESC
          </span>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '10px 8px' }}>
          <div className="eyb" style={{ padding: '6px 10px' }}>Channels</div>
          {d.searchCh.map((c) => (
            <button
              key={c.id}
              onClick={c.select}
              className="row-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                textAlign: 'left',
                border: 0,
                background: 'transparent',
                color: 'var(--text)',
                padding: '8px 10px',
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              <span style={{ color: 'var(--faint2)', display: 'flex' }}>
                <Icon name="hash" size={16} sw={1.8} />
              </span>
              {c.name}
            </button>
          ))}

          <div className="eyb" style={{ padding: '10px 10px 6px' }}>People</div>
          {d.searchPl.map((p) => (
            <button
              key={p.id}
              onClick={p.select}
              className="row-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                textAlign: 'left',
                border: 0,
                background: 'transparent',
                color: 'var(--text)',
                padding: '7px 10px',
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 3,
                  background: p.color,
                  color: p.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {p.initials}
              </span>
              <span style={{ flex: 1 }}>{p.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{p.role}</span>
            </button>
          ))}

          {d.hasSearchNav ? (
            <>
              <div className="eyb" style={{ padding: '10px 10px 6px' }}>Go to</div>
              {d.searchNav.map((g) => (
                <button
                  key={g.id}
                  onClick={g.go}
                  className="row-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    border: 0,
                    background: 'transparent',
                    color: 'var(--text)',
                    padding: '8px 10px',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: 'var(--faint2)', display: 'flex' }}>
                    <Icon name="arrow" size={16} sw={1.8} />
                  </span>
                  <span style={{ flex: 1 }}>{g.label}</span>
                  <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em' }}>{g.hint}</span>
                </button>
              ))}
            </>
          ) : null}

          {d.hasSearchAct ? (
            <>
              <div className="eyb" style={{ padding: '10px 10px 6px' }}>Actions</div>
              {d.searchAct.map((a) => (
                <button
                  key={a.id}
                  onClick={a.go}
                  className="row-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    border: 0,
                    background: 'transparent',
                    color: 'var(--text)',
                    padding: '8px 10px',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: 'var(--gold)', display: 'flex' }}>
                    <Icon name="zap" size={16} sw={1.8} />
                  </span>
                  <span style={{ flex: 1 }}>{a.label}</span>
                  <span className="mono" style={{ fontSize: 9.5, color: 'var(--gold-ink)', letterSpacing: '.08em' }}>{a.hint}</span>
                </button>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
