/**
 * Landing Page — Hero Section
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroScene from './HeroScene';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero">
      <div className="landing-hero-bg">
        <HeroScene />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-primary) 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      <div className="landing-hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="badge badge-accent" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            ⚡ Powered by AI & Scene Detection
          </div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Turn YouTube Videos into{' '}
          <span className="gradient-text">Presentation Slides</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Paste any YouTube link. Get key frames extracted automatically.
          Download as PDF or PPT in seconds.
        </motion.p>

        <motion.div
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/workspace')}
            style={{ minWidth: '200px' }}
          >
            🚀 Try Free — No Signup
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See How It Works
          </button>
        </motion.div>

        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '48px',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <span>✅ No login required</span>
          <span>✅ PDF & PPT export</span>
          <span>✅ Works with any video</span>
        </motion.div>
      </div>
    </section>
  );
}
