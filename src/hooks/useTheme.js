import { useState, useEffect } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('cc-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cc-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}
