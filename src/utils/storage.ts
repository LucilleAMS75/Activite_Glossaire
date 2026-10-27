import { GlossaryItem } from '../types';
import * as XLSX from 'xlsx';

const PRIMARY_STORAGE_KEY = 'interactive_glossary_personal_terms_v2';
const LEGACY_STORAGE_KEY = 'cce_rs7375_personal_glossary_v1';

/**
 * Access available storage engine cleanly with localStorage priority
 */
function getStorageEngines(): Storage[] {
  if (typeof window === 'undefined') return [];
  const engines: Storage[] = [];

  try {
    if (window.localStorage) {
      engines.push(window.localStorage);
    }
  } catch {
    // localStorage might be restricted in some iframe settings
  }

  try {
    if (window.sessionStorage) {
      engines.push(window.sessionStorage);
    }
  } catch {
    // sessionStorage fallback
  }

  return engines;
}

/**
 * Get stored personal glossary items from storage
 */
export function getPersonalItems(): GlossaryItem[] {
  const engines = getStorageEngines();
  if (engines.length === 0) return [];

  for (const engine of engines) {
    try {
      // Try primary key first
      let data = engine.getItem(PRIMARY_STORAGE_KEY);
      // Fallback to legacy key
      if (!data) {
        data = engine.getItem(LEGACY_STORAGE_KEY);
      }

      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({ ...item, isBase: false }));
        }
      }
    } catch (error) {
      console.error('Error reading personal glossary items from storage:', error);
    }
  }

  return [];
}

/**
 * Save personal glossary items to storage
 */
export function savePersonalItems(items: GlossaryItem[]): boolean {
  const engines = getStorageEngines();
  if (engines.length === 0) return false;

  const personalOnly = items
    .filter((item) => !item.isBase)
    .map((item) => ({
      ...item,
      isBase: false,
    }));

  const jsonString = JSON.stringify(personalOnly);
  let success = false;

  for (const engine of engines) {
    try {
      engine.setItem(PRIMARY_STORAGE_KEY, jsonString);
      success = true;
    } catch (error) {
      console.error('Error writing personal glossary items to storage:', error);
    }
  }

  return success;
}

/**
 * Clear all personal additions
 */
export function clearPersonalItems(): boolean {
  const engines = getStorageEngines();
  if (engines.length === 0) return false;

  for (const engine of engines) {
    try {
      engine.removeItem(PRIMARY_STORAGE_KEY);
      engine.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  return true;
}

/**
 * Parse an Excel (.xlsx / .xls) or CSV file into GlossaryItem objects
 */
export async function parseExcelOrCsvFile(file: File): Promise<Omit<GlossaryItem, 'id' | 'isBase'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          reject(new Error('Le fichier est vide.'));
          return;
        }

        const workbook = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to json rows
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        const extractedTerms: Omit<GlossaryItem, 'id' | 'isBase'>[] = [];

        for (const row of rawRows) {
          // Normalize key names (support Terme, Term, Def, Definition, Définition, Categorie, Category)
          let termVal = '';
          let defVal = '';
          let catVal = 'Général';

          for (const [key, value] of Object.entries(row)) {
            const cleanKey = key.trim().toLowerCase();
            const strVal = String(value || '').trim();

            if (['terme', 'term', 'mot', 'intitule', 'concept'].includes(cleanKey) || (!termVal && cleanKey.includes('term'))) {
              termVal = strVal;
            } else if (['definition', 'définition', 'def', 'explication', 'description'].includes(cleanKey) || (!defVal && cleanKey.includes('def'))) {
              defVal = strVal;
            } else if (['categorie', 'catégorie', 'category', 'tag', 'domaine'].includes(cleanKey)) {
              catVal = strVal || 'Général';
            }
          }

          // Fallback if keys were positional or first 2 columns
          if (!termVal && !defVal && Object.values(row).length >= 2) {
            const vals = Object.values(row).map((v) => String(v).trim());
            termVal = vals[0];
            defVal = vals[1];
            if (vals[2]) catVal = vals[2];
          }

          if (termVal && defVal) {
            extractedTerms.push({
              term: termVal,
              definition: defVal,
              category: catVal || 'Général',
              createdAt: new Date().toISOString(),
            });
          }
        }

        if (extractedTerms.length === 0) {
          reject(new Error("Aucune entrée valide trouvée. Assurez-vous que votre fichier contient des colonnes 'Terme' et 'Définition'."));
        } else {
          resolve(extractedTerms);
        }
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Erreur lors du traitement du fichier Excel/CSV.'));
      }
    };

    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsBinaryString(file);
  });
}

/**
 * Generate sample CSV download
 */
export function downloadSampleCsvTemplate() {
  const csvContent = `Terme;Définition;Catégorie
Inbound Marketing;Stratégie attirant le client grâce à des contenus pertinents;Marketing Digital
Social Listening;Surveillance des conversations sur les réseaux sociaux;Réseaux Sociaux
Taux de clics (CTR);Pourcentage de personnes ayant cliqué sur un lien publicitaire;KPI & Analyse
  `.trim();

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'modele_glossaire.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

