import Package from './Package';

/**
 * Single belt strip. direction: 'ltr' or 'rtl'.
 * Items animate across; clicking one selects it for matching.
 */
export default function Belt({ number, direction = 'ltr', items, selectedUid, onSelect, frozen, slow, e2 }) {
  const speed = frozen ? '999s' : slow ? '4s' : e2 ? '0.8s' : '2s';
  const scrollAnim = direction === 'ltr' ? 'beltScroll' : 'beltScrollR';
  const borderColor = number === 3 ? 'var(--n-pink)' : number === 2 ? 'var(--n-orange)' : 'var(--n-turquoise)';

  return (
    <div style={{
      position: 'relative',
      height: 80,
      background: 'var(--bg-belt)',
      borderRadius: 10,
      overflow: 'hidden',
      borderLeft: `4px solid ${borderColor}`,
      borderRight: `4px solid ${borderColor}`,
    }}>
      {/* Belt stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 28px, var(--belt-stripe) 28px, var(--belt-stripe) 30px)`,
        animation: frozen ? 'none' : `${scrollAnim} ${speed} linear infinite`,
        opacity: 0.4,
      }} />

      {/* Belt number label */}
      <div style={{
        position: 'absolute', top: 4, [direction === 'ltr' ? 'left' : 'right']: 8,
        fontSize: '0.6rem', fontWeight: 800, color: borderColor, opacity: 0.6,
        textTransform: 'uppercase', letterSpacing: '0.1em', zIndex: 5,
      }}>
        Belt {number} {number === 3 ? '⚠️' : number === 2 ? '→' : ''}
      </div>

      {/* Drop zone */}
      <div style={{
        position: 'absolute',
        [direction === 'ltr' ? 'right' : 'left']: 0,
        top: 0, bottom: 0, width: 4,
        background: 'var(--n-pink)',
        boxShadow: '0 0 10px var(--n-pink)',
        zIndex: 5,
      }} />

      {/* Items */}
      {items.map(item => (
        <Package
          key={item.uid}
          item={item}
          direction={direction}
          isSelected={item.uid === selectedUid}
          onClick={() => item.status === 'active' && onSelect(item.uid)}
          e2={e2}
          frozen={frozen}
          slow={slow}
        />
      ))}
    </div>
  );
}
