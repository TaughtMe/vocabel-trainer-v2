import React, { useState } from 'react';

function LernModus({ session, onSessionEnd, lernrichtung, lernmodus }) {
  // Alle benötigten States
  const [sessionCards, setSessionCards] = useState([...session]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false); // Der neue State für das Rundenende

  // Die ursprüngliche Anzahl an Karten für den Zähler "Y"
  const totalInitialCards = session.length;
  const aktuelleVokabel = sessionCards[currentIndex];

  let frage, korrekteAntwort;
  if (aktuelleVokabel) {
    if (lernrichtung === 'Rück-Vorder') {
      frage = aktuelleVokabel.fremdsprache;
      korrekteAntwort = aktuelleVokabel.deutsch;
    } else {
      frage = aktuelleVokabel.deutsch;
      korrekteAntwort = aktuelleVokabel.fremdsprache;
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
  
  // ANGEPASSTE "Weiter"-Logik
  const handleWeiter = () => {
    if (currentIndex + 1 >= totalInitialCards) {
      setIsSessionComplete(true); // Löst den Abschluss-Screen aus
    } else {
      setFeedback('');
      setUserAntwort('');
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // NEUER Abschluss-Screen
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

  // Fallback, falls alle Karten inkl. Wiederholungen gelernt wurden
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
          <div className="card vokabel-karte" onClick={() => setIsFlipped(true)}>
            <p className="vokabel-anzeige">{frage}</p>
            {isFlipped && <hr />}
            {isFlipped && <p className="vokabel-anzeige klassisch-antwort">{korrekteAntwort}</p>}
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
          <div className="card vokabel-karte"><p className="vokabel-anzeige">{frage}</p></div>
          <div><input type="text" className="lern-input" placeholder="Antwort eingeben..." value={userAntwort} onChange={(e) => setUserAntwort(e.target.value)} disabled={!!feedback} onKeyDown={(e) => e.key === 'Enter' && !feedback && handlePruefen()}/></div>
          {!feedback ? (<button onClick={handlePruefen} className="button-full-width">Prüfen</button>) : (<button onClick={handleWeiter} className="button-full-width">Weiter</button>)}
          {feedback && <p>{feedback}</p>}
          <button onClick={() => onSessionEnd(sessionCards)} className="button-link-style">Runde beenden</button>
          <p className="karten-zaehler">Karte {Math.min(currentIndex + 1, totalInitialCards)} von {totalInitialCards}</p>
        </main>
      </div>
    );
  }
}

export default LernModus;