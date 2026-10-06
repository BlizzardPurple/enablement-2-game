import { useState, useCallback, useRef, useEffect } from 'react';
import { SCORE, POWERUPS } from '../data/gameData';
import { getBossLine } from '../data/bossDialogue';
import useBeltSystem from './useBeltSystem';

/**
 * PHASES: INTRO → PLAYING → POWERUP_SELECT → PLAYING → POWERUP_SELECT → E2_ACTIVATE → E2 → SCORE
 * Timeline: 0-10s manual → 10s P1 → 10-25s → 25s P2 → 25-40s → 40s E2 → 40-60s → done
 */

const TOTAL_TIME = 60000;
const P1_TIME = 10000;
const P2_TIME = 25000;
const E2_TIME = 40000;

export default function useGameEngine() {
  const [phase, setPhase] = useState('INTRO');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [drops, setDrops] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [slow, setSlow] = useState(false);
  const [e2, setE2] = useState(false);
  const [activePowerup, setActivePowerup] = useState(null);
  const [powerupOptions, setPowerupOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bossLine, setBossLine] = useState('');
  const [bossEvent, setBossEvent] = useState('idle');
  const [floats, setFloats] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [particles, setParticles] = useState([]);
  const [wpm, setWpm] = useState(0);

  const tickRef = useRef(null);
  const spawnRef = useRef(null);
  const bossTimerRef = useRef(null);
  const startTimeRef = useRef(0);
  const matchTimesRef = useRef([]);
  const powerup1Fired = useRef(false);
  const powerup2Fired = useRef(false);
  const e2Fired = useRef(false);

  // Belt system
  const belt = useBeltSystem({
    frozen, slow, e2,
    onDrop: (uid) => {
      setDrops(d => d + 1);
      if (!e2) setScore(s => Math.max(0, s + SCORE.DROP));
      addFloat(SCORE.DROP, 'drop');
      shake();
      spawnParticle(uid, 'explosion');
      setBossEvent('drop');
      setBossLine(getBossLine('drop'));
      setTimeout(() => belt.removeItem(uid), 800);
    },
  });

  // Helpers
  const addFloat = useCallback((value, type) => {
    const id = Date.now() + Math.random();
    setFloats(prev => [...prev, { id, value: typeof value === 'number' ? (value > 0 ? `+${value}` : `${value}`) : value, type }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const spawnParticle = useCallback((uid, type) => {
    const id = Date.now() + Math.random();
    setParticles(prev => [...prev, { id, type }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1500);
  }, []);

  // Boss idle chatter
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    bossTimerRef.current = setInterval(() => {
      const evt = e2 ? 'e2_active' : 'idle';
      setBossEvent(evt);
      setBossLine(getBossLine(evt));
    }, 6000);
    return () => clearInterval(bossTimerRef.current);
  }, [phase, e2]);

  // Dynamic difficulty — track WPM
  const updateWpm = useCallback(() => {
    const recent = matchTimesRef.current.filter(t => Date.now() - t < 15000);
    setWpm(Math.round((recent.length / 15) * 60));
  }, []);

  const getSpawnRate = useCallback(() => {
    const base = e2 ? 1500 : 3000;
    if (wpm > 20) return base * 0.7;
    if (wpm > 10) return base * 0.85;
    return base;
  }, [e2, wpm]);

  const getMaxDiff = useCallback(() => {
    if (elapsed < P1_TIME) return 1;
    if (elapsed < P2_TIME) return 2;
    return 3;
  }, [elapsed]);

  // Match handler
  const handleMatch = useCallback((uid, dbId) => {
    const item = belt.items.find(i => i.uid === uid);
    if (!item || item.status !== 'active') return;

    const isCorrect = item.answerId === dbId;

    if (isCorrect) {
      const beltScore = e2 ? SCORE.E2_BASE : [0, SCORE.BELT_1, SCORE.BELT_2, SCORE.BELT_3][item.belt];
      const timeTaken = Date.now() - item.beltEntryTime;
      let points = beltScore;
      if (timeTaken < SCORE.SPEED_MS) points += SCORE.SPEED_BONUS;
      const newStreak = streak + 1;
      points += newStreak * SCORE.STREAK_BONUS;

      setScore(s => s + points);
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setCorrect(c => c + 1);
      addFloat(`+${points}`, 'correct');
      spawnParticle(uid, 'success');
      matchTimesRef.current.push(Date.now());
      updateWpm();

      belt.setItemStatus(uid, 'matched');
      setTimeout(() => belt.removeItem(uid), 400);

      setBossEvent('correct');
      setBossLine(getBossLine('correct'));
    } else {
      if (!e2) {
        setScore(s => Math.max(0, s + SCORE.WRONG));
        addFloat(SCORE.WRONG, 'wrong');
      }
      setWrong(w => w + 1);
      setStreak(0);
      shake();

      belt.setItemStatus(uid, 'wrong');
      setTimeout(() => belt.setItemStatus(uid, 'active'), 500);

      setBossEvent('wrong');
      setBossLine(getBossLine('wrong'));
    }

    setSelectedItem(null);
  }, [belt, streak, e2, addFloat, shake, spawnParticle, updateWpm]);

  // Auto-select most endangered item
  useEffect(() => {
    if (!selectedItem || !belt.items.find(i => i.uid === selectedItem && i.status === 'active')) {
      const endangered = belt.getMostEndangered();
      setSelectedItem(endangered?.uid || null);
    }
  }, [belt.items, selectedItem, belt]);

  // Main game tick
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;

    tickRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(tickRef.current);
  }, [phase]);

  // Spawn loop
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;

    const doSpawn = () => {
      belt.spawn(getMaxDiff());
      spawnRef.current = setTimeout(doSpawn, getSpawnRate());
    };
    spawnRef.current = setTimeout(doSpawn, 1000);

    return () => clearTimeout(spawnRef.current);
  }, [phase, belt.spawn, getSpawnRate, getMaxDiff]);

  // Phase transitions based on elapsed time
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;

    if (!powerup1Fired.current && elapsed >= P1_TIME && phase === 'PLAYING') {
      powerup1Fired.current = true;
      clearInterval(tickRef.current);
      clearTimeout(spawnRef.current);
      const opts = [...POWERUPS].sort(() => Math.random() - 0.5).slice(0, 2);
      setPowerupOptions(opts);
      setPhase('POWERUP_SELECT');
      setBossEvent('powerup');
      setBossLine(getBossLine('powerup'));
    } else if (!powerup2Fired.current && elapsed >= P2_TIME && phase === 'PLAYING') {
      powerup2Fired.current = true;
      clearInterval(tickRef.current);
      clearTimeout(spawnRef.current);
      const opts = [...POWERUPS].sort(() => Math.random() - 0.5).slice(0, 2);
      setPowerupOptions(opts);
      setPhase('POWERUP_SELECT');
      setBossEvent('powerup');
      setBossLine(getBossLine('powerup'));
    } else if (!e2Fired.current && elapsed >= E2_TIME && phase === 'PLAYING') {
      e2Fired.current = true;
      clearInterval(tickRef.current);
      clearTimeout(spawnRef.current);
      setPhase('E2_ACTIVATE');
      shake();
    } else if (elapsed >= TOTAL_TIME) {
      clearInterval(tickRef.current);
      clearTimeout(spawnRef.current);
      clearInterval(bossTimerRef.current);
      setPhase('SCORE');
    }
  }, [elapsed, phase, shake]);

  // Select powerup
  const selectPowerup = useCallback((powerup) => {
    setActivePowerup(powerup);
    if (powerup.id === 'clear') belt.clearAll();
    if (powerup.id === 'freeze') { setFrozen(true); setTimeout(() => setFrozen(false), powerup.dur); }
    if (powerup.id === 'slowmo') { setSlow(true); setTimeout(() => setSlow(false), powerup.dur); }
    // autosuggest is handled by SearchInput
    setPhase('PLAYING');
    // Re-anchor time so elapsed keeps ticking
    startTimeRef.current = Date.now() - elapsed;
  }, [belt, elapsed]);

  // Activate E2
  const activateE2 = useCallback(() => {
    setE2(true);
    setPhase('E2');
    setBossEvent('e2_activate');
    setBossLine(getBossLine('e2_activate'));
    shake();
    startTimeRef.current = Date.now() - elapsed;
  }, [elapsed, shake]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0); setStreak(0); setBestStreak(0); setCorrect(0);
    setWrong(0); setDrops(0); setElapsed(0);
    setFrozen(false); setSlow(false); setE2(false);
    setActivePowerup(null); setSelectedItem(null);
    setFloats([]); setParticles([]);
    matchTimesRef.current = [];
    powerup1Fired.current = false;
    powerup2Fired.current = false;
    e2Fired.current = false;
    startTimeRef.current = Date.now();
    belt.clearAll();
    setBossEvent('idle');
    setBossLine(getBossLine('idle'));
    setPhase('PLAYING');
  }, [belt]);

  const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
  const timeLeftSec = Math.ceil(timeLeft / 1000);
  const timePct = (timeLeft / TOTAL_TIME) * 100;

  return {
    phase, score, streak, bestStreak, correct, wrong, drops,
    elapsed, timeLeft, timeLeftSec, timePct,
    frozen, slow, e2, activePowerup, powerupOptions,
    selectedItem, setSelectedItem,
    bossLine, bossEvent,
    floats, shaking, particles,
    belt,
    startGame, handleMatch, selectPowerup, activateE2,
    setPhase,
  };
}
