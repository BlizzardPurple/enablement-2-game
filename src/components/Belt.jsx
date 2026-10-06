import Package from './Package';

export default function Belt({ num, dir, items, selUid, onSel, frozen, slow, e2 }) {
  const speed = frozen ? '999s' : slow ? '4s' : e2 ? '0.8s' : '2s';
  const scrollAnim = dir === 'ltr' ? 'beltL' : 'beltR';
  const col = 'var(--n-turquoise)';

  return (
    <div style={{
      position: 'relative', height: 76,
      background: 'var(--belt-bg)', borderRadius: 10,
      overflow: 'hidden',
      border: `2px solid var(--belt-stripe)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent 18px,var(--belt-stripe) 18px,var(--belt-stripe) 20px)`,
        animation: frozen ? 'none' : `${scrollAnim} ${speed} linear infinite`,
        opacity: 0.4,
      }} />
      {/* End zone */}
      <div style={{
        position: 'absolute', [dir === 'ltr' ? 'right' : 'left']: 0,
        top: 0, bottom: 0, width: 4,
        background: 'var(--n-pink)', boxShadow: '0 0 10px var(--n-pink)', zIndex: 5,
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
