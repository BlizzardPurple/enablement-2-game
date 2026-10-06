export default function ScoreDisplay({ score, streak, timePct, timeLeftSec, e2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* Score — big arcade style */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '3rem', fontWeight: 900, lineHeight: 1,
          color: e2 ? 'var(--n-turquoise)' : 'var(--text)',
          textShadow: e2 ? '0 0 24px rgba(57,196,195,0.5)' : 'none',
          transition: 'all 0.3s', letterSpacing: '-0.02em',
        }}>
          {score.toLocaleString()}
        </div>
        {streak > 1 && (
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--streak)', marginTop: 2 }}>
            🔥 {streak}× streak
          </div>
        )}
      </div>

      {/* Timer */}
      <div style={{ width: 200 }}>
        <div style={{ height: 12, background: 'var(--bg-card)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${timePct}%`,
            background: timePct < 20 ? 'var(--n-pink)' : e2 ? 'var(--n-turquoise)' : 'var(--n-purple)',
            borderRadius: 6, transition: 'width 0.1s linear, background 0.3s',
          }} />
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
          {timeLeftSec}s
        </div>
      </div>
    </div>
  );
}
