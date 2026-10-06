import { useState, useCallback, useRef, useEffect } from 'react';
import { pickItem } from '../data/gameData';

/**
 * Manages 3 connected belts. Items flow Belt 1 → 2 → 3.
 * Each belt has a travel time; if not matched, item drops to next belt.
 * After Belt 3, item is destroyed.
 */

const BELT_TRAVEL = { 1: 6000, 2: 5000, 3: 4000 }; // ms per belt
const BELT_TRAVEL_E2 = { 1: 3000, 2: 2500, 3: 2000 };

export default function useBeltSystem({ frozen, slow, e2, onDrop }) {
  const [items, setItems] = useState([]);
  const timersRef = useRef({});

  const getTravelTime = useCallback((belt) => {
    const base = e2 ? BELT_TRAVEL_E2[belt] : BELT_TRAVEL[belt];
    if (frozen) return 999999;
    if (slow) return base * 2;
    return base;
  }, [frozen, slow, e2]);

  // Schedule belt transitions / drops
  const scheduleItem = useCallback((item) => {
    if (timersRef.current[item.uid]) clearTimeout(timersRef.current[item.uid]);

    const travel = getTravelTime(item.belt);
    timersRef.current[item.uid] = setTimeout(() => {
      setItems(prev => {
        const found = prev.find(i => i.uid === item.uid && i.status === 'active');
        if (!found) return prev;

        if (found.belt < 3) {
          // Move to next belt
          const updated = prev.map(i =>
            i.uid === item.uid ? { ...i, belt: i.belt + 1, beltEntryTime: Date.now() } : i
          );
          // Re-schedule for next belt
          const next = { ...found, belt: found.belt + 1 };
          setTimeout(() => scheduleItem(next), 50);
          return updated;
        } else {
          // Fell off Belt 3 — destroyed
          onDrop(found.uid);
          return prev.map(i => i.uid === item.uid ? { ...i, status: 'dropped' } : i);
        }
      });
      delete timersRef.current[item.uid];
    }, travel);
  }, [getTravelTime, onDrop]);

  // Spawn new item onto Belt 1
  const spawn = useCallback((maxDiff = 2) => {
    const item = pickItem(maxDiff);
    item.beltEntryTime = Date.now();
    setItems(prev => [...prev, item]);
    scheduleItem(item);
  }, [scheduleItem]);

  // Remove item (matched or cleaned up after drop animation)
  const removeItem = useCallback((uid) => {
    setItems(prev => prev.filter(i => i.uid !== uid));
    if (timersRef.current[uid]) {
      clearTimeout(timersRef.current[uid]);
      delete timersRef.current[uid];
    }
  }, []);

  // Mark item status
  const setItemStatus = useCallback((uid, status) => {
    setItems(prev => prev.map(i => i.uid === uid ? { ...i, status } : i));
  }, []);

  // Clear all items (powerup)
  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setItems([]);
  }, []);

  // Get items by belt
  const getBeltItems = useCallback((belt) => items.filter(i => i.belt === belt), [items]);

  // Get most endangered active item (closest to falling off Belt 3)
  const getMostEndangered = useCallback(() => {
    const active = items.filter(i => i.status === 'active');
    if (active.length === 0) return null;
    // Prefer Belt 3, then 2, then 1. Within same belt, oldest first.
    return active.sort((a, b) => {
      if (a.belt !== b.belt) return b.belt - a.belt;
      return a.beltEntryTime - b.beltEntryTime;
    })[0];
  }, [items]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return { items, spawn, removeItem, setItemStatus, clearAll, getBeltItems, getMostEndangered };
}
