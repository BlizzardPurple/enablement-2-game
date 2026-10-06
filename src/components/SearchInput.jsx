import { useState, useRef, useEffect } from 'react';
import { DATABASE } from '../data/gameData';

export default function SearchInput({ selItem, onMatch, e2 }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [e2Options, setE2Options] = useState([]); // stable 2-option list for E2 mode
  const ref = useRef(null);
  const ddRef = useRef(null);
  const lastSelUid = useRef(null);

  // E2 mode: pre-fill and build stable 2-option list when selected item changes
  useEffect(() => {
    if (e2 && selItem && selItem.uid !== lastSelUid.current) {
      lastSelUid.current = selItem.uid;
      const correct = DATABASE.find(d => d.id === selItem.answerId);
      if (correct) {
        setQ(correct.name.slice(0, -1));
        // Pick a SIBLING wrong answer — same platform, different region
        const platform = selItem.answerId.split('-')[0]; // e.g. "spotify" from "spotify-jp"
        const siblings = DATABASE.filter(d => d.id !== selItem.answerId && d.id.startsWith(platform + '-'));
        let wrongPick;
        if (siblings.length > 0) {
          wrongPick = siblings[Math.floor(Math.random() * siblings.length)];
        } else {
          // fallback to any random wrong answer
          const allOthers = DATABASE.filter(d => d.id !== selItem.answerId);
          wrongPick = allOthers[Math.floor(Math.random() * allOthers.length)];
        }
        // Randomly order them so correct isn't always first
        const pair = [correct, wrongPick].filter(Boolean);
        if (Math.random() > 0.5) pair.reverse();
        setE2Options(pair);
        setOpen(true);
        setIdx(0);
      }
    } else if (!selItem) {
      setQ('');
      setOpen(false);
      setE2Options([]);
      lastSelUid.current = null;
    }
  }, [selItem, e2]);

  useEffect(() => { if (selItem && ref.current) ref.current.focus(); }, [selItem]);
  useEffect(() => {
    if (ddRef.current && open) {
      const el = ddRef.current.children[idx];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [idx, open]);

  // In E2 mode, use the stable pre-built options. Otherwise filter normally.
  let list;
  if (e2 && e2Options.length > 0) {
    list = e2Options;
  } else {
    list = q.length > 0 ? DATABASE.filter(d => d.name.toLowerCase().includes(q.toLowerCase())) : [];
  }

  // Auto-suggest: always highlight correct answer after 3 chars
  const sugId = q.length >= 3 && selItem ? selItem.answerId : null;

  const go = dbId => {
    if (!selItem) return;
    onMatch(selItem.uid, dbId);
    setQ('');
    setOpen(false);
    setIdx(0);
    setE2Options([]);
    lastSelUid.current = null;
  };

  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, list.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && list.length > 0) { e.preventDefault(); go(list[idx].id); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
      {open && list.length > 0 && (
        <div ref={ddRef} style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
          background: 'var(--bg2)', border: `1px solid ${e2 ? 'var(--n-turquoise)' : 'var(--border)'}`,
          borderRadius: 10, maxHeight: 200, overflowY: 'auto', zIndex: 100,
          boxShadow: e2 ? '0 0 20px rgba(57,196,195,0.15), var(--shadow)' : 'var(--shadow)',
        }}>
          {list.slice(0, 10).map((d, i) => (
            <div key={d.id} onClick={() => go(d.id)} style={{
              padding: '10px 14px', cursor: 'pointer', fontSize: '1.05rem',
              fontFamily: "'Fira Code',monospace",
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: i === idx ? 'rgba(57,196,195,0.15)' : d.id === sugId ? 'rgba(57,196,195,0.08)' : 'transparent',
              borderLeft: d.id === sugId ? '3px solid var(--n-turquoise)' : '3px solid transparent',
            }}>
              <span style={{ fontWeight: 600 }}>{d.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{d.region}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{
        fontSize: '0.85rem', color: e2 ? 'var(--n-turquoise)' : 'var(--text2)',
        marginBottom: 4, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '.08em', minHeight: 22,
      }}>
        {selItem
          ? e2
            ? `🚀 AI Assist: "${selItem.label}"`
            : `🔎 Match: "${selItem.label}"`
          : 'Waiting for package...'}
      </div>
      <input ref={ref} value={q}
        onChange={e => {
          if (!e2) { // In E2 mode, don't allow manual typing — use pre-filled value
            setQ(e.target.value);
            setOpen(true);
            setIdx(0);
          }
        }}
        onKeyDown={onKey}
        onFocus={() => (q || e2) && setOpen(true)}
        placeholder={selItem ? (e2 ? 'Press ↑↓ then Enter' : 'Type to search...') : '—'}
        disabled={!selItem}
        readOnly={e2}
        style={{
          width: '100%', padding: '14px 18px', fontSize: '1.15rem',
          fontFamily: "'Fira Code',monospace",
          background: 'var(--bg2)', color: 'var(--text)',
          border: `2px solid ${e2 ? 'var(--n-turquoise)' : selItem ? 'var(--n-turquoise)' : 'var(--text3)'}`,
          borderRadius: 10, outline: 'none',
          boxShadow: e2 ? '0 0 20px rgba(57,196,195,0.2)' : selItem ? '0 0 14px var(--glow)' : 'none',
        }}
      />
    </div>
  );
}
