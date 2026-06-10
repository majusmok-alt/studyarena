import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Search, Swords, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card, SectionTitle } from '../components/ui/Card';
import { Segmented } from '../components/ui/Segmented';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ActivityItem } from '../components/ActivityItem';
import { RankBadge } from '../components/RankBadge';
import { FRIENDS, WORLD } from '../lib/mockData';
import { getSubject } from '../lib/subjects';
import { clsx, flag, fmtNumber } from '../lib/format';

type Tab = 'feed' | 'friends';

export function Social() {
  const { feed, reactToActivity } = useData();
  const [tab, setTab] = useState<Tab>('feed');
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const suggestions = WORLD.filter((w) => !w.isMe && !FRIENDS.some((f) => f.id === w.userId)).slice(0, 6);
  const filteredFriends = FRIENDS.filter((f) => f.username.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <header className="pt-1">
        <h1 className="text-2xl font-extrabold font-display">Community</h1>
        <p className="text-sm text-slate-400">See what your rivals are up to.</p>
      </header>

      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'feed', label: 'Activity' },
          { value: 'friends', label: 'Friends' },
        ]}
      />

      {tab === 'feed' ? (
        <Card appear={false} className="divide-y divide-white/5 py-0">
          {feed.map((e, i) => (
            <ActivityItem key={e.id} entry={e} delay={i * 0.03} onReact={(k) => reactToActivity(e.id, k)} />
          ))}
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/8 px-3.5 py-2.5">
            <Search size={18} className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends…"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-600"
            />
          </div>

          {/* Friends list */}
          <section>
            <SectionTitle action={<span className="text-xs text-slate-500">{FRIENDS.length}</span>}>Your Friends</SectionTitle>
            <div className="space-y-2">
              {filteredFriends.map((f) => (
                <Card key={f.id} appear={false} className="flex items-center gap-3 py-2.5">
                  <Avatar username={f.username} size="md" online={f.online} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate flex items-center gap-1.5">
                      @{f.username} <span className="text-xs">{flag(f.country)}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {f.studyingNow ? (
                        <span className="text-brand-300">Studying {getSubject(f.studyingNow).label}…</span>
                      ) : f.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RankBadge rating={f.rating} size={28} glow={false} />
                    <Button size="sm" variant="ghost" className="px-2.5">
                      <Swords size={15} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Suggestions */}
          <section>
            <SectionTitle>Add Friends</SectionTitle>
            <div className="space-y-2">
              {suggestions.map((s) => {
                const isAdded = added.has(s.userId);
                return (
                  <motion.div key={s.userId} layout className="flex items-center gap-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5">
                    <Avatar username={s.username} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">@{s.username} <span className="text-xs">{flag(s.country)}</span></p>
                      <p className="text-xs text-slate-400 tnum">{fmtNumber(s.rating)} rating · #{s.rank}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isAdded ? 'ghost' : 'primary'}
                      onClick={() => setAdded((prev) => new Set(prev).add(s.userId))}
                      className={clsx(isAdded && 'pointer-events-none')}
                    >
                      {isAdded ? <><Check size={15} /> Added</> : <><UserPlus size={15} /> Add</>}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
