import { useState, useEffect } from 'react';

const BASE = '/assets/kenney/robot-pack/Side view/robot_';
const COLORS = ['green', 'blue', 'yellow'];
const POSES = { ok: ['Body', 'Drive1', 'Drive2'], good: ['Jump', 'Jump', 'Drive1'], bad: ['Hurt', 'Damage1', 'Damage2'] };

const DIALOGS = [
  'I ❤️ Enablement 2.0!', 'Ctrl + Automate FTW!', 'Ship it! 🚀',
  'Another match! 💪', 'Beep boop!', 'Break time yet?',
  'More incoming!', 'Speed run! ⚡', 'Who needs coffee?',
  'AI is my copilot', 'Faster! Faster!', 'Loading motivation...',
];

const WORKERS = [
  { x: 60, y: 8, flip: false, walk: 30 },
  { x: 220, y: 5, flip: true, walk: 20 },
  { x: 500, y: 10, flip: false, walk: 25 },
  { x: 750, y: 6, flip: true, walk: 15 },
  { x: 920, y: 12, flip: false, walk: 20 },
  { x: 80, y: 365, flip: true, walk: 25 },
  { x: 300, y: 370, flip: false, walk: 30 },
  { x: 550, y: 362, flip: true, walk: 20 },
  { x: 800, y: 368, flip: false, walk: 15 },
  { x: 950, y: 360, flip: true, walk: 25 },
  { x: 10, y: 120, flip: false, walk: 15 },
  { x: 15, y: 260, flip: false, walk: 20 },
  { x: 970, y: 130, flip: true, walk: 15 },
  { x: 965, y: 250, flip: true, walk: 20 },
];

export default function WorkerRobots({ performance = 'ok' }) {
  const [dialogIdx, setDialogIdx] = useState(-1);
  const [dialog, setDialog] = useState('');
  const [poses, setPoses] = useState(() => WORKERS.map(() => Math.floor(Math.random() * 3)));

  useEffect(() => {
    const t = setInterval(() => {
      setPoses(prev => prev.map(p => Math.random() < 0.3 ? Math.floor(Math.random() * 3) : p));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setDialogIdx(Math.floor(Math.random() * WORKERS.length));
      setDialog(DIALOGS[Math.floor(Math.random() * DIALOGS.length)]);
      setTimeout(() => setDialogIdx(-1), 2200);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const poseSet = POSES[performance] || POSES.ok;

  return (
    <>
      {WORKERS.map((w, i) => {
        const color = COLORS[i % COLORS.length];
        const pose = poseSet[poses[i] % poseSet.length];
        // Walking animation: oscillate left-right
        const walkDur = 2 + (i % 4);
        const walkDist = w.walk;
        return (
          <div key={i} style={{
            position: 'absolute', left: w.x, top: w.y, zIndex: 2,
            animation: `workerWalk${i % 2} ${walkDur}s ease-in-out infinite`,
          }}>
            <img
              src={`${BASE}${color}${pose}.png`}
              alt=""
              style={{
                width: 28, height: 28,
                imageRendering: 'auto',
                transform: w.flip ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            />
            {dialogIdx === i && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '3px 7px', fontSize: '8px', fontWeight: 700,
                color: 'var(--text)', whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow)', animation: 'pop 0.3s ease-out',
                marginBottom: 3,
              }}>
                {dialog}
              </div>
            )}
            {/* Inline keyframes for unique walk distance per worker */}
            <style>{`
              @keyframes workerWalk${i % 2} {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(${i % 2 === 0 ? walkDist : -walkDist}px); }
              }
            `}</style>
          </div>
        );
      })}
    </>
  );
}
