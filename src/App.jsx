import useGameState from './hooks/useGameState';
import IntroScreen from './pages/IntroScreen';
import PowerupSelect from './pages/PowerupSelect';
import E2Activation from './pages/E2Activation';
import ScoreScreen from './pages/ScoreScreen';
import ConveyorBelt from './components/ConveyorBelt';
import SearchInput from './components/SearchInput';
import GameHUD from './components/GameHUD';
import RobotBot from './components/RobotBot';
import FloatingScores from './components/FloatingScores';

const TUTORIAL_MESSAGES = [
  'Items slide across the belt. Click one to select it.',
  'Type in the search box to find the correct database match.',
  'Use ↑↓ to navigate, Enter to confirm. Don\'t let items fall off!',
];

export default function App() {
  const game = useGameState();

  // Intro screen
  if (game.phase === 'INTRO') {
    return <IntroScreen onStart={game.startGame} />;
  }

  // Powerup selection overlay
  if (game.phase === 'POWERUP_SELECT') {
    return (
      <>
        <GameScreen game={game} />
        <PowerupSelect options={game.powerupOptions} onSelect={game.selectPowerup} />
      </>
    );
  }

  // E2 activation cinematic
  if (game.phase === 'E2_ACTIVATE') {
    return <E2Activation onActivate={game.activateE2} />;
  }

  // Score screen
  if (game.phase === 'SCORE') {
    return (
      <ScoreScreen
        score={game.score}
        correct={game.correct}
        wrong={game.wrong}
        drops={game.drops}
        bestStreak={game.bestStreak}
        totalTime={game.totalTime}
        onRestart={() => game.setPhase('INTRO')}
      />
    );
  }

  // Active game phases (TUTORIAL, MANUAL, POWERUP, E2)
  return <GameScreen game={game} />;
}

function GameScreen({ game }) {
  const tutorialMsg = game.phase === 'TUTORIAL'
    ? TUTORIAL_MESSAGES[Math.min(
        Math.floor((15000 - game.phaseTimer) / 5000),
        TUTORIAL_MESSAGES.length - 1
      )]
    : null;

  const phaseConfig = {
    TUTORIAL: { beltSpeed: 12 },
    MANUAL: { beltSpeed: 8 },
    POWERUP: { beltSpeed: 6 },
    E2: { beltSpeed: 5 },
  }[game.phase] || { beltSpeed: 8 };

  return (
    <div
      className={game.shaking ? 'screen-shake' : ''}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 24px',
        gap: 16,
        background: game.e2Active
          ? 'radial-gradient(ellipse at 50% 80%, rgba(57,196,195,0.06), transparent 50%), var(--bg-dark)'
          : 'var(--bg-dark)',
        transition: 'background 0.5s',
      }}
    >
      <GameHUD
        score={game.score}
        streak={game.streak}
        phase={game.phase}
        phaseTimer={game.phaseTimer}
        activePowerup={game.activePowerup}
        e2Active={game.e2Active}
      />

      {/* Robot tutorial */}
      {game.phase === 'TUTORIAL' && (
        <div style={{ padding: '0 4px' }}>
          <RobotBot message={tutorialMsg} />
        </div>
      )}

      {/* Conveyor Belt */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        <ConveyorBelt
          items={game.beltItems}
          beltSpeed={phaseConfig.beltSpeed}
          frozen={game.beltFrozen}
          slow={game.beltSlow}
          onDrop={game.handleDrop}
          onSelect={(item) => {}} // Selection happens via first active item
          activeItemUid={game.activeItem?.uid}
          e2Active={game.e2Active}
        />

        {/* Search area */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '8px 0',
        }}>
          <SearchInput
            activeItem={game.activeItem}
            onMatch={game.handleMatch}
            e2Active={game.e2Active}
            autoSuggest={game.activePowerup?.id === 'autosuggest'}
          />
        </div>
      </div>

      <FloatingScores scores={game.floatingScores} />
    </div>
  );
}
