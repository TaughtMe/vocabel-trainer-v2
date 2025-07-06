import React, { useRef } from 'react';

function DatenManagement({ vokabeln, onStapelImport, onCsvImport }) {
  // Refs für die zwei unsichtbaren Datei-Inputs
  const jsonInputRef = useRef(null);
  const csvInputRef = useRef(null);

  const handleExport = () => {
    // ... unveränderte Export-Logik ...
    if (vokabeln.length === 0) {
      alert("Es gibt keine Vokabeln zum Exportieren.");
      return;
    }
    const jsonString = JSON.stringify(vokabeln, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vokabeln-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJsonImportClick = () => {
    jsonInputRef.current.click();
  };

  const handleJsonFileImport = (event) => {
    // ... unveränderte JSON-Import-Logik ...
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importierteVokabeln = JSON.parse(e.target.result);
        onStapelImport(importierteVokabeln);
      } catch (error) {
        alert("Fehler beim Lesen der Datei. Bitte stellen Sie sicher, dass es eine gültige Backup-Datei ist.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // NEU: Logik für den CSV-Import
  const handleCsvImportClick = () => {
    csvInputRef.current.click();
  };

  const handleCsvFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r?\n/); // Teilt den Text in Zeilen
        const neueVokabeln = lines
          .map((line, index) => {
            const columns = line.split(',');
            if (columns.length === 2 && columns[0].trim() !== '' && columns[1].trim() !== '') {
              return {
                deutsch: columns[0].trim(),
                fremdsprache: columns[1].trim(),
                level: 1,
                id: Date.now() + index // Eindeutige ID für jeden Import
              };
            }
            return null;
          })
          .filter(vokabel => vokabel !== null); // Entfernt ungültige oder leere Zeilen

        onCsvImport(neueVokabeln);
      } catch (error) {
        alert("Fehler beim Verarbeiten der CSV-Datei.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <div className="card">
      <input type="file" ref={jsonInputRef} style={{ display: 'none' }} accept=".json" onChange={handleJsonFileImport} />
      <input type="file" ref={csvInputRef} style={{ display: 'none' }} accept=".csv, text/csv" onChange={handleCsvFileImport} />

      <h2>Daten & Import/Export</h2>
      <div className="import-export-container">
        <div>
          <h3>Karten aus CSV hinzufügen</h3>
          <p>Fügt neue Karten aus einer CSV-Datei zu diesem Stapel hinzu.</p>
          <button onClick={handleCsvImportClick} className="button-full-width button-success">CSV Importieren</button>
        </div>

        <div className="stapel-sicherung">
          <h3>Stapel-Sicherung</h3>
          <p>Exportiert oder importiert den kompletten Stapel inkl. Lernfortschritt.</p>
          <div className="button-group">
            <button onClick={handleExport} className="button-warning">Exportieren</button>
            <button onClick={handleJsonImportClick} className="button-accent">Importieren</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatenManagement;