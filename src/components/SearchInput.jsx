import { useState, useRef, useEffect } from 'react';
import { DATABASE } from '../data/gameData';

export default function SearchInput({ selItem, onMatch, e2, suggest }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const ddRef = useRef(null);

  useEffect(() => {
    if (e2 && selItem) {
      const ans = DATABASE.find(d => d.id === selItem.answerId);
      if (ans) { setQ(ans.name.slice(0, -1)); setOpen(true); setIdx(0); }
    } else if (!selItem) { setQ(''); setOpen(false); }
  }, [selItem, e2]);

  useEffect(() => { if (selItem && ref.current) ref.current.focus(); }, [selItem]);
  useEffect(() => { if (ddRef.current && open) { const el = ddRef.current.children[idx]; if (el) el.scrollIntoView({ block: 'nearest' }); } }, [idx, open]);

  let list = q.length > 0 ? DATABASE.filter(d => d.name.toLowerCase().includes(q.toLowerCase())) : [];
  if (e2 && selItem) list = [...list].sort((a, b) => (a.id === selItem.answerId ? -1 : b.id === selItem.answerId ? 1 : 0));
  const sugId = suggest && q.length >= 3 && selItem ? selItem.answerId : null;

  const go = dbId => { if (!selItem) return; onMatch(selItem.uid, dbId); setQ(''); setOpen(false); setIdx(0); };
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
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
          maxHeight: 200, overflowY: 'auto', zIndex: 100, boxShadow: 'var(--shadow)',
        }}>
          {list.slice(0, 10).map((d, i) => (
            <div key={d.id} onClick={() => go(d.id)} style={{
              padding: '10px 14px', cursor: 'pointer', fontSize: '1.05rem', fontFamily: "'Fira Code',monospace",
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
      <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', minHeight: 22 }}>
        {selItem ? `🔎 Match: "${selItem.label}"` : 'Waiting for package...'}
      </div>
      <input ref={ref} value={q} onChange={e => { setQ(e.target.value); setOpen(true); setIdx(0); }}
        onKeyDown={onKey} onFocus={() => q && setOpen(true)}
        placeholder={selItem ? 'Type to search...' : '—'} disabled={!selItem}
        style={{
          width: '100%', padding: '14px 18px', fontSize: '1.15rem', fontFamily: "'Fira Code',monospace",
          background: 'var(--bg2)', color: 'var(--text)',
          border: `2px solid ${selItem ? 'var(--n-turquoise)' : 'var(--text3)'}`,
          borderRadius: 10, outline: 'none',
          boxShadow: selItem ? '0 0 14px var(--glow)' : 'none',
        }}
      />
    </div>
  );
}
