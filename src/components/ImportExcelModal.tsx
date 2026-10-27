import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { parseExcelOrCsvFile, downloadSampleCsvTemplate } from '../utils/storage';
import { GlossaryItem } from '../types';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (newTerms: Omit<GlossaryItem, 'id' | 'isBase'>[]) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedTerms, setParsedTerms] = useState<Omit<GlossaryItem, 'id' | 'isBase'>[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setErrorMessage('');
    setSuccessMessage('');
    setParsedTerms([]);

    try {
      const results = await parseExcelOrCsvFile(selectedFile);
      setParsedTerms(results);
      setSuccessMessage(`${results.length} terme(s) extrait(s) avec succès de "${selectedFile.name}".`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedTerms.length === 0) return;
    onImportSuccess(parsedTerms);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Importer un fichier Excel ou CSV
              </h2>
              <p className="text-xs text-slate-500">
                Enrichissez votre glossaire en chargeant votre propre liste de termes.
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Template Download Link */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <strong className="text-slate-800">Format recommandé :</strong>
              <p className="text-slate-500">Colonnes "Terme", "Définition" et optionnellement "Catégorie".</p>
            </div>
            <button
              onClick={downloadSampleCsvTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-accent bg-accent-light hover:bg-accent/10 border border-accent/20 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger un modèle
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-accent rounded-2xl p-6 text-center bg-slate-50/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-accent-light text-accent flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Glissez votre fichier ici ou <span className="text-accent underline">parcourez</span>
              </p>
              <p className="text-xs text-slate-400">
                Formats acceptés : .XLSX, .XLS, .CSV
              </p>
            </div>
          </div>

          {/* Loading Indicator */}
          {isParsing && (
            <div className="flex items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Analyse du fichier en cours...
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Preview Table */}
          {successMessage && parsedTerms.length > 0 && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs">
                {parsedTerms.map((t, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-2 bg-white">
                    <div>
                      <strong className="text-slate-900 block">{t.term}</strong>
                      <p className="text-slate-500 line-clamp-1">{t.definition}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-600 shrink-0">
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedTerms.length === 0}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer ${
              parsedTerms.length > 0
                ? 'bg-accent hover:bg-accent-hover shadow-sm'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Importer {parsedTerms.length > 0 ? `(${parsedTerms.length})` : ''}
          </button>
        </div>

      </div>
    </div>
  );
};
