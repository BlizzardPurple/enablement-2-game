import { useState, useCallback, useRef, useEffect } from 'react';
import { SCORE } from '../data/gameData';
import { getBossLine } from '../data/bossDialogue';
import useBelts from './useBelts';

const TOTAL = 60000;
const E2_AT = 40000;

export default function useGame() {
  const [phase, setPhase] = useState('INTRO'); // INTRO|PLAYING|E2_ACTIVATE|E2|SCORE
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);
  const [drops, setDrops] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [shielded, setShielded] = useState(false);
  const [doubleScore, setDoubleScore] = useState(false);
  const [e2, setE2] = useState(false);
  const [pu, setPu] = useState(null); // active powerup
  const [sel, setSel] = useState(null);
  const [bossLine, setBL] = useState('');
  const [bossEvt, setBE] = useState('idle');
  const [floats, setFloats] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [freezeVfx, setFreezeVfx] = useState(false);
  const [e2Flash, setE2Flash] = useState(false);
  const [puFlash, setPuFlash] = useState(null); // { name, iconId } or null
  const [bonusTime, setBonusTime] = useState(0);
  const [diffMult, setDiffMult] = useState(1);
  const [oldScore, setOldScore] = useState(0); // manual phase score
  const [newScore, setNewScore] = useState(0); // E2 phase score (before doubling)

  const t0 = useRef(0);
  const tick = useRef(null);
  const spawnI = useRef(null);
  const bossI = useRef(null);
  const e2Done = useRef(false);
  const phaseR = useRef('INTRO');
  const e2R = useRef(false);
  const elR = useRef(0);

  useEffect(() => { phaseR.current = phase; }, [phase]);
  useEffect(() => { e2R.current = e2; }, [e2]);
  useEffect(() => { elR.current = elapsed; }, [elapsed]);

  // Belt speed: starts at 0.75x, scales to 1x with score, E2 is 1.5x
  const beltSpeed = e2 ? 1.5 : 0.75 + Math.min(score / 3000, 0.25);

  const belt = useBelts({
    frozen, slow, e2, diffMultiplier: diffMult * beltSpeed,
    onDrop: uid => {
      setDrops(d => d + 1);
      if (!e2R.current) setScore(s => Math.max(0, s + SCORE.DROP));
      float(SCORE.DROP, 'drop');
      shake();
      setBE('drop'); setBL(getBossLine('drop'));
      setTimeout(() => belt.remove(uid), 800);
    },
  });

  const spawnFn = useRef(belt.spawn);
  useEffect(() => { spawnFn.current = belt.spawn; }, [belt.spawn]);

  const float = useCallback((v, t) => {
    const id = Date.now() + Math.random();
    const txt = typeof v === 'number' ? (v > 0 ? `+${v}` : `${v}`) : v;
    setFloats(p => [...p, { id, value: txt, type: t }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 1200);
  }, []);

  const shake = useCallback(() => { setShaking(true); setTimeout(() => setShaking(false), 500); }, []);

  // Apply powerup from belt package
  const applyPU = useCallback(p => {
    setPu(p);
    float(`⚡ ${p.name}!`, 'pu');
    setPuFlash({ name: p.name, iconId: p.iconId });
    setTimeout(() => setPuFlash(null), 1000);
    setBE('powerup'); setBL(getBossLine('powerup'));
    if (p.id === 'slow') { setSlow(true); setTimeout(() => setSlow(false), p.dur); }
    if (p.id === 'time') setBonusTime(b => b + 5000);
    if (p.id === 'shield') { setShielded(true); setTimeout(() => setShielded(false), p.dur); }
    if (p.id === 'double') { setDoubleScore(true); setTimeout(() => setDoubleScore(false), p.dur); }
    if (p.id === 'bonus') setScore(s => s + 500);
    if (p.dur > 0) setTimeout(() => setPu(null), p.dur);
    else setTimeout(() => setPu(null), 2000);
  }, [float]);

  // Spawn loop
  const startSpawn = useCallback(() => {
    clearInterval(spawnI.current);
    const go = () => {
      if (phaseR.current !== 'PLAYING' && phaseR.current !== 'E2') return;
      const el = elR.current;
      const d = el < 10000 ? 1 : el < 25000 ? 2 : 3;
      spawnFn.current(d, el);
    };
    go();
    spawnI.current = setInterval(go, e2R.current ? 1800 : 2200);
  }, []);

  // Match
  const match = useCallback((uid, dbId) => {
    const item = belt.items.find(i => i.uid === uid);
    if (!item || item.status !== 'active') return;
    if (item.answerId === dbId) {
      const pts = e2R.current ? SCORE.E2_BASE : SCORE.BASE;
      const fast = (Date.now() - item.beltEntryTime) < SCORE.SPEED_MS;
      const streakMult = e2R.current ? SCORE.STREAK * 2 : SCORE.STREAK;
      let total = pts + (fast ? SCORE.SPEED : 0);
      setStreak(prev => {
        const ns = prev + 1;
        total += ns * streakMult;
        // 2× multiplier: during E2 (permanent time bonus) or during double powerup
        const mult = (e2R.current ? 2 : 1) * (doubleScore ? 2 : 1);
        const finalTotal = total * mult;
        setScore(s => s + finalTotal);
        if (e2R.current) setNewScore(s => s + finalTotal);
        else setOldScore(s => s + finalTotal);
        setBest(b => Math.max(b, ns));
        return ns;
      });
      if (item.powerup && !e2R.current) {
        setScore(s => s + SCORE.POWERUP);
        setOldScore(s => s + SCORE.POWERUP);
        float(`+${SCORE.POWERUP} ⚡`, 'pu');
        applyPU(item.powerup);
      }
      setOk(c => c + 1);
      float(`+${total}`, 'correct');
      belt.setStatus(uid, 'matched');
      setTimeout(() => belt.remove(uid), 400);
      setBE('correct'); setBL(getBossLine('correct'));
    } else {
      if (!e2R.current && !shielded) {
        setScore(s => Math.max(0, s + SCORE.WRONG));
        setOldScore(s => s + SCORE.WRONG);
        float(SCORE.WRONG, 'wrong');
      } else if (shielded) {
        float('🛡️ Blocked!', 'pu');
        setShielded(false);
      }
      setBad(w => w + 1);
      setStreak(0);
      shake();
      belt.setStatus(uid, 'wrong');
      setTimeout(() => belt.setStatus(uid, 'active'), 500);
      setBE('wrong'); setBL(getBossLine('wrong'));
    }
    setSel(null);
  }, [belt, float, shake, applyPU, shielded]);

  // Auto-select endangered
  useEffect(() => {
    if (!sel || !belt.items.find(i => i.uid === sel && i.status === 'active')) {
      const e = belt.endangered();
      setSel(e?.uid || null);
    }
  }, [belt.items, sel, belt]);

  // Tick
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2' && phase !== 'E2_ACTIVATE') return;
    tick.current = setInterval(() => setElapsed(Date.now() - t0.current), 100);
    return () => clearInterval(tick.current);
  }, [phase]);

  // Transitions
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    const totalWithBonus = TOTAL + bonusTime;
    if (!e2Done.current && elapsed >= E2_AT && phase === 'PLAYING') {
      e2Done.current = true;
      // No screen change — activate E2 immediately
      setE2(true); e2R.current = true;
      belt.clearAll();
      // Clear all active powerup effects
      setPu(null); setSlow(false); setShielded(false); setFreezeVfx(false); setFrozen(false); setDoubleScore(false);
      setBE('e2_activate'); setBL(getBossLine('e2_activate'));
      shake();
      setE2Flash(true);
      // Brief freeze — pause spawning for 1s so player sees the flash
      clearInterval(spawnI.current);
      setTimeout(() => {
        setE2Flash(false);
        startSpawn();
      }, 1000);
      setPhase('E2');
    } else if (elapsed >= totalWithBonus) {
      clearInterval(tick.current);
      clearInterval(spawnI.current);
      clearInterval(bossI.current);
      belt.clearAll();
      setPhase('SCORE');
    }
  }, [elapsed, phase, shake, bonusTime]);

  // Dynamic difficulty — adjust every 5 seconds based on performance
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    const total = ok + bad + drops;
    if (total < 3) return; // too early to judge
    const ratio = ok / Math.max(1, total);
    // Winning a lot (>70% correct, few drops): speed up
    if (ratio > 0.7 && drops < 2) setDiffMult(m => Math.min(1.8, m + 0.05));
    // Struggling (<40% correct or many drops): slow down
    else if (ratio < 0.4 || drops > 4) setDiffMult(m => Math.max(0.6, m - 0.05));
  }, [Math.floor(elapsed / 5000)]); // re-evaluate every 5s

  // Instant respawn — if belt is empty in ANY phase, spawn immediately
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    if (belt.activeCount === 0) {
      const el = elR.current;
      const d = el < 10000 ? 1 : el < 25000 ? 2 : 3;
      belt.spawn(d, el);
    }
  }, [phase, belt.activeCount, belt]);

  // Boss chatter
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'E2') return;
    bossI.current = setInterval(() => {
      setBE(e2 ? 'e2_active' : 'idle');
      setBL(getBossLine(e2 ? 'e2_active' : 'idle'));
    }, 5000);
    return () => clearInterval(bossI.current);
  }, [phase, e2]);

  const activateE2 = useCallback(() => {
    setE2(true); e2R.current = true;
    belt.clearAll(); // clear all packages on activation
    setPhase('E2');
    setBE('e2_activate'); setBL(getBossLine('e2_activate'));
    shake();
    t0.current = Date.now() - elR.current;
    startSpawn();
  }, [belt, shake, startSpawn]);

  const start = useCallback(() => {
    setScore(0); setStreak(0); setBest(0); setOk(0); setBad(0); setDrops(0); setElapsed(0);
    setFrozen(false); setSlow(false); setReversed(false); setShielded(false); setDoubleScore(false);
    setE2(false); e2R.current = false; setPu(null); setSel(null); setFloats([]);
    setFreezeVfx(false); setBonusTime(0); setE2Flash(false); setPuFlash(null); setDiffMult(1);
    setOldScore(0); setNewScore(0);
    e2Done.current = false;
    t0.current = Date.now();
    belt.clearAll();
    setBE('idle'); setBL(getBossLine('idle'));
    setPhase('PLAYING');
    startSpawn();
  }, [belt, startSpawn]);

  const totalWithBonus = TOTAL + bonusTime;
  const left = Math.max(0, totalWithBonus - elapsed);
  const leftSec = Math.ceil(left / 1000);
  const pct = (left / totalWithBonus) * 100;

  return {
    phase, score, streak, best, ok, bad, drops, elapsed,
    left, leftSec, pct,
    frozen, slow, reversed, shielded, e2, pu, freezeVfx, e2Flash, puFlash, doubleScore,
    sel, setSel, bossLine, bossEvt: bossEvt, floats, shaking,
    belt, start, match, setPhase, oldScore, newScore,
  };
}
