/**
 * Landing Page — Footer
 */

export default function Footer() {
  return (
    <footer style={{
      padding: 'var(--space-2xl) var(--space-xl)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-md)',
      color: 'var(--text-tertiary)',
      fontSize: '0.85rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>🎬</span>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>VidSlides</span>
      </div>
      <div>
        Built with ❤️ · YouTube to Slides, effortlessly.
      </div>
    </footer>
  );
}
