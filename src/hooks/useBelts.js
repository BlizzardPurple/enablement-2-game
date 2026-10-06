import { useState, useCallback, useRef, useEffect } from 'react';
import { pickItem } from '../data/gameData';

const TRAVEL = { 1: 7000, 2: 6000, 3: 5000 };
const TRAVEL_E2 = { 1: 3000, 2: 2500, 3: 2000 };

export default function useBelts({ frozen, slow, e2, onDrop }) {
  const [items, setItems] = useState([]);
  const timers = useRef({});

  const getTime = useCallback((b) => {
    const base = e2 ? TRAVEL_E2[b] : TRAVEL[b];
    return frozen ? 999999 : slow ? base * 2 : base;
  }, [frozen, slow, e2]);

  const schedule = useCallback((item) => {
    if (timers.current[item.uid]) clearTimeout(timers.current[item.uid]);
    timers.current[item.uid] = setTimeout(() => {
      setItems(prev => {
        const found = prev.find(i => i.uid === item.uid && i.status === 'active');
        if (!found) return prev;
        if (found.belt < 3) {
          const next = { ...found, belt: found.belt + 1, beltEntryTime: Date.now() };
          setTimeout(() => schedule(next), 50);
          return prev.map(i => i.uid === item.uid ? next : i);
        }
        onDrop(found.uid);
        return prev.map(i => i.uid === item.uid ? { ...i, status: 'dropped' } : i);
      });
      delete timers.current[item.uid];
    }, getTime(item.belt));
  }, [getTime, onDrop]);

  const spawn = useCallback((maxDiff = 2) => {
    const item = pickItem(maxDiff);
    setItems(prev => [...prev, item]);
    schedule(item);
  }, [schedule]);

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
