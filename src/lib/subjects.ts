import type { Subject, SubjectId } from './types';

export const SUBJECTS: Subject[] = [
  { id: 'mathematics', label: 'Mathematics', icon: 'Sigma', color: '#6c63f5' },
  { id: 'science', label: 'Science', icon: 'FlaskConical', color: '#16c5d8' },
  { id: 'economics', label: 'Economics', icon: 'TrendingUp', color: '#34d399' },
  { id: 'languages', label: 'Languages', icon: 'Languages', color: '#f5c451' },
  { id: 'programming', label: 'Programming', icon: 'Code2', color: '#fb7185' },
  { id: 'custom', label: 'Custom', icon: 'Sparkles', color: '#c084fc' },
];

const BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s])) as Record<SubjectId, Subject>;

export function getSubject(id: SubjectId): Subject {
  return BY_ID[id] ?? BY_ID.custom;
}
