import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import StapelAuswahl from './StapelAuswahl.js';
import StapelAnsicht from './StapelAnsicht.js';
import UpdatePrompt from './UpdatePrompt.js';
import Impressum from './Impressum';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';



const APP_STORAGE_KEY_NEU = 'vokabeltrainer-stapel-sammlung';
const APP_STORAGE_KEY_ALT = 'vokabeltrainer-vokabeln';

function App() {

  // --- 1. Alle useState-Aufrufe zusammen ---
  const [stapelSammlung, setStapelSammlung] = useState(() => {
    const gespeicherteSammlung = localStorage.getItem(APP_STORAGE_KEY_NEU);
    if (gespeicherteSammlung) return JSON.parse(gespeicherteSammlung);
    const alteVokabeln = localStorage.getItem(APP_STORAGE_KEY_ALT);
    if (alteVokabeln) {
      return [{ 
          id: Date.now(), 
          name: "Mein erster Stapel", 
          vokabeln: JSON.parse(alteVokabeln),
          // Standard-Sprachen für migrierte Stapel
          quellSprache: 'de-DE',
          zielSprache: 'en-US'
      }];
    }
    return [];
  });

  const [aktiverStapelId, setAktiverStapelId] = useState(null);

  const [theme, setTheme] = useState(() => {
    const gespeichertesTheme = localStorage.getItem('theme');
    return gespeichertesTheme || 'light';
  });

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  
  const [zeigeImpressum, setZeigeImpressum] = useState(false);

  const handleSammlungImportieren = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importierteSammlung = JSON.parse(event.target.result);
          // Hier wird die bereits existierende Logik aufgerufen
          handleSammlungErsetzen(importierteSammlung);
        } catch (error) {
          alert('Fehler: Die Datei konnte nicht gelesen werden. Bitte stellen Sie sicher, dass es eine gültige JSON-Datei ist.');
          console.error("Fehler beim Importieren der Datei:", error);
        }
      };
      reader.readAsText(file);
    };

    fileInput.click();
  };


  // --- 2. Alle useEffect-Aufrufe zusammen ---
  useEffect(() => {
    const registerPeriodicSync = async () => {
      if ('serviceWorker' in navigator && 'PeriodicSyncManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
          if (status.state === 'granted') {
            await registration.periodicSync.register('update-check', {
              minInterval: 24 * 60 * 60 * 1000,
            });
            console.log('Periodische Update-Prüfung registriert.');
          } else {
            console.log('Keine Erlaubnis für periodische Hintergrund-Synchronisierung.');
          }
        } catch (error) {
          console.error('Fehler bei der Registrierung der periodischen Synchronisierung:', error);
        }
      }
    };
    registerPeriodicSync();
  }, []);

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
  
  useEffect(() => {
    serviceWorkerRegistration.register();
    const checkForWaitingWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.waiting) {
            setSwRegistration(registration);
            setIsUpdateAvailable(true);
          }
        });
      }
    };
    checkForWaitingWorker();
    const handleUpdate = (event) => {
      setSwRegistration(event.detail);
      setIsUpdateAvailable(true);
    };
    window.addEventListener('swUpdate', handleUpdate);
    return () => window.removeEventListener('swUpdate', handleUpdate);
  }, []);


  // --- 3. Alle Handler-Funktionen ---

  const handleStapelErstellen = (name, quellSprache, zielSprache) => {
    const neuerStapel = {
      id: Date.now(),
      name: name,
      vokabeln: [],
      lernrichtung: 'Vorder-Rück',
      lernmodus: 'schreiben',
      quellSprache: quellSprache || 'de-DE', 
      zielSprache: zielSprache || 'en-US'
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

  const toggleTheme = useCallback(() => {
    setTheme(aktuellesTheme => (aktuellesTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleStapelAuswählen = (id) => {
    setAktiverStapelId(id);
  };

  const handleZurueckZurUebersicht = useCallback(() => {
    setAktiverStapelId(null);
  }, []);

  const handleStapelUpdate = useCallback((aktualisierterStapel) => {
    setStapelSammlung(alteSammlung => alteSammlung.map(stapel =>
      stapel.id === aktualisierterStapel.id ? aktualisierterStapel : stapel
    ));
  }, []);

  const handleSammlungErsetzen = (importierteSammlung) => {
    if (!Array.isArray(importierteSammlung)) {
      alert("Fehler: Die Import-Datei hat ein ungültiges Format.");
      return;
    }
    const bestaetigt = window.confirm(
      "Achtung! Dies ersetzt ALLE Ihre Stapel und Vokabeln. Dieser Vorgang kann nicht rückgängig gemacht werden. Fortfahren?"
    );
    if (bestaetigt) {
      setStapelSammlung(importierteSammlung);
    }
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

  const handleGanzesExportieren = () => {
    if (stapelSammlung.length === 0) {
      alert("Es gibt keine Stapel zum Exportieren.");
      return;
    }
    const datenStr = JSON.stringify(stapelSammlung, null, 2);
    const dataBlob = new Blob([datenStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LernBox_Alle_Stapel.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const aktiverStapel = useMemo(() => 
    stapelSammlung.find(s => s.id === aktiverStapelId),
    [stapelSammlung, aktiverStapelId]
  );

  if (aktiverStapel) {
    currentPage = (
      <StapelAnsicht
        initialerStapel={aktiverStapel}
        onStapelUpdate={handleStapelUpdate}
        onZurueck={handleZurueckZurUebersicht}
        theme={theme}
        toggleTheme={toggleTheme}
        ganzeSammlung={stapelSammlung} 
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
        onGanzesExportieren={handleGanzesExportieren}
        onSammlungImportieren={handleSammlungImportieren}
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