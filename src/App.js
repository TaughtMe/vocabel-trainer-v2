import React, { useState, useEffect } from 'react';
import './App.css';
import VokabelListe from './VokabelListe.js';
import VokabelEingabe from './VokabelEingabe.js'; // FEHLER 1: Dieser Import hat gefehlt.

const APP_STORAGE_KEY = 'vokabeltrainer-vokabeln';

function App() {
  const [vokabeln, setVokabeln] = useState(() => {
    const gespeicherteVokabeln = localStorage.getItem(APP_STORAGE_KEY);
    return gespeicherteVokabeln ? JSON.parse(gespeicherteVokabeln) : [];
  });
  
  // FEHLER 2: Der State für neueVokabel wurde entfernt, da er jetzt in VokabelEingabe.js lebt.
  const [isLernmodus, setIsLernmodus] = useState(false);
  const [aktuelleVokabel, setAktuelleVokabel] = useState(null);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(vokabeln));
  }, [vokabeln]);

  // FEHLER 3: handleInputChange und handleSubmit wurden durch diese eine Funktion ersetzt.
  const addVokabel = (vokabel) => {
    const vokabelMitLevel = { ...vokabel, id: Date.now(), level: 1 };
    setVokabeln(alteVokabeln => [...alteVokabeln, vokabelMitLevel]);
  };

  const lerneVokabel = () => {
    if (vokabeln.length > 0) {
      const sortedVokabeln = [...vokabeln].sort((a, b) => a.level - b.level);
      setAktuelleVokabel(sortedVokabeln[0]);
      setIsLernmodus(true);
      setFeedback('');
      setUserAntwort('');
    }
  };

  const loescheVokabel = (id) => {
    const bestaetigt = window.confirm("Möchten Sie diese Vokabel wirklich löschen?");
    if (bestaetigt) {
      setVokabeln(vokabeln.filter(v => v.id !== id));
    }
  };

  const pruefeAntwort = () => {
    let isCorrect = userAntwort.trim().toLowerCase() === aktuelleVokabel.fremdsprache.trim().toLowerCase();
    
    const aktualisierteVokabeln = vokabeln.map(v => {
      if (v.id === aktuelleVokabel.id) {
        if (isCorrect) {
          setFeedback('Richtig!');
          return { ...v, level: Math.min(v.level + 1, 5) };
        } else {
          setFeedback(`Falsch. Richtig ist: ${aktuelleVokabel.fremdsprache}`);
          return { ...v, level: 1 };
        }
      }
      return v;
    });
    
    setVokabeln(aktualisierteVokabeln);
  };

  if (isLernmodus) {
    return (
      <div className="App">
        <header className="App-header"><h1>Lern-Modus</h1></header>
        <main>
          {aktuelleVokabel ? (
            <>
              <h2>Übersetze:</h2>
              <p className="vokabel-anzeige">{aktuelleVokabel.deutsch}</p>
              <input type="text" value={userAntwort} onChange={(e) => setUserAntwort(e.target.value)} disabled={!!feedback} />
              {!feedback ? (<button onClick={pruefeAntwort}>Prüfen</button>) : (<button onClick={lerneVokabel}>Weiter</button>)}
              {feedback && <p>{feedback}</p>}
              <button onClick={() => setIsLernmodus(false)}>Zurück zur Liste</button>
            </>
          ) : (<p>Keine Vokabeln mehr zu lernen. Gut gemacht!</p>)}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header"><h1>Vokabeltrainer</h1></header>
      <main>
        <button onClick={lerneVokabel} disabled={vokabeln.length === 0}>
          Lernen starten
        </button>
        <hr />
        <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
        <hr />
        <VokabelListe vokabeln={vokabeln} loescheVokabel={loescheVokabel} />
      </main>
    </div>
  );
}

export default App;