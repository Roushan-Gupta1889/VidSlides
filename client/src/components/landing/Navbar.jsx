/**
 * Landing Page — Navbar
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="landing-nav"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🎬</span>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          VidSlides
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/workspace')}
        >
          Dashboard
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/workspace')}
        >
          Get Started — Free
        </button>
      </div>
    </motion.nav>
  );
}
