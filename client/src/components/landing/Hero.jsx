import '../../styles/landingUI.css';

const presenterThumb =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80';
const heroVideoImage =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

const benefits = [
  {
    label: 'Fast & Accurate',
    accent: 'purple',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'AI Summaries',
    accent: 'green',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 12H16M12 8V16M4.5 9.5C4.5 5.91015 7.41015 3 11 3H13C16.5899 3 19.5 5.91015 19.5 9.5V14.5C19.5 18.0899 16.5899 21 13 21H11C7.41015 21 4.5 18.0899 4.5 14.5V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Easy Export',
    accent: 'amber',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const previewCards = [
  {
    title: '1. Introduction',
    variant: 'mountains',
    widths: ['72%', '52%', '58%'],
  },
  {
    title: '2. Key Concepts',
    variant: 'pie',
    widths: ['82%', '62%', '70%'],
  },
  {
    title: '3. Important Points',
    variant: 'bars',
    widths: ['74%', '58%', '66%'],
  },
];

function BenefitItem({ benefit }) {
  return (
    <div className="hero-benefit">
      <span className={`hero-benefit-icon ${benefit.accent}`}>{benefit.icon}</span>
      <span>{benefit.label}</span>
    </div>
  );
}

function SlideVisual({ variant }) {
  if (variant === 'pie') {
    return (
      <div className="slide-visual pie">
        <div className="slide-pie-chart" />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className="slide-visual bars">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className="slide-visual mountains">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60L18 22L30 32L50 12L66 27L84 8L100 30V60H0Z" fill="#D9D0FF" />
        <path d="M0 60L22 38L36 46L55 24L67 32L83 18L100 36V60H0Z" fill="#A88CFF" />
        <path d="M0 60L26 44L38 47L58 33L72 37L89 25L100 34V60H0Z" fill="#6D41FF" />
      </svg>
    </div>
  );
}

function PreviewCard({ title, variant, widths, muted = false }) {
  return (
    <div className={`hero-slide-card${muted ? ' muted' : ''}`}>
      <div className="hero-slide-copy">
        <h4>{title}</h4>
        <div className="hero-slide-lines">
          {widths.map((width) => (
            <div key={width} className="hero-slide-line">
              <span className="hero-slide-dot" />
              <span style={{ width }} />
            </div>
          ))}
        </div>
      </div>
      {!muted && <SlideVisual variant={variant} />}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <div className="hero-chip-row">
          <span className="hero-chip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3L13.9 8.1L19 10L13.9 11.9L12 17L10.1 11.9L5 10L10.1 8.1L12 3Z" fill="currentColor" />
            </svg>
            AI Powered
          </span>
          <span className="hero-chip-separator" />
          <span className="hero-chip">
            Built for YouTube
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21.58 7.19C21.35 6.35 20.7 5.69 19.86 5.46C18.32 5 12 5 12 5C12 5 5.68 5 4.14 5.46C3.3 5.69 2.65 6.35 2.42 7.19C2 8.74 2 12 2 12C2 12 2 15.26 2.42 16.81C2.65 17.65 3.3 18.31 4.14 18.54C5.68 19 12 19 12 19C12 19 18.32 19 19.86 18.54C20.7 18.31 21.35 17.65 21.58 16.81C22 15.26 22 12 22 12C22 12 22 8.74 21.58 7.19Z" fill="#FF2424" />
              <path d="M10 15.5V8.5L16 12L10 15.5Z" fill="white" />
            </svg>
          </span>
        </div>

        <div className="hero-title-wrap">
          <h1 className="hero-title">
            Turn <span>YouTube</span>
            <svg className="hero-title-youtube" width="60" height="43" viewBox="0 0 60 43" fill="none" aria-hidden="true">
              <rect width="60" height="43" rx="12" fill="#FF2B20" />
              <path d="M25 12.8L41.5 21.5L25 30.2V12.8Z" fill="white" />
            </svg>
            <br />
            Videos into Slides -
            <br />
            <span>Your Way</span>
          </h1>

          <svg className="hero-scribble" width="145" height="67" viewBox="0 0 145 67" fill="none" aria-hidden="true">
            <path d="M3.5 46C16.5 49.5 44 50 56 30.5C61.5 21.5 57 11.5 48 10.5C36.5 9.2 32.1 21.1 37.2 31.5C42.1 41.6 63.3 45.3 90.2 36.9C106.8 31.7 121 22.4 139.5 7.5" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M125 7.5H139.5V22" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="hero-description">
          Paste a YouTube link and get slides in the format
          <br />
          that works best for you.
        </p>

        <div className="hero-input-shell">
          <label className="hero-input-icon" htmlFor="youtube-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 13C10.56 13.56 11.33 13.91 12.18 13.91C13.03 13.91 13.79 13.57 14.36 13L17.89 9.47C19.06 8.3 19.06 6.4 17.89 5.23C16.72 4.06 14.82 4.06 13.65 5.23L11.63 7.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11C13.44 10.44 12.67 10.09 11.82 10.09C10.97 10.09 10.21 10.43 9.64 11L6.11 14.53C4.94 15.7 4.94 17.6 6.11 18.77C7.28 19.94 9.18 19.94 10.35 18.77L12.36 16.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
          <input id="youtube-link" type="text" placeholder="Paste YouTube video link here..." />
          <button type="button" className="hero-generate-button">
            <span>Generate Slides</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="hero-benefits">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit.label} benefit={benefit} />
          ))}
        </div>

        <div className="hero-proof-bar">
          <div className="hero-rating-block">
            <div className="hero-avatars" aria-hidden="true">
              <img src="https://i.pravatar.cc/100?img=11" alt="" />
              <img src="https://i.pravatar.cc/100?img=32" alt="" />
              <img src="https://i.pravatar.cc/100?img=13" alt="" />
              <img src="https://i.pravatar.cc/100?img=47" alt="" />
            </div>
            <div className="hero-rating-copy">
              <div className="hero-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg key={index} width="15" height="15" viewBox="0 0 24 24" fill="#F8B62D">
                    <path d="M12 2L14.9 8.18L22 9.24L17 14.1L18.18 21.02L12 17.59L5.82 21.02L7 14.1L2 9.24L9.1 8.18L12 2Z" />
                  </svg>
                ))}
              </div>
              <p>4.8/5 from 1,200+ users</p>
            </div>
          </div>

          <div className="hero-proof-divider" />

          <div className="hero-generated-block">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M6.75 20.5C4.83 22.02 4 25.25 4 25.25C4 25.25 7.24 24.43 8.75 22.5" stroke="#8D73FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 23C12.08 24.52 11.25 27.75 11.25 27.75C11.25 27.75 14.49 26.93 16 25" stroke="#8D73FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21.25 20.5C23.17 22.02 24 25.25 24 25.25C24 25.25 20.76 24.43 19.25 22.5" stroke="#8D73FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 13.5V9.5C9 6.74 11.24 4.5 14 4.5C16.76 4.5 19 6.74 19 9.5V13.5" stroke="#8D73FF" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div>
              <strong>10,000+</strong>
              <span>Slides Generated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-preview-stage">
        <div className="hero-preview-shell">
          <div className="hero-preview-stars" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#8D73FF"><path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" /></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#B7A4FF"><path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" /></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#7C5CFF"><path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" /></svg>
          </div>

          <div className="hero-video-panel">
            <div className="hero-video-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21.58 7.19C21.35 6.35 20.7 5.69 19.86 5.46C18.32 5 12 5 12 5C12 5 5.68 5 4.14 5.46C3.3 5.69 2.65 6.35 2.42 7.19C2 8.74 2 12 2 12C2 12 2 15.26 2.42 16.81C2.65 17.65 3.3 18.31 4.14 18.54C5.68 19 12 19 12 19C12 19 18.32 19 19.86 18.54C20.7 18.31 21.35 17.65 21.58 16.81C22 15.26 22 12 22 12C22 12 22 8.74 21.58 7.19Z" fill="#FF2B20" />
                <path d="M10 15.5V8.5L16 12L10 15.5Z" fill="white" />
              </svg>
              <span>YouTube Video</span>
            </div>

            <div className="hero-video-frame">
              <img src={heroVideoImage} alt="Mountain lake YouTube preview" className="hero-video-image" />
              <div className="hero-video-overlay" />
              <button type="button" className="hero-play-button" aria-label="Play preview">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              </button>

              <div className="hero-video-controls">
                <div className="hero-progress-track">
                  <span className="hero-progress-fill" />
                </div>
                <div className="hero-controls-row">
                  <div className="hero-controls-left">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5V19L19 12L8 5Z" />
                    </svg>
                    <span>04:25 / 16:30</span>
                  </div>
                  <div className="hero-controls-right" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M4 9V15H8L13 19V5L8 9H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 9C18.3333 10.3333 18.3333 13.6667 17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M19.5 6.5C22.1667 9.16667 22.1667 14.8333 19.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8.5V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M9 3H5C3.9 3 3 3.9 3 5V9M15 3H19C20.1 3 21 3.9 21 5V9M21 15V19C21 20.1 20.1 21 19 21H15M9 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="button" className="hero-transfer-button" aria-label="Move to slides preview">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="hero-slides-panel">
            <h3>Your Slides Preview</h3>
            <div className="hero-slides-stack">
              {previewCards.map((card) => (
                <PreviewCard key={card.title} {...card} />
              ))}
              <PreviewCard title="4. Conclusion" widths={['50%']} muted />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
