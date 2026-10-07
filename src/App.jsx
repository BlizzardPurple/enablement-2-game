import useGame from './hooks/useGame';
import useTheme from './hooks/useTheme';
import IntroScreen from './pages/IntroScreen';
import ScoreScreen from './pages/ScoreScreen';
import SCurveBelts from './components/SCurveBelts';
import SearchInput from './components/SearchInput';
import MicrowaveBoss from './components/MicrowaveBoss';
import Floats from './components/Floats';
import FactoryBG from './components/FactoryBG';
import PowerupIcon from './components/PowerupIcon';

export default function App() {
  const g = useGame();
  const theme = useTheme();

  if (g.phase === 'INTRO') return <IntroScreen onStart={g.start} theme={theme} />;
  if (g.phase === 'SCORE') return <ScoreScreen score={g.score} oldScore={g.oldScore} newScore={g.newScore} onAgain={() => g.setPhase('INTRO')} onHome={() => g.setPhase('INTRO')} theme={theme} />;

  const perf = g.streak >= 3 ? 'good' : g.drops > 2 ? 'bad' : 'ok';

  return (
    <div className={g.shaking ? 'shake' : ''} style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '10px 20px', gap: 6, position: 'relative',
      ...(g.e2 ? { boxShadow: 'inset 0 0 80px rgba(57,196,195,0.08)' } : {}),
      transition: 'box-shadow 0.5s',
    }}>
      <FactoryBG />

      {/* E2 flash */}
      {g.e2Flash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
            background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'e2flash 1.2s ease-out forwards',
            textAlign: 'center',
          }}>
            ⚡ ENABLEMENT 2.0
          </div>
        </div>
      )}

      {/* Powerup activation flash — smaller, orange */}
      {g.puFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'puflash 1s ease-out forwards',
          }}>
            <PowerupIcon type={g.puFlash.iconId} size={48} />
            <span style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 800,
              color: 'var(--n-orange)',
              textShadow: '0 0 20px rgba(255,148,8,0.4)',
            }}>
              {g.puFlash.name}
            </span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <MicrowaveBoss event={g.bossEvt} line={g.bossLine} elapsed={g.elapsed} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem', fontWeight: 900, lineHeight: 1,
              color: g.e2 ? 'var(--n-turquoise)' : 'var(--text)',
              textShadow: g.e2 ? '0 0 24px rgba(57,196,195,0.5)' : 'none',
            }}>{g.score.toLocaleString()}</div>
            {g.e2 && (
              <div style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--n-turquoise)', background: 'rgba(57,196,195,0.12)', padding: '2px 8px', borderRadius: 6, marginTop: 3, display: 'inline-block' }}>
                2× TIME BONUS
              </div>
            )}
            {g.doubleScore && !g.e2 && (
              <div style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--n-orange)', background: 'rgba(255,148,8,0.12)', padding: '2px 8px', borderRadius: 6, marginTop: 3, display: 'inline-block' }}>
                2× SCORE
              </div>
            )}
            {g.streak > 1 && <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--streak)', marginTop: 2 }}>🔥 {g.streak}×</div>}
          </div>
          <div style={{ width: 180 }}>
            <div style={{ height: 10, background: 'var(--bg2)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${g.pct}%`, background: g.pct < 20 ? 'var(--n-pink)' : g.e2 ? 'var(--n-turquoise)' : 'var(--n-purple)', borderRadius: 5, transition: 'width .1s linear' }} />
            </div>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text2)', textAlign: 'center', marginTop: 3 }}>{g.leftSec}s</div>
          </div>
          <button onClick={theme.toggle} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme.dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {g.pu && !g.e2 && (
        <div style={{ textAlign: 'center', fontSize: '.85rem', fontWeight: 800, color: 'var(--n-orange)', animation: 'pop 0.3s ease-out', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <PowerupIcon type={g.pu.iconId} size={18} /> {g.pu.name} Active
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, position: 'relative' }}>
        <SCurveBelts belt={g.belt} selUid={g.sel} onSel={uid => g.setSel(uid)}
          frozen={g.frozen} slow={g.slow} e2={g.e2} reversed={g.reversed} perf={perf} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10, zIndex: 10 }}>
        <SearchInput selItem={g.belt.items.find(i => i.uid === g.sel)} onMatch={g.match} e2={g.e2} />
      </div>

      <Floats items={g.floats} />
    </div>
  );
}
