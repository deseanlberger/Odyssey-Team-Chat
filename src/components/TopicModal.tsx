// ============================================================
// TopicModal — New Research Topic. 520px modal card. Ported 1:1
// from the hi-fi prototype markup (lines 797-846).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'
import type { MediaType } from '../data/types'

export function TopicModal() {
  const w = useWorkspace()
  const d = useDerived()

  if (!d.s.topicModalOpen) return null

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
        padding: '70px 20px',
        overflow: 'auto',
        animation: 'fadein .16s ease',
      }}
    >
      <div
        style={{
          width: 520,
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
            <Icon name="msg" size={18} sw={1.8} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="perf" style={{ fontSize: 15, color: 'var(--text-strong)' }}>New Research Topic</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>FILED UNDER A SUBJECT</div>
          </div>
          <button
            onClick={w.closeTopicModal}
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
          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>Topic title</label>
            <input
              value={d.tf.title}
              onChange={(e) => w.setTForm('title')(e.target.value)}
              placeholder="e.g. 10-yard start — video breakdown"
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

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="eyb" style={{ flex: 1 }}>Subject</span>
              <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                <button
                  onClick={() => w.setTopicMode('existing')}
                  className="mono"
                  style={{
                    padding: '5px 12px',
                    background: d.tExBg,
                    color: d.tExFg,
                    border: 0,
                    cursor: 'pointer',
                    fontSize: 10,
                    letterSpacing: '.06em',
                    fontWeight: 600,
                  }}
                >
                  EXISTING
                </button>
                <button
                  onClick={() => w.setTopicMode('new')}
                  className="mono"
                  style={{
                    padding: '5px 12px',
                    background: d.tNewBg,
                    color: d.tNewFg,
                    border: 0,
                    borderLeft: '1px solid var(--line)',
                    cursor: 'pointer',
                    fontSize: 10,
                    letterSpacing: '.06em',
                    fontWeight: 600,
                  }}
                >
                  NEW
                </button>
              </div>
            </div>

            {d.tSubExisting ? (
              <>
                <select
                  value={d.tf.subject}
                  onChange={(e) => w.setTForm('subject')(e.target.value)}
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
                  {d.topicSubjOpts.map((o) => (
                    <option key={o.v} value={o.v}>{o.label}</option>
                  ))}
                </select>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>
                  Adds this topic to an existing subject — keeps everything on that theme together, even months apart.
                </div>
              </>
            ) : null}

            {d.tSubNew ? (
              <input
                value={d.tf.newSubject}
                onChange={(e) => w.setTForm('newSubject')(e.target.value)}
                placeholder="e.g. Acceleration, Deceleration, Nutrition…"
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
            ) : null}
          </div>

          <div>
            <label className="eyb" style={{ display: 'block', marginBottom: 6 }}>
              Attach media <span style={{ color: 'var(--faint2)' }}>· optional</span>
            </label>
            <div style={{ display: 'flex', gap: 9 }}>
              <select
                value={d.tf.mediaType}
                onChange={(e) => w.setTForm('mediaType')(e.target.value as 'None' | MediaType)}
                style={{
                  width: 140,
                  flex: 'none',
                  background: 'var(--input)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  padding: '10px 12px',
                  borderRadius: 2,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                {d.mediaTypeOpts.map((o) => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
              {d.tHasMedia ? (
                <input
                  value={d.tf.mediaLabel}
                  onChange={(e) => w.setTForm('mediaLabel')(e.target.value)}
                  placeholder="File name or link…"
                  style={{
                    flex: 1,
                    background: 'var(--input)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    padding: '10px 12px',
                    borderRadius: 2,
                    fontSize: 14,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line)' }}>
          <div style={{ flex: 1 }} />
          <button
            onClick={w.closeTopicModal}
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
            onClick={w.submitTopic}
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
            Create Topic
          </button>
        </div>
      </div>
    </div>
  )
}
