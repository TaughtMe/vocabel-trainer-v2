import React, { useState, useEffect } from 'react';
import VokabelEingabe from './VokabelEingabe.js';
import VokabelListe from './VokabelListe.js';
import LernModus from './LernModus.js';
import DatenManagement from './DatenManagement.js';
import moonIcon from './moon.svg';
import sunIcon from './sun.svg';
import LanguageSelector from './LanguageSelector.js';

// NEU: 'ganzeSammlung' und 'onSammlungErsetzen' werden empfangen
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
  
  // VERALTETE FUNKTION WURDE ENTFERNT: handleStapelImport

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
            <img src={theme === 'light' ? moonIcon : sunIcon} alt="Theme umschalten" />
          </button>
        </div>
      </header>
      <main>
        {/* Einstellungen-Card bleibt unverändert */}
        <div className="card">
         {/* ... Ihr Einstellungs-Code ... */}
        </div>

        <VokabelEingabe onVokabelHinzufuegen={addVokabel} />
        <hr />
        <VokabelListe vokabeln={vokabeln} onLernenStarten={startQuizForLevel} />
        <hr />
        {/* NEU: Props werden hier korrekt weitergegeben */}
        <DatenManagement
          vokabeln={vokabeln}
          onSammlungErsetzen={onSammlungErsetzen} // onStapelImport wurde durch onSammlungErsetzen ersetzt
          onCsvImport={handleCsvImport}
          ganzeSammlung={ganzeSammlung}
        />
      </main>
    </div>
  );
}

export default StapelAnsicht;