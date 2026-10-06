import Package from './Package';

export default function Belt({ num, dir, items, selUid, onSel, frozen, slow, e2 }) {
  const speed = frozen ? '999s' : slow ? '4s' : e2 ? '1.2s' : '2s';
  const scrollAnim = dir === 'ltr' ? 'beltL' : 'beltR';

  // Which end is the "open" side connecting to the U-turn
  // Belt 1 (L→R): right end connects to corner
  // Belt 2 (R→L): left end connects to corner
  // Belt 3 (L→R): neither end connects (or right end is the drop zone)
  const roundLeft = num !== 2;  // square off left for belt 2 (connects to corner)
  const roundRight = num !== 1; // square off right for belt 1 (connects to corner)

  return (
    <div style={{
      position: 'relative', height: 76,
      background: 'var(--belt-bg)',
      borderRadius: `${roundLeft ? 10 : 0}px ${roundRight ? 10 : 0}px ${roundRight ? 10 : 0}px ${roundLeft ? 10 : 0}px`,
      overflow: 'hidden',
      borderTop: '2px solid var(--belt-stripe)',
      borderBottom: '2px solid var(--belt-stripe)',
      borderLeft: roundLeft ? '2px solid var(--belt-stripe)' : 'none',
      borderRight: roundRight ? '2px solid var(--belt-stripe)' : 'none',
    }}>
      {/* Belt stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent 18px,var(--belt-stripe) 18px,var(--belt-stripe) 20px)`,
        animation: frozen ? 'none' : `${scrollAnim} ${speed} linear infinite`,
        opacity: 0.35,
      }} />

      {/* Drop zone — only on the exit end */}
      <div style={{
        position: 'absolute',
        [dir === 'ltr' ? 'right' : 'left']: 0,
        top: 0, bottom: 0, width: 4,
        background: 'var(--n-pink)',
        boxShadow: '0 0 10px var(--n-pink)',
        zIndex: 5,
        display: num === 3 ? 'block' : 'none', // only show drop zone on belt 3
      }} />

      {items.map(item => (
        <Package key={item.uid} item={item} dir={dir} isSel={item.uid === selUid}
          onClick={() => item.status === 'active' && onSel(item.uid)}
          e2={e2} frozen={frozen} slow={slow}
        />
      ))}
    </div>
  );
}
