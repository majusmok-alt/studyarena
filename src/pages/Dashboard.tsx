import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Flame, Play, Swords, Timer, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card, SectionTitle } from '../components/ui/Card';
import { RankHero } from '../components/RankHero';
import { Avatar } from '../components/ui/Avatar';
import { MiniBars } from '../components/ui/Sparkline';
import { Countdown } from '../components/ui/Countdown';
import { CoinPill, XpPill } from '../components/Pills';
import { ActivityItem } from '../components/ActivityItem';
import { Button } from '../components/ui/Button';
import { FRIENDS, WEEK_MINUTES } from '../lib/mockData';
import { getSubject } from '../lib/subjects';
import { fmtMinutes } from '../lib/format';
import { todayKey } from '../lib/store';

export function Dashboard() {
  const { user, feed, battles, season, reactToActivity, sessions } = useData();
  const navigate = useNavigate();

  const todayMin =
    sessions.filter((s) => s.endedAt.slice(0, 10) === todayKey()).reduce((a, s) => a + s.minutes, 0) +
    (sessions.length === 0 ? 80 : 0); // seed a value for first impression
  const onlineFriends = FRIENDS.filter((f) => f.online);
  const activeBattles = battles.filter((b) => b.status === 'active' || b.status === 'pending');

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-1">
        <Link to="/profile" className="flex items-center gap-3">
          <Avatar username={user.username} src={user.avatarUrl} size="md" frame={user.frame} online />
          <div>
            <p className="text-xs text-slate-400">{greeting()},</p>
            <p className="font-bold font-display leading-tight">@{user.username}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <CoinPill value={user.coins} />
          <XpPill value={user.xp} />
        </div>
      </header>

      {/* Rank hero */}
      <RankHero user={user} />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <QuickStat icon={<Clock size={16} />} tint="#16c5d8" label="Today" value={fmtMinutes(todayMin)} />
        <QuickStat icon={<Flame size={16} />} tint="#fb923c" label="Streak" value={`${user.streak}d`} />
        <QuickStat icon={<Users size={16} />} tint="#34d399" label="Online" value={`${onlineFriends.length}`} />
      </div>

      {/* Start studying CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/study')}
        className="w-full relative overflow-hidden rounded-4xl p-5 text-left btn-grad shadow-glow"
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Ready to climb?</p>
            <p className="text-xl font-extrabold font-display mt-0.5">Start a Study Session</p>
            <p className="text-sm text-white/80 mt-1">Earn XP, coins & rating</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 grid place-items-center">
            <Play size={26} fill="currentColor" />
          </div>
        </div>
      </motion.button>

      {/* Season + week chart */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">{season.name}</p>
              <p className="text-sm text-slate-400">Season ends in</p>
            </div>
            <Link to="/leaderboard" className="text-xs text-slate-400 inline-flex items-center gap-0.5">
              Rewards <ChevronRight size={14} />
            </Link>
          </div>
          <Countdown to={season.endsAt} />
        </Card>

        <Card>
          <SectionTitle action={<span className="text-xs text-slate-500">{fmtMinutes(WEEK_MINUTES.reduce((a, b) => a + b, 0))}</span>}>
            This Week
          </SectionTitle>
          <MiniBars data={WEEK_MINUTES} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} />
        </Card>
      </div>

      {/* Active challenges */}
      <section>
        <SectionTitle action={<Link to="/battles" className="text-xs text-brand-300 font-semibold">See all</Link>}>
          Active Challenges
        </SectionTitle>
        {activeBattles.length === 0 ? (
          <Card className="text-center py-6">
            <Swords className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-slate-400">No active battles. Challenge a friend!</p>
            <Button size="sm" variant="ghost" className="mt-3" onClick={() => navigate('/battles')}>
              Find a battle
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeBattles.slice(0, 2).map((b) => {
              const subj = getSubject(b.subject);
              return (
                <Card key={b.id} appear={false} className="flex items-center gap-3" onClick={() => navigate('/battles')}>
                  <div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0" style={{ backgroundColor: `${subj.color}22`, color: subj.color }}>
                    <Swords size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">
                      {b.type === 'daily' ? 'Daily Challenge' : `vs @${b.opponentName}`}
                    </p>
                    <p className="text-xs text-slate-400">{subj.label} · <Countdown to={b.endsAt} compact /> left</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Stake</p>
                    <p className="font-bold text-brand-300 text-sm">+{b.ratingStake}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Friends online */}
      <section>
        <SectionTitle action={<Link to="/social" className="text-xs text-brand-300 font-semibold">Friends</Link>}>
          Online Now
        </SectionTitle>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {onlineFriends.map((f) => (
            <Link key={f.id} to="/social" className="flex flex-col items-center gap-1.5 shrink-0 w-16">
              <div className="relative">
                <Avatar username={f.username} size="lg" online />
                {f.studyingNow && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-brand-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    <Timer size={9} className="inline" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 truncate w-full text-center">@{f.username}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <SectionTitle action={<Link to="/social" className="text-xs text-brand-300 font-semibold">See all</Link>}>
          Recent Activity
        </SectionTitle>
        <Card appear={false} className="divide-y divide-white/5 py-0">
          {feed.slice(0, 4).map((e, i) => (
            <ActivityItem key={e.id} entry={e} delay={i * 0.05} onReact={(k) => reactToActivity(e.id, k)} />
          ))}
        </Card>
      </section>
    </div>
  );
}

function QuickStat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: string }) {
  return (
    <Card appear={false} className="p-3">
      <span className="grid place-items-center w-8 h-8 rounded-xl mb-2" style={{ backgroundColor: `${tint}22`, color: tint }}>
        {icon}
      </span>
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold font-display tnum">{value}</p>
    </Card>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
