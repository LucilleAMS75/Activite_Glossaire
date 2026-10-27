import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlossaryItem } from '../types';

export function exportGlossaryToPdf(items: GlossaryItem[], courseTitle: string = 'Communication Numérique en Entreprise') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Sort items alphabetically by term
  const sortedItems = [...items].sort((a, b) =>
    a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' })
  );

  const primaryColor = [129, 4, 100]; // #810464 violet
  const secondaryColor = [100, 116, 139]; // slate 500

  // Header banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 25, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('GLOSSAIRE DE LA COMMUNICATION NUMÉRIQUE', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(courseTitle, 14, 19);

  // Metadata block
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Document de formation généré le ${dateStr}`, 14, 32);
  doc.text(`Total des termes : ${sortedItems.length} (${items.filter(i => i.isBase).length} de base, ${items.filter(i => !i.isBase).length} personnalisés)`, 14, 37);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 41, 196, 41);

  // Format table rows
  const tableRows = sortedItems.map((item, index) => {
    const originBadge = item.isBase ? 'Socle de base' : 'Ajout personnel';
    const category = item.category || 'Général';
    return [
      (index + 1).toString(),
      item.term,
      item.definition,
      `${category}\n(${originBadge})`,
    ];
  });

  autoTable(doc, {
    startY: 45,
    head: [['#', 'Terme', 'Définition', 'Domaine / Source']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9.5,
      textColor: [30, 41, 59],
      cellPadding: 3.5,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold', textColor: primaryColor as [number, number, number] },
      2: { cellWidth: 95 },
      3: { cellWidth: 32, fontSize: 8, textColor: secondaryColor as [number, number, number] },
    },
    alternateRowStyles: {
      fillColor: [252, 244, 250],
    },
    margin: { top: 25, bottom: 20, left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Page ${data.pageNumber}`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        str,
        196,
        287,
        { align: 'right' }
      );
      doc.text(
        'Déployer une communication numérique en entreprise',
        14,
        287
      );
    },
  });

  // Save PDF file
  const filename = `Glossaire_Communication_Numerique.pdf`;
  doc.save(filename);
}
