function Impressum({ onClose }) {
  return (
    <div className="impressum-modal">
      <div className="impressum-content card">
        <button onClick={onClose} className="button-full-width" style={{ marginBottom: 16 }}>
          Schließen
        </button>
        <h2>Impressum</h2>
        <p>
          Diese App wird im Rahmen des schulischen Unterrichts verwendet.<br />
          Verantwortlich gemäß § 5 TMG:<br />
          Toby  Bryson<br />
          Musterstraße 1<br />
          12345 Musterstadt<br />
          E-Mail: toby.bryson@schule.bayern.de
        </p>
        <h3>Datenschutzerklärung</h3>
        <p>
          Diese App speichert und verarbeitet Daten ausschließlich lokal auf dem Endgerät des Nutzers.<br />
          Es erfolgt keine Übermittlung personenbezogener Daten an Dritte oder den Anbieter.<br />
          Es werden keine Cookies, keine Server-Trackingdienste und keine Analyse-Tools eingesetzt.
        </p>
        <h3>Verwendete Inhalte</h3>
        <p>
          Icons: moon.svg, sun.svg von [https://fonts.google.com/icons], Lizenz: Apache License Version 2.0<br />
          Bibliotheken: React, qrcode.react, etc. – jeweils unter Open-Source-Lizenz.
        </p>
        <h3>Copyright</h3>
        <p>
          © 2025 Toby Bryson. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
}
export default Impressum;
