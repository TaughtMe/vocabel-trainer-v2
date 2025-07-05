import React from 'react';

function LernModus({
  aktuelleVokabel,
  userAntwort,
  feedback,
  onAntwortChange,
  onPruefen,
  onWeiter,
  onBeenden
}) {
    return (
    <div className="App">
        <header className="App-header"><h1>Lern-Modus</h1></header>
        <main className="card">
        {aktuelleVokabel ? (
            <>
            <h2>Übersetze:</h2>
            <div className="card vokabel-karte">
                <p className="vokabel-anzeige">{aktuelleVokabel.deutsch}</p>
            </div>
            <div>
                <input
                type="text"
                className="lern-input"
                placeholder="Antwort"
                value={userAntwort}
                onChange={onAntwortChange}
                disabled={!!feedback}
            />
            </div>
            {!feedback ? (
                <button onClick={onPruefen} className="button-full-width">Prüfen</button>
            ) : (
                <button onClick={onWeiter} className="button-full-width">Weiter</button>
            )}
            {feedback && <p>{feedback}</p>}
            <button onClick={onBeenden} className="button-link-style">Zurück zur Liste</button>
            </>
        ) : (
            <p>Keine Vokabeln zum Lernen ausgewählt.</p>
        )}
        </main>
    </div>
    );
}

export default LernModus;