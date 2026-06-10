import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Swords, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { RankBadge } from '../components/RankBadge';
import { EU_COUNTRIES, countryName, flag } from '../lib/format';
import { RANKS } from '../lib/ranks';

export function Auth() {
  const { signUpEmail, signInGoogle, usingSupabase } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('DE');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const valid = username.trim().length >= 3 && /\S+@\S+\.\S+/.test(email);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(f);
  }

  async function submit() {
    if (!valid) return;
    setLoading(true);
    await signUpEmail({ email, username: username.trim(), country, avatarUrl: avatar });
    setLoading(false);
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md px-5 pt-12 pb-12 safe-top">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="flex justify-center gap-2 mb-5">
            {RANKS.slice(2, 6).map((r, i) => (
              <motion.div
                key={r.tier}
                initial={{ opacity: 0, y: 12, rotate: -8 }}
                animate={{ opacity: 1, y: i % 2 ? 6 : -6, rotate: 0 }}
                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 200 }}
              >
                <RankBadge rank={r} size={i === 1 || i === 2 ? 56 : 44} />
              </motion.div>
            ))}
          </div>
          <h1 className="text-[40px] leading-none font-extrabold font-display text-gradient">StudyArena</h1>
          <p className="mt-3 text-slate-400 text-[15px] leading-relaxed">
            Turn studying into a ranked online game.<br />Compete, climb, and dominate the European ladder.
          </p>
          <div className="flex justify-center gap-4 mt-5 text-xs text-slate-400 font-semibold">
            <span className="inline-flex items-center gap-1.5"><Swords size={14} className="text-loss" /> PvP Battles</span>
            <span className="inline-flex items-center gap-1.5"><Trophy size={14} className="text-gold" /> Ladders</span>
            <span className="inline-flex items-center gap-1.5"><Flame size={14} className="text-orange-400" /> Streaks</span>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-4xl p-5 mt-8 shadow-card"
        >
          <Button variant="ghost" full size="lg" onClick={() => void signInGoogle()}>
            <GoogleGlyph /> Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500 font-semibold">or sign up with email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Avatar uploader */}
          <div className="flex flex-col items-center mb-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="relative group"
              aria-label="Upload profile picture"
            >
              <div className="w-20 h-20 rounded-full grid place-items-center overflow-hidden bg-gradient-to-br from-brand-500 to-accent-500 ring-2 ring-white/10">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Sparkles size={26} className="text-white/80" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full btn-grad grid place-items-center border-2 border-ink-900">
                <Camera size={15} />
              </span>
            </button>
            <span className="text-xs text-slate-500 mt-2">Add a profile picture</span>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
          </div>

          <div className="space-y-3">
            <Field label="Username">
              <div className="flex items-center">
                <span className="text-slate-500 pl-1">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  placeholder="yourhandle"
                  maxLength={16}
                  className="flex-1 bg-transparent outline-none px-1 text-white placeholder:text-slate-600"
                />
              </div>
            </Field>

            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@university.eu"
                className="w-full bg-transparent outline-none text-white placeholder:text-slate-600"
              />
            </Field>

            <Field label="Country">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-transparent outline-none text-white appearance-none"
              >
                {EU_COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-ink-850">
                    {flag(c)} {countryName(c)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Button full size="lg" className="mt-5" disabled={!valid || loading} onClick={() => void submit()}>
            {loading ? 'Entering…' : 'Enter the Arena'}
          </Button>

          <p className="text-center text-[11px] text-slate-500 mt-3">
            {usingSupabase
              ? 'A magic sign-in link will be sent to your email.'
              : 'Demo mode · your progress is saved on this device.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 focus-within:border-brand-400/50 transition-colors">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">{label}</span>
      {children}
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2c-.4.4 6.5-4.8 6.5-14.8 0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
