import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Pause, Play, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { FinishResult } from '../context/DataContext';
import type { SubjectId } from '../lib/types';
import { SUBJECTS } from '../lib/subjects';
import { RingProgress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Victory } from '../components/Victory';
import { rewardsForSession } from '../lib/xp';
import { clsx, fmtClock } from '../lib/format';
import { haptic } from '../native';

const GOALS = [
  { min: 0, label: 'Free' },
  { min: 25, label: '25m' },
  { min: 45, label: '45m' },
  { min: 60, label: '60m' },
  { min: 90, label: '90m' },
];

export function Study() {
  const { user, finishSession } = useData();
  const [subject, setSubject] = useState<SubjectId>('mathematics');
  const [custom, setCustom] = useState('');
  const [goalMin, setGoalMin] = useState(45);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [victory, setVictory] = useState<{ result: FinishResult; minutes: number } | null>(null);
  const tick = useRef<number>();

  useEffect(() => {
    if (running) {
      tick.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const goalSeconds = goalMin * 60;
  const ringValue = goalMin > 0 ? Math.min(1, seconds / goalSeconds) : (seconds % 3600) / 3600;
  const minutesStudied = Math.max(1, Math.round(seconds / 60));
  const reachedGoal = goalMin > 0 && seconds >= goalSeconds;

  // live reward preview
  const preview = rewardsForSession(Math.max(1, Math.floor(seconds / 60)) || 1, user.streak);

  function start() {
    setStarted(true);
    setRunning(true);
  }
  function finish() {
    setRunning(false);
    void haptic();
    const result = finishSession({
      subject,
      customSubject: subject === 'custom' ? custom || 'Custom' : undefined,
      minutes: minutesStudied,
    });
    setVictory({ result, minutes: minutesStudied });
  }
  function reset() {
    setRunning(false);
    setStarted(false);
    setSeconds(0);
  }

  return (
    <div className="space-y-6">
      <header className="text-center pt-2">
        <h1 className="text-2xl font-extrabold font-display">Study Session</h1>
        <p className="text-sm text-slate-400 mt-1">Focus. Earn. Climb the ladder.</p>
      </header>

      {/* Subject selector */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Subject</p>
        <div className="grid grid-cols-3 gap-2.5">
          {SUBJECTS.map((s) => {
            const active = s.id === subject;
            return (
              <button
                key={s.id}
                disabled={started}
                onClick={() => setSubject(s.id)}
                className={clsx(
                  'rounded-2xl p-3 border flex flex-col items-center gap-1.5 transition-all disabled:opacity-60',
                  active ? 'border-transparent' : 'border-white/8 bg-white/[0.03]',
                )}
                style={active ? { backgroundColor: `${s.color}22`, boxShadow: `inset 0 0 0 1.5px ${s.color}` } : undefined}
              >
                <Icon name={s.icon} size={22} style={{ color: active ? s.color : '#94a3b8' }} />
                <span className={clsx('text-xs font-semibold', active ? 'text-white' : 'text-slate-400')}>{s.label}</span>
              </button>
            );
          })}
        </div>
        {subject === 'custom' && (
          <input
            value={custom}
            disabled={started}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Name your subject…"
            className="mt-2.5 w-full rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-400/50 placeholder:text-slate-600"
          />
        )}
      </div>

      {/* Goal selector */}
      {!started && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Goal</p>
          <div className="flex gap-2">
            {GOALS.map((g) => (
              <button
                key={g.min}
                onClick={() => setGoalMin(g.min)}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors',
                  goalMin === g.min ? 'btn-grad border-transparent' : 'bg-white/[0.03] border-white/8 text-slate-400',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer ring */}
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          {running && (
            <span className="absolute inset-0 rounded-full bg-brand-500/30 animate-pulse-ring" />
          )}
          <RingProgress value={ringValue} size={244} stroke={14} from="#6c63f5" to="#16c5d8">
            <div className="text-center">
              <div className="text-5xl font-extrabold font-display tnum tracking-tight">{fmtClock(seconds)}</div>
              <div className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">
                {goalMin > 0 ? (reachedGoal ? '🎯 Goal reached!' : `Goal · ${goalMin}m`) : 'Free session'}
              </div>
            </div>
          </RingProgress>
        </div>

        {/* live preview */}
        {started && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 mt-5 text-sm">
            <span className="text-brand-300 font-bold">+{preview.xp} XP</span>
            <span className="text-gold font-bold">+{preview.coins} coins</span>
            <span className="text-win font-bold">+{preview.rating} rating</span>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!started ? (
          <Button size="lg" full onClick={start} disabled={subject === 'custom' && !custom.trim()}>
            <Play size={20} fill="currentColor" /> Start Studying
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="lg" onClick={reset} aria-label="Reset">
              <RotateCcw size={20} />
            </Button>
            <Button
              variant={running ? 'glass' : 'primary'}
              size="lg"
              className="flex-1"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? <><Pause size={20} /> Pause</> : <><Play size={20} fill="currentColor" /> Resume</>}
            </Button>
            <Button variant="gold" size="lg" onClick={finish} aria-label="Finish">
              <Check size={20} strokeWidth={3} /> Finish
            </Button>
          </>
        )}
      </div>

      {victory && (
        <Victory
          result={victory.result}
          subject={subject}
          customSubject={custom}
          minutes={victory.minutes}
          onClaim={() => {
            setVictory(null);
            reset();
          }}
        />
      )}
    </div>
  );
}
