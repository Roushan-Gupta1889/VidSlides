import '../../styles/landingUI.css';

const presenterThumb =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80';

const featureCards = [
  {
    key: 'visual',
    theme: 'blue',
    title: 'Visual Slides',
    description: 'Extract original frames from the video and turn them into slide by slide.',
    footer: 'Best for tutorials, walkthroughs & how-to videos',
    preview: 'visual',
  },
  {
    key: 'smart',
    theme: 'purple',
    title: 'Smart Slides',
    description: 'AI understands the content and creates clean, structured slides with key takeaways.',
    footer: 'Best for lectures, educational & informational videos',
    preview: 'smart',
  },
  {
    key: 'hybrid',
    theme: 'green',
    title: 'Hybrid Slides',
    description: 'Get original frames plus AI summaries together on each slide.',
    footer: 'Best of both worlds - visual + understanding',
    badge: 'BEST EXPERIENCE',
    preview: 'hybrid',
  },
];

function FeatureIcon({ theme }) {
  if (theme === 'purple') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3V6M12 18V21M5.64 5.64L7.76 7.76M16.24 16.24L18.36 18.36M3 12H6M18 12H21M5.64 18.36L7.76 16.24M16.24 7.76L18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 9.5C10 8.67 10.67 8 11.5 8H12.5C13.33 8 14 8.67 14 9.5V10.5C14 11.33 13.33 12 12.5 12H11.5C10.67 12 10 12.67 10 13.5V14.5C10 15.33 10.67 16 11.5 16H12.5C13.33 16 14 15.33 14 14.5V13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (theme === 'green') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M9 8.5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16.5H12.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowButton({ theme }) {
  return (
    <button type="button" className={`feature-arrow-button ${theme}`} aria-label="Learn more">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function FeaturePreview({ type, theme }) {
  if (type === 'smart') {
    return (
      <div className="feature-preview smart">
        <div className="feature-smart-card">
          <span className="feature-preview-label">Key Takeaways</span>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '82%' }} />
          </div>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '64%' }} />
          </div>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '72%' }} />
          </div>
          <div className="feature-smart-art">
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 60L25 24L42 38L62 14L78 28L100 18V60H0Z" fill="#DCCFFF" />
              <path d="M0 60L18 42L40 45L54 32L74 37L88 28L100 38V60H0Z" fill="#A98EFF" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'hybrid') {
    return (
      <div className="feature-preview hybrid">
        <div className="feature-hybrid-thumb">
          <img src={presenterThumb} alt="Presenter thumbnail" />
          <span className="feature-thumb-time">07:42</span>
        </div>
        <div className="feature-hybrid-copy">
          <span className="feature-preview-label green">Key Point</span>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '92%' }} />
          </div>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '76%' }} />
          </div>
          <div className="feature-bullet-line">
            <span className={`feature-bullet-dot ${theme}`} />
            <span style={{ width: '86%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-preview visual">
      {['03:15', '07:42', '12:30'].map((time) => (
        <div key={time} className="feature-visual-thumb">
          <img src={presenterThumb} alt="Presenter thumbnail" />
          <span className="feature-thumb-time">{time}</span>
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="section-divider">
        <span className="section-divider-spark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4L13.4 10.6L20 12L13.4 13.4L12 20L10.6 13.4L4 12L10.6 10.6L12 4Z" fill="currentColor" />
          </svg>
        </span>
        <h2 className="section-title">Choose Your Output Style</h2>
        <span className="section-divider-spark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4L13.4 10.6L20 12L13.4 13.4L12 20L10.6 13.4L4 12L10.6 10.6L12 4Z" fill="currentColor" />
          </svg>
        </span>
      </div>

      <div className="features-grid">
        {featureCards.map((card) => (
          <article key={card.key} className={`feature-card ${card.theme}`}>
            <div className="feature-card-top">
              <div className={`feature-icon-bubble ${card.theme}`}>
                <FeatureIcon theme={card.theme} />
              </div>
              <div className="feature-heading-block">
                <div className="feature-title-row">
                  <h3>{card.title}</h3>
                  {card.badge ? <span className="feature-badge">{card.badge}</span> : null}
                </div>
                <p>{card.description}</p>
              </div>
            </div>

            <FeaturePreview type={card.preview} theme={card.theme} />

            <div className={`feature-footer-chip ${card.theme}`}>{card.footer}</div>
            <ArrowButton theme={card.theme} />
          </article>
        ))}
      </div>

      <p className="loved-by">
        Loved by students, educators &amp; creators worldwide
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#7C5CFF" aria-hidden="true">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
        </svg>
      </p>
    </section>
  );
}
