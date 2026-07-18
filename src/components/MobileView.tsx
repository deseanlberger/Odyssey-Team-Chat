// ============================================================
// MobileView — phone-frame preview of the chat / My Tasks screens.
// Always renders its stage; only mounted when mobile mode is on.
// Ported 1:1 from the hi-fi prototype markup (lines 568-625).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function MobileView() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 40%,#0A1A2F,#05101F)',
        minHeight: 0,
        padding: 20,
        gap: 26,
        flexWrap: 'wrap',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 340,
          height: 720,
          background: '#000',
          borderRadius: 38,
          padding: 11,
          boxShadow: '0 0 0 2px var(--line),0 30px 60px -20px rgba(0,0,0,.8)',
          flex: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 26,
            background: '#000',
            borderRadius: 14,
            zIndex: 5,
          }}
        />
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--app-bg)',
            borderRadius: 28,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: 'var(--text)',
          }}
        >
          <div style={{ height: 46, flex: 'none' }} />
          {/* mobile top bar */}
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 16px 12px',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span style={{ display: 'flex', color: 'var(--muted)' }}>
              <Icon name="menu" size={18} sw={1.8} />
            </span>
            <span className="perf" style={{ flex: 1, fontSize: 14, color: 'var(--text-strong)' }}>
              {d.mobIsChan ? `#${d.activeName}` : 'My Tasks'}
            </span>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 3,
                background: 'var(--gold)',
                color: '#05101F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {d.meInitials}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {d.mobIsChan ? (
              <div style={{ padding: '12px 14px' }}>
                {d.msgs.filter((m) => m.isNormal).map((m) => (
                  <div key={m.id} style={{ display: 'flex', gap: 9, marginBottom: 14 }}>
                    <span
                      style={{
                        flex: 'none',
                        width: 30,
                        height: 30,
                        borderRadius: 3,
                        background: m.avColor,
                        color: m.avInk,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {m.initials}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-strong)' }}>{m.name}</span>
                        <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)' }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--text)' }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {d.mobIsTasks ? (
              <div style={{ padding: 14 }}>
                {d.myGroups.map((g) => (
                  <div key={g.key} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span className="perf" style={{ fontSize: 11.5, color: 'var(--text-strong)' }}>{g.label}</span>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{g.count}</span>
                      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                    </div>
                    {g.items.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          background: 'var(--panel)',
                          border: '1px solid var(--line)',
                          borderLeft: `3px solid ${t.barColor}`,
                          padding: '10px 11px',
                          marginBottom: 7,
                          borderRadius: 2,
                        }}
                      >
                        <button
                          onClick={t.onCheck}
                          style={{
                            position: 'relative',
                            flex: 'none',
                            width: 18,
                            height: 18,
                            border: `1.5px solid ${t.barColor}`,
                            borderRadius: 3,
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {t.checked ? (
                            <span
                              style={{
                                position: 'absolute',
                                inset: -1,
                                background: 'var(--green)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 3,
                              }}
                            >
                              <Icon name="check" size={11} sw={3} color="#05101F" />
                            </span>
                          ) : null}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.3 }}>
                            {t.title}
                          </div>
                          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>
                            {t.metaLine}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* mobile bottom tabs */}
          <div style={{ flex: 'none', display: 'flex', borderTop: '1px solid var(--line)', background: 'var(--panel-2)' }}>
            <button
              onClick={() => w.setMobileView('channel')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '9px 0 14px',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                color: d.mobChanColor,
              }}
            >
              <span style={{ display: 'flex' }}>
                <Icon name="hash" size={18} sw={1.8} />
              </span>
              <span className="mono" style={{ fontSize: 9, letterSpacing: '.08em' }}>CHANNEL</span>
            </button>
            <button
              onClick={() => w.setMobileView('tasks')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '9px 0 14px',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                color: d.mobTasksColor,
              }}
            >
              <span style={{ display: 'flex' }}>
                <Icon name="list" size={18} sw={1.8} />
              </span>
              <span className="mono" style={{ fontSize: 9, letterSpacing: '.08em' }}>MY TASKS</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 'none', maxWidth: 220, color: 'var(--muted)' }}>
        <div className="eyb" style={{ marginBottom: 8 }}>Mobile preview</div>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>
          Tap the bottom tabs to switch between a channel and My Tasks.
        </div>
        <button
          onClick={w.toggleMobile}
          className="border-gold-hover"
          style={{
            marginTop: 16,
            background: 'none',
            border: '1px solid var(--line)',
            color: 'var(--gold)',
            padding: '8px 14px',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Back to desktop
        </button>
      </div>
    </div>
  )
}
