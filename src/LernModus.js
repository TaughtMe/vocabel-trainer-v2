import React, { useState, useEffect } from 'react';
import { speak } from './speechService.js';

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
        // KORREKTUR: 'rueckseite' wird hier als die Antwortseite der Karte definiert
        const antwortSeite = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.fremdsprache : aktuelleKarte.deutsch;
        const istKorrekt = inputValue.trim().toLowerCase() === antwortSeite.trim().toLowerCase();
        setFeedback(istKorrekt ? 'richtig' : 'falsch');
    }
  };

  // Funktion für die Sprachausgabe
  const handleSpeak = () => {
    const vorderseiteZeigt = (lernrichtung === 'Vorder-Rück' && !umgedreht) || (lernrichtung === 'Rück-Vorder' && umgedreht);
    
    // KORREKTUR: Logik war korrekt, aber falsche Prop-Namen wurden verwendet
    if (vorderseiteZeigt) {
      speak(aktuelleKarte.deutsch, spracheVorderseite);
    } else {
      speak(aktuelleKarte.fremdsprache, spracheRückseite);
    }
  };

  if (!aktuelleKarte) {
    return <div>Lade Lernmodus...</div>;
  }

  // KORREKTUR: Hier wurden 'vorderseite'/'rueckseite' durch 'deutsch'/'fremdsprache' ersetzt
  const frage = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.deutsch : aktuelleKarte.fremdsprache;
  const antwort = lernrichtung === 'Vorder-Rück' ? aktuelleKarte.fremdsprache : aktuelleKarte.deutsch;

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