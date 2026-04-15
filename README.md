# doeblin_freundinnen

Digitale, autonome Unterrichtseinheit zu Alfred Döblins *Die beiden Freundinnen und ihr Giftmord*.

Die App bietet:

- eingebettetes PDF der Erzählung
- Registrierung über Klassen-Code und Namen
- offenen Reader und SEB-Version
- Lehrer*innen-Dashboard mit Fortschrittsübersicht
- Peer Review
- sofortiges Arbeitsfeedback und SEB-Fachfeedback
- zwanzig eng geführte Lektionen mit passagennahen Aufgaben
- zusätzliche Dossiers zu Milieu, Briefdynamik, Körper/Gewalt, Prozess und Zusammenhang
- explizite interdisziplinäre Linsen zu Forensik, Chemie/Toxikologie, Rechtswissenschaft und Geschichte
- vertiefende Nachwort-Module zu Handschrift, Graphologie, Schaubild, Fallarchiv und Textmontage
- neue Forschungsdossiers zu queerer Weimarer Republik, Giftmorddiskurs, Gattungsfrage und Archivarbeit, eingearbeitet in die bestehenden Lektionen
- eingebundene PDF-Materialien zu Koos, Weiler, Jasper, Dertinger und Silveira
- erweiterte Gerichtsprozesssimulation mit zusätzlichen Kontext- und Diskursmaterialien

## Render

In [render.yaml](/Users/patrickfischer/Documents/New%20project/doeblin_freundinnen/render.yaml) ist bereits hinterlegt:

- Service-Name `doeblin-freundinnen`
- `npm install` als Build Command
- `npm start` als Start Command
- `HOST=0.0.0.0`

Für Render solltest du diese Variablen setzen:

- `OPEN_VERSION_PASSWORD`
- `TEACHER_DASHBOARD_PASSWORD`
- optional `SEB_CONFIG_KEY_HASH`

Die App speichert Lernstände dateibasiert in `data/kehlmann-reader-store.json`.

## Start

```bash
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

- Unterrichtspasswort: `giftmord`
- Lehrer*innen-Passwort: `doeblin_berlin`

Beide Werte können über Umgebungsvariablen überschrieben werden.
