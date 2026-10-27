import React from 'react';
import { Pencil, Trash2, UserCheck, ShieldCheck, Bookmark } from 'lucide-react';
import { GlossaryItem } from '../types';

interface ListViewProps {
  items: GlossaryItem[];
  onEdit?: (item: GlossaryItem) => void;
  onDelete?: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs no-print">
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              
              {/* Left Content */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {item.term}
                  </h3>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <Bookmark className="w-3 h-3 mr-1 text-slate-400" />
                    {item.category || 'Général'}
                  </span>

                  {item.isBase ? (
                    <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      <ShieldCheck className="w-3 h-3 mr-1 text-slate-400" />
                      Socle de base
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[11px] font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full border border-accent/30">
                      <UserCheck className="w-3 h-3 mr-1 text-accent" />
                      Mon ajout
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {item.definition}
                </p>
              </div>

              {/* Right Action buttons for personal items */}
              {!item.isBase && (
                <div className="flex items-center gap-1.5 self-start pt-1">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      title="Modifier cette entrée"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      title="Supprimer cette entrée"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
