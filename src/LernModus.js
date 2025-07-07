import React, { useState, useEffect } from 'react';
import { speak } from './speechService.js'; // RICHTIG

// Die neuen Props spracheVorderseite und spracheRückseite werden hier empfangen
function LernModus({ session, onSessionEnd, lernrichtung, lernmodus, stapel, spracheVorderseite, spracheRückseite }) {
  const [aktiverIndex, setAktiverIndex] = useState(0);
  const [umgedreht, setUmgedreht] = useState(false);
  const [sessionKarten, setSessionKarten] = useState([...session]);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(''); // Für "richtig" oder "falsch" Feedback

  const aktuelleKarte = sessionKarten[aktiverIndex];

  // Stellt sicher, dass die Ansicht zurückgesetzt wird, wenn eine neue Session startet
  useEffect(() => {
    setAktiverIndex(0);
    setUmgedreht(false);
    setInputValue('');
    setFeedback('');
    setSessionKarten([...session]);
  }, [session]);


  const handleWeiter = () => {
    if (aktiverIndex < sessionKarten.length - 1) {
      setAktiverIndex(aktiverIndex + 1);
      setUmgedreht(false);
      setInputValue('');
      setFeedback('');
    } else {
      // Wenn alle Karten durch sind, die Session beenden
      onSessionEnd(sessionKarten);
    }
  };

  const handleAufdecken = () => {
    setUmgedreht(true);
    if (lernmodus === 'schreiben') {
        const vorderseite = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.vorderseite : aktuelleKarte.rueckseite;
        const rueckseite = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.rueckseite : aktuelleKarte.vorderseite;
        const istKorrekt = inputValue.trim().toLowerCase() === rueckseite.trim().toLowerCase();
        setFeedback(istKorrekt ? 'richtig' : 'falsch');
    }
  };

  // Funktion für die Sprachausgabe
  const handleSpeak = () => {
    const vorderseiteZeigt = (lernrichtung === 'Vorder-Rück' && !umgedreht) || (lernrichtung === 'Rück-Vorder' && umgedreht);
    
    if (vorderseiteZeigt) {
      speak(aktuelleKarte.vorderseite, spracheVorderseite);
    } else {
      speak(aktuelleKarte.rueckseite, spracheRückseite);
    }
  };

  if (!aktuelleKarte) {
    return <div>Lade Lernmodus...</div>;
  }

  // Definiert, welche Seite der Karte die Frage und welche die Antwort ist
  const frage = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.vorderseite : aktuelleKarte.rueckseite;
  const antwort = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.rueckseite : aktuelleKarte.vorderseite;

  return (
    <div className="lern-modus">
      <div className={`karte ${umgedreht ? 'umgedreht' : ''}`}>
        <div className="karte-inhalt">
          <div className="karte-vorderseite">
            <p>{frage}</p>
          </div>
          <div className="karte-rueckseite">
            <p>{antwort}</p>
            {feedback && (
                <p className={feedback === 'richtig' ? 'feedback-richtig' : 'feedback-falsch'}>
                    {feedback}
                </p>
            )}
          </div>
        </div>
      </div>

      <div className="lern-controls">
         {/* Sprachausgabe-Button */}
         <button onClick={handleSpeak} className="speak-button">🔊 Vorlesen</button>
        
        {lernmodus === 'schreiben' && !umgedreht && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Antwort eingeben"
            className="antwort-input"
          />
        )}
        
        {umgedreht ? (
          <button onClick={handleWeiter}>Weiter</button>
        ) : (
          <button onClick={handleAufdecken}>Aufdecken</button>
        )}
      </div>

      <div className="session-fortschritt">
        Karte {aktiverIndex + 1} von {sessionKarten.length}
      </div>

      <button onClick={() => onSessionEnd(sessionKarten)} className="button-link-style">
        Lernmodus vorzeitig beenden
      </button>
    </div>
  );
}

export default LernModus;