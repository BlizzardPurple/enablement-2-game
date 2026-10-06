import { useEffect, useRef } from 'react';

const BELT_HEIGHT = 140;
const ITEM_TRAVEL_TIME_BASE = 10000; // ms to cross the belt

export default function ConveyorBelt({ items, beltSpeed = 8, frozen = false, slow = false, onDrop, onSelect, activeItemUid, e2Active }) {
  const beltRef = useRef(null);
  const timerRefs = useRef({});

  // Set drop timers for each item
  useEffect(() => {
    items.forEach(item => {
      if (item.status === 'active' && !timerRefs.current[item.uid]) {
        const speed = frozen ? 999999 : slow ? ITEM_TRAVEL_TIME_BASE * 2 : ITEM_TRAVEL_TIME_BASE;
        timerRefs.current[item.uid] = setTimeout(() => {
          onDrop(item.uid);
          delete timerRefs.current[item.uid];
        }, speed);
      }
    });

    // Cleanup removed items
    const activeUids = new Set(items.map(i => i.uid));
    Object.keys(timerRefs.current).forEach(uid => {
      if (!activeUids.has(uid)) {
        clearTimeout(timerRefs.current[uid]);
        delete timerRefs.current[uid];
      }
    });
  }, [items, frozen, slow, onDrop]);

  const travelDuration = frozen ? '999s' : slow ? '20s' : `${beltSpeed}s`;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: BELT_HEIGHT,
      background: 'var(--belt-bg)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      border: '2px solid var(--belt-stripe)',
    }} ref={beltRef}>
      {/* Belt stripes animation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 28px, var(--belt-stripe) 28px, var(--belt-stripe) 30px)`,
        animation: frozen ? 'none' : `beltScroll ${slow ? '4s' : '2s'} linear infinite`,
        opacity: 0.5,
      }} />

      {/* Drop zone indicator */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        background: 'var(--n-pink)',
        boxShadow: '0 0 12px var(--n-pink)',
        zIndex: 5,
      }} />

      {/* Items */}
      {items.map(item => (
        <div
          key={item.uid}
          onClick={() => item.status === 'active' && onSelect(item)}
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            animation: item.status === 'dropped'
              ? 'fallOff 0.8s ease-in forwards'
              : item.status === 'matched'
              ? 'none'
              : `slideIn 0.3s ease-out, beltMove ${travelDuration} linear forwards`,
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
            cursor: item.status === 'active' ? 'pointer' : 'default',
            userSelect: 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
            zIndex: 2,
            ...(item.status === 'matched' ? {
              background: 'var(--correct)',
              color: '#fff',
              transform: 'translateY(-50%) scale(1.1)',
              opacity: 0,
              transition: 'all 0.5s',
            } : item.status === 'wrong' ? {
              background: 'var(--wrong)',
              color: '#fff',
              animation: 'shake 0.4s ease-in-out',
            } : item.uid === activeItemUid ? {
              background: 'var(--n-turquoise)',
              color: 'var(--n-navy)',
              boxShadow: '0 0 16px rgba(57, 196, 195, 0.5)',
            } : {
              background: 'var(--bg-card-light)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.1)',
            }),
          }}
        >
          {item.label}
          {e2Active && item.status === 'active' && (
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--n-turquoise)',
              marginTop: 2,
              opacity: 0.8,
            }}>
              → {DATABASE_LOOKUP[item.answerId] || ''}
            </span>
          )}
        </div>
      ))}

      {/* CSS for belt item movement */}
      <style>{`
        @keyframes beltMove {
          from { right: -200px; }
          to { right: calc(100% + 50px); }
        }
      `}</style>
    </div>
  );
}

// Quick lookup for E2 hints
import { DATABASE } from '../data/gameData';
const DATABASE_LOOKUP = Object.fromEntries(DATABASE.map(d => [d.id, d.name]));
