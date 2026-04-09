# wahl_22bahnen

Digitale Unterrichtseinheit zu Caroline Wahls *22 Bahnen*.

Die App bietet:

- eingebettetes PDF des Romans
- Registrierung über Klassen-Code und Namen
- offenen Reader und SEB-Version
- Lehrer*innen-Dashboard mit Fortschrittsübersicht
- Peer Review
- sofortiges Arbeitsfeedback und SEB-Fachfeedback
- zwölf eng geführte Lektionen mit vielen differenzierten Lektürefragen
- zusätzliche Theorie-Dossiers zu Perspektive, Wasser-Motivik, Familienrollen und Sprache
- Einbindung der vom Auftrag genannten YouTube- und Dropbox-Materialien

## Start

```bash
npm install
npm test
npm start
```

Danach läuft die App standardmäßig unter [http://127.0.0.1:3017](http://127.0.0.1:3017).

## Zugänge

- `/open` offene Version mit Unterrichtspasswort, Klassen-Code und Name
- `/seb` Safe-Exam-Browser-Version mit Klassen-Code und Name
- `/teacher-entry` offener Lehrer*innen-Überblick über alle Lektionen
- `/teacher` Lehrer*innen-Dashboard

Standardwerte lokal:

- Unterrichtspasswort: `22bahnen`
- Lehrer*innen-Passwort: `caroline_wahl`

Beide Werte können über Umgebungsvariablen überschrieben werden.
