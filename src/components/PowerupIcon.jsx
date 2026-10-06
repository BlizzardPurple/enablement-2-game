/**
 * Game-style SVG icons for powerups. No emojis.
 */
const ICONS = {
  shield: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11 5.17-.85 9-5.75 9-11V7L12 2z" fill="var(--n-turquoise)" opacity="0.9"/>
      <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11 5.17-.85 9-5.75 9-11V7L12 2z" stroke="#fff" strokeWidth="1.5" fill="none"/>
      <path d="M10 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <circle cx="12" cy="13" r="8" fill="var(--n-orange)" opacity="0.9"/>
      <circle cx="12" cy="13" r="8" stroke="#fff" strokeWidth="1.5" fill="none"/>
      <path d="M12 9v4l3 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 2h6M12 2v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  bonus: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--streak)" opacity="0.9"/>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#fff" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  slow: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <circle cx="12" cy="12" r="9" fill="var(--n-purple)" opacity="0.9"/>
      <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.5" fill="none"/>
      <rect x="8" y="7" width="3" height="10" rx="1" fill="#fff"/>
      <rect x="13" y="7" width="3" height="10" rx="1" fill="#fff"/>
    </svg>
  ),
};

export default function PowerupIcon({ type, size = 24 }) {
  return (
    <span style={{ display: 'inline-block', width: size, height: size, verticalAlign: 'middle' }}>
      {ICONS[type] || null}
    </span>
  );
}
