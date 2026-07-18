import { WorkspaceProvider } from './store/WorkspaceContext'
import { useDerived } from './store/useDerived'
import { useWorkspace } from './store/WorkspaceContext'
import { Icon } from './lib/Icon'
import { Sidebar } from './components/Sidebar'
import { ChatView } from './components/ChatView'
import { MyTasksView } from './components/MyTasksView'
import { ScheduleView } from './components/ScheduleView'
import { AdminView } from './components/AdminView'
import { SavedView } from './components/SavedView'
import { ThreadDrawer } from './components/ThreadDrawer'
import { CreateTaskModal } from './components/CreateTaskModal'
import { ClassModal } from './components/ClassModal'
import { TopicModal } from './components/TopicModal'
import { CommandBar } from './components/CommandBar'
import { NotificationsPanel } from './components/NotificationsPanel'
import { PinnedPanel } from './components/PinnedPanel'
import { MobileView } from './components/MobileView'
import { Toast } from './components/Toast'

function AppInner() {
  const d = useDerived()
  const w = useWorkspace()

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--app-bg)',
        color: 'var(--text)',
        overflow: 'hidden',
      }}
    >
      {d.isDesktop && (
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <Sidebar />
          {/* main area — all screens live in this relative container */}
          <div style={{ flex: 1, display: 'flex', minWidth: 0, position: 'relative' }}>
            {d.isChat && <ChatView />}
            {d.isMyTasks && <MyTasksView />}
            {d.isAdmin && <AdminView />}
            {d.isSchedule && <ScheduleView />}
            {d.isSaved && <SavedView />}
            {d.threadShow && <ThreadDrawer />}
          </div>
        </div>
      )}

      {d.isMobile && <MobileView />}

      {/* floating mobile-preview toggle (desktop only) */}
      {d.isDesktop && (
        <button
          onClick={w.toggleMobile}
          title="Mobile preview"
          className="ghost-gold"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
            padding: '8px 12px',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Icon name="phone" size={16} />
          Mobile
        </button>
      )}

      {/* fixed overlays — each renders null when closed */}
      <CreateTaskModal />
      <ClassModal />
      <TopicModal />
      <CommandBar />
      <NotificationsPanel />
      <PinnedPanel />
      <Toast />
    </div>
  )
}

export function App() {
  return (
    <WorkspaceProvider>
      <AppInner />
    </WorkspaceProvider>
  )
}
