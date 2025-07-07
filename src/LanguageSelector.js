import React from 'react';

// Eine Liste verfügbarer Sprachen für die Sprachausgabe
const verfügbareSprachen = [
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'en-GB', name: 'Englisch (UK)' },
  { code: 'es-ES', name: 'Spanisch' },
  { code: 'fr-FR', name: 'Französisch' },
  { code: 'it-IT', name: 'Italienisch' },
  { code: 'pt-PT', name: 'Portugiesisch (Portugal)' },
  { code: 'ru-RU', name: 'Russisch' },
  { code: 'ar-SA', name: 'Arabisch' },
  { code: 'tr-TR', name: 'Türkisch' },
  { code: 'pl-PL', name: 'Polnisch' },
  { code: 'cs-CZ', name: 'Tschechisch' },
  { code: 'hu-HU', name: 'Ungarisch' },
  { code: 'ro-RO', name: 'Rumänisch' },
  { code: 'bg-BG', name: 'Bulgarisch' },
  { code: 'uk-UA', name: 'Ukrainisch' }
  // Fügen Sie bei Bedarf weitere Sprachen hinzu
];

/**
 * Diese Komponente rendert jetzt nur noch EIN Dropdown-Menü.
 * Sie erhält die aktuell gewählte Sprache ('sprache') und eine
 * Funktion zur Aktualisierung ('onSprachAenderung') als Props.
 */
function LanguageSelector({ sprache, onSprachAenderung }) {
  return (
    <select
      value={sprache}
      onChange={(e) => onSprachAenderung(e.target.value)}
    >
      {verfügbareSprachen.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.name}</option>
      ))}
    </select>
  );
}

export default LanguageSelector;