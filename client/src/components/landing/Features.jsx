/**
 * Landing Page — Features Section
 */
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎯',
    title: 'Smart Scene Detection',
    desc: 'AI-powered frame extraction detects scene changes automatically — no manual scrubbing.',
  },
  {
    icon: '📄',
    title: 'PDF & PPT Export',
    desc: 'Download slides as polished PDF documents or editable PowerPoint presentations.',
  },
  {
    icon: '⚡',
    title: 'Instant Caching',
    desc: 'Already processed? Get results instantly. Same video = zero wait time.',
  },
  {
    icon: '🧩',
    title: 'Chunk Processing',
    desc: 'Long videos are split into chunks and processed in parallel for maximum speed.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section
      id="features"
      style={{ padding: 'var(--space-4xl) var(--space-xl)', background: 'var(--bg-secondary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Everything You Need
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          From paste to presentation in minutes, not hours.
        </p>
      </motion.div>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="card card-glow"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              marginBottom: 'var(--space-md)',
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              {f.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
