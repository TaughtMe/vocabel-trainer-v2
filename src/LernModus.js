import React, { useState, useEffect } from 'react';
import { speak } from './speechService.js';

// Das 'stapel'-Prop wird jetzt nicht mehr benötigt, wir entfernen es.
function LernModus({ session, onSessionEnd, lernrichtung, lernmodus, spracheVorderseite, spracheRückseite }) {
  const [aktiverIndex, setAktiverIndex] = useState(0);
  const [istBeantwortet, setIstBeantwortet] = useState(false); // Wird für "umgedreht" im klassischen Modus wiederverwendet
  const [sessionKarten, setSessionKarten] = useState([...session]);
  const [inputValue, setInputValue] = useState(''); // Nur für "schreiben"
  const [feedbackText, setFeedbackText] = useState(''); // Nur für "schreiben"
  const [istRundeBeendet, setIstRundeBeendet] = useState(false);

  const aktuelleKarte = sessionKarten[aktiverIndex];

  useEffect(() => {
    setAktiverIndex(0);
    setIstBeantwortet(false);
    setInputValue('');
    setFeedbackText('');
    setSessionKarten([...session]);
    setIstRundeBeendet(false);
  }, [session]);

  const handleWeiter = () => {
    if (aktiverIndex >= sessionKarten.length - 1) {
      setIstRundeBeendet(true);
    } else {
      setAktiverIndex(aktiverIndex + 1);
      setIstBeantwortet(false);
      setInputValue('');
      setFeedbackText('');
    }
  };
  
  const updateKartenLevel = (warRichtig) => {
    const kartenKopie = [...sessionKarten];
    const zuBearbeitendeKarte = { ...kartenKopie[aktiverIndex] };
    if (warRichtig) {
      zuBearbeitendeKarte.level = Math.min((zuBearbeitendeKarte.level || 0) + 1, 5);
    } else {
      zuBearbeitendeKarte.level = 1;
    }
    kartenKopie[aktiverIndex] = zuBearbeitendeKarte;
    setSessionKarten(kartenKopie);
  };
  
  // Neuer Handler für die "Gewusst"/"Nicht gewusst"-Buttons
  const handleBewertung = (warRichtig) => {
    updateKartenLevel(warRichtig);
    handleWeiter(); // Direkt zur nächsten Karte gehen
  };

  const handlePruefen = () => {
    const istKorrekt = inputValue.trim().toLowerCase() === korrekteAntwort.trim().toLowerCase();
    updateKartenLevel(istKorrekt);
    setFeedbackText(istKorrekt ? 'Richtig! 🎉' : `Falsch. Richtig ist: ${korrekteAntwort}`);
    setIstBeantwortet(true);
  };

  if (istRundeBeendet) {
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

  if (!aktuelleKarte) { return <div>Lade...</div>; }

  const istVorderseiteZuRückseite = lernrichtung === 'Vorder-Rück';
  const frage = istVorderseiteZuRückseite ? aktuelleKarte.deutsch : aktuelleKarte.fremdsprache;
  const korrekteAntwort = istVorderseiteZuRückseite ? aktuelleKarte.fremdsprache : aktuelleKarte.deutsch;
  const frageSprache = istVorderseiteZuRückseite ? spracheVorderseite : spracheRückseite;
  const antwortSprache = istVorderseiteZuRückseite ? spracheRückseite : spracheVorderseite;

  // ================= RENDER-LOGIK MIT BEIDEN MODI =================
  if (lernmodus === 'klassisch') {
    return (
      <main className="card">
        <h2>Lern-Modus: Klassisch</h2>
        <div className="card vokabel-karte">
          {/* Frage */}
          <div className="vokabel-zeile">
            <p className="vokabel-anzeige">{frage}</p>
            <button onClick={() => speak(frage, frageSprache)} className="speak-button">🔊</button>
          </div>
          
          {istBeantwortet && <hr />}
          
          {/* Antwort (wird nach Klick angezeigt) */}
          {istBeantwortet && (
            <div className="vokabel-zeile">
              <p className="vokabel-anzeige klassisch-antwort">{korrekteAntwort}</p>
              <button onClick={() => speak(korrekteAntwort, antwortSprache)} className="speak-button">🔊</button>
            </div>
          )}
        </div>
        
        {!istBeantwortet ? (
          <button onClick={() => setIstBeantwortet(true)} className="button-full-width">Karte umdrehen</button>
        ) : (
          <div className="button-group">
            <button className="button-warning" onClick={() => handleBewertung(false)}>Nicht gewusst</button>
            <button className="button-success" onClick={() => handleBewertung(true)}>Gewusst</button>
          </div>
        )}
        
        <button onClick={() => onSessionEnd(sessionKarten)} className="button-link-style">Runde beenden</button>
        <p className="karten-zaehler">Karte {aktiverIndex + 1} von {sessionKarten.length}</p>
      </main>
    );
  } else { // Fallback auf "schreiben"
    return (
      <main className="card">
        <h2>Übersetze:</h2>
        <div className="vokabel-zeile">
          <div className="card vokabel-karte"><p className="vokabel-anzeige">{frage}</p></div>
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
            onKeyDown={(e) => e.key === 'Enter' && !istBeantwortet && handlePruefen()}
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
            {feedbackText.includes(korrekteAntwort) && (<button onClick={() => speak(korrekteAntwort, antwortSprache)} className="speak-button-inline">🔊</button>)}
          </p>
        )}
        <button onClick={() => onSessionEnd(sessionKarten)} className="button-link-style">Runde beenden</button>
        <p className="karten-zaehler">Karte {aktiverIndex + 1} von {sessionKarten.length}</p>
      </main>
    );
  }
}

export default LernModus;