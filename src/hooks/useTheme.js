import { useState, useEffect } from 'react';
export default function useTheme() {
  const [dark, setDark] = useState(() => (localStorage.getItem('cc-theme') || 'dark') === 'dark');
  useEffect(() => { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); localStorage.setItem('cc-theme', dark ? 'dark' : 'light'); }, [dark]);
  return { dark, toggle: () => setDark(d => !d) };
}
