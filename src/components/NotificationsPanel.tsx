// ============================================================
// NotificationsPanel — right 360px slide-in panel. Ported 1:1
// from the hi-fi prototype markup (lines 884-904).
// ============================================================
import { Icon, type IconName } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function NotificationsPanel() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.notifOpen) return null

  return (
    <div onClick={w.closeNotif} style={{ position: 'fixed', inset: 0, zIndex: 55, animation: 'fadein .14s ease' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
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
            <Icon name="bell" size={18} sw={1.8} />
          </span>
          <span className="perf" style={{ flex: 1, fontSize: 14, color: 'var(--text-strong)' }}>Notifications</span>
          <button
            onClick={w.markAllNotifs}
            style={{ background: 'none', border: 0, color: 'var(--gold-ink)', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
          >
            Mark all read
          </button>
          <button
            onClick={w.closeNotif}
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

        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {d.notifs.map((n) => (
            <div
              key={n.id}
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
              <span style={{ position: 'relative', color: 'var(--muted)', display: 'flex', flex: 'none', marginTop: 1 }}>
                <Icon name={n.iconName as IconName} size={16} sw={1.8} />
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: n.dotColor,
                  }}
                />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--text)' }}>{n.text}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, letterSpacing: '.08em' }}>
                  {n.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
