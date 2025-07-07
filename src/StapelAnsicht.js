import React, { useState, useEffect } from 'react';
import VokabelEingabe from './VokabelEingabe.js';
import VokabelListe from './VokabelListe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';
import LanguageSelector from './LanguageSelector.js';

function StapelAnsicht({ initialerStapel, onStapelUpdate, onZurueck, theme, toggleTheme, ganzeSammlung, onSammlungErsetzen }) {
  const [vokabeln, setVokabeln] = useState(initialerStapel.vokabeln);
  const [quizSession, setQuizSession] = useState(null);

  useEffect(() => {
    onStapelUpdate({ ...initialerStapel, vokabeln: vokabeln });
  }, [vokabeln, onStapelUpdate, initialerStapel]);

  const handleModusWechseln = (neuerModus) => {
    onStapelUpdate({ ...initialerStapel, lernmodus: neuerModus });
  };

  const handleSprachAenderung = (key, neueSprache) => {
    onStapelUpdate({ ...initialerStapel, [key]: neueSprache });
  };

  const toggleLernrichtung = () => {
    const neueRichtung = initialerStapel.lernrichtung === 'Vorder-Rück' ? 'Rück-Vorder' : 'Vorder-Rück';
    onStapelUpdate({ ...initialerStapel, lernrichtung: neueRichtung });
  };

  const addVokabel = (vokabel) => {
    const vokabelMitLevel = { ...vokabel, id: Date.now(), level: 1 };
    setVokabeln(alteVokabeln => [...alteVokabeln, vokabelMitLevel]);
  };

  const startQuizForLevel = (level) => {
    const kartenFuerLevel = vokabeln.filter(v => v.level === level);
    if (kartenFuerLevel.length === 0) {
      alert("Für dieses Level sind keine Vokabeln vorhanden.");
      return;
    }
    const gemischteKarten = [...kartenFuerLevel].sort(() => Math.random() - 0.5);
    setQuizSession(gemischteKarten);
  };

  const handleSessionEnd = (gelernteKarten) => {
    const neueVokabeln = vokabeln.map(originalVokabel => {
      const gelernteVersion = gelernteKarten.find(g => g.id === originalVokabel.id);
      return gelernteVersion || originalVokabel;
    });
    setVokabeln(neueVokabeln);
    setQuizSession(null);
  };
  
  const handleCsvImport = (neueVokabeln) => {
    if (!Array.isArray(neueVokabeln) || neueVokabeln.length === 0) { 
      alert("Keine gültigen Vokabeln in der CSV-Datei gefunden."); 
      return; 
    }
    setVokabeln(alteVokabeln => [...alteVokabeln, ...neueVokabeln]);
    alert(`${neueVokabeln.length} Vokabel(n) erfolgreich importiert!`);
  };

  // Wenn eine Quiz-Session aktiv ist, zeige nur den Lernmodus an
  if (quizSession) {
    return (
      <LernModus
        session={quizSession}
        onSessionEnd={handleSessionEnd}
        lernrichtung={initialerStapel.lernrichtung}
        lernmodus={initialerStapel.lernmodus}
        spracheVorderseite={initialerStapel.quellSprache}
        spracheRückseite={initialerStapel.zielSprache}
      />
    );
  }

  // Standardansicht des Stapels
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onZurueck} className="button-link-style">← Zurück zur Übersicht</button>
        <div className="stapel-header-main-row">
          <h1>{initialerStapel.name}</h1>
          <button onClick={toggleTheme} className="theme-toggle-button">
            <img src={theme === 'light' ? moonIcon : sunIcon} alt="Theme umschalten" />
          </button>
        </div>
      </header>
      
      <main>
        {/* --- START: Finaler Einstellungs-Block --- */}
        <div className="card">
          <h2>Einstellungen</h2>

          {/* Reihe 1: Lernmodus & Lernrichtung */}
          <div className="settings-row">
            <div className="settings-group">
              <label>Lernmodus</label>
              <div className="segmented-control">
                <button
                  onClick={() => handleModusWechseln('Schreiben')}
                  className={initialerStapel.lernmodus === 'Schreiben' ? 'active' : ''}
                >
                  Schreiben
                </button>
                <button
                  onClick={() => handleModusWechseln('Klassisch')}
                  className={initialerStapel.lernmodus === 'Klassisch' ? 'active' : ''}
                >
                  Klassisch
                </button>
              </div>
            </div>
            <div className="settings-group">
              <label>Lernrichtung</label>
              <button onClick={toggleLernrichtung} className="direction-button">
                {initialerStapel.lernrichtung === 'Vorder-Rück' ? 'Vorderseite → Rückseite' : 'Rückseite → Vorderseite'}
              </button>
            </div>
          </div>

          {/* Reihe 2: Sprachausgabe */}
          <div className="settings-row">
            <div className="settings-group full-width">
              <h3>Sprachen für die Sprachausgabe</h3>
              <div className="language-selectors">
                <div className="language-selector-wrapper">
                  <label>Vorderseite:</label>
                  <LanguageSelector
                    sprache={initialerStapel.quellSprache}
                    onSprachAenderung={(neueSprache) => handleSprachAenderung('quellSprache', neueSprache)}
                  />
                </div>
                <div className="language-selector-wrapper">
                  <label>Rückseite:</label>
                  <LanguageSelector
                    sprache={initialerStapel.zielSprache}
                    onSprachAenderung={(neueSprache) => handleSprachAenderung('zielSprache', neueSprache)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- ENDE: Finaler Einstellungs-Block --- */}

        <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
        <hr />
        <VokabelListe vokabeln={vokabeln} onLernenStarten={startQuizForLevel} />
        <hr />
        <DatenManagement
          vokabeln={vokabeln}
          onSammlungErsetzen={onSammlungErsetzen}
          onCsvImport={handleCsvImport}
          ganzeSammlung={ganzeSammlung}
        />
      </main>
    </div>
  );
}

export default StapelAnsicht;