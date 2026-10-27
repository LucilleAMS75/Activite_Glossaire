import React, { useState } from 'react';
import { RotateCw, Pencil, Trash2, Bookmark, UserCheck, ShieldCheck } from 'lucide-react';
import { GlossaryItem } from '../types';

interface FlashcardProps {
  item: GlossaryItem;
  onEdit?: (item: GlossaryItem) => void;
  onDelete?: (id: string) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ item, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent flip if clicking action buttons (edit/delete)
    if ((e.target as HTMLElement).closest('.card-action-btn')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="perspective-1000 w-full h-[260px] cursor-pointer group focus:outline-hidden"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${item.term}. ${isFlipped ? 'Définition affichée' : 'Cliquer pour retourner'}`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform shadow-sm hover:shadow-md rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= RECTO (FRONT) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-x border-b border-slate-200 border-t-4 border-t-[#810464] rounded-xl p-6 flex flex-col justify-between select-none hover:shadow-md transition-shadow">
          
          {/* Top header on front */}
          <div className="flex items-center justify-between">
            {/* Category tag */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Bookmark className="w-3 h-3 mr-1 text-slate-400" />
              {item.category || 'Général'}
            </span>

            {/* Badge: Base vs Personal */}
            {item.isBase ? (
              <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200" title="Entrée officielle de la formation">
                <ShieldCheck className="w-3 h-3 mr-1 text-slate-400" />
                Socle de base
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider" title="Entrée personnelle ajoutée par l'apprenant">
                <UserCheck className="w-3 h-3 mr-1 text-rose-800" />
                Mon ajout
              </span>
            )}
          </div>

          {/* Center: Term Title */}
          <div className="my-auto text-center px-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#810464] transition-colors line-clamp-2 leading-tight">
              {item.term}
            </h3>
          </div>

          {/* Bottom Flip Indicator */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
            <span className="flex items-center gap-1 group-hover:text-[#810464] transition-colors font-medium">
              <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#810464] group-hover:rotate-45 transition-transform" />
              Voir la définition
            </span>

            <span className="text-[10px] text-slate-400 italic">
              Recto
            </span>
          </div>
        </div>

        {/* ================= VERSO (BACK) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#810464] text-white rounded-xl p-6 flex flex-col justify-between select-none border border-[#6a0352]">
          
          {/* Back Top header */}
          <div className="flex items-center justify-between text-xs border-b border-white/20 pb-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              {item.term}
            </span>

            {/* Edit / Delete actions for learner entries ONLY */}
            {!item.isBase && (
              <div className="flex items-center gap-1.5 card-action-btn">
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    title="Modifier mon entrée"
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    title="Supprimer mon entrée"
                    className="p-1.5 rounded-md bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Center: Definition content */}
          <div className="my-auto overflow-y-auto max-h-[140px] pr-1 scrollbar-thin text-white/95 text-sm leading-relaxed">
            <p>{item.definition}</p>
          </div>

          {/* Back Bottom footer */}
          <div className="flex items-center justify-between pt-2.5 border-t border-white/20 text-xs text-white/70">
            <span className="flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              Retourner au terme
            </span>

            <span className="text-[10px] text-white/60 italic">
              Verso
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
