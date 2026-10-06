import { useState, useCallback, useRef, useEffect } from 'react';
import { pickItem } from '../data/gameData';

const TRAVEL = { 1: 7000, 2: 6000, 3: 5000 };
const TRAVEL_E2 = { 1: 3000, 2: 2500, 3: 2000 };
const PKG_WIDTH_PCT = 22; // approximate package width as % of belt
const MIN_GAP_PCT = 5;    // minimum gap between packages

export default function useBelts({ frozen, slow, e2, onDrop }) {
  const [items, setItems] = useState([]);
  const timers = useRef({});

  const getTime = useCallback((b) => {
    const base = e2 ? TRAVEL_E2[b] : TRAVEL[b];
    return frozen ? 999999 : slow ? base * 2 : base;
  }, [frozen, slow, e2]);

  // Get current position (0-100%) of a package on its belt
  const getPos = useCallback((item) => {
    if (item.status !== 'active') return -1;
    const travel = getTime(item.belt);
    const elapsed = Date.now() - item.beltEntryTime;
    return Math.min(100, (elapsed / travel) * 100);
  }, [getTime]);

  // Check if there's space at the start of a belt (position ~0%)
  const hasSpaceAtStart = useCallback((beltNum, currentItems) => {
    const beltItems = currentItems.filter(i => i.belt === beltNum && i.status === 'active');
    for (const existing of beltItems) {
      const pos = getPos(existing);
      // If an existing package is still near the start (within pkg width + gap), no space
      if (pos >= 0 && pos < PKG_WIDTH_PCT + MIN_GAP_PCT) {
        return false;
      }
    }
    return true;
  }, [getPos]);

  const schedule = useCallback((item) => {
    if (timers.current[item.uid]) clearTimeout(timers.current[item.uid]);
    timers.current[item.uid] = setTimeout(() => {
      setItems(prev => {
        const found = prev.find(i => i.uid === item.uid && i.status === 'active');
        if (!found) return prev;
        if (found.belt < 3) {
          const nextBelt = found.belt + 1;
          // Check space at start of next belt
          if (!hasSpaceAtStart(nextBelt, prev)) {
            // Retry in 400ms
            setTimeout(() => schedule(found), 400);
            return prev;
          }
          const next = { ...found, belt: nextBelt, beltEntryTime: Date.now() };
          setTimeout(() => schedule(next), 50);
          return prev.map(i => i.uid === item.uid ? next : i);
        }
        onDrop(found.uid);
        return prev.map(i => i.uid === item.uid ? { ...i, status: 'dropped' } : i);
      });
      delete timers.current[item.uid];
    }, getTime(item.belt));
  }, [getTime, onDrop, hasSpaceAtStart]);

  const spawn = useCallback((maxDiff = 2) => {
    setItems(prev => {
      // Only spawn if there's space at the start of belt 1
      if (!hasSpaceAtStart(1, prev)) return prev;
      const item = pickItem(maxDiff);
      schedule(item);
      return [...prev, item];
    });
  }, [schedule, hasSpaceAtStart]);

  const remove = useCallback(uid => {
    setItems(prev => prev.filter(i => i.uid !== uid));
    if (timers.current[uid]) { clearTimeout(timers.current[uid]); delete timers.current[uid]; }
  }, []);

  const setStatus = useCallback((uid, s) => setItems(prev => prev.map(i => i.uid === uid ? { ...i, status: s } : i)), []);
  const clearAll = useCallback(() => { Object.values(timers.current).forEach(clearTimeout); timers.current = {}; setItems([]); }, []);
  const byBelt = useCallback(b => items.filter(i => i.belt === b), [items]);
  const endangered = useCallback(() => {
    const active = items.filter(i => i.status === 'active');
    return active.sort((a, b) => b.belt - a.belt || a.beltEntryTime - b.beltEntryTime)[0] || null;
  }, [items]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return { items, spawn, remove, setStatus, clearAll, byBelt, endangered };
}
