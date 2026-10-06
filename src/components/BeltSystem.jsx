import Belt from './Belt';

/**
 * 3 connected belts: Belt 1 (L→R), Belt 2 (R→L), Belt 3 (L→R).
 * Arrows between them show the flow.
 */
export default function BeltSystem({ belt, selectedUid, onSelect, frozen, slow, e2, elapsed }) {
  const belt1Items = belt.getBeltItems(1);
  const belt2Items = belt.getBeltItems(2);
  const belt3Items = belt.getBeltItems(3);

  // Belt 2 activates at 10s, Belt 3 at 25s
  const show2 = elapsed >= 10000;
  const show3 = elapsed >= 25000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Belt number={1} direction="ltr" items={belt1Items} selectedUid={selectedUid} onSelect={onSelect} frozen={frozen} slow={slow} e2={e2} />

      {/* Connector arrow */}
      <div style={{ textAlign: 'right', paddingRight: 12, fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1, height: 14 }}>
        {show2 ? '↓' : ''}
      </div>

      {show2 && (
        <Belt number={2} direction="rtl" items={belt2Items} selectedUid={selectedUid} onSelect={onSelect} frozen={frozen} slow={slow} e2={e2} />
      )}

      {show2 && (
        <div style={{ textAlign: 'left', paddingLeft: 12, fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1, height: 14 }}>
          {show3 ? '↓' : ''}
        </div>
      )}

      {show3 && (
        <Belt number={3} direction="ltr" items={belt3Items} selectedUid={selectedUid} onSelect={onSelect} frozen={frozen} slow={slow} e2={e2} />
      )}
    </div>
  );
}
