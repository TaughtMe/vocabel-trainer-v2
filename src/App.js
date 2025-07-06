import React, { useState, useEffect } from 'react';
import './App.css';
import StapelAuswahl from './StapelAuswahl.js';
import StapelAnsicht from './StapelAnsicht.js'; // NEU

const APP_STORAGE_KEY_NEU = 'vokabeltrainer-stapel-sammlung';
const APP_STORAGE_KEY_ALT = 'vokabeltrainer-vokabeln';

function App() {
  // --- 1. Alle useState-Aufrufe zusammen ---
  const [stapelSammlung, setStapelSammlung] = useState(() => {
    const gespeicherteSammlung = localStorage.getItem(APP_STORAGE_KEY_NEU);
    if (gespeicherteSammlung) return JSON.parse(gespeicherteSammlung);
    const alteVokabeln = localStorage.getItem(APP_STORAGE_KEY_ALT);
    if (alteVokabeln) {
      return [{ id: Date.now(), name: "Mein erster Stapel", vokabeln: JSON.parse(alteVokabeln) }];
    }
    return [];
  });

  const [aktiverStapelId, setAktiverStapelId] = useState(null);

  const [theme, setTheme] = useState(() => {
    const gespeichertesTheme = localStorage.getItem('theme');
    return gespeichertesTheme || 'light';
  });

  // --- 2. Alle useEffect-Aufrufe zusammen ---
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY_NEU, JSON.stringify(stapelSammlung));
  }, [stapelSammlung]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleStapelErstellen = (name) => {
    const neuerStapel = {
      id: Date.now(),
      name: name,
      vokabeln: [],
      lernrichtung: 'Vorder-Rück' // NEU: Standard-Lernrichtung
    };
    setStapelSammlung(alteSammlung => [...alteSammlung, neuerStapel]);
  };

  // NEU: Funktion zum Löschen eines Stapels
  const handleStapelLöschen = (id) => {
    const zuLöschenderStapel = stapelSammlung.find(s => s.id === id);
    if (!zuLöschenderStapel) return;

    const bestaetigt = window.confirm(
      `Möchten Sie den Stapel "${zuLöschenderStapel.name}" wirklich endgültig löschen?`
    );
    if (bestaetigt) {
      setStapelSammlung(alteSammlung => alteSammlung.filter(s => s.id !== id));
    }
  };

  const toggleTheme = () => {
  setTheme(aktuellesTheme => (aktuellesTheme === 'light' ? 'dark' : 'light'));
  };

  const handleStapelAuswählen = (id) => {
    setAktiverStapelId(id);
  };

  // NEU: Setzt die ID zurück, um zur Startseite zu gelangen
  const handleZurueckZurUebersicht = () => {
    setAktiverStapelId(null);
  };

  // NEU: Aktualisiert einen Stapel in der Sammlung
  const handleStapelUpdate = (aktualisierterStapel) => {
    setStapelSammlung(alteSammlung => alteSammlung.map(stapel => 
      stapel.id === aktualisierterStapel.id ? aktualisierterStapel : stapel
    ));
  };

  // Finde den aktuell aktiven Stapel
  const aktiverStapel = stapelSammlung.find(s => s.id === aktiverStapelId);

  if (aktiverStapel) {
    // Zeige die Detailansicht für den ausgewählten Stapel
    return (
      <StapelAnsicht 
        initialerStapel={aktiverStapel}
        onStapelUpdate={handleStapelUpdate}
        onZurueck={handleZurueckZurUebersicht} 
      />
    );
  } else {
    // Zeige die Startseite mit der Stapel-Übersicht
    return (
      <StapelAuswahl
        stapelSammlung={stapelSammlung}
        onStapelAuswählen={handleStapelAuswählen}
        onStapelErstellen={handleStapelErstellen}
        onStapelLöschen={handleStapelLöschen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }
}

export default App;