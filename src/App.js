import React, { useState, useEffect } from 'react';
import './App.css';
import StapelAuswahl from './StapelAuswahl.js';
import StapelAnsicht from './StapelAnsicht.js';
import UpdatePrompt from './UpdatePrompt.js'; // NEU

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

  // NEU: State für die Update-Benachrichtigung
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);


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
  
  // NEU: Dieser useEffect lauscht auf unser benutzerdefiniertes 'swUpdate' Event
  useEffect(() => {
    const handleUpdate = (event) => {
      // NEUE TEST-AUSGABE
      console.log('EVENT WURDE IN APP.JS EMPFANGEN!', event);
      setSwRegistration(event.detail);
      setIsUpdateAvailable(true);
      
    };
    window.addEventListener('swUpdate', handleUpdate);
    return () => window.removeEventListener('swUpdate', handleUpdate);
  }, []);


  // --- 3. Alle Handler-Funktionen ---
  const handleStapelErstellen = (name) => {
    const neuerStapel = {
      id: Date.now(),
      name: name,
      vokabeln: [],
      lernrichtung: 'Vorder-Rück',
      lernmodus: 'schreiben'
    };
    setStapelSammlung(alteSammlung => [...alteSammlung, neuerStapel]);
  };

  const handleStapelLöschen = (id) => {
    const zuLöschenderStapel = stapelSammlung.find(s => s.id === id);
    if (!zuLöschenderStapel) return;
    const bestaetigt = window.confirm(`Möchten Sie den Stapel "${zuLöschenderStapel.name}" wirklich endgültig löschen?`);
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

  const handleZurueckZurUebersicht = () => {
    setAktiverStapelId(null);
  };

  const handleStapelUpdate = (aktualisierterStapel) => {
    setStapelSammlung(alteSammlung => alteSammlung.map(stapel => 
      stapel.id === aktualisierterStapel.id ? aktualisierterStapel : stapel
    ));
  };
  
  // NEU: Diese Funktion wird vom Update-Button aufgerufen
  const handleUpdateAccept = () => {
    setIsUpdateAvailable(false);
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Der Service Worker lädt die Seite nach der Aktivierung neu. 
      // Ein zusätzlicher Reload sorgt für mehr Stabilität.
      swRegistration.waiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  // --- 4. Finale Render-Logik ---
  const aktiverStapel = stapelSammlung.find(s => s.id === aktiverStapelId);
  let currentPage;

  if (aktiverStapel) {
    currentPage = (
      <StapelAnsicht 
        initialerStapel={aktiverStapel}
        onStapelUpdate={handleStapelUpdate}
        onZurueck={handleZurueckZurUebersicht}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  } else {
    currentPage = (
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

  return (
    <>
      {isUpdateAvailable && <UpdatePrompt onUpdate={handleUpdateAccept} />}
      {currentPage}
    </>
  );
}

export default App;