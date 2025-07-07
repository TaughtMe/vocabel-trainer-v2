import React, { useState } from 'react';
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';

function StapelAuswahl({ stapelSammlung, onStapelAuswählen, onStapelErstellen, onStapelLöschen, theme, toggleTheme, onGanzesExportieren, onSammlungImportieren }) {
  const [neuerStapelName, setNeuerStapelName] = useState('');

  const handleSubmit = (e) => {
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
              <div>
                  <h1>LernBox2.026 beta</h1>
                  <p className="subtitle">Wähle einen Stapel oder erstelle einen neuen.</p>
              </div>
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
                <div key={stapel.id} className="card stapel-karte">
                  <button 
                    className="stapel-karte-loesch-button"
                    onClick={(e) => {
                      e.stopPropagation(); 
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

            {/* HIER WURDE DER TEXT EINGEFÜGT */}
            <div className="card">
              <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                <h3>Stapel-Sicherung</h3>
                <p style={{fontSize: '0.9rem', opacity: '0.8'}}>
                  Exportiert oder importiert die komplette Sammlung aller Stapel.
                </p>
              </div>
              <div className="button-container">
                <button onClick={onGanzesExportieren} className="button-export">
                  Exportieren
                </button>
                <button onClick={onSammlungImportieren} className="button-import">
                  Importieren
                </button>
              </div>
            </div>
            
          </main>
        </div>
    );
}

export default StapelAuswahl;