// src/components/LanguageSelection.js

import React, { useState, useEffect } from 'react';

function LanguageSelection({ spracheVorderseite, setSpracheVorderseite, spracheRückseite, setSpracheRückseite }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        const uniqueLanguages = [...new Set(availableVoices.map(voice => voice.lang.split('-')[0]))].sort();
        setLanguages(uniqueLanguages);
      }
    };

    loadVoices(); // Sofortiger Versuch
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices); // Warten auf das Event
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []); // Nur beim ersten Rendern ausführen

  const renderLanguageOptions = () => {
    return languages.map(lang => (
      <option key={lang} value={lang}>
        {/* Wandelt z.B. "de" in "Deutsch" um */}
        {new Intl.DisplayNames([lang], { type: 'language' }).of(lang)}
      </option>
    ));
  };

  return (
    <div className="language-selection">
      <div>
        <label htmlFor="spracheVorderseite">Vorderseite:</label>
        <select
          id="spracheVorderseite"
          value={spracheVorderseite}
          onChange={e => setSpracheVorderseite(e.target.value)}
        >
          {renderLanguageOptions()}
        </select>
      </div>
      <div>
        <label htmlFor="spracheRückseite">Rückseite:</label>
        <select
          id="spracheRückseite"
          value={spracheRückseite}
          onChange={e => setSpracheRückseite(e.target.value)}
        >
          {renderLanguageOptions()}
        </select>
      </div>
    </div>
  );
}

export default LanguageSelection;