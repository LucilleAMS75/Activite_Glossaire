import React from 'react';
import { Search, X, LayoutGrid, List, GraduationCap, Filter } from 'lucide-react';
import { ViewMode, FilterSource, CATEGORIES } from '../types';

interface SearchBarAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterSource: FilterSource;
  onFilterSourceChange: (source: FilterSource) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  personalCount: number;
  baseCount: number;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterSource,
  onFilterSourceChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  personalCount,
  baseCount,
}) => {
  return (
    <div className="no-print bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6 space-y-4">
      {/* Top row: Search input & View Mode buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-lg search-container">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un terme, une définition ou un mot-clé..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#810464] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto view-toggle">
          <button
            id="view-cards-btn"
            onClick={() => onViewModeChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#810464] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#810464]" />
            <span>Flashcards 3D</span>
          </button>

          <button
            id="view-list-btn"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5 text-slate-600" />
            <span>Vue Liste</span>
          </button>

          <button
            id="view-quiz-btn"
            onClick={() => onViewModeChange('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'quiz'
                ? 'bg-[#810464] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mode Révision</span>
          </button>
        </div>
      </div>

      {/* Middle row: Source tabs (Tous / Base / Ajouts) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Source :
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onFilterSourceChange('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterSource === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>

            <button
              onClick={() => onFilterSourceChange('base')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterSource === 'base'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Base ({baseCount})
            </button>

            <button
              onClick={() => onFilterSourceChange('personal')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterSource === 'personal'
                  ? 'bg-[#810464] text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mes ajouts ({personalCount})
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Toutes catégories
          </button>

          {CATEGORIES.map((cat) => {
            const isCatSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(isCatSelected ? null : cat.label)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isCatSelected
                    ? 'bg-[#810464] text-white border-[#810464] shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
