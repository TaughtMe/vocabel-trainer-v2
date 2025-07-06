import React, { useState, useEffect } from 'react';
import './App.css';
import VokabelListe from './VokabelListe.js';
import VokabelEingabe from './VokabelEingabe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';

const APP_STORAGE_KEY = 'vokabeltrainer-vokabeln';

function App() {
  const [vokabeln, setVokabeln] = useState(() => {
    const gespeicherteVokabeln = localStorage.getItem(APP_STORAGE_KEY);
    return gespeicherteVokabeln ? JSON.parse(gespeicherteVokabeln) : [];
  });

  // NEU: Hält die Karten für die aktuelle Runde. null = keine Runde aktiv.
  const [quizSession, setQuizSession] = useState(null);

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(vokabeln));
  }, [vokabeln]);

  const addVokabel = (vokabel) => {
    const vokabelMitLevel = { ...vokabel, id: Date.now(), level: 1 };
    setVokabeln(alteVokabeln => [...alteVokabeln, vokabelMitLevel]);
  };

  // NEU: Überschreibt den aktuellen Stapel mit importierten Vokabeln.
const handleStapelImport = (importierteVokabeln) => {
  if (!Array.isArray(importierteVokabeln)) {
    alert("Fehler: Die Import-Datei hat ein ungültiges Format.");
    return;
  }
  const bestaetigt = window.confirm(
    "Achtung! Dies ersetzt alle aktuell gespeicherten Vokabeln. Fortfahren?"
  );
  if (bestaetigt) {
    setVokabeln(importierteVokabeln);
  }
};

// NEU: Fügt neue Vokabeln aus einem CSV-Import zur bestehenden Liste hinzu.
const handleCsvImport = (neueVokabeln) => {
  if (!Array.isArray(neueVokabeln) || neueVokabeln.length === 0) {
    alert("Keine gültigen Vokabeln in der CSV-Datei gefunden.");
    return;
  }
  // Fügt die neuen Vokabeln zur bestehenden Liste hinzu
  setVokabeln(alteVokabeln => [...alteVokabeln, ...neueVokabeln]);
  alert(`${neueVokabeln.length} Vokabel(n) erfolgreich importiert!`);
};

  // NEU: Startet eine Runde mit den Karten eines bestimmten Levels.
  const startQuizForLevel = (level) => {
    const kartenFuerLevel = vokabeln.filter(v => v.level === level);
    // Mische die Karten für eine zufällige Reihenfolge
    const gemischteKarten = [...kartenFuerLevel].sort(() => Math.random() - 0.5);
    setQuizSession(gemischteKarten);
  };

  // NEU: Beendet eine Runde und aktualisiert die Level der Vokabeln.
  const handleSessionEnd = (gelernteKarten) => {
    const neueVokabeln = vokabeln.map(originalVokabel => {
      const gelernteVersion = gelernteKarten.find(g => g.id === originalVokabel.id);
      return gelernteVersion || originalVokabel;
    });
    setVokabeln(neueVokabeln);
    setQuizSession(null); // Beendet die Quiz-Runde
  };

  return (
    quizSession ? (
      <LernModus session={quizSession} onSessionEnd={handleSessionEnd} />
    ) : (
      <div className="App">
        <header className="App-header"><h1>Meine Lernstapel</h1></header>
        <main>
          <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
          <hr />
          <VokabelListe vokabeln={vokabeln} onLernenStarten={startQuizForLevel} />
          <hr />
          <DatenManagement vokabeln={vokabeln} onStapelImport={handleStapelImport} />
        </main>
      </div>
    )
  );
}

export default App;