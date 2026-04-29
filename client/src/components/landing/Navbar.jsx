import '../../styles/landingUI.css';

function BrandMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="42" height="42" rx="12" fill="url(#brand-bg)" fillOpacity="0.12" />
      <path d="M13 11.5C13 8.8346 15.8877 7.16826 18.1999 8.50365L32.1999 16.5879C34.5121 17.9233 34.5121 21.256 32.1999 22.5914L18.1999 30.6756C15.8877 32.011 13 30.3447 13 27.6793V11.5Z" fill="url(#brand-fill)" />
      <defs>
        <linearGradient id="brand-bg" x1="2" y1="2" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8E77FF" />
          <stop offset="1" stopColor="#5F31FF" />
        </linearGradient>
        <linearGradient id="brand-fill" x1="13" y1="8" x2="33.9332" y2="31.1791" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A98EFF" />
          <stop offset="1" stopColor="#5F31FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#use-cases', label: 'Use Cases' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#blog', label: 'Blog' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  return (
    <header className="landing-navbar">
      <a className="landing-brand" href="#top" aria-label="VidSlides home">
        <BrandMark />
        <span className="landing-brand-text">
          Vid<span>Slides</span>
        </span>
      </a>

      <nav className="landing-nav-links" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="landing-nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="landing-nav-actions">
        <a href="#login" className="landing-login-link">
          Login
        </a>
        <a href="#cta" className="landing-cta-button">
          <span>Try VidSlides Free</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
