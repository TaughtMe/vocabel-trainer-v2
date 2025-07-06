import React, { useState, useEffect } from 'react';
import VokabelEingabe from './VokabelEingabe.js';
import VokabelListe from './VokabelListe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';
// NEU: SVG-Imports
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';

// NEU: theme und toggleTheme werden empfangen
function StapelAnsicht({ initialerStapel, onStapelUpdate, onZurueck, theme, toggleTheme }) {
  const [vokabeln, setVokabeln] = useState(initialerStapel.vokabeln);
  const [quizSession, setQuizSession] = useState(null);

  const aktuelleRichtung = initialerStapel.lernrichtung || 'Vorder-Rück';
  const aktuellerModus = initialerStapel.lernmodus || 'schreiben';

  useEffect(() => {
    onStapelUpdate({ ...initialerStapel, vokabeln: vokabeln, lernrichtung: aktuelleRichtung, lernmodus: aktuellerModus });
  }, [vokabeln, aktuelleRichtung, aktuellerModus]);

  // --- Alle Handler-Funktionen (handleRichtungWechseln, addVokabel etc.) bleiben unverändert ---
  const handleRichtungWechseln = (neueRichtung) => {
    onStapelUpdate({ ...initialerStapel, lernrichtung: neueRichtung });
  };
  const handleModusWechseln = (neuerModus) => {
    onStapelUpdate({ ...initialerStapel, lernmodus: neuerModus });
  };
  const addVokabel = (vokabel) => {
    const vokabelMitLevel = { ...vokabel, id: Date.now(), level: 1 };
    setVokabeln(alteVokabeln => [...alteVokabeln, vokabelMitLevel]);
  };
  const startQuizForLevel = (level) => {
    const kartenFuerLevel = vokabeln.filter(v => v.level === level);
    const gemischteKarten = [...kartenFuerLevel].sort(() => Math.random() - 0.5);
    setQuizSession(gemischteKarten);
  };
  const handleSessionEnd = (gelernteKarten) => {
    const neueVokabeln = vokabeln.map(originalVokabel => {
      const gelernteVersion = gelernteKarten.find(g => g.id === originalVokabel.id);
      return gelernteVersion || originalVokabel;
    });
    setVokabeln(neueVokabeln);
    setQuizSession(null);
  };
  const handleStapelImport = (importierteVokabeln) => {
    if (!Array.isArray(importierteVokabeln)) { alert("Fehler: Die Import-Datei hat ein ungültiges Format."); return; }
    const bestaetigt = window.confirm("Achtung! Dies ersetzt alle Vokabeln in diesem Stapel. Fortfahren?");
    if (bestaetigt) setVokabeln(importierteVokabeln);
  };
  const handleCsvImport = (neueVokabeln) => {
    if (!Array.isArray(neueVokabeln) || neueVokabeln.length === 0) { alert("Keine gültigen Vokabeln in der CSV-Datei gefunden."); return; }
    setVokabeln(alteVokabeln => [...alteVokabeln, ...neueVokabeln]);
    alert(`${neueVokabeln.length} Vokabel(n) erfolgreich importiert!`);
  };
   // --- Ende der unveränderten Funktionen ---

  if (quizSession) {
    return <LernModus 
             session={quizSession} 
             onSessionEnd={handleSessionEnd} 
             lernrichtung={aktuelleRichtung} 
             lernmodus={aktuellerModus}
           />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onZurueck} className="button-link-style">← Zurück zur Übersicht</button>
        <div className="stapel-header-main-row">
            <h1>{initialerStapel.name}</h1>
            <button onClick={toggleTheme} className="theme-toggle-button">
            <img 
                src={theme === 'light' ? moonIcon : sunIcon} 
                alt="Theme umschalten" 
            />
            </button>
        </div>
      </header>
      <main>
        {/* Der Rest der Komponente bleibt unverändert */}
        <div className="card">
          <h2>Einstellungen</h2>
          <div className="einstellungen-container">
            <div>
              <strong>Lernmodus</strong>
              <div className="button-group-richtung">
                <button className={aktuellerModus === 'schreiben' ? 'button-active' : ''} onClick={() => handleModusWechseln('schreiben')}>Schreiben</button>
                <button className={aktuellerModus === 'klassisch' ? 'button-active' : ''} onClick={() => handleModusWechseln('klassisch')}>Klassisch</button>
              </div>
            </div>
            <div>
              <strong>Lernrichtung</strong>
              <div className="button-group-richtung">
                <button className={aktuelleRichtung === 'Vorder-Rück' ? 'button-active' : ''} onClick={() => handleRichtungWechseln('Vorder-Rück')}>Vorderseite → Rückseite</button>
                <button className={aktuelleRichtung === 'Rück-Vorder' ? 'button-active' : ''} onClick={() => handleRichtungWechseln('Rück-Vorder')}>Rückseite → Vorderseite</button>
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