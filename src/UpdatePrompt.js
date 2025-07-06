import React from 'react';

function UpdatePrompt({ onUpdate }) {
  return (
    <div className="update-prompt">
      <div className="update-prompt-content">
        <p>Eine neue Version der App ist verfügbar.</p>
        <button onClick={onUpdate}>Jetzt aktualisieren</button>
      </div>
    </div>
  );
}

export default UpdatePrompt;