import React from 'react';
import { GlossaryItem } from '../types';

interface PrintViewProps {
  items: GlossaryItem[];
}

export const PrintView: React.FC<PrintViewProps> = ({ items }) => {
  const sortedItems = [...items].sort((a, b) =>
    a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' })
  );

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block print-glossary-container p-6">
      
      {/* Printable Header */}
      <div className="print-only-header mb-6 pb-4 border-b-2 border-[#810464]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-extrabold text-[#810464] uppercase tracking-wide">
              Glossaire de la Communication Numérique
            </h1>
            <p className="text-xs font-bold text-slate-700">
              Déployer une communication numérique en entreprise
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <div>Généré le {dateStr}</div>
            <div>Total : {sortedItems.length} termes</div>
          </div>
        </div>
      </div>

      {/* Terms list */}
      <div className="print-glossary-list space-y-4">
        {sortedItems.map((item, idx) => (
          <div key={item.id} className="print-glossary-item pb-3 border-b border-slate-200">
            <div className="flex items-baseline justify-between gap-2">
              <span className="print-term font-bold text-[#810464] text-sm">
                {idx + 1}. {item.term}
              </span>

              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {item.category || 'Général'} {item.isBase ? '' : '• Mon ajout'}
              </span>
            </div>

            <p className="print-def text-xs text-slate-800 mt-1 leading-snug">
              {item.definition}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-300 text-[9px] text-slate-500 text-center">
        Document de révision pédagogique — Formation Déployer une communication numérique en entreprise
      </div>

    </div>
  );
};
