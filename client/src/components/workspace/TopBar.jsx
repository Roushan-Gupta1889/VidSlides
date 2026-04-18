/**
 * Workspace — TopBar
 */
import useAppStore from '../../stores/appStore';

export default function TopBar() {
  const { isLoggedIn, user, login, logout, setSidebarOpen } = useAppStore();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile hamburger */}
        <button
          className="btn btn-ghost btn-icon"
          style={{ display: 'none' }}
          onClick={() => setSidebarOpen(true)}
          id="mobile-menu-btn"
        >
          ☰
        </button>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          Workspace
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 600,
            }}>
              {user?.avatar || 'U'}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {user?.name || 'User'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => login('User')}>
            Sign In
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
