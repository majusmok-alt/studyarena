export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** "2h 05m" style from minutes. */
export function fmtMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

/** Decimal hours, e.g. 184.5 → "184.5h". */
export function fmtHours(min: number): string {
  return `${(min / 60).toFixed(1)}h`;
}

/** mm:ss / h:mm:ss from seconds for the live timer. */
export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function fmtNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtCompact(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function countdown(toIso: string): { days: number; hours: number; minutes: number; seconds: number; done: boolean } {
  const diff = new Date(toIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

const FLAGS: Record<string, string> = {
  DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', NL: '🇳🇱', PL: '🇵🇱', SE: '🇸🇪',
  PT: '🇵🇹', BE: '🇧🇪', AT: '🇦🇹', DK: '🇩🇰', FI: '🇫🇮', NO: '🇳🇴', IE: '🇮🇪',
  GR: '🇬🇷', CZ: '🇨🇿', RO: '🇷🇴', HU: '🇭🇺', CH: '🇨🇭', UA: '🇺🇦', GB: '🇬🇧',
};

export function flag(country: string): string {
  return FLAGS[country] ?? '🏳️';
}

const COUNTRY_NAMES: Record<string, string> = {
  DE: 'Germany', FR: 'France', ES: 'Spain', IT: 'Italy', NL: 'Netherlands',
  PL: 'Poland', SE: 'Sweden', PT: 'Portugal', BE: 'Belgium', AT: 'Austria',
  DK: 'Denmark', FI: 'Finland', NO: 'Norway', IE: 'Ireland', GR: 'Greece',
  CZ: 'Czechia', RO: 'Romania', HU: 'Hungary', CH: 'Switzerland', UA: 'Ukraine', GB: 'United Kingdom',
};

export function countryName(country: string): string {
  return COUNTRY_NAMES[country] ?? country;
}

export const EU_COUNTRIES = Object.keys(COUNTRY_NAMES);
