/**
 * Kenney robots placed between and around the S-curve belts.
 * Full opacity, reactive to game performance.
 */
const BASE = '/assets/kenney/robot-pack/Side view/';

const WORKERS = [
  // Between belt 1 and 2
  { color: 'green', x: '8%', y: 0 },
  { color: 'blue', x: '25%', y: 0 },
  { color: 'yellow', x: '75%', y: 0 },
  { color: 'green', x: '90%', y: 0 },
  // Between belt 2 and 3
  { color: 'blue', x: '10%', y: 1 },
  { color: 'yellow', x: '40%', y: 1 },
  { color: 'green', x: '60%', y: 1 },
  { color: 'blue', x: '85%', y: 1 },
];

export default function WorkerRobots({ performance = 'ok' }) {
  // ok = Body, good = Jump (happy bounce), bad = Hurt
  const pose = performance === 'good' ? 'Jump' : performance === 'bad' ? 'Hurt' : 'Body';
  const anim = performance === 'good' ? 'bounce 0.6s ease-in-out infinite' : 'float 2.5s ease-in-out infinite';

  return (
    <>
      {WORKERS.map((w, i) => (
        <img
          key={i}
          src={`${BASE}robot_${w.color}${pose}.png`}
          alt=""
          style={{
            position: 'absolute',
            left: w.x,
            top: w.y === 0 ? 'calc(50% - 54px)' : 'calc(50% + 32px)',
            width: 36, height: 36,
            animation: `${anim}`,
            animationDelay: `${i * 0.2}s`,
            transform: i % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)',
            zIndex: 2,
            imageRendering: 'auto',
          }}
        />
      ))}
    </>
  );
}
