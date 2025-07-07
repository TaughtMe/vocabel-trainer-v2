import React from 'react';

// Eine Liste verfügbarer Sprachen für die Sprachausgabe
const verfügbareSprachen = [
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'en-US', name: 'Englisch (US)' },
  { code: 'en-GB', name: 'Englisch (UK)' },
  { code: 'es-ES', name: 'Spanisch' },
  { code: 'fr-FR', name: 'Französisch' },
  { code: 'it-IT', name: 'Italienisch' },
  // Fügen Sie bei Bedarf weitere Sprachen hinzu
];

function LanguageSelector({
  spracheVorderseite,
  setSpracheVorderseite,
  spracheRückseite,
  setSpracheRückseite
}) {
  return (
    // Dieses Fragment (<>) ist der Schlüssel zur Lösung.
    // Es ersetzt das überflüssige <div>, das das Layout zerstört hat.
    <>
      <div className="language-selector-wrapper">
        <label>Vorderseite:</label>
        <select
          value={spracheVorderseite}
          onChange={(e) => setSpracheVorderseite(e.target.value)}
        >
          {verfügbareSprachen.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="language-selector-wrapper">
        <label>Rückseite:</label>
        <select
          value={spracheRückseite}
          onChange={(e) => setSpracheRückseite(e.target.value)}
        >
          {verfügbareSprachen.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}

export default LanguageSelector;