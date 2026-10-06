import { useState, useRef, useEffect } from 'react';
import { DATABASE } from '../data/gameData';

export default function SearchInput({ activeItem, onMatch, e2Active, autoSuggest = false }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Auto-fill for E2 mode
  useEffect(() => {
    if (e2Active && activeItem) {
      const answer = DATABASE.find(d => d.id === activeItem.answerId);
      if (answer) {
        // Pre-fill most of the name
        const prefill = answer.name.slice(0, -2);
        setQuery(prefill);
        setShowDropdown(true);
      }
    } else {
      setQuery('');
      setShowDropdown(false);
    }
  }, [activeItem, e2Active]);

  // Focus input when active item changes
  useEffect(() => {
    if (activeItem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeItem]);

  const filtered = query.length > 0
    ? DATABASE.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Auto-suggest powerup: highlight correct answer after 3 chars
  const suggestedId = autoSuggest && query.length >= 3 && activeItem
    ? activeItem.answerId
    : null;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered.length > 0 && activeItem) {
      e.preventDefault();
      onMatch(activeItem.uid, filtered[selectedIndex].id);
      setQuery('');
      setShowDropdown(false);
      setSelectedIndex(0);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSelect = (dbId) => {
    if (!activeItem) return;
    onMatch(activeItem.uid, dbId);
    setQuery('');
    setShowDropdown(false);
    setSelectedIndex(0);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
    }}>
      {/* Label */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 600,
      }}>
        {activeItem ? `Match: ${activeItem.label}` : 'Waiting for item...'}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
          setSelectedIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length > 0 && setShowDropdown(true)}
        placeholder={activeItem ? 'Type to search database...' : '—'}
        disabled={!activeItem}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: `2px solid ${activeItem ? 'var(--n-turquoise)' : 'var(--text-dim)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: activeItem ? '0 0 12px rgba(57, 196, 195, 0.2)' : 'none',
        }}
      />

      {/* Dropdown */}
      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-sm)',
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: 'var(--shadow-card)',
        }}>
          {filtered.map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => handleSelect(entry.id)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: i === selectedIndex
                  ? 'rgba(57, 196, 195, 0.15)'
                  : entry.id === suggestedId
                  ? 'rgba(57, 196, 195, 0.08)'
                  : 'transparent',
                borderLeft: entry.id === suggestedId ? '3px solid var(--n-turquoise)' : '3px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <span>{entry.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{entry.region}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
