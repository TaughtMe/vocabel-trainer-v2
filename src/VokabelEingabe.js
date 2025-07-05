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
    <div>
      <h2>Neue Vokabel hinzufügen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Deutsch: 
            <input type="text" name="deutsch" value={neueVokabel.deutsch} onChange={handleInputChange} autoComplete="off" />
          </label>
        </div>
        <div>
          <label>Fremdsprache: 
            <input type="text" name="fremdsprache" value={neueVokabel.fremdsprache} onChange={handleInputChange} autoComplete="off" />
          </label>
        </div>
        <button type="submit">Hinzufügen</button>
      </form>
    </div>
  );
}

export default VokabelEingabe;