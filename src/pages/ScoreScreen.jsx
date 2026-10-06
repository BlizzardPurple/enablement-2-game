import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

const LB_KEY = 'cc-leaderboard';
const getLB = () => { try { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); } catch { return []; } };
const saveLB = (name, score) => {
  const lb = getLB();
  lb.push({ name, score, date: new Date().toLocaleDateString() });
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0, 10)));
};

export default function ScoreScreen({ score, correct, wrong, drops, bestStreak, onRestart, theme }) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [lb, setLb] = useState(getLB());
  const isHigh = lb.length === 0 || score > (lb[0]?.score || 0);

  const save = () => { if (!name.trim()) return; saveLB(name.trim(), score); setLb(getLB()); setSaved(true); };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(120,46,255,0.06), transparent 50%), var(--bg)',
    }}>
      <div style={{ position: 'absolute', top: 16, right: 16 }}><ThemeToggle dark={theme.dark} onToggle={theme.toggle} /></div>

      <div style={{ display: 'flex', gap: '3rem', maxWidth: 960, width: '100%' }}>
        {/* Left — score */}
        <div style={{ flex: 1 }}>
          {/* Victory robot */}
          <img
            src={`/assets/kenney/robot-pack/Side view/robot_red${isHigh ? 'Jump' : 'Body'}.png`}
            alt="" style={{ width: 64, marginBottom: '0.75rem', animation: 'float 2s ease-in-out infinite' }}
          />

          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--n-turquoise)', fontWeight: 700 }}>
            {isHigh ? '🏆 New High Score!' : 'Mission Complete'}
          </div>

          <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem' }}>
            {score.toLocaleString()}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {[
              { l: 'Correct', v: correct, c: 'var(--correct)' },
              { l: 'Wrong', v: wrong, c: 'var(--wrong)' },
              { l: 'Dropped', v: drops, c: 'var(--n-pink)' },
              { l: 'Best Streak', v: `${bestStreak}×`, c: 'var(--streak)' },
            ].map(s => (
              <div key={s.l} style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {!saved ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
                placeholder="Your name" maxLength={16} autoFocus
                style={{
                  flex: 1, padding: '12px 14px', fontSize: '1rem',
                  background: 'var(--bg-card)', color: 'var(--text)',
                  border: '2px solid var(--n-turquoise)', borderRadius: 8, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button onClick={save} style={{
                padding: '12px 20px', fontWeight: 800, color: '#fff',
                background: 'var(--n-turquoise)', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '1rem',
              }}>Save</button>
            </div>
          ) : (
            <button onClick={onRestart} style={{
              width: '100%', padding: '14px', fontWeight: 800, fontSize: '1.1rem',
              color: '#fff', background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            }}>Play Again</button>
          )}
        </div>

        {/* Right — leaderboard */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--n-purple)', fontWeight: 700, marginBottom: '0.75rem' }}>
            🏆 Leaderboard
          </div>
          {lb.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No scores yet!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {lb.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', background: i === 0 ? 'rgba(57,196,195,0.1)' : 'var(--bg-card)',
                  borderRadius: 8, border: i === 0 ? '1px solid var(--n-turquoise)' : '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: i === 0 ? 'var(--n-turquoise)' : i === 1 ? 'var(--n-purple)' : i === 2 ? 'var(--n-orange)' : 'var(--text-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 900, color: '#fff',
                    }}>{i + 1}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{e.name}</span>
                  </div>
                  <span style={{ fontWeight: 900, color: 'var(--n-turquoise)', fontSize: '0.95rem' }}>{e.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
