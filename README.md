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

## Render

Das Repo ist für Render als Node Web Service vorbereitet.

In [render.yaml](/Users/patrickfischer/Documents/New%20project/wahl_22bahnen/render.yaml) ist bereits hinterlegt:

- Service-Name `wahl-22bahnen`
- `npm install` als Build Command
- `npm start` als Start Command
- `HOST=0.0.0.0`

Für Render solltest du diese Variablen setzen:

- `OPEN_VERSION_PASSWORD`
- `TEACHER_DASHBOARD_PASSWORD`
- optional `SEB_CONFIG_KEY_HASH`

Wichtig:

- Wenn dein bestehender Render-Service im Dashboard noch `yarn install` verwendet, stelle ihn manuell auf `npm install` um.
- Die App speichert Lernstände dateibasiert in `data/kehlmann-reader-store.json`.
- Auf Render-Free ist dieses Dateisystem nicht dauerhaft persistent.
- Das Tool lässt sich also veröffentlichen und benutzen, aber Kursdaten können bei Redeploys oder Neustarts verloren gehen.
- Für dauerhaftes Live-Tracking brauchst du später entweder ein Render Persistent Disk Setup auf einem passenden Plan oder ein externes Storage.

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
