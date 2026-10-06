import { getBossAnim } from '../data/bossDialogue';

const BASE = '/assets/kenney/robot-pack/Side view/robot_red';

const POSE_MAP = {
  Idle: 'Body', Walk: 'Jump', Attack: 'Damage2', Hit: 'Hurt', Death: 'Damage1',
};

export default function MicrowaveBoss({ event = 'idle', line = '', elapsed = 0 }) {
  const animKey = getBossAnim(event);
  const pose = POSE_MAP[animKey] || 'Body';
  const src = `${BASE}${pose}.png`;

  // Boss grows bigger over time: 72px at start → 130px at 60s
  const scale = Math.min(130, 72 + (elapsed / 1000) * 1);
  const isAngry = pose === 'Hurt' || pose === 'Damage1' || pose === 'Damage2';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, minWidth: 300 }}>
      <img
        src={src}
        alt="Boss"
        style={{
          width: scale, height: scale,
          imageRendering: 'auto',
          animation: isAngry ? 'shake 0.5s ease-in-out infinite' : 'float 2.5s ease-in-out infinite',
          transition: 'width 0.5s, height 0.5s',
        }}
      />
      {line && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '8px 14px', fontSize: '0.9rem', fontWeight: 600,
          color: 'var(--text)', maxWidth: 260, lineHeight: 1.4,
          boxShadow: 'var(--shadow)', animation: 'pop 0.3s ease-out',
          position: 'relative',
        }}>
          {line}
          <div style={{
            position: 'absolute', left: -7, bottom: 12,
            borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
            borderRight: '7px solid var(--bg2)',
          }} />
        </div>
      )}
    </div>
  );
}
