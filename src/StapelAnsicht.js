import React, { useState, useEffect } from 'react';
import VokabelEingabe from './VokabelEingabe.js';
import VokabelListe from './VokabelListe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';
import LanguageSelector from './LanguageSelector.js';

function StapelAnsicht({ initialerStapel, onStapelUpdate, onZurueck, theme, toggleTheme }) {
  const [vokabeln, setVokabeln] = useState(initialerStapel.vokabeln);
  const [quizSession, setQuizSession] = useState(null);

  useEffect(() => {
    onStapelUpdate({ ...initialerStapel, vokabeln: vokabeln });
  }, [vokabeln, onStapelUpdate]);


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
  const handleStapelImport = (importierteVokabeln) => {
    if (!Array.isArray(importierteVokabeln)) { alert("Fehler: Die Import-Datei hat ein ungültiges Format."); return; }
    const bestaetigt = window.confirm("Achtung! Dies ersetzt alle Vokabeln in diesem Stapel. Fortfahren?");
    if (bestaetigt) setVokabeln(importierteVokabeln);
  };
  const handleCsvImport = (neueVokabeln) => {
    if (!Array.isArray(neueVokabeln) || neueVokabeln.length === 0) { alert("Keine gültigen Vokabeln in der CSV-Datei gefunden."); return; }
    setVokabeln(alteVokabeln => [...alteVokabeln, ...neueVokabeln]);
    alert(`${neueVokabeln.length} Vokabel(n) erfolgreich importiert!`);
  };

  if (quizSession) {
    return <LernModus
              session={quizSession}
              onSessionEnd={handleSessionEnd}
              lernrichtung={initialerStapel.lernrichtung}
              lernmodus={initialerStapel.lernmodus}
              stapel={initialerStapel}
              spracheVorderseite={initialerStapel.quellSprache}
              spracheRückseite={initialerStapel.zielSprache}
            />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onZurueck} className="button-link-style">← Zurück zur Übersicht</button>
        <div className="stapel-header-main-row">
          <h1>{initialerStapel.name}</h1>
          <button onClick={toggleTheme} className="theme-toggle-button">
            <img
              src={theme === 'light' ? moonIcon : sunIcon}
              alt="Theme umschalten"
            />
          </button>
        </div>
      </header>
      <main>
        <div className="card">
          <h2>Einstellungen</h2>
          <div className="einstellungen-layout-container">

            <div className="einstellungen-reihe">
              {/* Gruppe für Lernmodus */}
              <div className="einstellungs-gruppe">
                <strong>Lernmodus</strong>
                <div className="button-group-richtung">
                  <button className={initialerStapel.lernmodus === 'schreiben' ? 'button-active' : ''} onClick={() => handleModusWechseln('schreiben')}>Schreiben</button>
                  <button className={initialerStapel.lernmodus === 'klassisch' ? 'button-active' : ''} onClick={() => handleModusWechseln('klassisch')}>Klassisch</button>
                </div>
              </div>

              {/* Gruppe für Lernrichtung mit dem neuen Einzel-Button */}
              <div className="einstellungs-gruppe">
                <strong>Lernrichtung</strong>
                <button onClick={toggleLernrichtung} className="button-toggle">
                  {initialerStapel.lernrichtung === 'Vorder-Rück' ? 'Vorderseite → Rückseite' : 'Rückseite → Vorderseite'}
                </button>
              </div>
            </div>

            {/* Reihe für die Sprachauswahl */}
            <div className="einstellungen-reihe">
              <div className="einstellungs-gruppe vollbreite">
                <strong>Sprachen für die Sprachausgabe</strong>
                <div className="sprachen-auswahl-container">
                  <LanguageSelector
                    spracheVorderseite={initialerStapel.quellSprache || 'de'}
                    setSpracheVorderseite={(neueSprache) => handleSprachAenderung('quellSprache', neueSprache)}
                    spracheRückseite={initialerStapel.zielSprache || 'en'}
                    setSpracheRückseite={(neueSprache) => handleSprachAenderung('zielSprache', neueSprache)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
        <hr />
        <VokabelListe vokabeln={vokabeln} onLernenStarten={startQuizForLevel} />
        <hr />
        <DatenManagement
          vokabeln={vokabeln}
          onStapelImport={handleStapelImport}
          onCsvImport={handleCsvImport}
        />
      </main>
    </div>
  );
}

export default StapelAnsicht;