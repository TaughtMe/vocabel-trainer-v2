import React, { useState } from 'react';

function VokabelEingabe({ onVokabelHinzufuegen }) {
  const [neueVokabel, setNeueVokabel] = useState({ deutsch: '', fremdsprache: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNeueVokabel({ ...neueVokabel, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (neueVokabel.deutsch && neueVokabel.fremdsprache) {
      onVokabelHinzufuegen(neueVokabel);
      setNeueVokabel({ deutsch: '', fremdsprache: '' });
    }
  };

    return (
    <div className="card">
        <h2>Neue Lernkarte erstellen</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-grid">
            <label>
            Vorderseite (Frage/Begriff)
            <textarea
                name="deutsch"
                value={neueVokabel.deutsch}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="z.B. What does 'bewältigen' mean?"
                rows="3"
            />
            </label>
            <label>
            Rückseite (Antwort/Definition)
            <textarea
                name="fremdsprache"
                value={neueVokabel.fremdsprache}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="z.B. to cope with, to manage"
                rows="3"
            />
            </label>
        </div>
        <button type="submit" className="button-full-width">
            Lernkarte hinzufügen
        </button>
        </form>
    </div>
    );
}

export default VokabelEingabe;