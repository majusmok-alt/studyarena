import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Swords, Trophy } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card, SectionTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/Progress';
import { Countdown } from '../components/ui/Countdown';
import { Icon } from '../components/ui/Icon';
import { FRIENDS } from '../lib/mockData';
import { SUBJECTS, getSubject } from '../lib/subjects';
import { clsx } from '../lib/format';
import type { Battle, SubjectId } from '../lib/types';

const DURATIONS = [25, 45, 60, 90];

export function Battles() {
  const { user, battles, challengeFriend } = useData();
  const [open, setOpen] = useState(false);
  const [friendId, setFriendId] = useState(FRIENDS[0].id);
  const [subject, setSubject] = useState<SubjectId>('mathematics');
  const [duration, setDuration] = useState(60);

  const active = useMemo(() => battles.filter((b) => b.status === 'active' || b.status === 'pending'), [battles]);
  const history = useMemo(() => battles.filter((b) => b.status === 'completed'), [battles]);
  const winRate = user.wins + user.losses > 0 ? Math.round((user.wins / (user.wins + user.losses)) * 100) : 0;

  function send() {
    challengeFriend(friendId, subject, duration);
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold font-display">Battles</h1>
          <p className="text-sm text-slate-400">Study head-to-head. Winner takes rating.</p>
        </div>
      </header>

      {/* Record card */}
      <Card glass className="grid grid-cols-3 divide-x divide-white/8">
        <div className="text-center px-2">
          <p className="text-2xl font-extrabold font-display text-win tnum">{user.wins}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Wins</p>
        </div>
        <div className="text-center px-2">
          <p className="text-2xl font-extrabold font-display text-loss tnum">{user.losses}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Losses</p>
        </div>
        <div className="text-center px-2">
          <p className="text-2xl font-extrabold font-display text-brand-300 tnum">{winRate}%</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Win rate</p>
        </div>
      </Card>

      {/* Battle types */}
      <div className="grid grid-cols-3 gap-2.5">
        <TypeCard icon={<Swords size={18} />} tint="#fb7185" title="Focus" subtitle="1v1" onClick={() => setOpen(true)} />
        <TypeCard icon={<Calendar size={18} />} tint="#16c5d8" title="Daily" subtitle="Score" />
        <TypeCard icon={<Trophy size={18} />} tint="#f5c451" title="Weekly" subtitle="Tourney" />
      </div>

      <Button full size="lg" onClick={() => setOpen(true)}>
        <Plus size={20} /> Challenge a Friend
      </Button>

      {/* Active battles */}
      <section>
        <SectionTitle>Active Battles</SectionTitle>
        {active.length === 0 ? (
          <Card className="text-center py-6 text-sm text-slate-400">No active battles yet.</Card>
        ) : (
          <div className="space-y-3">
            {active.map((b) => (
              <ActiveBattle key={b.id} battle={b} meName={user.username} meAvatar={user.avatarUrl} />
            ))}
          </div>
        )}
      </section>

      {/* Tournament teaser */}
      <Card className="relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/15 text-gold"><Trophy size={24} /></span>
          <div className="flex-1">
            <p className="font-bold font-display">Weekly Tournament</p>
            <p className="text-xs text-slate-400">128 students · ends in <Countdown to={weekEnd()} compact /></p>
          </div>
          <span className="text-xs font-bold rounded-full bg-gold/15 text-gold px-2.5 py-1">#14</span>
        </div>
      </Card>

      {/* History */}
      <section>
        <SectionTitle>Match History</SectionTitle>
        <div className="space-y-2">
          {history.map((b) => {
            const subj = getSubject(b.subject);
            const win = b.result === 'win';
            return (
              <Card key={b.id} appear={false} className="flex items-center gap-3 py-3">
                <span
                  className={clsx('w-1.5 h-10 rounded-full', win ? 'bg-win' : 'bg-loss')}
                />
                <Avatar username={b.opponentName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">vs @{b.opponentName}</p>
                  <p className="text-xs text-slate-400 inline-flex items-center gap-1">
                    <Icon name={subj.icon} size={11} style={{ color: subj.color }} /> {subj.label} · {b.durationMin}m
                  </p>
                </div>
                <div className="text-right">
                  <p className={clsx('font-bold text-sm', win ? 'text-win' : 'text-loss')}>
                    {win ? 'WIN' : 'LOSS'}
                  </p>
                  <p className={clsx('text-xs tnum', win ? 'text-win/80' : 'text-loss/80')}>
                    {win ? '+' : '−'}{b.ratingStake}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* New challenge sheet */}
      <Sheet open={open} onClose={() => setOpen(false)} title="New Focus Battle">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Opponent</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {FRIENDS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFriendId(f.id)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 shrink-0 w-16 rounded-2xl p-1.5 border transition-colors',
                    friendId === f.id ? 'border-brand-400/50 bg-brand-500/10' : 'border-transparent',
                  )}
                >
                  <Avatar username={f.username} size="md" online={f.online} />
                  <span className="text-[11px] text-slate-300 truncate w-full text-center">@{f.username}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Subject</p>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={clsx(
                    'rounded-xl py-2 flex flex-col items-center gap-1 border text-xs font-semibold transition-colors',
                    subject === s.id ? 'border-transparent text-white' : 'border-white/8 text-slate-400 bg-white/[0.03]',
                  )}
                  style={subject === s.id ? { backgroundColor: `${s.color}22`, boxShadow: `inset 0 0 0 1.5px ${s.color}` } : undefined}
                >
                  <Icon name={s.icon} size={18} style={{ color: subject === s.id ? s.color : '#94a3b8' }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Duration</p>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={clsx(
                    'flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors',
                    duration === d ? 'btn-grad border-transparent' : 'bg-white/[0.03] border-white/8 text-slate-400',
                  )}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/8 px-4 py-3">
            <span className="text-sm text-slate-300">Rating at stake</span>
            <span className="font-bold text-brand-300 tnum">±{Math.round(20 + duration / 6)}</span>
          </div>

          <Button full size="lg" onClick={send}>
            <Swords size={18} /> Send Challenge
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function TypeCard({ icon, title, subtitle, tint, onClick }: { icon: React.ReactNode; title: string; subtitle: string; tint: string; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="rounded-2xl p-3 bg-white/[0.03] border border-white/8 flex flex-col items-center gap-1.5"
    >
      <span className="grid place-items-center w-10 h-10 rounded-xl" style={{ backgroundColor: `${tint}22`, color: tint }}>
        {icon}
      </span>
      <span className="text-sm font-bold">{title}</span>
      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{subtitle}</span>
    </motion.button>
  );
}

function ActiveBattle({ battle, meName, meAvatar }: { battle: Battle; meName: string; meAvatar: string | null }) {
  const subj = getSubject(battle.subject);
  const leading = battle.myProgress >= battle.oppProgress;
  return (
    <Card appear={false} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-2.5 py-1" style={{ backgroundColor: `${subj.color}22`, color: subj.color }}>
          <Icon name={subj.icon} size={12} /> {battle.type === 'daily' ? 'Daily Challenge' : `${battle.durationMin}m Focus`}
        </span>
        <span className="text-xs text-slate-400">
          {battle.status === 'pending' ? 'Awaiting accept' : <><Countdown to={battle.endsAt} compact /> left</>}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar username={meName} src={meAvatar} size="sm" />
          <span className="text-sm font-bold truncate">You</span>
        </div>
        <span className="text-xs text-slate-500 font-bold">VS</span>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-bold truncate">@{battle.opponentName}</span>
          <Avatar username={battle.opponentName} size="sm" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ProgressBar value={battle.myProgress} gradient="from-brand-400 to-accent-400" className="flex-1" />
          <span className="text-[11px] tnum text-brand-300 w-9 text-right">{Math.round(battle.myProgress * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <ProgressBar value={battle.oppProgress} gradient="from-slate-500 to-slate-400" className="flex-1" />
          <span className="text-[11px] tnum text-slate-400 w-9 text-right">{Math.round(battle.oppProgress * 100)}%</span>
        </div>
      </div>

      {battle.status === 'active' && (
        <p className={clsx('text-xs font-semibold text-center', leading ? 'text-win' : 'text-loss')}>
          {leading ? '🔥 You’re ahead — keep going!' : '⚡ You’re behind — push harder!'}
        </p>
      )}
    </Card>
  );
}

function weekEnd(): string {
  const d = new Date();
  const day = d.getDay();
  const toSunday = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + toSunday);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}
