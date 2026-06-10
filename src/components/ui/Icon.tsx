import {
  Circle,
  Clock,
  Code2,
  Coins,
  Flag,
  FlaskConical,
  Flame,
  Gem,
  GraduationCap,
  Languages,
  Sigma,
  Sparkles,
  Swords,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

interface Props extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Curated registry of every icon referenced *by string name* across the app
// (subjects, achievements, stat tiles). Keeping this explicit lets the bundler
// tree-shake the rest of lucide-react.
const REGISTRY: Record<string, LucideIcon> = {
  Sigma, FlaskConical, TrendingUp, Languages, Code2, Sparkles,
  Flag, Flame, Clock, GraduationCap, Swords, Trophy, Gem,
  Zap, Coins,
};

/** Render any registered lucide icon by its string name. */
export function Icon({ name, ...props }: Props) {
  const Cmp = REGISTRY[name] ?? Circle;
  return <Cmp strokeWidth={2.1} {...props} />;
}
