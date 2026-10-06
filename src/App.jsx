import useGameEngine from './hooks/useGameEngine';
import useTheme from './hooks/useTheme';
import IntroScreen from './pages/IntroScreen';
import PowerupSelect from './pages/PowerupSelect';
import E2Activation from './pages/E2Activation';
import ScoreScreen from './pages/ScoreScreen';
import BeltSystem from './components/BeltSystem';
import SearchInput from './components/SearchInput';
import ScoreDisplay from './components/ScoreDisplay';
import RobotBoss from './components/RobotBoss';
import FloatingScores from './components/FloatingScores';
import FactoryBG from './components/FactoryBG';
import ThemeToggle from './components/ThemeToggle';
import { getBossEmotion } from './data/bossDialogue';

export default function App() {
  const game = useGameEngine();
  const theme = useTheme();

  if (game.phase === 'INTRO') {
    return <IntroScreen onStart={game.startGame} theme={theme} />;
  }

  if (game.phase === 'SCORE') {
    return (
      <ScoreScreen
        score={game.score} correct={game.correct} wrong={game.wrong}
        drops={game.drops} bestStreak={game.bestStreak}
        onRestart={() => game.setPhase('INTRO')} theme={theme}
      />
    );
  }

  return (
    <div className={game.shaking ? 'shake' : ''} style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '12px 20px', gap: 8, position: 'relative',
      background: game.e2
        ? 'radial-gradient(ellipse at 50% 80%, rgba(57,196,195,0.06), transparent 50%), var(--bg)'
        : 'var(--bg)',
      transition: 'background 0.5s',
    }}>
      <FactoryBG />

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <RobotBoss emotion={getBossEmotion(game.bossEvent)} line={game.bossLine} />
        <ScoreDisplay
          score={game.score} streak={game.streak}
          timePct={game.timePct} timeLeftSec={game.timeLeftSec} e2={game.e2}
        />
        <ThemeToggle dark={theme.dark} onToggle={theme.toggle} />
      </div>

      {/* E2 banner */}
      {game.e2 && (
        <div style={{
          textAlign: 'center', padding: '4px 0',
          fontSize: '0.75rem', fontWeight: 800, color: 'var(--n-turquoise)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          animation: 'glow 2s ease-in-out infinite', zIndex: 10,
        }}>
          🚀 ENABLEMENT 2.0 ACTIVE — AI ASSIST ON
        </div>
      )}

      {/* Belt system */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
        <BeltSystem
          belt={game.belt}
          selectedUid={game.selectedItem}
          onSelect={(uid) => game.setSelectedItem(uid)}
          frozen={game.frozen} slow={game.slow} e2={game.e2}
          elapsed={game.elapsed}
        />
      </div>

      {/* Search */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12, zIndex: 10 }}>
        <SearchInput
          selectedItem={game.belt.items.find(i => i.uid === game.selectedItem)}
          onMatch={game.handleMatch}
          e2={game.e2}
          autoSuggest={game.activePowerup?.id === 'autosuggest'}
        />
      </div>

      <FloatingScores floats={game.floats} />

      {/* Overlays */}
      {game.phase === 'POWERUP_SELECT' && (
        <PowerupSelect options={game.powerupOptions} onSelect={game.selectPowerup} />
      )}
      {game.phase === 'E2_ACTIVATE' && (
        <E2Activation onActivate={game.activateE2} />
      )}
    </div>
  );
}
