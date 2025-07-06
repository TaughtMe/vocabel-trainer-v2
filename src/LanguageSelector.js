import React, { useState, useEffect } from 'react';

// Diese Komponente erhält als Props:
// - label: Die Beschriftung für das Dropdown (z.B. "Vorderseite")
// - selectedLanguage: Der aktuell ausgewählte Sprachcode (z.B. 'de-DE')
// - onLanguageChange: Eine Funktion, die bei einer Änderung aufgerufen wird

function LanguageSelector({ label, selectedLanguage, onLanguageChange }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        // Filtern, um jede Sprache nur einmal anzuzeigen
        const uniqueLanguages = availableVoices.reduce((acc, voice) => {
          if (!acc[voice.lang]) {
            // Zeigt Sprache und Namen der ersten gefundenen Stimme an
            acc[voice.lang] = `${voice.lang} (${voice.name})`;
          }
          return acc;
        }, {});
        
        const languageOptions = Object.entries(uniqueLanguages).map(([code, name]) => ({
          code,
          name
        }));

        // Alphabetisch sortieren
        languageOptions.sort((a, b) => a.name.localeCompare(b.name));
        
        setVoices(languageOptions);
      }
    };

    // Wichtig: getVoices() wird oft asynchron geladen.
    // Wir müssen auf das 'voiceschanged'-Event warten.
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Einmal direkt beim Start aufrufen

    // Aufräumfunktion
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <div className="language-selector-wrapper">
      <label htmlFor={`lang-select-${label}`}>{label}</label>
      <select 
        id={`lang-select-${label}`}
        value={selectedLanguage} 
        onChange={e => onLanguageChange(e.target.value)}
      >
        <option value="">Bitte wählen...</option>
        {voices.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;