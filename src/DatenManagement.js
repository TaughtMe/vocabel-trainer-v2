import React, { useRef } from 'react';

// Prop "onStapelImport" wurde entfernt
function DatenManagement({ vokabeln, onCsvImport }) {
  // Ref für das unsichtbare CSV-Datei-Input
  const csvInputRef = useRef(null);

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
      {/* Das alte json-input wurde entfernt */}
      <input type="file" ref={csvInputRef} style={{ display: 'none' }} accept=".csv, text/csv" onChange={handleCsvFileImport} />

      <h2>Daten & Import/Export</h2>
      <div className="import-export-container">
        <div>
          <h3>Karten aus CSV hinzufügen</h3>
          <p>Fügt Vokabeln zum aktuellen Stapel hinzu. Format: `Wort1,Übersetzung1`</p>
          <button onClick={handleCsvImportClick} className="button-full-width button-success">CSV Importieren</button>
        </div>
      </div>
    </div>
  );
}

export default DatenManagement;