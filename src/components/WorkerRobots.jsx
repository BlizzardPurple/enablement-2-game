import { useState, useEffect } from 'react';

const BASE = '/assets/kenney/robot-pack/Side view/robot_';
const COLORS = ['green', 'blue', 'yellow'];
const POSES = { ok: ['Body', 'Drive1', 'Drive2'], good: ['Jump', 'Jump', 'Drive1'], bad: ['Hurt', 'Damage1', 'Damage2'] };

const DIALOGS = [
  'I ❤️ Enablement 2.0!',
  'Ctrl + Automate FTW!',
  'Ship it! 🚀',
  'Another match! 💪',
  'Beep boop! 🤖',
  'Is it break time yet?',
  'More packages incoming!',
  'Speed run! ⚡',
  'Who needs coffee?',
  'AI is my copilot 🧠',
];

// Workers positioned AROUND the belt — top, bottom, sides
const WORKERS = [
  // Above belt 1
  { x: 60, y: 8, flip: false },
  { x: 220, y: 5, flip: true },
  { x: 500, y: 10, flip: false },
  { x: 750, y: 6, flip: true },
  { x: 920, y: 12, flip: false },
  // Below belt 3
  { x: 80, y: 365, flip: true },
  { x: 300, y: 370, flip: false },
  { x: 550, y: 362, flip: true },
  { x: 800, y: 368, flip: false },
  { x: 950, y: 360, flip: true },
  // Left side between belts
  { x: 10, y: 120, flip: false },
  { x: 15, y: 260, flip: false },
  // Right side between belts
  { x: 970, y: 130, flip: true },
  { x: 965, y: 250, flip: true },
];

export default function WorkerRobots({ performance = 'ok' }) {
  const [dialogIdx, setDialogIdx] = useState(-1); // which worker shows dialog
  const [dialog, setDialog] = useState('');
  const [workerPoses, setWorkerPoses] = useState(() =>
    WORKERS.map(() => Math.floor(Math.random() * 3))
  );

  // Randomly swap poses every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setWorkerPoses(prev => prev.map((p, i) =>
        Math.random() < 0.3 ? Math.floor(Math.random() * 3) : p
      ));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Random dialog popup every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setDialogIdx(Math.floor(Math.random() * WORKERS.length));
      setDialog(DIALOGS[Math.floor(Math.random() * DIALOGS.length)]);
      setTimeout(() => setDialogIdx(-1), 2500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const poses = POSES[performance] || POSES.ok;

  return (
    <>
      {WORKERS.map((w, i) => {
        const color = COLORS[i % COLORS.length];
        const pose = poses[workerPoses[i] % poses.length];
        return (
          <div key={i} style={{ position: 'absolute', left: w.x, top: w.y, zIndex: 2 }}>
            <img
              src={`${BASE}${color}${pose}.png`}
              alt=""
              style={{
                width: 30, height: 30,
                imageRendering: 'auto',
                animation: performance === 'good' ? 'bounce 0.6s ease-in-out infinite' : 'float 2.5s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
                transform: w.flip ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            />
            {/* Dialog bubble */}
            {dialogIdx === i && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '4px 8px', fontSize: '9px', fontWeight: 700,
                color: 'var(--text)', whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow)', animation: 'pop 0.3s ease-out',
                marginBottom: 4,
              }}>
                {dialog}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
