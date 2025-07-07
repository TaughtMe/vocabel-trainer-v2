import React, { useState } from 'react';
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';

// NEU: Props empfangen
function StapelAuswahl({ stapelSammlung, onStapelAuswählen, onStapelErstellen, onStapelLöschen, theme, toggleTheme }) {
  const [neuerStapelName, setNeuerStapelName] = useState('');

  const handleSubmit = (e) => {
    // ... diese Funktion bleibt unverändert ...
    e.preventDefault();
    if (neuerStapelName.trim() === '') {
      alert("Bitte geben Sie einen Namen für den neuen Stapel ein.");
      return;
    }
    onStapelErstellen(neuerStapelName);
    setNeuerStapelName('');
  };

    return (
        <div className="App">
          <header className="App-header header-overview">
                <div> {/* Div-Container für linke Seite des Headers */}
                    <h1>LernBox2.017 beta</h1>
                    <p className="subtitle">Wähle einen Stapel oder erstelle einen neuen.</p>
                </div>
                {/* NEUER THEME-BUTTON */}
                <button onClick={toggleTheme} className="theme-toggle-button">
                    <img 
                    src={theme === 'light' ? moonIcon : sunIcon} 
                    alt="Theme umschalten" 
                    />
                </button>
            </header>
          <main>
            <div className="stapel-container">
              {stapelSammlung.map(stapel => (
                // Wir ändern hier nur den Inhalt der Card
                <div key={stapel.id} className="card stapel-karte">
                  {/* NEUER LÖSCH-BUTTON */}
                  <button 
                    className="stapel-karte-loesch-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Verhindert, dass man zum Stapel navigiert
                      onStapelLöschen(stapel.id);
                    }}
                  >
                    &times; 
                  </button>
                  <div onClick={() => onStapelAuswählen(stapel.id)}>
                    <h3>{stapel.name}</h3>
                    <p>{stapel.vokabeln.length} Karten</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="lern-input"
                  value={neuerStapelName}
                  onChange={(e) => setNeuerStapelName(e.target.value)}
                  placeholder="Name für neuen Stapel..."
                />
                <button type="submit" className="button-full-width" style={{marginTop: '1rem'}}>
                  Neuen Stapel erstellen
                </button>
              </form>
            </div>
          </main>
        </div>
    );
}

export default StapelAuswahl;