import React from 'react';

interface AlphabetNavProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
  availableCountsByLetter: Record<string, number>;
  totalCount: number;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const AlphabetNav: React.FC<AlphabetNavProps> = ({
  selectedLetter,
  onSelectLetter,
  availableCountsByLetter,
  totalCount,
}) => {
  return (
    <nav className="no-print bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs mb-6" aria-label="Navigation par lettre">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation Alphabétique
        </span>
        {selectedLetter && (
          <span className="text-xs text-[#810464] font-medium">
            Filtre actif : Lettre <strong>{selectedLetter}</strong> ({availableCountsByLetter[selectedLetter] || 0} terme{availableCountsByLetter[selectedLetter] > 1 ? 's' : ''})
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* 'Tous' button */}
        <button
          id="btn-letter-all"
          onClick={() => onSelectLetter(null)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedLetter === null
              ? 'bg-[#810464] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          Tous ({totalCount})
        </button>

        {/* Letters A-Z */}
        {ALPHABET.map((letter) => {
          const count = availableCountsByLetter[letter] || 0;
          const isSelected = selectedLetter === letter;
          const isDisabled = count === 0;

          return (
            <button
              key={letter}
              id={`btn-letter-${letter}`}
              disabled={isDisabled}
              onClick={() => onSelectLetter(letter)}
              title={isDisabled ? `Aucun terme commençant par ${letter}` : `${count} terme(s) commençant par ${letter}`}
              className={`min-w-[2.25rem] h-9 px-1 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center relative ${
                isSelected
                  ? 'bg-[#810464] text-white shadow-xs font-bold cursor-pointer'
                  : isDisabled
                  ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50'
                  : 'bg-[rgba(129,4,100,0.06)] hover:bg-[rgba(129,4,100,0.15)] text-[#810464] cursor-pointer'
              }`}
            >
              <span>{letter}</span>
              {count > 0 && !isSelected && (
                <span className="text-[9px] text-[#810464]/60 font-normal leading-none -mt-0.5">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
