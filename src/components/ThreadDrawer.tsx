// ============================================================
// ThreadDrawer — 388px right drawer showing a message's parent
// + replies + a reply composer. Ported 1:1 from the hi-fi
// prototype markup (lines 313-354).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function ThreadDrawer() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.threadShow) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 388,
        background: 'var(--panel)',
        borderLeft: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 25,
        boxShadow: '-16px 0 40px -16px rgba(0,0,0,.6)',
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
          padding: '0 16px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <span style={{ color: 'var(--gold)', display: 'flex' }}>
          <Icon name="msg" size={18} sw={1.8} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="perf" style={{ fontSize: 13, color: 'var(--text-strong)' }}>Thread</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>{d.threadChannel}</div>
        </div>
        <button
          onClick={w.closeThread}
          title="Close"
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {d.threadParent ? (
          <div style={{ display: 'flex', gap: 11, paddingBottom: 14 }}>
            <span
              style={{
                flex: 'none',
                width: 36,
                height: 36,
                borderRadius: 3,
                background: d.threadParent.color,
                color: d.threadParent.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {d.threadParent.initials}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-strong)' }}>{d.threadParent.name}</span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{d.threadParent.time}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>{d.threadParent.text}</div>

              {d.threadParent.hasMedia ? (
                <div
                  style={{
                    marginTop: 9,
                    border: '1px solid var(--line)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'var(--panel-2)',
                  }}
                >
                  {d.threadParent.mediaIsVideo ? (
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: 'linear-gradient(135deg,#0A1A2F,#04080E)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid var(--line)',
                      }}
                    >
                      <span
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'var(--gold)',
                          color: '#05101F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="play" size={18} />
                      </span>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px' }}>
                    <span style={{ color: 'var(--gold)', display: 'flex' }}>
                      <Icon name="film" size={16} sw={1.7} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: 'var(--text-strong)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {d.threadParent.mediaLabel}
                      </div>
                      <div
                        className="mono"
                        style={{
                          fontSize: 9.5,
                          color: 'var(--gold-ink)',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          marginTop: 1,
                        }}
                      >
                        {d.threadParent.mediaType}
                      </div>
                    </div>
                    <button
                      className="border-gold-hover"
                      style={{
                        flex: 'none',
                        background: 'none',
                        border: '1px solid var(--line)',
                        color: 'var(--text)',
                        padding: '5px 11px',
                        borderRadius: 2,
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Open
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 12px' }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '.1em' }}>
            {d.threadCount} REPLIES
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {d.threadReplies.map((r) => (
          <div key={r.key} style={{ display: 'flex', gap: 11, marginBottom: 14 }}>
            <span
              style={{
                flex: 'none',
                width: 32,
                height: 32,
                borderRadius: 3,
                background: r.color,
                color: r.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {r.initials}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>{r.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{r.time}</span>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)' }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 'none', padding: '0 16px 16px' }}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            border: '1px solid var(--line)',
            borderRadius: 3,
            background: 'var(--input)',
            padding: '8px 8px 8px 12px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            value={d.s.replyText}
            onChange={(e) => w.setReplyText(e.target.value)}
            placeholder="Reply…"
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              background: 'transparent',
              border: 0,
              color: 'var(--text)',
              fontSize: 13.5,
              lineHeight: 1.4,
              padding: '4px 0',
            }}
          />
          <button
            onClick={w.sendReply}
            className="gold-btn"
            style={{
              flex: 'none',
              width: 34,
              height: 32,
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
