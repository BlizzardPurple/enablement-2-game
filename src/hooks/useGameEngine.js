import { useState, useCallback, useRef, useEffect } from 'react';
import { SCORE, POWERUPS } from '../data/gameData';
import { getBossLine } from '../data/bossDialogue';
import useBeltSystem from './useBeltSystem';

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

  const startTimeRef = useRef(0);
  const tickRef = useRef(null);
  const spawnRef = useRef(null);
  const bossRef = useRef(null);
  const p1Fired = useRef(false);
  const p2Fired = useRef(false);
  const e2Fired = useRef(false);
  const phaseRef = useRef('INTRO');
  const e2Ref = useRef(false);
  const elapsedRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { e2Ref.current = e2; }, [e2]);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  const belt = useBeltSystem({
    frozen, slow, e2,
    onDrop: (uid) => {
      setDrops(d => d + 1);
      if (!e2Ref.current) setScore(s => Math.max(0, s + SCORE.DROP));
      addFloat(SCORE.DROP, 'drop');
      shake();
      setBossEvent('drop');
      setBossLine(getBossLine('drop'));
      setTimeout(() => belt.removeItem(uid), 800);
    },
  });

  // Store belt.spawn in a ref so the interval doesn't need it as a dep
  const spawnFnRef = useRef(belt.spawn);
  useEffect(() => { spawnFnRef.current = belt.spawn; }, [belt.spawn]);

  const addFloat = useCallback((value, type) => {
    const id = Date.now() + Math.random();
    const text = typeof value === 'number' ? (value > 0 ? `+${value}` : `${value}`) : value;
    setFloats(prev => [...prev, { id, value: text, type }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  // Spawn loop — uses refs only, no deps on state
  const startSpawnLoop = useCallback(() => {
    clearInterval(spawnRef.current);
    const doSpawn = () => {
      if (phaseRef.current !== 'PLAYING' && phaseRef.current !== 'E2') return;
      const el = elapsedRef.current;
      const maxDiff = el < P1_TIME ? 1 : el < P2_TIME ? 2 : 3;
      spawnFnRef.current(maxDiff);
    };
    doSpawn(); // immediate first spawn
    spawnRef.current = setInterval(doSpawn, e2Ref.current ? 1800 : 2500);
  }, []);

  // Match handler
  const handleMatch = useCallback((uid, dbId) => {
    const item = belt.items.find(i => i.uid === uid);
    if (!item || item.status !== 'active') return;

    if (item.answerId === dbId) {
      const beltScore = e2Ref.current ? SCORE.E2_BASE : [0, SCORE.BELT_1, SCORE.BELT_2, SCORE.BELT_3][item.belt];
      const timeTaken = Date.now() - item.beltEntryTime;
      let points = beltScore;
      if (timeTaken < SCORE.SPEED_MS) points += SCORE.SPEED_BONUS;

      setStreak(prev => {
        const ns = prev + 1;
        points += ns * SCORE.STREAK_BONUS;
        setScore(s => s + points);
        setBestStreak(b => Math.max(b, ns));
        return ns;
      });

      setCorrect(c => c + 1);
      addFloat(`+${points}`, 'correct');
      belt.setItemStatus(uid, 'matched');
      setTimeout(() => belt.removeItem(uid), 400);
      setBossEvent('correct');
      setBossLine(getBossLine('correct'));
    } else {
      if (!e2Ref.current) {
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
  }, [belt, addFloat, shake]);

  // Auto-select most endangered item
  useEffect(() => {
    if (!selectedItem || !belt.items.find(i => i.uid === selectedItem && i.status === 'active')) {
      const endangered = belt.getMostEndangered();
      setSelectedItem(endangered?.uid || null);
    }
  }, [belt.items, selectedItem, belt]);

  // Tick — elapsed time
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    tickRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;

    if (!p1Fired.current && elapsed >= P1_TIME && phase === 'PLAYING') {
      p1Fired.current = true;
      clearInterval(spawnRef.current);
      const opts = [...POWERUPS].sort(() => Math.random() - 0.5).slice(0, 2);
      setPowerupOptions(opts);
      setPhase('POWERUP_SELECT');
      setBossEvent('powerup');
      setBossLine(getBossLine('powerup'));
    } else if (!p2Fired.current && elapsed >= P2_TIME && phase === 'PLAYING') {
      p2Fired.current = true;
      clearInterval(spawnRef.current);
      const opts = [...POWERUPS].sort(() => Math.random() - 0.5).slice(0, 2);
      setPowerupOptions(opts);
      setPhase('POWERUP_SELECT');
      setBossEvent('powerup');
      setBossLine(getBossLine('powerup'));
    } else if (!e2Fired.current && elapsed >= E2_TIME && phase === 'PLAYING') {
      e2Fired.current = true;
      clearInterval(spawnRef.current);
      setPhase('E2_ACTIVATE');
      shake();
    } else if (elapsed >= TOTAL_TIME) {
      clearInterval(tickRef.current);
      clearInterval(spawnRef.current);
      clearInterval(bossRef.current);
      setPhase('SCORE');
    }
  }, [elapsed, phase, shake]);

  // Boss idle chatter
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    bossRef.current = setInterval(() => {
      const evt = e2 ? 'e2_active' : 'idle';
      setBossEvent(evt);
      setBossLine(getBossLine(evt));
    }, 6000);
    return () => clearInterval(bossRef.current);
  }, [phase, e2]);

  const selectPowerup = useCallback((powerup) => {
    setActivePowerup(powerup);
    if (powerup.id === 'clear') belt.clearAll();
    if (powerup.id === 'freeze') { setFrozen(true); setTimeout(() => setFrozen(false), powerup.dur); }
    if (powerup.id === 'slowmo') { setSlow(true); setTimeout(() => setSlow(false), powerup.dur); }
    setPhase('PLAYING');
    startTimeRef.current = Date.now() - elapsedRef.current;
    startSpawnLoop();
  }, [belt, startSpawnLoop]);

  const activateE2 = useCallback(() => {
    setE2(true);
    e2Ref.current = true;
    setPhase('E2');
    setBossEvent('e2_activate');
    setBossLine(getBossLine('e2_activate'));
    shake();
    startTimeRef.current = Date.now() - elapsedRef.current;
    startSpawnLoop();
  }, [shake, startSpawnLoop]);

  const startGame = useCallback(() => {
    setScore(0); setStreak(0); setBestStreak(0); setCorrect(0);
    setWrong(0); setDrops(0); setElapsed(0);
    setFrozen(false); setSlow(false); setE2(false);
    e2Ref.current = false;
    setActivePowerup(null); setSelectedItem(null); setFloats([]);
    p1Fired.current = false; p2Fired.current = false; e2Fired.current = false;
    startTimeRef.current = Date.now();
    belt.clearAll();
    setBossEvent('idle');
    setBossLine(getBossLine('idle'));
    setPhase('PLAYING');
    startSpawnLoop();
  }, [belt, startSpawnLoop]);

  const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
  const timeLeftSec = Math.ceil(timeLeft / 1000);
  const timePct = (timeLeft / TOTAL_TIME) * 100;

  return {
    phase, score, streak, bestStreak, correct, wrong, drops,
    elapsed, timeLeft, timeLeftSec, timePct,
    frozen, slow, e2, activePowerup, powerupOptions,
    selectedItem, setSelectedItem,
    bossLine, bossEvent, floats, shaking,
    belt, startGame, handleMatch, selectPowerup, activateE2, setPhase,
  };
}
