import { useState, useCallback, useRef, useEffect } from 'react';
import { pickItem } from '../data/gameData';

const BASE_TRAVEL = 18000;
const PKG_SIZE_PCT = 8;
const MIN_GAP_PCT = 4;

export default function useBelts({ frozen, slow, e2, onDrop, diffMultiplier = 1 }) {
  const [items, setItems] = useState([]);
  const timers = useRef({});
  const lastAnswerRef = useRef(null);

  // Dynamic travel time based on game state and difficulty
  const getTravelTime = useCallback(() => {
    if (frozen) return 999999999;
    let t = BASE_TRAVEL;
    if (e2) t *= 0.65;           // E2: faster
    if (slow) t *= 2;            // slow powerup
    t /= diffMultiplier;         // dynamic difficulty scales speed
    return Math.max(3000, t);    // floor at 3s
  }, [frozen, slow, e2, diffMultiplier]);

  const getPos = useCallback((item) => {
    if (item.status !== 'active') return -1;
    const elapsed = Date.now() - item.spawnTime;
    return Math.min(100, (elapsed / (item.travelTime || BASE_TRAVEL)) * 100);
  }, []);

  const hasSpaceAtStart = useCallback((currentItems) => {
    for (const existing of currentItems) {
      if (existing.status !== 'active') continue;
      const pos = getPos(existing);
      if (pos >= 0 && pos < PKG_SIZE_PCT + MIN_GAP_PCT) return false;
    }
    return true;
  }, [getPos]);

  const schedule = useCallback((item) => {
    if (timers.current[item.uid]) clearTimeout(timers.current[item.uid]);
    timers.current[item.uid] = setTimeout(() => {
      setItems(prev => {
        const found = prev.find(i => i.uid === item.uid && i.status === 'active');
        if (!found) return prev;
        onDrop(found.uid);
        return prev.map(i => i.uid === item.uid ? { ...i, status: 'dropped' } : i);
      });
      delete timers.current[item.uid];
    }, item.travelTime || BASE_TRAVEL);
  }, [onDrop]);

  const spawn = useCallback((maxDiff = 2, elapsed = 0) => {
    setItems(prev => {
      if (!hasSpaceAtStart(prev)) return prev;
      const item = pickItem(maxDiff, elapsed, e2, lastAnswerRef.current);
      item.travelTime = getTravelTime();
      lastAnswerRef.current = item.answerId;
      schedule(item);
      return [...prev, item];
    });
  }, [schedule, hasSpaceAtStart, e2, getTravelTime]);

  const remove = useCallback(uid => {
    setItems(prev => prev.filter(i => i.uid !== uid));
    if (timers.current[uid]) { clearTimeout(timers.current[uid]); delete timers.current[uid]; }
  }, []);

  const setStatus = useCallback((uid, s) => setItems(prev => prev.map(i => i.uid === uid ? { ...i, status: s } : i)), []);
  const clearAll = useCallback(() => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; setItems([]); lastAnswerRef.current = null; }, []);

  const endangered = useCallback(() => {
    const active = items.filter(i => i.status === 'active');
    return active.sort((a, b) => getPos(b) - getPos(a))[0] || null;
  }, [items, getPos]);

  const activeCount = items.filter(i => i.status === 'active').length;

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return { items, spawn, remove, setStatus, clearAll, endangered, activeCount };
}
