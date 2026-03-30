![CI](https://github.com/PatrickFischerKSA/reise_der_verlorenen/actions/workflows/ci.yml/badge.svg)

# reise_der_verlorenen

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PatrickFischerKSA/reise_der_verlorenen)

Eigenständige Webanwendung für die schulische Arbeit mit Daniel Kehlmanns *Die Reise der Verlorenen*.

Die App bündelt:

- offenen Reader mit Klassen-Code, Namen und Unterrichtspasswort
- SEB-Reader für Prüfungs- und Testsituationen
- integriertes PDF des Werks
- engmaschige Lektionssets über den Textverlauf
- Theorie-Linsen und Sekundärmaterial
- Peer Review in der offenen Version
- Lehrer*innen-Dashboard mit Klassen-Codes, SEB-Steuerung und Fortschrittsübersicht
- fachlich differenziertes SEB-Feedback

Wichtig: Dieses Repo ist bewusst **kein Mehrwerk-Backbone** mehr. Es enthält nur noch die Kehlmann-Einheit.

## Startpunkte

- `/` Übersicht der Kehlmann-Einheit
- `/open` offene Version
- `/seb` SEB-Version
- `/teacher` Lehrer*innen-Dashboard

## Architektur

- Frontend: Vanilla JS
- Backend: Node.js + Express
- Persistenz: dateibasierter JSON-Store für Klassen, Arbeitsstände und Peer Reviews
- Tests: `node:test`

Die Architektur ist bewusst leichtgewichtig, damit die Einheit lokal und auf Render ohne Build-Pipeline betrieben werden kann.

## Projektstruktur

```text
reise_der_verlorenen/
├── .github/workflows/ci.yml
├── data/
│   └── kehlmann-reader-store.json
├── docs/
│   ├── architecture.md
│   ├── classroom-codes.md
│   └── deployment.md
├── public/
│   ├── kehlmann-reader/
│   │   ├── app.js
│   │   ├── data.js
│   │   ├── styles.css
│   │   └── assets/
│   └── kehlmann-teacher/
│       ├── app.js
│       └── styles.css
├── src/
│   ├── app.mjs
│   ├── routes/kehlmann-reader-api.mjs
│   └── services/
│       ├── access.mjs
│       ├── kehlmann-reader-feedback.mjs
│       ├── kehlmann-reader-progress.mjs
│       └── kehlmann-reader-store.mjs
├── tests/
│   ├── access.test.mjs
│   └── kehlmann-reader-feedback.test.mjs
├── package.json
├── render.yaml
└── server.mjs
```

## Lokale Entwicklung

```bash
cd "/Users/patrickfischer/Documents/New project/reise_der_verlorenen"
npm install
npm test
npm start
```

Danach läuft die App unter [http://127.0.0.1:3017](http://127.0.0.1:3017).

## Render-Deployment

Die App ist für Render als Node Web Service vorbereitet.

Empfohlene Variablen in Render:

- `OPEN_VERSION_PASSWORD`
- `TEACHER_DASHBOARD_PASSWORD`
- `SEB_CONFIG_KEY_HASH` optional

`OPEN_VERSION_PASSWORD` ist absichtlich nicht mehr im Repo fest verdrahtet.

## Klassen-Codes und Anmeldung

Die minutiöse Lehrer*innen-Anleitung für Code-Erstellung, Regeneration und Schüler-Registrierung liegt in [docs/classroom-codes.md](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/docs/classroom-codes.md).

## Inhalte der Einheit

Die Reader-Daten in [public/kehlmann-reader/data.js](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/public/kehlmann-reader/data.js) enthalten:

- Lektionssets über den Textverlauf
- Passagen mit Seitenhinweisen
- Fokusfragen
- Theorie-Linsen
- Video- und Sekundärtext-Ressourcen

Wenn du die Einheit fachlich erweitern willst, ist das die wichtigste Datei.
