import React from 'react';
import { Plus, Download, Printer, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  baseCount: number;
  personalCount: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onResetPersonal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  baseCount,
  personalCount,
  onOpenAddModal,
  onOpenImportModal,
  onExportPdf,
  onPrint,
  onResetPersonal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left Title with Brand Logo Badge */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#810464] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs shrink-0 select-none">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#810464] leading-tight">
                Glossaire Interactif
              </h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">
                Déployer une communication numérique en entreprise
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              id="btn-add-term"
              onClick={onOpenAddModal}
              className="bg-[#810464] hover:bg-[#6a0352] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-[#810464] focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un terme</span>
            </button>

            <button
              id="btn-import-excel"
              onClick={onOpenImportModal}
              title="Importer des termes depuis un fichier Excel ou CSV"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Excel/CSV</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-1"></div>

            <button
              id="btn-export-pdf"
              onClick={onExportPdf}
              title="Télécharger le glossaire en PDF"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 sm:border-0"
            >
              <Download className="w-5 h-5 text-[#810464]" />
            </button>

            <button
              id="btn-print-glossary"
              onClick={onPrint}
              title="Imprimer le glossaire"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 sm:border-0"
            >
              <Printer className="w-5 h-5" />
            </button>

            {personalCount > 0 && (
              <button
                id="btn-reset-personal"
                onClick={onResetPersonal}
                title="Effacer vos ajouts personnels"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200 sm:border-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
