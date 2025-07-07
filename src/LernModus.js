import React, { useState, useEffect } from 'react';
import { speak } from './speechService.js';

function LernModus({ session, onSessionEnd, lernrichtung, lernmodus, stapel, spracheVorderseite, spracheRückseite }) {
  const [aktiverIndex, setAktiverIndex] = useState(0);
  const [istBeantwortet, setIstBeantwortet] = useState(false);
  const [sessionKarten, setSessionKarten] = useState([...session]);
  const [inputValue, setInputValue] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const aktuelleKarte = sessionKarten[aktiverIndex];

  useEffect(() => {
    setAktiverIndex(0);
    setIstBeantwortet(false);
    setInputValue('');
    setFeedbackText('');
    setSessionKarten([...session]);
  }, [session]);

  const handleWeiter = () => {
    if (aktiverIndex < sessionKarten.length - 1) {
      setAktiverIndex(aktiverIndex + 1);
      setIstBeantwortet(false);
      setInputValue('');
      setFeedbackText('');
    } else {
      onSessionEnd(sessionKarten);
    }
  };

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

  const istVorderseiteZuRückseite = lernrichtung === 'Vorder-Rück';
  const frage = istVorderseiteZuRückseite ? aktuelleKarte.deutsch : aktuelleKarte.fremdsprache;
  const korrekteAntwort = istVorderseiteZuRückseite ? aktuelleKarte.fremdsprache : aktuelleKarte.deutsch;
  const frageSprache = istVorderseiteZuRückseite ? spracheVorderseite : spracheRückseite;
  const antwortSprache = istVorderseiteZuRückseite ? spracheRückseite : spracheVorderseite;

  const handlePruefen = () => {
    const istKorrekt = inputValue.trim().toLowerCase() === korrekteAntwort.trim().toLowerCase();
    
    // ======================= HIER IST DIE KORREKTUR =======================
    // Eine Kopie des aktuellen Karten-Arrays erstellen, um den State nicht direkt zu verändern.
    const kartenKopie = [...sessionKarten];
    const zuBearbeitendeKarte = { ...kartenKopie[aktiverIndex] };

    if (istKorrekt) {
      setFeedbackText('Richtig! 🎉');
      // Level erhöhen, aber maximal bis Level 5
      zuBearbeitendeKarte.level = Math.min((zuBearbeitendeKarte.level || 0) + 1, 5);
    } else {
      setFeedbackText(`Falsch. Richtig ist: ${korrekteAntwort}`);
      // Bei falscher Antwort wird das Level auf 1 zurückgesetzt
      zuBearbeitendeKarte.level = 1;
    }

    // Die bearbeitete Karte in der Kopie an der richtigen Stelle ersetzen
    kartenKopie[aktiverIndex] = zuBearbeitendeKarte;

    // Den State mit der aktualisierten Kartenliste (inkl. neuem Level) setzen
    setSessionKarten(kartenKopie);
    // =====================================================================
    
    setIstBeantwortet(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !istBeantwortet) {
      handlePruefen();
    }
  };

  return (
    <main className="card">
      <h2>Übersetze:</h2>
      
      <div className="vokabel-zeile">
        <div className="card vokabel-karte">
          <p className="vokabel-anzeige">{frage}</p>
        </div>
        <button onClick={() => speak(frage, frageSprache)} className="speak-button">🔊</button>
      </div>
      
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
      
      {!istBeantwortet ? (
        <button onClick={handlePruefen} className="button-full-width">Prüfen</button>
      ) : (
        <button onClick={handleWeiter} className="button-full-width">Weiter</button>
      )}
      
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