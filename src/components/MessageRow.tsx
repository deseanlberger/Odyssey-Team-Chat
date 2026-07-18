// ============================================================
// MessageRow — one row in the chat feed. Branches on the message
// view-model's isSystem / isSchedulePost / isNormal flags.
// Ported 1:1 from the hi-fi prototype markup (lines 139-215).
// ============================================================
import { Icon } from '../lib/Icon'
import type { Derived } from '../store/useDerived'

type MsgVM = Derived['msgs'][number]

export function MessageRow({ m }: { m: MsgVM }) {
  if (m.isSystem) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 20px', margin: '1px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <span
          className="mono"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontSize: 11.5 }}
        >
          <Icon name="check" size={13} sw={2.4} />
          {m.text}
          <span style={{ color: 'var(--muted)' }}>· {m.time}</span>
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>
    )
  }

  if (m.isSchedulePost) {
    return (
      <div style={{ display: 'flex', gap: 13, padding: '9px 20px' }}>
        <span
          style={{
            flex: 'none',
            width: 40,
            height: 40,
            borderRadius: 3,
            background: m.avColor,
            color: m.avInk,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {m.initials}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{m.name}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{m.time}</span>
          </div>
          <div
            style={{
              maxWidth: 460,
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 4, background: 'var(--gold)' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 14px',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span style={{ color: 'var(--gold)', display: 'flex' }}>
                <Icon name="cal" size={16} sw={1.8} />
              </span>
              <span className="perf" style={{ fontSize: 13, color: 'var(--text-strong)' }}>{m.schedTitle}</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {(m.schedLines ?? []).map((ln, i) => (
                <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '7px 14px' }}>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--gold-ink)', minWidth: 64, fontWeight: 600 }}>
                    {ln.time}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{ln.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{ln.staff}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // isNormal
  return (
    <div className="msgrow" style={{ position: 'relative', display: 'flex', gap: 13, padding: '9px 20px' }}>
      <span
        style={{
          flex: 'none',
          width: 40,
          height: 40,
          borderRadius: 3,
          background: m.avColor,
          color: m.avInk,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {m.initials}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{m.name}</span>
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: '.1em',
              color: 'var(--faint2)',
              border: '1px solid var(--line)',
              padding: '0 4px',
              borderRadius: 2,
            }}
          >
            {m.role}
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{m.time}</span>
        </div>

        <div style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--text)' }}>
          {(m.parts ?? []).map((pt, i) =>
            pt.mention ? (
              <span
                key={i}
                style={{
                  color: 'var(--gold-ink)',
                  fontWeight: 600,
                  background: 'var(--chip)',
                  border: '1px solid var(--line)',
                  borderRadius: 2,
                  padding: '0 4px',
                }}
              >
                {pt.t}
              </span>
            ) : (
              <span key={i}>{pt.t}</span>
            ),
          )}
        </div>

        {m.hasDoc ? (
          <div
            style={{
              marginTop: 8,
              maxWidth: 420,
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderLeft: '3px solid var(--gold)',
              padding: '13px 15px',
              borderRadius: 2,
            }}
          >
            <span style={{ color: 'var(--gold)', display: 'flex' }}>
              <Icon name="file" size={18} sw={1.8} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{m.docTitle}</div>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '.04em' }}>{m.docMeta}</div>
            </div>
            <a
              href="#"
              className="perf gold-btn"
              style={{
                flex: 'none',
                fontSize: 11,
                background: 'var(--gold)',
                color: '#05101F',
                padding: '6px 13px',
                borderRadius: 2,
              }}
            >
              Open
            </a>
          </div>
        ) : null}

        {m.hasAttach ? (
          <div
            className="border-gold-hover"
            style={{
              marginTop: 8,
              maxWidth: 360,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              padding: '11px 14px',
              borderRadius: 2,
            }}
          >
            <span style={{ color: 'var(--steel-line)', display: 'flex' }}>
              <Icon name="file" size={18} sw={1.8} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{m.attachName}</div>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{m.attachMeta}</div>
            </div>
          </div>
        ) : null}

        {m.hasReact ? (
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {m.react.map((r) => (
              <span
                key={r.key}
                className="border-gold-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--chip)',
                  border: '1px solid var(--line)',
                  padding: '2px 9px',
                  borderRadius: 2,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {r.e}
                <span className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{r.n}</span>
              </span>
            ))}
          </div>
        ) : null}

        {m.hasThread ? (
          <a
            href="#"
            onClick={m.openThread}
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              color: 'var(--gold-ink)',
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            <Icon name="msg" size={15} sw={1.8} />
            {m.threadLabel}
            <span style={{ color: 'var(--muted)' }}>›</span>
          </a>
        ) : null}
      </div>

      {/* hover actions */}
      <div
        className="msgacts"
        style={{
          position: 'absolute',
          top: -13,
          right: 16,
          display: 'flex',
          gap: 2,
          background: 'var(--panel)',
          border: '1px solid var(--line)',
          borderRadius: 2,
          padding: 2,
          boxShadow: '0 2px 0 rgba(0,0,0,.4)',
        }}
      >
        <button
          title="React"
          className="row-hover"
          style={{
            width: 28,
            height: 26,
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
          <Icon name="smile" size={16} sw={1.8} />
        </button>
        <button
          onClick={m.openThread}
          title="Reply in thread"
          className="row-hover"
          style={{
            width: 28,
            height: 26,
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
          <Icon name="msg" size={16} sw={1.8} />
        </button>
        <button
          onClick={m.turnIntoTask}
          title="Turn into task"
          className="gold-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            height: 26,
            padding: '0 8px',
            background: 'none',
            border: 0,
            color: 'var(--gold-ink)',
            cursor: 'pointer',
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <Icon name="task" size={14} sw={1.8} />
          Task
        </button>
        <button
          onClick={m.toggleSave}
          title="Save"
          className="row-hover"
          style={{
            width: 28,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 0,
            color: m.saveColor,
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          <Icon name="bookmark" size={15} sw={1.8} />
        </button>
        <button
          onClick={m.togglePin}
          title="Pin to channel"
          className="row-hover"
          style={{
            width: 28,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 0,
            color: m.pinColor,
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          <Icon name="pin" size={15} sw={1.8} />
        </button>
        <button
          title="More"
          className="row-hover"
          style={{
            width: 28,
            height: 26,
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
          <Icon name="moreH" size={16} sw={1.8} />
        </button>
      </div>
    </div>
  )
}
