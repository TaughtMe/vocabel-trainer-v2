import React, { useState, useEffect } from 'react';
import './App.css';

const APP_STORAGE_KEY = 'vokabeltrainer-vokabeln';

function App() {
  const [vokabeln, setVokabeln] = useState(() => {
    const gespeicherteVokabeln = localStorage.getItem(APP_STORAGE_KEY);
    return gespeicherteVokabeln ? JSON.parse(gespeicherteVokabeln) : [];
  });
  
  const [neueVokabel, setNeueVokabel] = useState({ deutsch: '', fremdsprache: '' });
  const [isLernmodus, setIsLernmodus] = useState(false);
  const [aktuelleVokabel, setAktuelleVokabel] = useState(null);
  const [userAntwort, setUserAntwort] = useState('');
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(vokabeln));
  }, [vokabeln]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNeueVokabel({ ...neueVokabel, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (neueVokabel.deutsch && neueVokabel.fremdsprache) {
      setVokabeln([...vokabeln, { ...neueVokabel, id: Date.now(), level: 1 }]);
      setNeueVokabel({ deutsch: '', fremdsprache: '' });
    }
  };

  const lerneVokabel = () => {
    if (vokabeln.length > 0) {
      const sortedVokabeln = [...vokabeln].sort((a, b) => a.level - b.level);
      setAktuelleVokabel(sortedVokabeln[0]);
      setIsLernmodus(true);
      setFeedback('');
      setUserAntwort('');
    }
  };

    function loescheVokabel(id) {
    const bestaetigt = window.confirm("Möchten Sie diese Vokabel wirklich löschen?");
    if (bestaetigt) {
      setVokabeln(vokabeln.filter(v => v.id !== id));
    }
  }

  const pruefeAntwort = () => {
    let isCorrect = userAntwort.trim().toLowerCase() === aktuelleVokabel.fremdsprache.trim().toLowerCase();
    
    const aktualisierteVokabeln = vokabeln.map(v => {
      if (v.id === aktuelleVokabel.id) {
        if (isCorrect) {
          setFeedback('Richtig!');
          return { ...v, level: Math.min(v.level + 1, 5) };
        } else {
          setFeedback(`Falsch. Richtig ist: ${aktuelleVokabel.fremdsprache}`);
          return { ...v, level: 1 };
        }
      }
      return v;
    });
    
    setVokabeln(aktualisierteVokabeln);
  };

  // Der restliche Code (return statement) bleibt identisch.
  if (isLernmodus) {
    return (
      <div className="App">
        <header className="App-header"><h1>Lern-Modus</h1></header>
        <main>
          {aktuelleVokabel ? (
            <>
              <h2>Übersetze:</h2>
              <p className="vokabel-anzeige">{aktuelleVokabel.deutsch}</p>
              <input type="text" value={userAntwort} onChange={(e) => setUserAntwort(e.target.value)} disabled={!!feedback} />
              {!feedback ? (<button onClick={pruefeAntwort}>Prüfen</button>) : (<button onClick={lerneVokabel}>Weiter</button>)}
              {feedback && <p>{feedback}</p>}
              <button onClick={() => setIsLernmodus(false)}>Zurück zur Liste</button>
            </>
          ) : (<p>Keine Vokabeln mehr zu lernen. Gut gemacht!</p>)}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header"><h1>Vokabeltrainer</h1></header>
      <main>
        <button onClick={lerneVokabel} disabled={vokabeln.length === 0}>Lernen starten</button>
        <hr />
        <h2>Neue Vokabel hinzufügen</h2>
        <form onSubmit={handleSubmit}>
          <div><label>Deutsch: <input type="text" name="deutsch" value={neueVokabel.deutsch} onChange={handleInputChange} autoComplete="off" /></label></div>
          <div><label>Fremdsprache: <input type="text" name="fremdsprache" value={neueVokabel.fremdsprache} onChange={handleInputChange} autoComplete="off" /></label></div>
          <button type="submit">Hinzufügen</button>
        </form>
        <hr />
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
      </main>
    </div>
  );
}

export default App;
