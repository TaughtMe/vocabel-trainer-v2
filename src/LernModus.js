import React, { useState, useEffect } from 'react';

function LernModus({ session, onSessionEnd }) {
  const [sessionCards, setSessionCards] = useState([...session]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');

  const aktuelleVokabel = sessionCards[currentIndex];

  const handlePruefen = () => {
    if (!aktuelleVokabel) return;

    const isCorrect = userAntwort.trim().toLowerCase() === aktuelleVokabel.fremdsprache.trim().toLowerCase();
    let kartenKopie = [...sessionCards];
    let zuBearbeitendeKarte = { ...kartenKopie[currentIndex] };

    if (isCorrect) {
      setFeedback('Richtig!');
      zuBearbeitendeKarte.level = Math.min(zuBearbeitendeKarte.level + 1, 5);
    } else {
      setFeedback(`Falsch. Richtig ist: ${aktuelleVokabel.fremdsprache}`);
      zuBearbeitendeKarte.level = 1;
      // NEU: Karte nach hinten schieben
      kartenKopie.push(zuBearbeitendeKarte);
    }

    // Aktualisiere die bearbeitete Karte in der Kopie
    kartenKopie[currentIndex] = zuBearbeitendeKarte;
    setSessionCards(kartenKopie);
  };

  const handleWeiter = () => {
    setFeedback('');
    setUserAntwort('');
    setCurrentIndex(currentIndex + 1);
  };

  // Wenn alle Karten durch sind, beende die Session.
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
          <p className="vokabel-anzeige">{aktuelleVokabel.deutsch}</p>
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
      </main>
    </div>
  );
}

export default LernModus;