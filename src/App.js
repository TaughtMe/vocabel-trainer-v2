// In src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import StapelAuswahl from './StapelAuswahl.js';
import StapelAnsicht from './StapelAnsicht.js';
import UpdatePrompt from './UpdatePrompt.js';
import Impressum from './Impressum';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const APP_STORAGE_KEY_NEU = 'vokabeltrainer-stapel-sammlung';
const APP_STORAGE_KEY_ALT = 'vokabeltrainer-vokabeln';

function App() {

useEffect(() => {
  const registerPeriodicSync = async () => {
    // Prüfen, ob der Browser die nötigen APIs überhaupt unterstützt
    if ('serviceWorker' in navigator && 'PeriodicSyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Erlaubnis für 'periodic-background-sync' anfragen
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' });

        if (status.state === 'granted') {
          // Erlaubnis ist bereits erteilt
          // Wir registrieren eine Aufgabe mit einem eindeutigen Namen ('update-check')
          await registration.periodicSync.register('update-check', {
            // minInterval in Millisekunden: 24 Stunden
            // Der Browser entscheidet, wann genau er es ausführt.
            minInterval: 24 * 60 * 60 * 1000, 
          });
          console.log('Periodische Update-Prüfung registriert.');
        } else {
          // Erlaubnis wurde noch nicht erteilt oder abgelehnt
          console.log('Keine Erlaubnis für periodische Hintergrund-Synchronisierung.');
        }
      } catch (error) {
        console.error('Fehler bei der Registrierung der periodischen Synchronisierung:', error);
      }
    }
  };

  registerPeriodicSync();
  }, []);
  
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

  // State für die Update-Benachrichtigung
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
  
  // KORRIGIERTER useEffect für die Service Worker Logik
  useEffect(() => {
    // 1. Wir rufen die register() Funktion auf, um den Service Worker zu aktivieren.
    // Das ist notwendig, damit die Update-Prüfung überhaupt stattfindet.
    serviceWorkerRegistration.register();

    // 2. Funktion zur Prüfung, ob ein Worker wartet (für den Refresh-Fall)
    const checkForWaitingWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.waiting) {
            console.log('Ein wartender Worker wurde beim Seitenstart gefunden.');
            setSwRegistration(registration);
            setIsUpdateAvailable(true);
          }
        });
      }
    };
    
    // Wir führen die Prüfung direkt beim Start aus.
    checkForWaitingWorker();

    // 3. Wir lauschen weiterhin auf das 'swUpdate'-Event für neue Updates.
    const handleUpdate = (event) => {
      console.log('Neues Update via "swUpdate"-Event erkannt.');
      setSwRegistration(event.detail);
      setIsUpdateAvailable(true);
    };
    window.addEventListener('swUpdate', handleUpdate);

    // Aufräumfunktion
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
  
  const handleUpdateAccept = () => {
    setIsUpdateAvailable(false);
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const handleStapelErstellen = (name, quellSprache, zielSprache) => {
    const neuerStapel = {
      id: Date.now(),
      name: name,
      vokabeln: [],
      lernrichtung: 'Vorder-Rück',
      lernmodus: 'schreiben',
      quellSprache: quellSprache || 'de-DE', // Fallback, falls nichts übergeben wird
      zielSprache: zielSprache || 'en-US'   // Fallback
    };
    setStapelSammlung(alteSammlung => [...alteSammlung, neuerStapel]);
  };

   const [zeigeImpressum, setZeigeImpressum] = useState(false);

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

      <footer className="app-footer">
        <span 
          style={{ cursor: "pointer", color: "var(--primary-color)", textDecoration: "underline" }}
          onClick={() => setZeigeImpressum(true)}
        >
          Impressum
        </span>
      </footer>

      {zeigeImpressum && <Impressum onClose={() => setZeigeImpressum(false)} />}
    </>
  );
}

export default App;