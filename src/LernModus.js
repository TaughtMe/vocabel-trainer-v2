import React, { useState } from 'react';

// Die Komponente empfängt jetzt auch die "lernrichtung"
function LernModus({ session, onSessionEnd, lernrichtung }) {
  const [sessionCards, setSessionCards] = useState([...session]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');

  const aktuelleVokabel = sessionCards[currentIndex];

  // NEU: Wir definieren Frage und Antwort basierend auf der Lernrichtung
  let frage, korrekteAntwort;
  if (aktuelleVokabel) {
    if (lernrichtung === 'Rück-Vorder') {
      frage = aktuelleVokabel.fremdsprache;
      korrekteAntwort = aktuelleVokabel.deutsch;
    } else { // Standard ist 'Vorder-Rück'
      frage = aktuelleVokabel.deutsch;
      korrekteAntwort = aktuelleVokabel.fremdsprache;
    }
  }

  const handlePruefen = () => {
    if (!aktuelleVokabel) return;

    // NEU: Vergleicht mit der dynamischen "korrekteAntwort"
    const isCorrect = userAntwort.trim().toLowerCase() === korrekteAntwort.trim().toLowerCase();
    let kartenKopie = [...sessionCards];
    let zuBearbeitendeKarte = { ...kartenKopie[currentIndex] };

    if (isCorrect) {
      setFeedback('Richtig!');
      zuBearbeitendeKarte.level = Math.min(zuBearbeitendeKarte.level + 1, 5);
    } else {
      // NEU: Zeigt die dynamische "korrekteAntwort"
      setFeedback(`Falsch. Richtig ist: ${korrekteAntwort}`);
      zuBearbeitendeKarte.level = 1;
      kartenKopie.push(zuBearbeitendeKarte);
    }

    kartenKopie[currentIndex] = zuBearbeitendeKarte;
    setSessionCards(kartenKopie);
  };

  const handleWeiter = () => {
    setFeedback('');
    setUserAntwort('');
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= sessionCards.length) {
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

  if (currentIndex >= sessionCards.length) {
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

    return (
    <div className="App">
        <header className="App-header"><h1>Lern-Modus</h1></header>
        <main className="card">
        <h2>Übersetze:</h2>
        <div className="card vokabel-karte">
            <p className="vokabel-anzeige">{frage}</p>
        </div>
        <div>
            <input
            type="text"
            className="lern-input"
            placeholder="Antwort eingeben..."
            value={userAntwort}
            onChange={(e) => setUserAntwort(e.target.value)}
            disabled={!!feedback}
            onKeyDown={(e) => e.key === 'Enter' && !feedback && handlePruefen()}
            />
        </div>
        {!feedback ? (
            <button onClick={handlePruefen} className="button-full-width">Prüfen</button>
        ) : (
            <button onClick={handleWeiter} className="button-full-width">Weiter</button>
        )}
        {feedback && <p>{feedback}</p>}
        <button onClick={() => onSessionEnd(sessionCards)} className="button-link-style">
            Runde beenden
        </button>

        {/* NEUER ZÄHLER HINZUGEFÜGT */}
        <p className="karten-zaehler">
            Karte {currentIndex + 1} von {session.length}
        </p>
        </main>
    </div>
    );
}

export default LernModus;