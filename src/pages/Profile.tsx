import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight, Globe, LogOut, Pencil, RotateCcw, Trophy } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, SectionTitle } from '../components/ui/Card';
import { RankHero } from '../components/RankHero';
import { Avatar } from '../components/ui/Avatar';
import { Stat } from '../components/ui/Stat';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { ProgressBar } from '../components/ui/Progress';
import { Icon } from '../components/ui/Icon';
import { ACHIEVEMENTS } from '../lib/achievements';
import { EU_COUNTRIES, countryName, flag, fmtNumber } from '../lib/format';

export function Profile() {
  const { user, leaderboard, achievementProgress, updateProfile, resetDemo } = useData();
  const { signOut } = useAuth();
  const [edit, setEdit] = useState(false);
  const [draftName, setDraftName] = useState(user.username);
  const [draftCountry, setDraftCountry] = useState(user.country);
  const [draftAvatar, setDraftAvatar] = useState(user.avatarUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const globalRank = useMemo(() => leaderboard('global').find((r) => r.isMe)?.rank ?? 0, [leaderboard]);
  const countryRank = useMemo(() => leaderboard('country').find((r) => r.isMe)?.rank ?? 0, [leaderboard]);
  const ach = achievementProgress();
  const unlockedCount = ach.filter((a) => a.unlocked).length;
  const totalGames = user.wins + user.losses;
  const winPct = totalGames ? (user.wins / totalGames) * 100 : 0;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setDraftAvatar(reader.result as string);
    reader.readAsDataURL(f);
  }
  function save() {
    updateProfile({ username: draftName.trim() || user.username, country: draftCountry, avatarUrl: draftAvatar });
    setEdit(false);
  }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative">
        <div className="h-28 rounded-4xl overflow-hidden bg-gradient-to-br from-brand-600/40 via-brand-500/20 to-accent-500/20 border border-white/8">
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(60% 80% at 80% 0%, rgba(22,197,216,0.4), transparent)' }} />
        </div>
        <button
          onClick={() => { setDraftName(user.username); setDraftCountry(user.country); setDraftAvatar(user.avatarUrl); setEdit(true); }}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold"
        >
          <Pencil size={13} /> Edit
        </button>
        <div className="absolute -bottom-8 left-5 flex items-end gap-3">
          <Avatar username={user.username} src={user.avatarUrl} size="xl" frame={user.frame} />
        </div>
      </div>

      <div className="pt-9 px-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold font-display">@{user.username}</h1>
        </div>
        <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
          <span>{flag(user.country)}</span> {countryName(user.country)}
          <span className="text-slate-600">·</span>
          <span className="inline-flex items-center gap-1"><Trophy size={12} className="text-gold" /> #{globalRank} global</span>
        </p>
      </div>

      <RankHero user={user} />

      {/* Rankings */}
      <div className="grid grid-cols-2 gap-3">
        <Card appear={false} className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gold/15 text-gold"><Globe size={20} /></span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Global</p>
            <p className="text-xl font-extrabold font-display tnum">#{fmtNumber(globalRank)}</p>
          </div>
        </Card>
        <Card appear={false} className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-brand-500/15 text-brand-300 text-lg">{flag(user.country)}</span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{countryName(user.country)}</p>
            <p className="text-xl font-extrabold font-display tnum">#{fmtNumber(countryRank)}</p>
          </div>
        </Card>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <Stat icon="Clock" label="Study time" tint="#16c5d8" value={`${(user.totalMinutes / 60).toFixed(1)}h`} />
        <Stat icon="Flame" label="Streak" tint="#fb923c" value={`${user.streak} ${user.streak === 1 ? 'day' : 'days'}`} />
        <Stat icon="Zap" label="Total XP" tint="#8587fb" value={fmtNumber(user.xp)} />
        <Stat icon="Coins" label="Coins" tint="#f5c451" value={fmtNumber(user.coins)} />
      </div>

      {/* Win / loss */}
      <Card>
        <SectionTitle action={<span className="text-xs text-slate-500">{totalGames} battles</span>}>Win / Loss</SectionTitle>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-bold text-win tnum">{user.wins}W</span>
          <span className="font-bold text-brand-300 tnum">{winPct.toFixed(0)}%</span>
          <span className="font-bold text-loss tnum">{user.losses}L</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden bg-loss/30 flex">
          <div className="h-full bg-gradient-to-r from-win to-emerald-400" style={{ width: `${winPct}%` }} />
        </div>
      </Card>

      {/* Achievements showcase */}
      <section>
        <SectionTitle action={<Link to="/achievements" className="text-xs text-brand-300 font-semibold inline-flex items-center">{unlockedCount}/{ACHIEVEMENTS.length} <ChevronRight size={14} /></Link>}>
          Achievements
        </SectionTitle>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {ach.map((a) => {
            const def = ACHIEVEMENTS.find((x) => x.id === a.id)!;
            return (
              <Link
                key={a.id}
                to="/achievements"
                className="shrink-0 w-[88px] rounded-2xl border border-white/8 bg-white/[0.03] p-3 flex flex-col items-center gap-1.5 text-center"
                style={{ opacity: a.unlocked ? 1 : 0.45 }}
              >
                <span className={`grid place-items-center w-11 h-11 rounded-2xl ${a.unlocked ? 'bg-gold/15 text-gold' : 'bg-white/5 text-slate-500'}`}>
                  <Icon name={def.icon} size={20} />
                </span>
                <span className="text-[10px] font-semibold leading-tight">{def.title}</span>
                {!a.unlocked && <ProgressBar value={a.progress} height={3} className="w-full" gradient="from-brand-400 to-accent-400" />}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Account actions */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button variant="ghost" onClick={() => { if (confirm('Reset all demo progress?')) resetDemo(); }}>
          <RotateCcw size={16} /> Reset demo
        </Button>
        <Button variant="danger" onClick={signOut}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>

      {/* Edit sheet */}
      <Sheet open={edit} onClose={() => setEdit(false)} title="Edit Profile">
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <button onClick={() => fileRef.current?.click()} className="relative">
              <Avatar username={draftName || user.username} src={draftAvatar} size="xl" />
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full btn-grad grid place-items-center border-2 border-ink-900">
                <Camera size={15} />
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>
          <label className="block rounded-2xl bg-white/[0.04] border border-white/8 px-3.5 py-2.5">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">Username</span>
            <div className="flex items-center">
              <span className="text-slate-500">@</span>
              <input value={draftName} onChange={(e) => setDraftName(e.target.value.replace(/\s/g, '').toLowerCase())} maxLength={16} className="flex-1 bg-transparent outline-none px-1 text-white" />
            </div>
          </label>
          <label className="block rounded-2xl bg-white/[0.04] border border-white/8 px-3.5 py-2.5">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">Country</span>
            <select value={draftCountry} onChange={(e) => setDraftCountry(e.target.value)} className="w-full bg-transparent outline-none text-white">
              {EU_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-ink-850">{flag(c)} {countryName(c)}</option>
              ))}
            </select>
          </label>
          <Button full size="lg" onClick={save}>Save changes</Button>
        </div>
      </Sheet>
    </div>
  );
}
