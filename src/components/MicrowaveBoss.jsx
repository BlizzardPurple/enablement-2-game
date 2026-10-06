import { getBossAnim } from '../data/bossDialogue';

const SPRITES = {
  Idle: { src: '/assets/microwave/Idle.png', frames: 5, w: 400 },
  Walk: { src: '/assets/microwave/Walk.png', frames: 6, w: 480 },
  Attack: { src: '/assets/microwave/Attack.png', frames: 15, w: 1200 },
  Hit: { src: '/assets/microwave/Hit.png', frames: 4, w: 320 },
  Death: { src: '/assets/microwave/Death.png', frames: 8, w: 640 },
};
const ANIM_NAMES = { Idle: 'spriteIdle', Walk: 'spriteWalk', Attack: 'spriteAttack', Hit: 'spriteHit', Death: 'spriteDeath' };

export default function MicrowaveBoss({ event = 'idle', line = '', elapsed = 0 }) {
  const animKey = getBossAnim(event);
  const sprite = SPRITES[animKey] || SPRITES.Idle;
  const animName = ANIM_NAMES[animKey] || 'spriteIdle';

  // Boss grows bigger over time: 80px at start → 140px at 60s
  const scale = Math.min(140, 80 + (elapsed / 1000) * 1);
  const speed = animKey === 'Attack' ? 1.2 : animKey === 'Hit' ? 0.4 : 0.8;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, minWidth: 320 }}>
      <div style={{
        width: scale, height: scale,
        backgroundImage: `url(${sprite.src})`,
        backgroundSize: `${sprite.w * (scale / 80)}px ${scale}px`,
        imageRendering: 'pixelated',
        animation: `${animName} ${speed}s steps(${sprite.frames}) infinite`,
        transition: 'width 0.5s, height 0.5s',
      }} />
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
