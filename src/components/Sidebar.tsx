// ============================================================
// Sidebar — left workspace rail: header, search/notif/theme row,
// channel + DM lists, footer nav, and the "me" card.
// Ported 1:1 from the hi-fi prototype markup (lines 42-104).
// ============================================================
import { Icon } from '../lib/Icon'
import { useWorkspace } from '../store/WorkspaceContext'
import { useDerived } from '../store/useDerived'

export function Sidebar() {
  const w = useWorkspace()
  const d = useDerived()

  return (
    <div
      style={{
        width: 264,
        flex: 'none',
        background: 'var(--panel-2)',
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* ---- workspace header ---- */}
      <div
        style={{
          height: 60,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 16px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            height: 34,
            width: 34,
            flex: 'none',
            borderRadius: 3,
            background: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#05101F', display: 'flex' }}>
            <Icon name="zap" size={20} />
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="perf" style={{ fontSize: 13, color: 'var(--text-strong)', lineHeight: 1.1 }}>
            Odyssey Performance
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--muted)' }}>
            STAFF WORKSPACE
          </div>
        </div>
      </div>

      {/* ---- action row ---- */}
      <div style={{ display: 'flex', gap: 7, padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>
        <button
          onClick={w.openSearch}
          className="ghost"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--input)',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
            padding: '7px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          <Icon name="search" size={16} sw={1.8} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search</span>
          <span className="mono" style={{ fontSize: 10, border: '1px solid var(--line)', padding: '1px 4px', borderRadius: 2 }}>
            ⌘K
          </span>
        </button>
        <button
          onClick={w.openNotif}
          className="ghost"
          style={{
            position: 'relative',
            width: 36,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--input)',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Icon name="bell" size={16} sw={1.8} />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: d.notifDot,
            }}
          />
        </button>
        <button
          onClick={w.toggleTheme}
          className="ghost-gold"
          style={{
            width: 36,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--input)',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Icon name={d.isLight ? 'moon' : 'sun'} size={17} sw={1.8} />
        </button>
      </div>

      {/* ---- scroll area: channels + dms ---- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
          <span className="eyb">Channels</span>
          <button
            onClick={() => w.openModal('', '')}
            className="ghost-gold"
            style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer', display: 'flex' }}
          >
            <Icon name="plus" size={16} sw={1.8} />
          </button>
        </div>
        {d.chans.map((c) => (
          <button
            key={c.id}
            onClick={c.select}
            className="row-hover"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              width: '100%',
              textAlign: 'left',
              border: 0,
              cursor: 'pointer',
              padding: '7px 10px 7px 14px',
              borderRadius: 2,
              marginBottom: 1,
              background: c.rowBg,
            }}
          >
            <span style={{ position: 'absolute', left: 0, top: 5, bottom: 5, width: 3, background: c.barColor }} />
            <span style={{ color: 'var(--faint2)', display: 'flex' }}>
              <Icon name="hash" size={16} sw={1.8} />
            </span>
            <span style={{ flex: 1, fontSize: 14, ...c.nameStyle }}>{c.name}</span>
            {c.isUnread ? (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', flex: 'none' }} />
            ) : null}
          </button>
        ))}

        <div style={{ height: 16 }} />
        <div style={{ padding: '0 8px 8px' }}>
          <span className="eyb">Direct Messages</span>
        </div>
        {d.dms.map((dd) => (
          <button
            key={dd.id}
            onClick={dd.select}
            className="row-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              border: 0,
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 2,
              marginBottom: 1,
              background: dd.rowBg,
            }}
          >
            <span style={{ position: 'relative', flex: 'none' }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 3,
                  background: dd.color,
                  color: dd.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {dd.initials}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  border: '2px solid var(--panel-2)',
                  background: dd.presenceColor,
                }}
              />
            </span>
            <span style={{ flex: 1, fontSize: 14, ...dd.nameStyle }}>{dd.name}</span>
          </button>
        ))}
      </div>

      {/* ---- footer nav ---- */}
      <div style={{ flex: 'none', borderTop: '1px solid var(--line)', padding: 8 }}>
        <button
          onClick={() => w.setScreen('mytasks')}
          className="row-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            textAlign: 'left',
            border: 0,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 2,
            background: 'transparent',
            color: 'var(--text)',
          }}
        >
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <Icon name="list" size={16} sw={1.8} />
          </span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>My Tasks</span>
          <span
            className="mono"
            style={{
              minWidth: 20,
              textAlign: 'center',
              background: 'var(--gold)',
              color: '#05101F',
              fontSize: 11,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 2,
            }}
          >
            {d.myCountStr}
          </span>
        </button>
        <button
          onClick={() => w.setScreen('schedule')}
          className="row-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            textAlign: 'left',
            border: 0,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 2,
            background: 'transparent',
            color: 'var(--muted)',
          }}
        >
          <span style={{ color: 'var(--gold)', display: 'flex' }}>
            <Icon name="cal" size={16} sw={1.8} />
          </span>
          <span style={{ flex: 1, fontSize: 14 }}>Schedule</span>
        </button>
        <button
          onClick={() => w.setScreen('saved')}
          className="row-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            textAlign: 'left',
            border: 0,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 2,
            background: 'transparent',
            color: 'var(--muted)',
          }}
        >
          <span style={{ display: 'flex' }}>
            <Icon name="bookmark" size={16} sw={1.8} />
          </span>
          <span style={{ flex: 1, fontSize: 14 }}>Saved</span>
          {d.hasSaved ? (
            <span
              className="mono"
              style={{
                minWidth: 20,
                textAlign: 'center',
                background: 'var(--chip)',
                border: '1px solid var(--line)',
                color: 'var(--muted)',
                fontSize: 11,
                padding: '1px 6px',
                borderRadius: 2,
              }}
            >
              {d.savedCount}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => w.setScreen('admin')}
          className="row-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            width: '100%',
            textAlign: 'left',
            border: 0,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 2,
            background: 'transparent',
            color: 'var(--muted)',
          }}
        >
          <span style={{ display: 'flex' }}>
            <Icon name="shield" size={16} sw={1.8} />
          </span>
          <span style={{ flex: 1, fontSize: 14 }}>Admin</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 10px 4px',
            marginTop: 4,
            borderTop: '1px solid var(--line)',
          }}
        >
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
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {d.meInitials}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{d.meName}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>
              SALES · ONLINE
            </div>
          </div>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
        </div>
      </div>
    </div>
  )
}
