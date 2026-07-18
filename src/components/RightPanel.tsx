// ============================================================
// RightPanel — Task Board for normal channels, Topics (Subjects)
// for #research. Ported 1:1 from the hi-fi prototype markup
// (lines 257-308).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function RightPanel() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div
      style={{
        width: 344,
        flex: 'none',
        background: 'var(--panel-2)',
        borderLeft: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="perf" style={{ fontSize: 13, color: 'var(--text-strong)' }}>{d.rightTitle}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>#{d.boardTitle}</div>
        </div>
        <button
          onClick={() => w.openModal('', '')}
          title="New task"
          className="gold-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--gold)',
            border: 0,
            color: '#05101F',
            padding: '6px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <Icon name="plus" size={14} sw={1.8} />
          New
        </button>
        <button
          onClick={w.toggleRight}
          title="Collapse"
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
          <Icon name="chevR" size={16} sw={1.8} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {d.notResearch ? (
          <>
            {d.boardEmpty ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: 'var(--faint2)' }}>
                  <Icon name="task" size={24} sw={1.6} />
                </div>
                <div style={{ fontSize: 13 }}>No tasks on this board yet.</div>
                <button
                  onClick={() => w.openModal('', '')}
                  className="border-gold-hover"
                  style={{
                    marginTop: 12,
                    background: 'none',
                    border: '1px solid var(--line)',
                    color: 'var(--gold)',
                    padding: '7px 13px',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Create the first one
                </button>
              </div>
            ) : null}
            {d.board.map((t) => (
              <div
                key={t.id}
                style={{
                  position: 'relative',
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderLeft: `3px solid ${t.barColor}`,
                  padding: '11px 12px 11px 13px',
                  marginBottom: 9,
                  borderRadius: 2,
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <button
                    onClick={t.onCheck}
                    className="border-gold-hover"
                    style={{
                      flex: 'none',
                      marginTop: 1,
                      width: 19,
                      height: 19,
                      border: `1.5px solid ${t.barColor}`,
                      borderRadius: 2,
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#05101F',
                    }}
                  >
                    {t.checked ? (
                      <span
                        style={{
                          position: 'absolute',
                          width: 19,
                          height: 19,
                          background: 'var(--green)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                        }}
                      >
                        <Icon name="check" size={12} sw={3} color="#05101F" />
                      </span>
                    ) : null}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: 'var(--text-strong)' }}>{t.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7, flexWrap: 'wrap' }}>
                      {t.hasAssignee ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span
                            style={{
                              width: 17,
                              height: 17,
                              borderRadius: 3,
                              background: t.assigneeColor,
                              color: t.assigneeInk,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 8.5,
                              fontWeight: 700,
                            }}
                          >
                            {t.assigneeInitials}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t.assigneeName}</span>
                        </span>
                      ) : null}
                      {t.isScheduled ? (
                        <span
                          className="mono"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--gold-ink)', fontSize: 11 }}
                        >
                          <Icon name="clock" size={12} sw={1.8} />
                          {t.metaLine}
                        </span>
                      ) : null}
                      {t.isRecurring ? (
                        <span
                          className="mono"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--steel-line)', fontSize: 11 }}
                        >
                          <Icon name="repeat" size={12} sw={1.8} />
                          {t.metaLine}
                        </span>
                      ) : null}
                      {t.isOverdue ? (
                        <span
                          className="mono"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--red)', fontSize: 11, fontWeight: 600 }}
                        >
                          {t.metaLine}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : null}

        {d.isResearch ? (
          <>
            <button
              onClick={w.openTopicModal}
              className="gold-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                width: '100%',
                background: 'var(--gold)',
                border: 0,
                color: '#05101F',
                padding: '9px 12px',
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              <Icon name="plus" size={14} sw={1.8} />
              New Topic
            </button>
            <div style={{ padding: '2px 4px 8px' }}>
              <span className="eyb">Subjects</span>
            </div>
            {d.topicGroups.map((tg) => (
              <div key={tg.key}>
                <button
                  onClick={tg.toggle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    margin: '4px 0 8px',
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                    padding: '2px 0',
                  }}
                >
                  <span style={{ color: 'var(--gold-ink)', fontSize: 12, width: 12, display: 'flex', justifyContent: 'center' }}>
                    {tg.chevron}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 10, letterSpacing: '.12em', color: 'var(--gold-ink)', textTransform: 'uppercase' }}
                  >
                    {tg.subject}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: 9,
                      color: 'var(--muted)',
                      background: 'var(--chip)',
                      border: '1px solid var(--line)',
                      padding: '0 6px',
                      borderRadius: 2,
                    }}
                  >
                    {tg.count}
                  </span>
                  <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                </button>
                {tg.expanded
                  ? tg.items.map((tp) => (
                      <button
                        key={tp.key}
                        onClick={tp.open}
                        className="border-gold-hover"
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          width: '100%',
                          textAlign: 'left',
                          background: 'var(--panel)',
                          border: '1px solid var(--line)',
                          borderLeft: '3px solid var(--gold)',
                          borderRadius: 2,
                          padding: '10px 12px',
                          marginBottom: 8,
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            flex: 'none',
                            width: 22,
                            height: 22,
                            borderRadius: 3,
                            background: tp.color,
                            color: tp.ink,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 9,
                            fontWeight: 700,
                            marginTop: 1,
                          }}
                        >
                          {tp.initials}
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.3 }}>
                            {tp.title}
                          </span>
                          <span className="mono" style={{ display: 'block', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                            {tp.when} · {tp.countLabel}
                          </span>
                        </span>
                        {tp.hasMedia ? (
                          <span
                            title={`${tp.mediaType} attached`}
                            style={{ flex: 'none', color: 'var(--gold-ink)', display: 'flex', marginTop: 1 }}
                          >
                            <Icon name="film" size={14} sw={1.8} />
                          </span>
                        ) : null}
                      </button>
                    ))
                  : null}
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.45, padding: '6px 4px 0' }}>
              Post in the channel to start a topic — file it under a subject to keep everything on that theme together, even
              months apart.
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
