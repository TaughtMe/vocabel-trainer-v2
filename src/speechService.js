// Empfohlener Code für speechService.js

export const speak = (text, lang) => {
  // Prüft, ob der Browser die Funktion überhaupt unterstützt.
  if (!('speechSynthesis' in window)) {
    console.error("Dieser Browser unterstützt keine Sprachausgabe.");
    return;
  }
  
  // Verhindert Fehler, wenn kein Text oder keine Sprache vorhanden ist.
  if (!text || !lang) return;

  const synth = window.speechSynthesis;

  // Bricht eine eventuell noch laufende Sprachausgabe ab.
  if (synth.speaking) {
    synth.cancel();
  }

  const utterThis = new SpeechSynthesisUtterance(text);

  // Diese Logik sucht die beste Stimme für die angeforderte Sprache.
  const voices = synth.getVoices();
  // Bevorzuge die Standardstimme für die Sprache
  let voiceToUse = voices.find(voice => voice.lang.startsWith(lang) && voice.default);
  // Wenn keine gefunden, nimm die erste verfügbare Stimme für die Sprache
  if (!voiceToUse) {
    voiceToUse = voices.find(voice => voice.lang.startsWith(lang));
  }
  
  // Wenn eine passende Stimme gefunden wurde, verwende sie.
  if (voiceToUse) {
    utterThis.voice = voiceToUse;
  } else {
    // Ansonsten setze nur den Sprachcode als Fallback.
    utterThis.lang = lang;
  }

  synth.speak(utterThis);
};