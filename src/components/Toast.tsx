import { useDerived } from '../store/useDerived'
import { Icon } from '../lib/Icon'

// Transient bottom-center confirmation. Auto-dismissed by the store.
export function Toast() {
  const d = useDerived()
  if (!d.toastShow) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 70,
        background: 'var(--panel)',
        border: '1px solid var(--gold)',
        borderLeft: '4px solid var(--gold)',
        padding: '12px 18px',
        borderRadius: 2,
        boxShadow: '0 12px 30px -10px rgba(0,0,0,.7)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        animation: 'toastup .24s cubic-bezier(.2,.7,.2,1)',
      }}
    >
      <span style={{ color: 'var(--gold)', display: 'flex' }}>
        <Icon name="task" size={16} />
      </span>
      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.toast}</span>
    </div>
  )
}
