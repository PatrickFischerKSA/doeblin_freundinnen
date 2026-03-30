![CI](https://github.com/PatrickFischerKSA/bahnwaerter_lektueretool/actions/workflows/ci.yml/badge.svg)

# bahnwaerter_lektueretool

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PatrickFischerKSA/bahnwaerter_lektueretool)

Produktionsnahes MVP für schulischen Literaturunterricht mit textnaher Annotation, Versionierung, Peer-Feedback und didaktisch übersetzter GitHub-Logik.

Wichtig: Die produktive App läuft als Node-Webservice auf Render oder lokal mit `npm start`. GitHub Pages reicht für die Passwort- und SEB-Logik nicht aus.

Empfohlene GitHub-Kurzbeschreibung:
Textnahe Lernplattform für den Literaturunterricht mit Arbeitskopien, Annotationen, Review-Workflows, Versionierung und didaktischem Feedback.

## Kernidee

Lehrpersonen legen ein Lektüreprojekt an. Schüler*innen arbeiten in eigenen Arbeitskopien oder später in Gruppenräumen daran weiter, markieren Textstellen, formulieren Deutungen, erhalten Feedback und überarbeiten ihre Arbeit sichtbar in Versionen. Die Plattform übersetzt GitHub-Logik in schulisch lesbare Begriffe:

- Fork → Arbeitskopie
- Commit/Version → Arbeitsstand
- Pull Request → Einreichen
- Review → Rückmeldung

## Was das MVP schon kann

- segmentierte literarische Texte in einer Zwei-Spalten-Leseansicht
- direkte Annotationen mit Quote, Typ, Tags und Versionierung
- Arbeitsstände sichern und Versionen vergleichen
- Einreichungen und threaded Peer-/Lehrkraft-Reviews
- regelbasiertes didaktisches Feedback mit Fokus auf Textnähe
- Lehrpersonen-Setup für neue Lektüreprojekte direkt im UI
- Projekt-Export als JSON-Bundle

## Architektur

- Frontend: modulare Vanilla-JS-Single-Page-App
- Backend: Node.js + Express JSON-API
- Persistenz im MVP: dateibasierter JSON-Store
- Tests: `node:test`

Warum diese Wahl:

- läuft lokal ohne Build-Schritt
- trennt UI, API und Domänenlogik trotzdem sauber
- ist GitHub-freundlich und leicht zu deployen
- lässt sich später auf React, PostgreSQL, OAuth und echte GitHub-Integrationen erweitern

## Projektstruktur

```text
bahnwaerter_lektueretool/
├── .github/workflows/ci.yml
├── data/
│   └── seed.json
├── docs/
│   ├── architecture.md
│   └── deployment.md
├── public/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── app.js
│       └── modules/
│           ├── api.js
│           └── state.js
├── src/
│   ├── app.mjs
│   ├── routes/api.mjs
│   └── services/
│       ├── bootstrap.mjs
│       ├── feedback-engine.mjs
│       ├── project-builder.mjs
│       ├── store.mjs
│       └── versioning.mjs
├── tests/
│   ├── feedback-engine.test.mjs
│   ├── project-builder.test.mjs
│   └── versioning.test.mjs
├── package.json
├── render.yaml
└── server.mjs
```

## Datenmodell

- `Course`: Kurskontext
- `Project`: Lektüreprojekt mit Metadaten, Sichtbarkeit und Feedbackschwerpunkten
- `Segment`: textunabhängige Abschnitte eines Werks
- `Task`: textbezogene oder projektweite Aufgaben
- `Workspace`: Basisraum oder persönliche Arbeitskopie
- `Annotation`: aktuelle Fassung einer Beobachtung
- `AnnotationVersion`: Versionen einzelner Annotationen
- `WorkspaceVersion`: Snapshots ganzer Arbeitsstände
- `Submission`: Pull-Request-ähnliche Einreichung
- `Thread`: Diskussion oder Review an Annotationen bzw. Einreichungen
- `Rubric`: Bewertungs- und Feedbackkriterien

## Kern-User-Flows

1. Lehrperson legt im UI ein neues Lektüreprojekt mit Segmenten an.
2. Das System erzeugt automatisch einen Basisraum und Arbeitskopien für alle Schüler*innen im Kurs.
3. Schüler*innen markieren Textstellen und verfassen Annotationen.
4. Das Feedback-Modul prüft Beleg, Begründung, Fokusbezug und Nacherzählungsrisiko.
5. Arbeitsstände werden versioniert gespeichert.
6. Schüler*innen reichen ihre Arbeit ein, Peers oder Lehrperson reviewen.
7. Revisionen werden über Versionsvergleiche sichtbar.

## API

| Methode | Route | Zweck |
|---|---|---|
| `GET` | `/api/bootstrap?viewerId=...&projectId=...` | Rollen- und projektabhängiges Viewmodel |
| `POST` | `/api/projects` | neues Lektüreprojekt anlegen |
| `POST` | `/api/workspaces/:id/annotations` | Annotation anlegen |
| `PATCH` | `/api/annotations/:id` | Annotation versioniert überarbeiten |
| `POST` | `/api/annotations/:id/comments` | Diskussion an Annotation |
| `POST` | `/api/annotations/:id/feedback` | automatisches Feedback erzeugen |
| `POST` | `/api/workspaces/:id/versions` | Arbeitsstand sichern |
| `GET` | `/api/workspaces/:id/versions/:a/compare/:b` | Versionen vergleichen |
| `POST` | `/api/workspaces/:id/submissions` | Arbeitsstand einreichen |
| `POST` | `/api/submissions/:id/reviews` | Review zur Einreichung |
| `GET` | `/api/export/projects/:id` | Projektbundles exportieren |

## Automatisiertes Feedback

Das MVP arbeitet regelbasiert und modular:

- Ebene A: formale Basisprüfung von Beleg, Länge und Begründungssignalen
- Ebene B: heuristische Prüfung von Textnähe, Fokusbezug und Präzision
- Ebene C: didaktisch formulierte positive und entwicklungsorientierte Hinweise
- Ebene D: vorbereitet für spätere KI- oder Moderationsmodule

## Lokale Entwicklung

```bash
cd /Users/patrickfischer/Documents/New\ project/bahnwaerter_lektueretool
npm install
npm start
```

App unter [http://localhost:3017](http://localhost:3017)

Tests:

```bash
npm test
```

## Deployment und CI

- CI über GitHub Actions: [.github/workflows/ci.yml](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/.github/workflows/ci.yml)
- Render-Blueprint: [render.yaml](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/render.yaml)
- Deploy-Doku: [docs/deployment.md](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/docs/deployment.md)

## Neue Lektüren anlegen

Es gibt jetzt zwei Wege:

1. Direkt im UI als Lehrperson:
   Im Bereich `Lehrpersonen-Setup` Titel, Metadaten und Segmentblöcke eingeben. Das System erstellt automatisch Projekt, Aufgaben, Rubrik, Basisraum und Schüler-Arbeitskopien.
2. Datengetrieben:
   [data/seed.json](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/data/seed.json) erweitern und anschließend `data/store.json` löschen.

Segmentformat im UI:

```text
Abschnittstitel
Hier steht der eigentliche Abschnittstext.

Nächster Abschnitt
Hier steht der nächste Textblock.
```

## Roadmap nach dem MVP

- echte Authentifizierung
- Gruppenräume und feinere Sichtbarkeiten
- persistente Datenbank
- PDF- oder DOCX-Import
- GitHub-OAuth und echtes Branch-/PR-Mapping
- austauschbare KI-Feedbackmodule mit Logging und Moderation
