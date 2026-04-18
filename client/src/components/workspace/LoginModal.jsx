/**
 * Workspace — Login Modal (Free Usage Gate)
 */
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/appStore';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAppStore();

  const benefits = [
    { icon: '🎬', text: 'Unlimited video conversions' },
    { icon: '💾', text: 'Saved projects & history' },
    { icon: '📄', text: 'PDF & PPT export' },
    { icon: '📝', text: 'AI-generated notes' },
  ];

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Lock icon */}
            <div style={{
              width: '64px', height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
              margin: '0 auto var(--space-lg)',
            }}>
              🔓
            </div>

            <h2 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
              Unlock Unlimited Slides
            </h2>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              marginBottom: 'var(--space-xl)',
            }}>
              You've used your free conversion. Sign in to continue.
            </p>

            {/* Benefits */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
              marginBottom: 'var(--space-xl)',
            }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{b.icon}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => login('User')}
              >
                Sign In
              </button>
              <button
                className="btn btn-ghost"
                style={{ width: '100%' }}
                onClick={() => setShowLoginModal(false)}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
