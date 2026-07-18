// ============================================================
// ChatView — center chat column (header, resources strip, feed,
// composer) plus the right panel. Ported 1:1 from the hi-fi
// prototype markup (lines 106-310).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'
import { MessageRow } from './MessageRow'
import { Composer } from './Composer'
import { RightPanel } from './RightPanel'

export function ChatView() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* channel header */}
        <div
          style={{
            height: 60,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 20px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <span style={{ color: 'var(--faint2)', display: 'flex' }}>
            <Icon name="hash" size={18} sw={1.8} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="perf" style={{ fontSize: 17, color: 'var(--text-strong)', lineHeight: 1.1 }}>
              {d.activePrefix}
              {d.activeName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {d.topic}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={w.togglePinnedPanel}
            title="Pinned messages"
            className="ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--input)',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
              padding: '6px 11px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <Icon name="pin" size={15} sw={1.8} />
            <span className="mono" style={{ letterSpacing: '.06em' }}>{d.pinnedCount}</span>
          </button>
          <button
            onClick={w.toggleRight}
            className="ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: 'var(--input)',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
              padding: '6px 11px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <Icon name="task" size={15} sw={1.8} />
            <span className="mono" style={{ letterSpacing: '.08em', textTransform: 'uppercase' }}>{d.rightTitle}</span>
          </button>
        </div>

        {/* resources strip */}
        {d.hasRes ? (
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--panel)',
              overflowX: 'auto',
            }}
          >
            <span style={{ color: 'var(--gold)', display: 'flex', flex: 'none' }}>
              <Icon name="pin" size={15} sw={1.8} />
            </span>
            <span className="eyb" style={{ flex: 'none', marginRight: 2 }}>Resources</span>
            {d.resList.map((r) => (
              <a
                key={r.key}
                href="#"
                className="border-gold-hover"
                style={{
                  flex: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'var(--chip)',
                  border: '1px solid var(--line)',
                  padding: '5px 10px',
                  borderRadius: 2,
                  color: 'var(--text)',
                  fontSize: 12,
                }}
              >
                <Icon name="file" size={14} sw={1.8} color="var(--gold)" />
                {r.n}
                <span className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{r.t}</span>
              </a>
            ))}
          </div>
        ) : null}

        {/* feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0 6px' }}>
          {d.msgs.map((m) => (
            <MessageRow key={m.id} m={m} />
          ))}
        </div>

        <Composer />
      </div>

      {d.rightOpen ? <RightPanel /> : null}
    </div>
  )
}
