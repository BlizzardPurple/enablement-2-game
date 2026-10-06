import { useState, useCallback, useRef, useEffect } from 'react';
import { DATABASE, POWERUPS, SCORING, PHASES, pickBeltItems } from '../data/gameData';

const GAME_PHASES = ['INTRO', 'TUTORIAL', 'MANUAL', 'POWERUP_SELECT', 'POWERUP', 'E2_ACTIVATE', 'E2', 'SCORE'];

export default function useGameState() {
  const [phase, setPhase] = useState('INTRO');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [drops, setDrops] = useState(0);
  const [beltItems, setBeltItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [activePowerup, setActivePowerup] = useState(null);
  const [powerupOptions, setPowerupOptions] = useState([]);
  const [e2Active, setE2Active] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [beltFrozen, setBeltFrozen] = useState(false);
  const [beltSlow, setBeltSlow] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const spawnTimerRef = useRef(null);
  const phaseTimerRef = useRef(null);
  const itemTimerRef = useRef(null);
  const gameStartRef = useRef(null);
  const itemSpawnedRef = useRef(0);

  // Clean up all timers
  const clearAllTimers = useCallback(() => {
    clearInterval(spawnTimerRef.current);
    clearInterval(phaseTimerRef.current);
    clearTimeout(itemTimerRef.current);
  }, []);

  // Add floating score text
  const addFloatingScore = useCallback((value, type) => {
    const id = Date.now() + Math.random();
    setFloatingScores(prev => [...prev, { id, value, type }]);
    setTimeout(() => setFloatingScores(prev => prev.filter(f => f.id !== id)), 1000);
  }, []);

  // Screen shake
  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }, []);

  // Spawn a belt item
  const spawnItem = useCallback((maxDiff = 2) => {
    const items = pickBeltItems(1, maxDiff);
    if (items.length > 0) {
      const item = { ...items[0], spawnTime: Date.now(), status: 'active' };
      setBeltItems(prev => [...prev, item]);
      itemSpawnedRef.current++;
    }
  }, []);

  // Item fell off belt
  const handleDrop = useCallback((uid) => {
    setBeltItems(prev => prev.map(i => i.uid === uid ? { ...i, status: 'dropped' } : i));
    setDrops(d => d + 1);
    setStreak(0);
    setScore(s => s + SCORING.DROP_PENALTY);
    addFloatingScore(SCORING.DROP_PENALTY, 'drop');
    triggerShake();
    // Remove after animation
    setTimeout(() => setBeltItems(prev => prev.filter(i => i.uid !== uid)), 800);
  }, [addFloatingScore, triggerShake]);

  // Player submits a match
  const handleMatch = useCallback((uid, selectedDbId) => {
    const item = beltItems.find(i => i.uid === uid);
    if (!item) return;

    const isCorrect = item.answerId === selectedDbId;
    const timeTaken = Date.now() - item.spawnTime;

    if (isCorrect) {
      let points = SCORING.CORRECT;
      if (timeTaken < SCORING.SPEED_THRESHOLD) points += SCORING.SPEED_BONUS;
      const newStreak = streak + 1;
      points += newStreak * SCORING.STREAK_BONUS;

      setScore(s => s + points);
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setCorrect(c => c + 1);
      addFloatingScore(`+${points}`, 'correct');

      setBeltItems(prev => prev.map(i => i.uid === uid ? { ...i, status: 'matched' } : i));
      setTimeout(() => setBeltItems(prev => prev.filter(i => i.uid !== uid)), 500);
    } else {
      setScore(s => s + SCORING.WRONG_PENALTY);
      setWrong(w => w + 1);
      setStreak(0);
      addFloatingScore(SCORING.WRONG_PENALTY, 'wrong');
      triggerShake();
      setBeltItems(prev => prev.map(i => i.uid === uid ? { ...i, status: 'wrong' } : i));
      setTimeout(() => setBeltItems(prev => prev.map(i => i.uid === uid ? { ...i, status: 'active' } : i)), 600);
    }

    // Auto-advance active item to next
    setActiveItem(null);
  }, [beltItems, streak, addFloatingScore, triggerShake]);

  // Start a game phase
  const startPhase = useCallback((phaseName) => {
    clearAllTimers();
    setPhase(phaseName);
    setBeltItems([]);
    setActiveItem(null);

    const config = PHASES[phaseName];
    if (!config) return;

    setPhaseTimer(config.duration);

    // Countdown
    phaseTimerRef.current = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev <= 100) {
          clearInterval(phaseTimerRef.current);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    // Spawn items
    const maxDiff = phaseName === 'TUTORIAL' ? 1 : phaseName === 'MANUAL' ? 2 : 3;
    spawnItem(maxDiff);
    spawnTimerRef.current = setInterval(() => spawnItem(maxDiff), config.spawnRate);
  }, [clearAllTimers, spawnItem]);

  // Phase transitions based on timer
  useEffect(() => {
    if (phaseTimer === 0 && phase === 'TUTORIAL') {
      clearAllTimers();
      startPhase('MANUAL');
    } else if (phaseTimer === 0 && phase === 'MANUAL') {
      clearAllTimers();
      // Pick 2 random powerups to choose from
      const shuffled = [...POWERUPS].sort(() => Math.random() - 0.5);
      setPowerupOptions(shuffled.slice(0, 2));
      setPhase('POWERUP_SELECT');
    } else if (phaseTimer === 0 && phase === 'POWERUP') {
      clearAllTimers();
      setActivePowerup(null);
      setBeltFrozen(false);
      setBeltSlow(false);
      setPhase('E2_ACTIVATE');
    } else if (phaseTimer === 0 && phase === 'E2') {
      clearAllTimers();
      setTotalTime(Date.now() - gameStartRef.current);
      setPhase('SCORE');
    }
  }, [phaseTimer, phase, clearAllTimers, startPhase]);

  // Select powerup
  const selectPowerup = useCallback((powerup) => {
    setActivePowerup(powerup);
    startPhase('POWERUP');

    // Apply immediate powerups
    if (powerup.id === 'clear') {
      setBeltItems([]);
    }
    if (powerup.id === 'freeze') {
      setBeltFrozen(true);
      setTimeout(() => setBeltFrozen(false), powerup.duration);
    }
    if (powerup.id === 'slowmo') {
      setBeltSlow(true);
      setTimeout(() => setBeltSlow(false), powerup.duration);
    }
  }, [startPhase]);

  // Activate Enablement 2.0
  const activateE2 = useCallback(() => {
    setE2Active(true);
    startPhase('E2');
  }, [startPhase]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setWrong(0);
    setDrops(0);
    setTotalTime(0);
    setE2Active(false);
    setActivePowerup(null);
    setBeltFrozen(false);
    setBeltSlow(false);
    itemSpawnedRef.current = 0;
    gameStartRef.current = Date.now();
    startPhase('TUTORIAL');
  }, [startPhase]);

  // Get the first active item on belt (for the player to match)
  useEffect(() => {
    const firstActive = beltItems.find(i => i.status === 'active');
    setActiveItem(firstActive || null);
  }, [beltItems]);

  return {
    // State
    phase, score, streak, bestStreak, correct, wrong, drops,
    beltItems, activeItem, phaseTimer, activePowerup, powerupOptions,
    e2Active, floatingScores, shaking, beltFrozen, beltSlow, totalTime,
    // Actions
    startGame, handleMatch, handleDrop, selectPowerup, activateE2,
    setPhase,
  };
}
