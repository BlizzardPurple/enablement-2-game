import { useState, useEffect } from 'react';

const KEY = 'cc-lb';
const getLB = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const saveLB = (n, s) => { const lb = getLB(); lb.push({ name: n, score: s, d: new Date().toLocaleDateString() }); lb.sort((a, b) => b.score - a.score); localStorage.setItem(KEY, JSON.stringify(lb.slice(0, 10))); };

export default function ScoreScreen({ score, oldScore, newScore, onAgain, theme }) {
  const [step, setStep] = useState(0); // 0=old, 1=new, 2=multiplier, 3=name
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [lb, setLb] = useState(getLB());

  // newScore doubled (E2 time was half)
  const boostedNew = Math.max(1, newScore * 2);
  const safeOld = Math.max(1, oldScore);
  const multiplier = (boostedNew / safeOld).toFixed(1);

  // Step through animations
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2400);
    const t3 = setTimeout(() => setStep(3), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const save = () => { if (!name.trim()) return; saveLB(name.trim(), score); setLb(getLB()); setSaved(true); };

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'Inter,sans-serif', padding: '2rem',
      position: 'relative',
    }}>
      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <button onClick={theme.toggle} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{theme.dark ? '☀️' : '🌙'}</button>
      </div>

      {/* Comparison cards */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '2rem' }}>

        {/* OLD FLOW — left */}
        <div style={{
          textAlign: 'center',
          opacity: step >= 0 ? 1 : 0,
          transform: step >= 0 ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.8)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--n-pink)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Old Flow
          </div>
          <div style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1,
            color: 'var(--n-pink)',
          }}>
            {safeOld.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '0.3rem' }}>Manual (40s)</div>
        </div>

        {/* VS divider */}
        <div style={{
          fontSize: '1.2rem', fontWeight: 800, color: 'var(--text3)',
          opacity: step >= 1 ? 1 : 0,
          transition: 'opacity 0.5s',
        }}>vs</div>

        {/* NEW FLOW — right */}
        <div style={{
          textAlign: 'center',
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.8)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--n-turquoise)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Enablement 2.0
          </div>
          <div style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1,
            color: 'var(--n-turquoise)',
            textShadow: '0 0 20px rgba(57,196,195,0.3)',
          }}>
            {boostedNew.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '0.3rem' }}>AI Assist (20s) × 2</div>
        </div>
      </div>

      {/* Multiplier — center, big */}
      <div style={{
        textAlign: 'center', marginBottom: '2.5rem',
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? 'scale(1)' : 'scale(0.3)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {multiplier}×
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text2)', fontWeight: 600, marginTop: '0.3rem' }}>
          more productive with AI
        </div>
      </div>

      {/* Name entry + leaderboard */}
      <div style={{
        opacity: step >= 3 ? 1 : 0,
        transform: step >= 3 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out',
        width: '100%', maxWidth: 500, textAlign: 'center',
      }}>
        {/* Total score */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>
          Total: {score.toLocaleString()} pts
        </div>

        {!saved ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="Enter your name" maxLength={16} autoFocus
              style={{
                flex: 1, maxWidth: 280, padding: '12px 14px', fontSize: '1rem',
                background: 'var(--bg2)', color: 'var(--text)',
                border: '2px solid var(--n-turquoise)', borderRadius: 8, outline: 'none', fontFamily: 'inherit',
              }} />
            <button onClick={save} style={{
              padding: '12px 24px', fontWeight: 800, color: '#fff',
              background: 'var(--n-turquoise)', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem',
            }}>Save</button>
          </div>
        ) : (
          <div>
            <button onClick={onAgain} style={{
              padding: '14px 48px', fontWeight: 800, fontSize: '1.1rem',
              color: '#fff', background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
              border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 20px var(--glow)',
            }}>Play Again</button>

            {/* Mini leaderboard */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--n-purple)', fontWeight: 700, marginBottom: '.5rem' }}>🏆 Top 5</div>
              {lb.slice(0, 5).map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '6px 12px',
                  background: i === 0 ? 'rgba(57,196,195,0.08)' : 'transparent',
                  borderRadius: 6, fontSize: '.9rem',
                }}>
                  <span style={{ color: 'var(--text2)' }}>{i + 1}. {e.name}</span>
                  <span style={{ fontWeight: 800, color: 'var(--n-turquoise)' }}>{e.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
