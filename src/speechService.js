/**
 * Spricht einen gegebenen Text mit der Web Speech API vor.
 * @param {string} text Der vorzulesende Text.
 * @param {string} lang Der Sprachcode (z.B. 'en-US', 'de-DE').
 */
export const speak = (text, lang) => {
  // Verhindert Fehler, wenn kein Text vorhanden ist.
  if (!text || typeof text !== 'string') return;

  // Prüft, ob der Browser die Funktion überhaupt unterstützt.
  if (!('speechSynthesis' in window)) {
    console.error("Dieser Browser unterstützt keine Sprachausgabe.");
    return;
  }

  // Bricht eine eventuell noch laufende Sprachausgabe ab.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // Setzt die korrekte Sprache und Stimme.
  window.speechSynthesis.speak(utterance);
};