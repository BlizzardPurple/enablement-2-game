import { useState, useCallback, useRef, useEffect } from 'react';
import { pickItem } from '../data/gameData';

/**
 * Simplified belt system — packages travel along one continuous S-path.
 * No more belt 1/2/3 transitions. Each package has a spawn time and total
 * travel duration. When it reaches 100% of the path, it's dropped.
 *
 * Collision: packages have a "path %" position. New packages only spawn
 * if the start of the path is clear.
 */

const TRAVEL_NORMAL = 18000; // 18s to traverse full S-path
const TRAVEL_E2 = 12000;     // 1.5x faster
const TRAVEL_SLOW = 36000;
const PKG_SIZE_PCT = 8;      // package occupies ~8% of path length
const MIN_GAP_PCT = 4;

export default function useBelts({ frozen, slow, e2, onDrop }) {
  const [items, setItems] = useState([]);
  const timers = useRef({});

  const getTravelTime = useCallback(() => {
    if (frozen) return 999999999;
    if (slow) return TRAVEL_SLOW;
    if (e2) return TRAVEL_E2;
    return TRAVEL_NORMAL;
  }, [frozen, slow, e2]);

  // Get current position (0-100%) of a package on the path
  const getPos = useCallback((item) => {
    if (item.status !== 'active') return -1;
    const travel = getTravelTime();
    const elapsed = Date.now() - item.spawnTime;
    return Math.min(100, (elapsed / travel) * 100);
  }, [getTravelTime]);

  const hasSpaceAtStart = useCallback((currentItems) => {
    for (const existing of currentItems) {
      if (existing.status !== 'active') continue;
      const pos = getPos(existing);
      if (pos >= 0 && pos < PKG_SIZE_PCT + MIN_GAP_PCT) return false;
    }
    return true;
  }, [getPos]);

  // Schedule drop timer
  const schedule = useCallback((item) => {
    if (timers.current[item.uid]) clearTimeout(timers.current[item.uid]);
    const travel = getTravelTime();
    timers.current[item.uid] = setTimeout(() => {
      setItems(prev => {
        const found = prev.find(i => i.uid === item.uid && i.status === 'active');
        if (!found) return prev;
        onDrop(found.uid);
        return prev.map(i => i.uid === item.uid ? { ...i, status: 'dropped' } : i);
      });
      delete timers.current[item.uid];
    }, travel);
  }, [getTravelTime, onDrop]);

  const spawn = useCallback((maxDiff = 2, elapsed = 0) => {
    setItems(prev => {
      if (!hasSpaceAtStart(prev)) return prev;
      const item = pickItem(maxDiff, elapsed, e2);
      item.travelTime = getTravelTime();
      schedule(item);
      return [...prev, item];
    });
  }, [schedule, hasSpaceAtStart, e2, getTravelTime]);

  const remove = useCallback(uid => {
    setItems(prev => prev.filter(i => i.uid !== uid));
    if (timers.current[uid]) { clearTimeout(timers.current[uid]); delete timers.current[uid]; }
  }, []);

  const setStatus = useCallback((uid, s) => setItems(prev => prev.map(i => i.uid === uid ? { ...i, status: s } : i)), []);
  const clearAll = useCallback(() => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; setItems([]); }, []);

  // Most endangered = furthest along the path
  const endangered = useCallback(() => {
    const active = items.filter(i => i.status === 'active');
    return active.sort((a, b) => getPos(b) - getPos(a))[0] || null;
  }, [items, getPos]);

  // Keep byBelt for compatibility (estimate belt from position)
  const byBelt = useCallback(() => items, [items]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return { items, spawn, remove, setStatus, clearAll, byBelt, endangered };
}
