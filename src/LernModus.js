import React, { useState } from 'react';
import { speak } from './speechService'; // NEU: Import des Sprach-Service

// WICHTIG: 'stapel' muss als Prop empfangen werden, um die Sprachcodes zu erhalten
function LernModus({ session, onSessionEnd, lernrichtung, lernmodus, stapel }) {
  // Alle benötigten States
  const [sessionCards, setSessionCards] = useState([...session]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const totalInitialCards = session.length;
  const aktuelleVokabel = sessionCards[currentIndex];

  // NEU: Logik zur Bestimmung der korrekten Sprache für die Sprachausgabe
  // Definiert Standardwerte, falls Sprachen im Stapel fehlen (für alte Stapel)
  const quellSprache = stapel?.quellSprache || 'de-DE';
  const zielSprache = stapel?.zielSprache || 'en-US';

  let frage, korrekteAntwort, frageSprache, antwortSprache;
  if (aktuelleVokabel) {
    // Hier wird unterschieden, was die Frage/Antwort und was die jeweilige Sprache ist
    if (lernrichtung === 'Rück-Vorder') {
      frage = aktuelleVokabel.fremdsprache;
      korrekteAntwort = aktuelleVokabel.deutsch;
      frageSprache = zielSprache; // Die Fremdsprache ist die Zielsprache des Stapels
      antwortSprache = quellSprache;
    } else {
      frage = aktuelleVokabel.deutsch;
      korrekteAntwort = aktuelleVokabel.fremdsprache;
      frageSprache = quellSprache; // Deutsch ist die Quellsprache des Stapels
      antwortSprache = zielSprache;
    }
  }

  const bewerteKarte = (isCorrect) => {
    let kartenKopie = [...sessionCards];
    let zuBearbeitendeKarte = { ...kartenKopie[currentIndex] };
    if (isCorrect) {
      setFeedback('Richtig!');
      zuBearbeitendeKarte.level = Math.min(zuBearbeitendeKarte.level + 1, 5);
    } else {
      setFeedback(`Falsch. Richtig ist: ${korrekteAntwort}`);
      zuBearbeitendeKarte.level = 1;
      kartenKopie.push(zuBearbeitendeKarte);
    }
    kartenKopie[currentIndex] = zuBearbeitendeKarte;
    setSessionCards(kartenKopie);
  };

  const handlePruefen = () => {
    if (!aktuelleVokabel) return;
    const isCorrect = userAntwort.trim().toLowerCase() === korrekteAntwort.trim().toLowerCase();
    bewerteKarte(isCorrect);
  };

  const handleBewertung = (warRichtig) => {
    bewerteKarte(warRichtig);
    handleWeiter();
  };
  
  const handleWeiter = () => {
    if (currentIndex + 1 >= totalInitialCards) {
      setIsSessionComplete(true);
    } else {
      setFeedback('');
      setUserAntwort('');
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (isSessionComplete) {
    return (
      <div className="App">
        <header className="App-header"><h1>Runde geschafft!</h1></header>
        <main className="card" style={{textAlign: 'center'}}>
          <h2>Sehr gut, du hast es geschafft!</h2>
          <p>Du hast alle {totalInitialCards} Karten der Runde durchgearbeitet.</p>
          <button className="button-full-width" onClick={() => onSessionEnd(sessionCards)}>
            OK
          </button>
        </main>
      </div>
    );
  }

  if (!aktuelleVokabel) {
    return (
      <div className="App">
        <main className="card">
          <h2>Super!</h2>
          <p>Du hast alle Karten für diese Runde gelernt.</p>
          <button className="button-full-width" onClick={() => onSessionEnd(sessionCards)}>
            Zurück zur Übersicht
          </button>
        </main>
      </div>
    );
  }

  // Die eigentliche Render-Logik mit den beiden Modi
  if (lernmodus === 'klassisch') {
    return (
      <div className="App">
        <header className="App-header"><h1>Lern-Modus: Klassisch</h1></header>
        <main className="card">
          <div className="card vokabel-karte">
            {/* NEU: Sprachausgabe für die Frage */}
            <div className="vokabel-zeile">
              <p className="vokabel-anzeige">{frage}</p>
              <button onClick={() => speak(frage, frageSprache)} className="speak-button">🔊</button>
            </div>
            
            {isFlipped && <hr />}
            
            {/* NEU: Sprachausgabe für die Antwort */}
            {isFlipped && (
              <div className="vokabel-zeile">
                <p className="vokabel-anzeige klassisch-antwort">{korrekteAntwort}</p>
                <button onClick={() => speak(korrekteAntwort, antwortSprache)} className="speak-button">🔊</button>
              </div>
            )}
          </div>
          {!isFlipped ? (<button onClick={() => setIsFlipped(true)} className="button-full-width">Karte umdrehen</button>) : (<div className="button-group bewertungs-buttons"><button className="button-warning" onClick={() => handleBewertung(false)}>Nicht gewusst</button><button className="button-success" onClick={() => handleBewertung(true)}>Gewusst</button></div>)}
          <button onClick={() => onSessionEnd(sessionCards)} className="button-link-style">Runde beenden</button>
          <p className="karten-zaehler">Karte {Math.min(currentIndex + 1, totalInitialCards)} von {totalInitialCards}</p>
        </main>
      </div>
    );
  } else { // Schreiben-Modus
    return (
      <div className="App">
        <header className="App-header"><h1>Lern-Modus: Schreiben</h1></header>
        <main className="card">
          <h2>Übersetze:</h2>
          {/* NEU: Sprachausgabe für die Frage */}
          <div className="vokabel-zeile">
             <div className="card vokabel-karte"><p className="vokabel-anzeige">{frage}</p></div>
             <button onClick={() => speak(frage, frageSprache)} className="speak-button">🔊</button>
          </div>
          
          <div><input type="text" className="lern-input" placeholder="Antwort eingeben..." value={userAntwort} onChange={(e) => setUserAntwort(e.target.value)} disabled={!!feedback} onKeyDown={(e) => e.key === 'Enter' && !feedback && handlePruefen()}/></div>
          {!feedback ? (<button onClick={handlePruefen} className="button-full-width">Prüfen</button>) : (<button onClick={handleWeiter} className="button-full-width">Weiter</button>)}
          
          {/* NEU: Sprachausgabe für die richtige Antwort im Feedback */}
          {feedback && (
            <p className="feedback-text">
              {feedback}
              {feedback.includes(korrekteAntwort) && (
                 <button onClick={() => speak(korrekteAntwort, antwortSprache)} className="speak-button-inline">🔊</button>
              )}
            </p>
          )}
          
          <button onClick={() => onSessionEnd(sessionCards)} className="button-link-style">Runde beenden</button>
          <p className="karten-zaehler">Karte {Math.min(currentIndex + 1, totalInitialCards)} von {totalInitialCards}</p>
        </main>
      </div>
    );
  }
}

export default LernModus;

/*
CSS-Tipp für die Darstellung (z.B. in App.css):

.vokabel-zeile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.speak-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 10px;
}

.speak-button-inline {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 8px;
}
*/