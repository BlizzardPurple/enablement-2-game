const SPRITE_BASE = '/assets/kenney/robot-pack/Side view/robot_red';

const EMOTION_MAP = {
  Body: 'Body', Jump: 'Jump', Hurt: 'Hurt', Damage1: 'Damage1', Damage2: 'Damage2',
};

export default function RobotBoss({ emotion = 'Body', line = '' }) {
  const sprite = `${SPRITE_BASE}${EMOTION_MAP[emotion] || 'Body'}.png`;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 10,
      position: 'relative',
    }}>
      <img
        src={sprite}
        alt="Boss"
        style={{
          width: 56, height: 56, imageRendering: 'auto',
          animation: emotion === 'Damage2' ? 'shake 0.5s ease-in-out infinite' : 'float 2.5s ease-in-out infinite',
          transition: 'all 0.2s',
        }}
      />
      {line && (
        <div style={{
          background: 'var(--bg-card2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '8px 12px', fontSize: '0.78rem',
          color: 'var(--text)', maxWidth: 240, lineHeight: 1.4,
          boxShadow: 'var(--shadow)', position: 'relative',
          animation: 'popIn 0.3s ease-out',
        }}>
          {line}
          <div style={{
            position: 'absolute', left: -6, bottom: 10,
            width: 0, height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: '6px solid var(--bg-card2)',
          }} />
        </div>
      )}
    </div>
  );
}
