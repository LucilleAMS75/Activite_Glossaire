import React, { useState, useEffect } from 'react';
import { X, Plus, Pencil, Bookmark } from 'lucide-react';
import { GlossaryItem, CATEGORIES } from '../types';

interface TermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: { term: string; definition: string; category: string }) => void;
  editingItem?: GlossaryItem | null;
}

export const TermModal: React.FC<TermModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('Général');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTerm(editingItem.term);
      setDefinition(editingItem.definition);
      setCategory(editingItem.category || 'Général');
    } else {
      setTerm('');
      setDefinition('');
      setCategory('Général');
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) {
      setError('Veuillez saisir le nom du terme.');
      return;
    }
    if (!definition.trim()) {
      setError('Veuillez saisir la définition du terme.');
      return;
    }

    onSave({
      term: term.trim(),
      definition: definition.trim(),
      category: category.trim() || 'Général',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-accent-light text-accent">
              {editingItem ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingItem ? 'Modifier mon terme' : 'Ajouter un nouveau terme'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingItem
                  ? 'Mettez à jour la définition de votre entrée personnelle.'
                  : 'Ce terme sera enregistré dans votre espace personnel.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Term Input */}
          <div>
            <label htmlFor="modal-term-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Terme <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="modal-term-input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="ex: Lead Nurturing, Social Listening..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-accent focus:border-accent"
              autoFocus
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="modal-category-select" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              Catégorie / Domaine
            </label>
            <select
              id="modal-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Definition Textarea */}
          <div>
            <label htmlFor="modal-def-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Définition <span className="text-red-500">*</span>
            </label>
            <textarea
              id="modal-def-input"
              rows={4}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Rédigez une définition claire et précise pour réviser efficacement..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-accent focus:border-accent resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-accent hover:bg-accent-hover shadow-sm transition-colors cursor-pointer"
            >
              {editingItem ? 'Mettre à jour' : 'Ajouter au glossaire'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
