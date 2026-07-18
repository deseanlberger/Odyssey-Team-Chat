// ============================================================
// Composer — message input with slash-command menu, @mention
// menu, and bottom action bar. Ported 1:1 from the hi-fi
// prototype markup (lines 219-254).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function Composer() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div style={{ flex: 'none', padding: '0 20px 18px' }}>
      <div style={{ position: 'relative', border: '1px solid var(--line)', borderRadius: 3, background: 'var(--panel)' }}>
        {d.slashOpen ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 'calc(100% + 6px)',
              background: 'var(--panel)',
              border: '1px solid var(--gold)',
              borderRadius: 2,
              boxShadow: '0 -8px 30px -12px rgba(0,0,0,.7)',
              overflow: 'hidden',
              zIndex: 10,
            }}
          >
            <div className="eyb" style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>Commands</div>
            {d.slashCmds.map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={cmd.run}
                className="row-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                  border: 0,
                  background: 'transparent',
                  color: 'var(--text)',
                  padding: '9px 12px',
                  cursor: 'pointer',
                }}
              >
                <span className="mono" style={{ color: 'var(--gold-ink)', fontSize: 12.5, fontWeight: 600, minWidth: 80 }}>
                  {cmd.cmd}
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{cmd.desc}</span>
              </button>
            ))}
          </div>
        ) : null}

        {d.mentionOpen ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 'calc(100% + 6px)',
              background: 'var(--panel)',
              border: '1px solid var(--gold)',
              borderRadius: 2,
              boxShadow: '0 -8px 30px -12px rgba(0,0,0,.7)',
              overflow: 'hidden',
              zIndex: 10,
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            <div className="eyb" style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>People</div>
            {d.mentionPeople.map((mp) => (
              <button
                key={mp.id}
                onClick={mp.pick}
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
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 3,
                    background: mp.color,
                    color: mp.ink,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {mp.initials}
                </span>
                <span style={{ flex: 1, fontSize: 13.5, color: 'var(--text-strong)' }}>{mp.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{mp.role}</span>
              </button>
            ))}
          </div>
        ) : null}

        <textarea
          value={d.composerText}
          onChange={(e) => w.setComposer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              w.sendMessage()
            }
          }}
          placeholder={`Message ${d.composerPh}  ·  / for commands, @ to mention`}
          rows={1}
          style={{
            display: 'block',
            width: '100%',
            resize: 'none',
            background: 'transparent',
            border: 0,
            color: 'var(--text)',
            padding: '13px 15px 4px',
            fontSize: 14,
            lineHeight: 1.4,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px 8px' }}>
          <button
            title="Attach"
            className="row-hover"
            style={{
              width: 32,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 0,
              color: 'var(--muted)',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            <Icon name="clip" size={16} sw={1.8} />
          </button>
          <button
            title="Add link"
            className="row-hover"
            style={{
              width: 32,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 0,
              color: 'var(--muted)',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            <Icon name="link" size={16} sw={1.8} />
          </button>
          <button
            onClick={() => w.openModal('', '')}
            className="ghost-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 30,
              padding: '0 11px',
              background: 'none',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              cursor: 'pointer',
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Icon name="task" size={15} sw={1.8} />
            Create Task
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={w.sendMessage}
            className="gold-btn"
            style={{
              width: 34,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gold)',
              border: 0,
              color: '#05101F',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            <Icon name="send" size={16} sw={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
