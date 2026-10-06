import { useState, useRef, useEffect } from 'react';
import { DATABASE } from '../data/gameData';

export default function SearchInput({ selectedItem, onMatch, e2, autoSuggest }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);

  // E2 mode: pre-fill correct answer
  useEffect(() => {
    if (e2 && selectedItem) {
      const ans = DATABASE.find(d => d.id === selectedItem.answerId);
      if (ans) { setQuery(ans.name.slice(0, -1)); setOpen(true); setIdx(0); }
    } else if (!selectedItem) {
      setQuery(''); setOpen(false);
    }
  }, [selectedItem, e2]);

  useEffect(() => { if (selectedItem && ref.current) ref.current.focus(); }, [selectedItem]);

  const filtered = query.length > 0
    ? DATABASE.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // In E2 mode, put correct answer first
  if (e2 && selectedItem) {
    filtered.sort((a, b) => {
      if (a.id === selectedItem.answerId) return -1;
      if (b.id === selectedItem.answerId) return 1;
      return 0;
    });
  }

  const suggestedId = autoSuggest && query.length >= 3 && selectedItem ? selectedItem.answerId : null;

  const submit = (dbId) => {
    if (!selectedItem) return;
    onMatch(selectedItem.uid, dbId);
    setQuery(''); setOpen(false); setIdx(0);
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && filtered.length > 0) { e.preventDefault(); submit(filtered[idx].id); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', minHeight: 20 }}>
        {selectedItem ? `🔎 Match: "${selectedItem.label}"` : 'Waiting for package...'}
      </div>
      <input
        ref={ref}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setIdx(0); }}
        onKeyDown={handleKey}
        onFocus={() => query && setOpen(true)}
        placeholder={selectedItem ? 'Type to search...' : '—'}
        disabled={!selectedItem}
        style={{
          width: '100%', padding: '14px 18px', fontSize: '1.1rem',
          fontFamily: "'Fira Code', monospace",
          background: 'var(--bg-card)', color: 'var(--text)',
          border: `2px solid ${selectedItem ? 'var(--n-turquoise)' : 'var(--text-dim)'}`,
          borderRadius: 10, outline: 'none',
          boxShadow: selectedItem ? '0 0 14px var(--glow)' : 'none',
          transition: 'all 0.2s',
        }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, maxHeight: 180, overflowY: 'auto', zIndex: 100,
          boxShadow: 'var(--shadow)',
        }}>
          {filtered.slice(0, 8).map((d, i) => (
            <div
              key={d.id}
              onClick={() => submit(d.id)}
              style={{
                padding: '10px 14px', cursor: 'pointer', fontSize: '1rem',
                fontFamily: "'Fira Code', monospace",
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: i === idx ? 'rgba(57,196,195,0.15)' : d.id === suggestedId ? 'rgba(57,196,195,0.08)' : 'transparent',
                borderLeft: d.id === suggestedId ? '3px solid var(--n-turquoise)' : '3px solid transparent',
              }}
            >
              <span>{d.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.region}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
