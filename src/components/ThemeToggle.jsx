export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        cursor: 'pointer', fontSize: '1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
