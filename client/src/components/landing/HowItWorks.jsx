/**
 * Landing Page — How It Works
 */
import { motion } from 'framer-motion';

const steps = [
  { num: '1', title: 'Paste URL', desc: 'Drop any YouTube link into VidSlides. We support all video lengths.' },
  { num: '2', title: 'Extract Slides', desc: 'Our engine detects scene changes and extracts key frames automatically.' },
  { num: '3', title: 'Download', desc: 'Select slides you want, download as PDF or PowerPoint. Done.' },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: 'var(--space-4xl) var(--space-xl)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          How It Works
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Three simple steps. No complexity.
        </p>
      </motion.div>

      <div className="steps-container">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="step-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="step-number">{step.num}</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              {step.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
