import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GLOSSARY_ITEMS } from './data/defaultTerms';
import { GlossaryItem, ViewMode, FilterSource } from './types';
import { getPersonalItems, savePersonalItems, clearPersonalItems } from './utils/storage';
import { exportGlossaryToPdf } from './utils/pdfExport';

import { Header } from './components/Header';
import { AlphabetNav } from './components/AlphabetNav';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { Flashcard } from './components/Flashcard';
import { ListView } from './components/ListView';
import { StudyMode } from './components/StudyMode';
import { TermModal } from './components/TermModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { PrintView } from './components/PrintView';

import { BookOpen, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  // Base fixed terms
  const baseItems = DEFAULT_GLOSSARY_ITEMS;

  // Personal learner terms
  const [personalItems, setPersonalItems] = useState<GlossaryItem[]>([]);

  // Navigation & Filtering state
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Modal dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlossaryItem | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load personal items on mount
  useEffect(() => {
    const loaded = getPersonalItems();
    setPersonalItems(loaded);
    setIsInitialized(true);
  }, []);

  // Sync personal items to storage whenever personalItems changes after initial load
  useEffect(() => {
    if (isInitialized) {
      savePersonalItems(personalItems);
    }
  }, [personalItems, isInitialized]);

  // Show Toast
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Merge base and personal terms cleanly
  const allItems = useMemo(() => {
    return [...baseItems, ...personalItems];
  }, [baseItems, personalItems]);

  // Available letter counts calculation (for alphabet navigation bar)
  const availableCountsByLetter = useMemo(() => {
    const counts: Record<string, number> = {};

    allItems.forEach((item) => {
      // Respect source filter for counts
      if (filterSource === 'base' && !item.isBase) return;
      if (filterSource === 'personal' && item.isBase) return;
      // Respect category filter
      if (selectedCategory && item.category !== selectedCategory) return;

      const firstChar = item.term.trim().charAt(0).toUpperCase();
      // Normalize accented chars if any (e.g., É -> E)
      const normalizedChar = firstChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (/[A-Z]/.test(normalizedChar)) {
        counts[normalizedChar] = (counts[normalizedChar] || 0) + 1;
      }
    });

    return counts;
  }, [allItems, filterSource, selectedCategory]);

  // Main filtered glossary list
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        // Filter by source
        if (filterSource === 'base' && !item.isBase) return false;
        if (filterSource === 'personal' && item.isBase) return false;

        // Filter by category
        if (selectedCategory && item.category !== selectedCategory) return false;

        // Filter by selected letter
        if (selectedLetter) {
          const firstChar = item.term.trim().charAt(0).toUpperCase();
          const normalizedChar = firstChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (normalizedChar !== selectedLetter) return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTerm = item.term.toLowerCase().includes(query);
          const matchDef = item.definition.toLowerCase().includes(query);
          const matchCat = (item.category || '').toLowerCase().includes(query);
          return matchTerm || matchDef || matchCat;
        }

        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }));
  }, [allItems, filterSource, selectedCategory, selectedLetter, searchQuery]);

  // CRUD Handler: Add or Update personal item
  const handleSaveTerm = (data: { term: string; definition: string; category: string }) => {
    if (editingItem) {
      // Update existing
      const updated = personalItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              term: data.term,
              definition: data.definition,
              category: data.category,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      setPersonalItems(updated);
      savePersonalItems(updated);
      showToast(`Le terme "${data.term}" a été mis à jour avec succès.`);
    } else {
      // Create new
      const newItem: GlossaryItem = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        term: data.term,
        definition: data.definition,
        category: data.category,
        isBase: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...personalItems];
      setPersonalItems(updated);
      savePersonalItems(updated);
      showToast(`Nouveau terme "${data.term}" ajouté à votre glossaire personnel !`);
    }
    setEditingItem(null);
  };

  // CRUD Handler: Delete personal item
  const handleDeleteTerm = (id: string) => {
    const itemToDelete = personalItems.find((i) => i.id === id);
    if (!itemToDelete) return;

    if (window.confirm(`Voulez-vous vraiment supprimer le terme "${itemToDelete.term}" de vos ajouts personnels ?`)) {
      const updated = personalItems.filter((item) => item.id !== id);
      setPersonalItems(updated);
      savePersonalItems(updated);
      showToast(`Le terme "${itemToDelete.term}" a été supprimé.`, 'info');
    }
  };

  // Reset personal entries
  const handleResetPersonal = () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir réinitialiser vos ${personalItems.length} ajouts personnels ? Cette action est irréversible.`
      )
    ) {
      setPersonalItems([]);
      clearPersonalItems();
      showToast('Vos ajouts personnels ont été réinitialisés.', 'info');
    }
  };

  // Import Excel/CSV terms
  const handleImportSuccess = (newParsedTerms: Omit<GlossaryItem, 'id' | 'isBase'>[]) => {
    const itemsToAdd: GlossaryItem[] = newParsedTerms.map((t) => ({
      ...t,
      id: `user-import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isBase: false,
      createdAt: new Date().toISOString(),
    }));

    const updated = [...itemsToAdd, ...personalItems];
    setPersonalItems(updated);
    savePersonalItems(updated);
    showToast(`${itemsToAdd.length} terme(s) importé(s) avec succès dans votre glossaire !`);
  };

  // Export PDF trigger
  const handleExportPdf = () => {
    exportGlossaryToPdf(filteredItems, 'Communication Numérique en Entreprise');
    showToast('Téléchargement du PDF lancé.');
  };

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f9] text-[#2d3436] flex flex-col font-sans">
      
      {/* Header */}
      <Header
        totalCount={allItems.length}
        baseCount={baseItems.length}
        personalCount={personalItems.length}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onResetPersonal={handleResetPersonal}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Alphabetical Navigation */}
        <AlphabetNav
          selectedLetter={selectedLetter}
          onSelectLetter={setSelectedLetter}
          availableCountsByLetter={availableCountsByLetter}
          totalCount={allItems.length}
        />

        {/* Search & Filters Controls */}
        <SearchBarAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterSource={filterSource}
          onFilterSourceChange={setFilterSource}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          personalCount={personalItems.length}
          baseCount={baseItems.length}
        />

        {/* Active Filters Summary Bar */}
        {(selectedLetter || searchQuery || selectedCategory || filterSource !== 'all') && (
          <div className="no-print mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-white/80 px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span className="font-semibold text-slate-700">Filtres appliqués :</span>
            {selectedLetter && (
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium text-[#810464]">
                Lettre : {selectedLetter}
              </span>
            )}
            {selectedCategory && (
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                Catégorie : {selectedCategory}
              </span>
            )}
            {filterSource !== 'all' && (
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                Source : {filterSource === 'base' ? 'Socle de base' : 'Mes ajouts'}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                Recherche : "{searchQuery}"
              </span>
            )}

            <button
              onClick={() => {
                setSelectedLetter(null);
                setSearchQuery('');
                setSelectedCategory(null);
                setFilterSource('all');
              }}
              className="ml-auto text-[#810464] hover:underline font-semibold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* ================= MAIN CONTENT VIEWS ================= */}

        {/* 1. STUDY / QUIZ MODE */}
        {viewMode === 'quiz' && (
          <StudyMode items={filteredItems} onExit={() => setViewMode('cards')} />
        )}

        {/* 2. FLASHCARDS GRID VIEW */}
        {viewMode === 'cards' && (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Aucun terme ne correspond à vos critères
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Essayez de modifier votre recherche ou ajoutez un terme personnel.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedLetter(null);
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setFilterSource('all');
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Effacer les filtres
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#810464] hover:bg-[#6a0352] transition-colors shadow-sm cursor-pointer"
                  >
                    + Ajouter un terme
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Flashcard
                    key={item.id}
                    item={item}
                    onEdit={(itemToEdit) => {
                      setEditingItem(itemToEdit);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteTerm}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* 3. LIST VIEW */}
        {viewMode === 'list' && (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-2xs">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <h3 className="text-base font-bold text-slate-800">Aucun terme trouvé</h3>
              </div>
            ) : (
              <ListView
                items={filteredItems}
                onEdit={(itemToEdit) => {
                  setEditingItem(itemToEdit);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeleteTerm}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-[#810464] text-white py-3 mt-12 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Glossaire • Déployer une communication numérique en entreprise
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <span>{allItems.length} termes au total</span>
            <span>•</span>
            <span>{personalItems.length} ajouts personnels</span>
          </div>
        </div>
      </footer>

      {/* Print View Component */}
      <PrintView items={allItems} />

      {/* Add / Edit Modal */}
      <TermModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveTerm}
        editingItem={editingItem}
      />

      {/* Import Excel / CSV Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-5 duration-300">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
