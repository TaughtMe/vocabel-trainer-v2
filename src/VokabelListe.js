import React from 'react';

// NEU: onLernenStarten wird hier empfangen
function VokabelListe({ vokabeln, onLernenStarten }) {
  const levels = [1, 2, 3, 4, 5];

  const getVokabelnFuerLevel = (level) => {
    return vokabeln.filter(v => v.level === level).length;
  };

  return (
    <div className="card">
      <h2>Deine Lernlevel</h2>
      <div className="level-container">
        {levels.map(level => {
          const kartenAnzahl = getVokabelnFuerLevel(level);
          return (
            <div key={level} className={`level-box level-${level}`}>
              <div className="level-header">Level {level}</div>
              <div className="level-count">{kartenAnzahl}</div>
              <div className="level-label">Karten</div>
              <button 
                className="button-level-lernen"
                disabled={kartenAnzahl === 0}
                onClick={() => onLernenStarten(level)}
              >
                Lernen
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VokabelListe;