/**
 * Utilitaire d'export CSV pour le client
 */

export function downloadCsvBlob(blobData, filename = 'export.csv') {
  const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv(filename, headers, rows) {
  // UTF-8 BOM pour compatibilité Excel
  let csvContent = '\uFEFF';
  
  // Headers
  csvContent += headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(';') + '\r\n';

  // Rows
  rows.forEach(row => {
    csvContent += row.map(cell => {
      if (cell === null || cell === undefined) return '""';
      return `"${String(cell).replace(/"/g, '""')}"`;
    }).join(';') + '\r\n';
  });

  downloadCsvBlob(csvContent, filename);
}
