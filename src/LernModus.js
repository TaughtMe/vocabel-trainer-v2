import React, { useState, useEffect } from 'react';
import { speak } from './speechService.js';

function LernModus({ session, onSessionEnd, lernrichtung, lernmodus, stapel, spracheVorderseite, spracheRückseite }) {
  const [aktiverIndex, setAktiverIndex] = useState(0);
  const [istBeantwortet, setIstBeantwortet] = useState(false); // Statt 'umgedreht'
  const [sessionKarten, setSessionKarten] = useState([...session]);
  const [inputValue, setInputValue] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const aktuelleKarte = sessionKarten[aktiverIndex];

  useEffect(() => {
    // Reset für jede neue Session
    setAktiverIndex(0);
    setIstBeantwortet(false);
    setInputValue('');
    setFeedbackText('');
    setSessionKarten([...session]);
  }, [session]);

  // Handler für den "Weiter"-Button
  const handleWeiter = () => {
    if (aktiverIndex < sessionKarten.length - 1) {
      setAktiverIndex(aktiverIndex + 1);
      // Zustand für die nächste Karte zurücksetzen
      setIstBeantwortet(false);
      setInputValue('');
      setFeedbackText('');
    } else {
      // Session beenden, wenn alle Karten durch sind
      onSessionEnd(sessionKarten);
    }
  };

  // Wenn es keine Karten mehr gibt, Endbildschirm anzeigen
  if (!aktuelleKarte) {
    return (
      <main className="card" style={{ textAlign: 'center' }}>
        <h2>Super!</h2>
        <p>Du hast alle Karten für diese Runde gelernt.</p>
        <button className="button-full-width" onClick={() => onSessionEnd(sessionKarten)}>
          Zurück zur Übersicht
        </button>
      </main>
    );
  }

  // Definiert Frage, Antwort und die jeweilige Sprache basierend auf der Lernrichtung
  const istVorderseiteZuRückseite = lernrichtung === 'Vorder-Rück';
  const frage = istVorderseiteZuRückseite ? aktuelleKarte.deutsch : aktuelleKarte.fremdsprache;
  const korrekteAntwort = istVorderseiteZuRückseite ? aktuelleKarte.fremdsprache : aktuelleKarte.deutsch;
  const frageSprache = istVorderseiteZuRückseite ? spracheVorderseite : spracheRückseite;
  const antwortSprache = istVorderseiteZuRückseite ? spracheRückseite : spracheVorderseite;

  // Handler für den "Prüfen"-Button
  const handlePruefen = () => {
    const istKorrekt = inputValue.trim().toLowerCase() === korrekteAntwort.trim().toLowerCase();
    setFeedbackText(istKorrekt ? 'Richtig!' : `Falsch. Richtig ist: ${korrekteAntwort}`);
    setIstBeantwortet(true); // Zeigt das Feedback und den "Weiter"-Button an
  };

  // Handler für die Enter-Taste
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !istBeantwortet) {
      handlePruefen();
    }
  };

  // Wir rendern nur noch den "Schreiben"-Modus basierend auf dem alten Code
  return (
    <main className="card">
      <h2>Übersetze:</h2>
      
      {/* Die eigentliche Vokabelkarte mit Sprachausgabe-Button */}
      <div className="vokabel-zeile">
        <div className="card vokabel-karte">
          <p className="vokabel-anzeige">{frage}</p>
        </div>
        <button onClick={() => speak(frage, frageSprache)} className="speak-button">🔊</button>
      </div>
      
      {/* Eingabefeld */}
      <div>
        <input
          type="text"
          className="lern-input"
          placeholder="Antwort eingeben..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={istBeantwortet}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      {/* Button "Prüfen" oder "Weiter" */}
      {!istBeantwortet ? (
        <button onClick={handlePruefen} className="button-full-width">Prüfen</button>
      ) : (
        <button onClick={handleWeiter} className="button-full-width">Weiter</button>
      )}
      
      {/* Feedback-Text */}
      {istBeantwortet && (
        <p className="feedback-text">
          {feedbackText}
          {feedbackText.includes(korrekteAntwort) && (
            <button onClick={() => speak(korrekteAntwort, antwortSprache)} className="speak-button-inline">🔊</button>
          )}
        </p>
      )}
      
      <button onClick={() => onSessionEnd(sessionKarten)} className="button-link-style">Runde beenden</button>
      <p className="karten-zaehler">Karte {aktiverIndex + 1} von {sessionKarten.length}</p>
    </main>
  );
}

export default LernModus;