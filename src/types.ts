export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category?: string;
  isBase: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ViewMode = 'cards' | 'list' | 'quiz';

export type FilterSource = 'all' | 'base' | 'personal';

export interface CategoryOption {
  id: string;
  label: string;
  color: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'marketing-digital', label: 'Marketing Digital', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'seo-web', label: 'SEO & Web', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'social-media', label: 'Réseaux Sociaux', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { id: 'kpi-analytics', label: 'KPI & Analyse', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'strategie-contenu', label: 'Stratégie de Contenu', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'general', label: 'Général', color: 'bg-slate-100 text-slate-800 border-slate-200' },
];
