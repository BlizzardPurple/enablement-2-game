import useGame from './hooks/useGame';
import useTheme from './hooks/useTheme';
import IntroScreen from './pages/IntroScreen';
import E2Screen from './pages/E2Screen';
import ScoreScreen from './pages/ScoreScreen';
import SCurveBelts from './components/SCurveBelts';
import SearchInput from './components/SearchInput';
import MicrowaveBoss from './components/MicrowaveBoss';
import Floats from './components/Floats';
import FactoryBG from './components/FactoryBG';

export default function App() {
  const g = useGame();
  const theme = useTheme();

  if (g.phase === 'INTRO') return <IntroScreen onStart={g.start} theme={theme} />;
  if (g.phase === 'SCORE') return <ScoreScreen score={g.score} ok={g.ok} bad={g.bad} drops={g.drops} best={g.best} onAgain={() => g.setPhase('INTRO')} theme={theme} />;
  if (g.phase === 'E2_ACTIVATE') return <E2Screen onGo={g.activateE2} />;

  // Determine worker robot mood
  const perf = g.streak >= 3 ? 'good' : g.drops > 2 ? 'bad' : 'ok';

  return (
    <div className={g.shaking ? 'shake' : ''} style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '10px 20px', gap: 6, position: 'relative',
    }}>
      <FactoryBG />

      {/* Freeze overlay */}
      {g.freezeVfx && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none',
          background: 'rgba(57,196,195,0.06)', border: '4px solid rgba(57,196,195,0.25)',
          animation: 'glow 1s ease-in-out infinite',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '4rem', opacity: 0.2, animation: 'pulse 1s ease-in-out infinite' }}>❄️</div>
        </div>
      )}

      {/* Top bar: boss + score + theme */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <MicrowaveBoss event={g.bossEvt} line={g.bossLine} elapsed={g.elapsed} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem', fontWeight: 900, lineHeight: 1,
              color: g.e2 ? 'var(--n-turquoise)' : 'var(--text)',
              textShadow: g.e2 ? '0 0 24px rgba(57,196,195,0.5)' : 'none',
            }}>{g.score.toLocaleString()}</div>
            {g.streak > 1 && <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--streak)' }}>🔥 {g.streak}×</div>}
          </div>
          {/* Timer */}
          <div style={{ width: 180 }}>
            <div style={{ height: 10, background: 'var(--bg2)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${g.pct}%`, background: g.pct < 20 ? 'var(--n-pink)' : g.e2 ? 'var(--n-turquoise)' : 'var(--n-purple)', borderRadius: 5, transition: 'width .1s linear' }} />
            </div>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text2)', textAlign: 'center', marginTop: 3 }}>{g.leftSec}s</div>
          </div>
          {/* Theme toggle */}
          <button onClick={theme.toggle} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme.dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Active powerup banner */}
      {g.pu && (
        <div style={{ textAlign: 'center', fontSize: '.85rem', fontWeight: 800, color: 'var(--n-orange)', animation: 'pop 0.3s ease-out', zIndex: 10 }}>
          {g.pu.icon} {g.pu.name} Active
        </div>
      )}

      {/* E2 banner */}
      {g.e2 && (
        <div style={{ textAlign: 'center', fontSize: '.8rem', fontWeight: 800, color: 'var(--n-turquoise)', letterSpacing: '.12em', textTransform: 'uppercase', animation: 'glow 2s ease-in-out infinite', zIndex: 10 }}>
          🚀 ENABLEMENT 2.0 — AI ASSIST
        </div>
      )}

      {/* S-Curve Belts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10, position: 'relative' }}>
        <SCurveBelts belt={g.belt} selUid={g.sel} onSel={uid => g.setSel(uid)}
          frozen={g.frozen} slow={g.slow} e2={g.e2} reversed={g.reversed} perf={perf} />
      </div>

      {/* Search */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10, zIndex: 10 }}>
        <SearchInput selItem={g.belt.items.find(i => i.uid === g.sel)} onMatch={g.match} e2={g.e2} suggest={g.pu?.id === 'suggest'} />
      </div>

      <Floats items={g.floats} />
    </div>
  );
}
