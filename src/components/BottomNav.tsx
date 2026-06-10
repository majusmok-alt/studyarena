import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Home, Swords, Timer, User } from 'lucide-react';
import { clsx } from '../lib/format';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/leaderboard', label: 'Ranks', icon: BarChart3 },
  { to: '/study', label: 'Study', icon: Timer, primary: true },
  { to: '/battles', label: 'Battles', icon: Swords },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none">
      <div className="mx-auto max-w-md px-4 pb-3 pointer-events-auto">
        <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-between shadow-card">
          {ITEMS.map((item) => {
            const active = loc.pathname === item.to;
            const Ico = item.icon;
            if (item.primary) {
              return (
                <NavLink key={item.to} to={item.to} className="relative -mt-7" aria-label={item.label}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-2xl btn-grad grid place-items-center shadow-glow"
                  >
                    <Ico size={26} strokeWidth={2.4} />
                  </motion.div>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl"
                aria-label={item.label}
              >
                {active && (
                  <motion.span
                    layoutId="navpill"
                    className="absolute inset-1 rounded-2xl bg-white/8"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Ico
                  size={22}
                  className={clsx('relative transition-colors', active ? 'text-brand-300' : 'text-slate-400')}
                />
                <span
                  className={clsx(
                    'relative text-[10px] font-semibold transition-colors',
                    active ? 'text-brand-200' : 'text-slate-500',
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
