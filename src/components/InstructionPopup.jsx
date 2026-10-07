import PowerupIcon from './PowerupIcon';

export default function InstructionPopup({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '2rem 2.5rem', maxWidth: 480, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        margin: '0 auto',
      }}>
        {/* Boss image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
          <img
            src="/assets/kenney/robot-pack/Side view/robot_redBody.png"
            alt="Boss" style={{ width: 56, height: 56 }}
          />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
              How to Play
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)', margin: '2px 0 0' }}>
              60 seconds. Match fast. Don't drop packages.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Step num="1" title="Read the label" desc="Messy package labels appear on the conveyor belt" />
          <Step num="2" title="Type to search" desc="Start typing the correct site name in the search box" />
          <Step num="3" title="Select the match" desc="Pick the right option from the dropdown, then press Enter" />
        </div>

        {/* Powerup callout */}
        <div style={{
          marginTop: '1.25rem', padding: '12px 14px',
          background: 'rgba(255,148,8,0.08)', border: '1px solid rgba(255,148,8,0.2)',
          borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--n-orange)' }}>
              Watch for powerups!
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PowerupIcon type="shield" size={14} /> Shield</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PowerupIcon type="time" size={14} /> +5s</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PowerupIcon type="bonus" size={14} /> 2× Score</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PowerupIcon type="slow" size={14} /> Slow</span>
            </div>
          </div>
        </div>

        {/* E2 callout */}
        {/* Removed — don't reveal the E2 multiplier upfront */}

        {/* Start button */}
        <button onClick={onClose} style={{
          marginTop: '1.5rem', width: '100%', padding: '14px',
          fontSize: '1.1rem', fontWeight: 800, fontFamily: 'inherit',
          color: '#fff', background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          boxShadow: '0 4px 16px var(--glow)',
        }}>
          Got it — Start!
        </button>

        {/* Keyboard hints */}
        <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text3)' }}>
          ⌨️ Type to search · ↑↓ Navigate · ↵ Confirm
        </div>
      </div>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--n-turquoise), var(--n-purple))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 800, color: '#fff',
      }}>{num}</div>
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 1 }}>{desc}</div>
      </div>
    </div>
  );
}
