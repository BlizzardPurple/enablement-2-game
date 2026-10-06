export default function GameHUD({ score, streak, phase, phaseTimer, activePowerup, e2Active }) {
  const timerSec = Math.ceil(phaseTimer / 1000);
  const timerPct = phaseTimer / (
    phase === 'TUTORIAL' ? 15000 :
    phase === 'MANUAL' ? 30000 :
    phase === 'POWERUP' ? 25000 :
    phase === 'E2' ? 20000 : 1
  ) * 100;

  const phaseLabel = {
    TUTORIAL: 'TUTORIAL',
    MANUAL: 'PHASE 1 — MANUAL',
    POWERUP: 'PHASE 2 — POWERUP',
    E2: 'PHASE 3 — ENABLEMENT 2.0',
  }[phase] || '';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius)',
      border: `1px solid ${e2Active ? 'var(--n-turquoise)' : 'rgba(255,255,255,0.06)'}`,
      boxShadow: e2Active ? 'var(--shadow-glow)' : 'none',
      transition: 'all 0.3s',
    }}>
      {/* Phase */}
      <div>
        <div style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: e2Active ? 'var(--n-turquoise)' : 'var(--text-muted)',
          fontWeight: 700,
        }}>
          {phaseLabel}
        </div>
        {activePowerup && (
          <div style={{ fontSize: '0.72rem', color: 'var(--n-orange)', marginTop: 2 }}>
            {activePowerup.icon} {activePowerup.name}
          </div>
        )}
      </div>

      {/* Timer bar */}
      <div style={{ flex: 1, margin: '0 20px', maxWidth: 300 }}>
        <div style={{
          height: 8,
          background: 'var(--bg-dark)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${timerPct}%`,
            background: timerPct < 25
              ? 'var(--n-pink)'
              : e2Active
              ? 'var(--n-turquoise)'
              : 'var(--n-purple)',
            borderRadius: 4,
            transition: 'width 0.1s linear, background 0.3s',
          }} />
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 3,
        }}>
          {timerSec}s
        </div>
      </div>

      {/* Score + Streak */}
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {score.toLocaleString()}
        </div>
        {streak > 1 && (
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--streak)',
            fontWeight: 700,
            marginTop: 2,
          }}>
            🔥 {streak}× streak
          </div>
        )}
      </div>
    </div>
  );
}
