import React from 'react';

function VokabelListe({ vokabeln, loescheVokabel }) {
  // TEST-AUSGABE HINZUGEFÜGT
  console.log("VOKABELLISTE KOMPONENTE GERENDERT. DATEN:", vokabeln);

  return (
    <div>
      <h2>Gespeicherte Vokabeln</h2>
      <ul>
        {vokabeln.map(v => (
          <li key={v.id}>
            {v.deutsch} – {v.fremdsprache} (Level {v.level})
            <button onClick={() => loescheVokabel(v.id)} className="loesch-button">
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VokabelListe;