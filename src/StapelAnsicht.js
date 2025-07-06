import React, { useState, useEffect } from 'react';
import VokabelEingabe from './VokabelEingabe.js';
import VokabelListe from './VokabelListe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';

function StapelAnsicht({ initialerStapel, onStapelUpdate, onZurueck }) {
  const [vokabeln, setVokabeln] = useState(initialerStapel.vokabeln);
  const [quizSession, setQuizSession] = useState(null);

  // NEU: Stellt sicher, dass auch alte Stapel einen Standardwert haben.
  const aktuelleRichtung = initialerStapel.lernrichtung || 'Vorder-Rück';

  useEffect(() => {
    onStapelUpdate({ ...initialerStapel, vokabeln: vokabeln, lernrichtung: aktuelleRichtung });
  }, [vokabeln, aktuelleRichtung]);

  // NEU: Funktion zum Ändern der Lernrichtung
  const handleRichtungWechseln = (neueRichtung) => {
    onStapelUpdate({ ...initialerStapel, lernrichtung: neueRichtung });
  };

  const addVokabel = (vokabel) => {
    // ... unveränderte Funktion ...
    const vokabelMitLevel = { ...vokabel, id: Date.now(), level: 1 };
    setVokabeln(alteVokabeln => [...alteVokabeln, vokabelMitLevel]);
  };

  const startQuizForLevel = (level) => {
    // ... unveränderte Funktion ...
    const kartenFuerLevel = vokabeln.filter(v => v.level === level);
    const gemischteKarten = [...kartenFuerLevel].sort(() => Math.random() - 0.5);
    setQuizSession(gemischteKarten);
  };

  const handleSessionEnd = (gelernteKarten) => {
    // ... unveränderte Funktion ...
    const neueVokabeln = vokabeln.map(originalVokabel => {
      const gelernteVersion = gelernteKarten.find(g => g.id === originalVokabel.id);
      return gelernteVersion || originalVokabel;
    });
    setVokabeln(neueVokabeln);
    setQuizSession(null);
  };

  const handleStapelImport = (importierteVokabeln) => {
    // ... unveränderte Funktion ...
    if (!Array.isArray(importierteVokabeln)) {
      alert("Fehler: Die Import-Datei hat ein ungültiges Format.");
      return;
    }
    const bestaetigt = window.confirm(
      "Achtung! Dies ersetzt alle Vokabeln in diesem Stapel. Fortfahren?"
    );
    if (bestaetigt) {
      setVokabeln(importierteVokabeln);
    }
  };

  const handleCsvImport = (neueVokabeln) => {
    // ... unveränderte Funktion ...
    if (!Array.isArray(neueVokabeln) || neueVokabeln.length === 0) {
      alert("Keine gültigen Vokabeln in der CSV-Datei gefunden.");
      return;
    }
    setVokabeln(alteVokabeln => [...alteVokabeln, ...neueVokabeln]);
    alert(`${neueVokabeln.length} Vokabel(n) erfolgreich importiert!`);
  };

  if (quizSession) {
    // Wir übergeben die Lernrichtung an den Lernmodus
    return <LernModus session={quizSession} onSessionEnd={handleSessionEnd} lernrichtung={aktuelleRichtung} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="stapel-header">
          <button onClick={onZurueck} className="button-link-style">← Zurück zur Übersicht</button>
          <h1>{initialerStapel.name}</h1>
        </div>
      </header>
      <main>
        {/* NEUE EINSTELLUNGS-KARTE */}
        <div className="card">
          <h2>Einstellungen</h2>
          <div className="einstellungen-container">
            <div>
              <strong>Lernrichtung</strong>
              <div className="button-group-richtung">
                <button 
                  className={aktuelleRichtung === 'Vorder-Rück' ? 'button-active' : ''}
                  onClick={() => handleRichtungWechseln('Vorder-Rück')}
                >
                  Vorderseite → Rückseite
                </button>
                <button 
                  className={aktuelleRichtung === 'Rück-Vorder' ? 'button-active' : ''}
                  onClick={() => handleRichtungWechseln('Rück-Vorder')}
                >
                  Rückseite → Vorderseite
                </button>
              </div>
            </div>
          </div>
        </div>

        <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
        <hr />
        <VokabelListe vokabeln={vokabeln} onLernenStarten={startQuizForLevel} />
        <hr />
        <DatenManagement 
          vokabeln={vokabeln} 
          onStapelImport={handleStapelImport}
          onCsvImport={handleCsvImport}
        />
      </main>
    </div>
  );
}

export default StapelAnsicht;