import React, { useState } from 'react';
import { RotateCw, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, GraduationCap, Sparkles } from 'lucide-react';
import { GlossaryItem } from '../types';

interface StudyModeProps {
  items: GlossaryItem[];
  onExit: () => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ items, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-8">
        <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Aucune carte disponible</h3>
        <p className="text-sm text-slate-500 mb-4">Modifiez vos filtres ou ajoutez des termes pour démarrer une session de révision.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors cursor-pointer"
        >
          Retourner au glossaire
        </button>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleNext = () => {
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const markMastered = () => {
    const newMastered = new Set(masteredIds);
    newMastered.add(currentItem.id);
    setMasteredIds(newMastered);
    const newReview = new Set(reviewIds);
    newReview.delete(currentItem.id);
    setReviewIds(newReview);
    handleNext();
  };

  const markReview = () => {
    const newReview = new Set(reviewIds);
    newReview.add(currentItem.id);
    setReviewIds(newReview);
    const newMastered = new Set(masteredIds);
    newMastered.delete(currentItem.id);
    setMasteredIds(newMastered);
    handleNext();
  };

  return (
    <div className="no-print max-w-3xl mx-auto my-4 space-y-6">
      {/* Header card for Quiz */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accent-light text-accent">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Mode Révision & Auto-évaluation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Testez vos connaissances sur les concepts de la communication numérique.
          </p>
        </div>

        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer self-end sm:self-auto"
        >
          Quitter la révision
        </button>
      </div>

      {/* Progress indicators */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
        <span>
          Carte <strong>{currentIndex + 1}</strong> sur <strong>{items.length}</strong>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-emerald-700 font-medium">
            Acquis : {masteredIds.size}
          </span>
          <span className="text-amber-700 font-medium">
            À réviser : {reviewIds.size}
          </span>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 min-h-[300px] flex flex-col justify-between shadow-sm relative">
        
        {/* Category tag */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            {currentItem.category || 'Général'}
          </span>
          {masteredIds.has(currentItem.id) && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Acquis
            </span>
          )}
          {reviewIds.has(currentItem.id) && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" /> À revoir
            </span>
          )}
        </div>

        {/* Term Title */}
        <div className="my-auto text-center py-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentItem.term}
          </h3>

          {!isRevealed ? (
            <div className="mt-8">
              <button
                onClick={() => setIsRevealed(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                Révéler la définition
              </button>
            </div>
          ) : (
            <div className="mt-6 p-5 bg-slate-900 text-slate-100 rounded-xl text-sm leading-relaxed text-left max-w-xl mx-auto shadow-inner border border-slate-800">
              <p className="font-medium">{currentItem.definition}</p>
            </div>
          )}
        </div>

        {/* Post-reveal self assessment buttons */}
        {isRevealed && (
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Comment évaluez-vous votre réponse ?
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={markReview}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                À réviser
              </button>

              <button
                onClick={markMastered}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Facile / Acquis
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Carte précédente
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Carte suivante
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
