import React from 'react';

function VokabelListe({ vokabeln }) {
  const levels = [1, 2, 3, 4, 5];

  const getVokabelnFuerLevel = (level) => {
    return vokabeln.filter(v => v.level === level).length;
  };

  return (
    <div className="card">
      <h2>Deine Lernlevel</h2>
      <div className="level-container">
        {levels.map(level => (
          <div key={level} className={`level-box level-${level}`}>
            <div className="level-header">Level {level}</div>
            <div className="level-count">{getVokabelnFuerLevel(level)}</div>
            <div className="level-label">Karten</div>
            {/* Der "Lernen"-Button kann später hinzugefügt werden */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VokabelListe;