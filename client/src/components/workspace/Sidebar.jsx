/**
 * Workspace — Sidebar
 */
import { motion } from 'framer-motion';
import useAppStore from '../../stores/appStore';

const navItems = [
  { id: 'new-video', icon: '➕', label: 'New Video' },
  { id: 'projects', icon: '📂', label: 'Projects' },
  { id: 'exports', icon: '📥', label: 'Exports' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 199,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          marginBottom: 'var(--space-lg)',
        }}>
          <span style={{ fontSize: '1.4rem' }}>🎬</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            VidSlides
          </span>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Bottom info */}
        <div style={{
          padding: 'var(--space-md)',
          borderTop: '1px solid var(--border-subtle)',
          color: 'var(--text-tertiary)',
          fontSize: '0.75rem',
        }}>
          VidSlides v1.0 · Layer 1 Engine
        </div>
      </aside>
    </>
  );
}
