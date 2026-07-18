// ============================================================
// PinnedPanel — right 380px slide-in panel listing pinned
// messages for the active channel. Ported 1:1 from the hi-fi
// prototype markup (lines 906-929).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function PinnedPanel() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.pinnedPanelOpen) return null

  return (
    <div onClick={w.togglePinnedPanel} style={{ position: 'fixed', inset: 0, zIndex: 55, animation: 'fadein .14s ease' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: '90%',
          background: 'var(--panel)',
          borderLeft: '1px solid var(--line)',
          boxShadow: '-16px 0 40px -16px rgba(0,0,0,.6)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slidein .22s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div
          style={{
            height: 60,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <Icon name="pin" size={16} sw={1.8} />
          </span>
          <span className="perf" style={{ flex: 1, fontSize: 14, color: 'var(--text-strong)' }}>Pinned</span>
          <button
            onClick={w.togglePinnedPanel}
            style={{
              width: 28,
              height: 28,
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

        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {d.pinnedEmpty ? (
            <div style={{ textAlign: 'center', padding: '44px 16px', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: 'var(--faint2)' }}>
                <Icon name="pin" size={30} sw={1.5} />
              </div>
              <div style={{ fontSize: 13 }}>No pinned messages here.</div>
              <div style={{ fontSize: 12, marginTop: 4, color: 'var(--faint2)' }}>Hover a message and hit the pin.</div>
            </div>
          ) : null}

          {d.pinnedList.map((pn) => (
            <div
              key={pn.key}
              style={{
                display: 'flex',
                gap: 11,
                padding: 12,
                border: '1px solid var(--line)',
                borderRadius: 2,
                marginBottom: 8,
                background: 'var(--panel-2)',
              }}
            >
              <span
                style={{
                  flex: 'none',
                  width: 30,
                  height: 30,
                  borderRadius: 3,
                  background: pn.color,
                  color: pn.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {pn.initials}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-strong)' }}>{pn.name}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{pn.time}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--text)' }}>{pn.text}</div>
              </div>
              <button
                onClick={pn.unpin}
                title="Unpin"
                className="row-hover"
                style={{
                  flex: 'none',
                  width: 26,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 0,
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
              >
                <Icon name="x" size={14} sw={1.8} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
