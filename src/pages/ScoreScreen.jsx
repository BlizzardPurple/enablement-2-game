import { useState, useEffect } from 'react';

const LB_KEY = 'enablement2-game-leaderboard';

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || '[]');
  } catch { return []; }
}

function saveScore(name, score) {
  const lb = getLeaderboard();
  lb.push({ name, score, date: new Date().toLocaleDateString() });
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0, 10)));
}

export default function ScoreScreen({ score, correct, wrong, drops, bestStreak, totalTime, onRestart }) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());

  const timeSec = Math.round(totalTime / 1000);

  const handleSave = () => {
    if (!name.trim()) return;
    saveScore(name.trim(), score);
    setLeaderboard(getLeaderboard());
    setSaved(true);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(120,46,255,0.06), transparent 60%), var(--bg-dark)',
    }}>
      <div style={{
        display: 'flex',
        gap: '3rem',
        maxWidth: 900,
        width: '100%',
      }}>
        {/* Score breakdown */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--n-turquoise)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Mission Complete
          </div>

          <div style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}>
            {score.toLocaleString()}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            {[
              { label: 'Correct', value: correct, color: 'var(--correct)' },
              { label: 'Wrong', value: wrong, color: 'var(--wrong)' },
              { label: 'Dropped', value: drops, color: 'var(--n-pink)' },
              { label: 'Best Streak', value: `${bestStreak}×`, color: 'var(--streak)' },
              { label: 'Total Time', value: `${timeSec}s`, color: 'var(--text-muted)' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '10px 14px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Name input */}
          {!saved ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Your name"
                maxLength={16}
                autoFocus
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-game)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--n-turquoise)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-game)',
                  color: '#fff',
                  background: 'var(--n-turquoise)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={onRestart}
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-game)',
                color: '#fff',
                background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Play Again
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--n-purple)',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            🏆 Leaderboard
          </div>

          {leaderboard.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No scores yet. Be the first!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {leaderboard.map((entry, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: i === 0 ? 'rgba(57,196,195,0.1)' : 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: i === 0 ? '1px solid var(--n-turquoise)' : '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--n-turquoise)' : i === 1 ? 'var(--n-purple)' : i === 2 ? 'var(--n-orange)' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{entry.name}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--n-turquoise)' }}>
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
