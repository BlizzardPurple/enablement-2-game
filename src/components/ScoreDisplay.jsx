export default function ScoreDisplay({ score, streak, timePct, timeLeftSec, e2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Score — arcade style */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '2.2rem', fontWeight: 900, lineHeight: 1,
          color: e2 ? 'var(--n-turquoise)' : 'var(--text)',
          textShadow: e2 ? '0 0 20px rgba(57,196,195,0.4)' : 'none',
          transition: 'all 0.3s',
        }}>
          {score.toLocaleString()}
        </div>
        {streak > 1 && (
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--streak)', marginTop: 2 }}>
            🔥 {streak}× streak
          </div>
        )}
      </div>

      {/* Timer */}
      <div style={{ flex: 1, maxWidth: 260 }}>
        <div style={{ height: 10, background: 'var(--bg-card)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${timePct}%`,
            background: timePct < 20 ? 'var(--n-pink)' : e2 ? 'var(--n-turquoise)' : 'var(--n-purple)',
            borderRadius: 5, transition: 'width 0.1s linear, background 0.3s',
          }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 3 }}>
          {timeLeftSec}s
        </div>
      </div>
    </div>
  );
}
