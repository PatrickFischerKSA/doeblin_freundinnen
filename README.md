# `bahnwaerter_lektueretool`

Produktionsnahes MVP für schulischen Literaturunterricht mit textnaher Annotation, Versionierung, Peer-Feedback und didaktisch interpretierbarer GitHub-Logik.

## 1. Architekturvorschlag

**Technologiewahl**

- Frontend: modulare Vanilla-JS-Single-Page-App mit responsivem HTML/CSS
- Backend: Node.js + Express JSON-API
- Persistenz im MVP: dateibasierte JSON-Store-Schicht mit Seed-Daten
- Tests: `node:test` für Kernlogik ohne Zusatzabhängigkeiten

**Begründung**

- Startet lokal ohne Build-Tooling und ohne unnötige Infrastruktur.
- Trennt trotzdem sauber zwischen UI, API und Domänenlogik.
- Ist GitHub-freundlich: einfach versionierbar, klar dokumentierbar, gut deploybar.
- Kann später schrittweise auf React, PostgreSQL, OAuth und echtes GitHub-Mapping migriert werden.

**Architektur in Schichten**

1. `public/`: UI, Reader-Layout, Interaktionen, API-Client
2. `src/routes/`: API-Endpunkte für Annotation, Version, Review, Export
3. `src/services/`: Store, Bootstrap-Viewmodel, Feedback-Engine, Versioning
4. `data/`: Seed-Daten und lokaler Arbeitsstand

## 2. Ordnerstruktur

```text
bahnwaerter_lektueretool/
├── data/
│   └── seed.json
├── docs/
│   └── architecture.md
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
│   ├── routes/
│   │   └── api.mjs
│   └── services/
│       ├── bootstrap.mjs
│       ├── feedback-engine.mjs
│       ├── store.mjs
│       └── versioning.mjs
├── tests/
│   ├── feedback-engine.test.mjs
│   └── versioning.test.mjs
├── .gitignore
├── package.json
├── render.yaml
└── server.mjs
```

## 3. Datenmodell

**Zentrale Entitäten**

- `Course`: Kurskontext, Klassenstufe, Zeitraum
- `Project`: Lektüreprojekt, Arbeitsmodus, Bewertungsmodus, Sichtbarkeit, GitHub-Modus
- `Segment`: textunabhängige Segmente wie Kapitel, Szene, Absatz oder frei definierter Ausschnitt
- `Task`: textbezogene oder projektweite Aufgaben mit Deadline und Reviewpflicht
- `Workspace`: didaktischer Fork, also Ausgangsprojekt, Einzelarbeitskopie oder Gruppenraum
- `Annotation`: aktuelle Fassung einer Markierung mit Typ, Tags, Quote und Segmentbindung
- `AnnotationVersion`: historisierte Annotationstexte zur Nachvollziehbarkeit von Revisionen
- `WorkspaceVersion`: Snapshots eines ganzen Arbeitsstandes
- `Submission`: Pull-Request-ähnliche Einreichung eines Arbeitsstandes
- `Thread`: Feedback- oder Review-Thread an Annotationen oder Einreichungen
- `Rubric`: konfigurierbare Kriterien wie Textnähe, Belegarbeit, Klarheit, Plausibilität

**Didaktische Übersetzung von GitHub**

- `Fork` → `Arbeitskopie`
- `Commit/Version` → `Arbeitsstand`
- `Pull Request` → `Einreichen`
- `Review` → `Rückmeldung / Peer-Review`
- `Merge` → für spätere Ausbaustufe als Übernahme in Gruppen- oder Kursraum vorgesehen

## 4. Kern-User-Flows

1. Lehrperson legt Projekt an.
   In diesem MVP geschieht das über Seed-Daten, später über ein UI-Formular.
2. Schüler*in öffnet persönliche Arbeitskopie.
   Der Arbeitsraum ist eine Fork-artige Abzweigung vom Basisprojekt.
3. Textnahe Annotation.
   Links Text, rechts Editor. Markierter Wortlaut wird in den Entwurf übernommen.
4. Automatisches Feedback.
   Die Feedback-Engine prüft Beleg, Begründung, Fokusbezug und Nacherzählungsrisiko.
5. Version speichern.
   Aus den aktuellen Annotationen wird ein Arbeitsstand erzeugt.
6. Einreichen und Review.
   Ein Arbeitsstand wird als Einreichung sichtbar; Peers oder Lehrperson kommentieren.
7. Revision sichtbar machen.
   Versionen lassen sich vergleichen, inklusive Revisionen nach Feedback.

## 5. MVP-Umfang

**Im MVP enthalten**

- Kurse, Projektmetadaten und segmentierte Texte
- Rollenansicht für Lehrperson und Schüler*innen
- Arbeitskopien mit editierbaren und schreibgeschützten Bereichen
- Annotationen mit Typ, Quote, Tags, Kommentar und Historie
- Versionierung auf Annotations- und Arbeitsstandebene
- Einreichen und submission-basierte Reviews
- Regelbasierte Feedback-Engine mit didaktisch formulierten Hinweisen
- Export eines kompletten Projektbundles als JSON

**Noch nicht im MVP**

- echte Authentifizierung
- Gruppenräume und fein granularer Rechteeditor im UI
- persistente Datenbank
- echte GitHub-OAuth-, Repository- und Pull-Request-Integration
- PDF-/DOCX-Import im UI
- Moderations-, Logging- und KI-Provider-Schicht

## API-Design

| Methode | Route | Zweck |
|---|---|---|
| `GET` | `/api/bootstrap?viewerId=...` | Rollenabhängiges Viewmodel für UI |
| `POST` | `/api/workspaces/:id/annotations` | Annotation anlegen |
| `PATCH` | `/api/annotations/:id` | Annotation versioniert überarbeiten |
| `POST` | `/api/annotations/:id/comments` | Diskussion an Annotation |
| `POST` | `/api/annotations/:id/feedback` | Automatisches Feedback erzeugen |
| `POST` | `/api/workspaces/:id/versions` | Arbeitsstand sichern |
| `GET` | `/api/workspaces/:id/versions/:a/compare/:b` | Versionen vergleichen |
| `POST` | `/api/workspaces/:id/submissions` | Arbeitsstand einreichen |
| `POST` | `/api/submissions/:id/reviews` | Review zur Einreichung |
| `GET` | `/api/export/projects/:id` | Projektartefakte exportieren |

## UI-Konzept

- Zwei-Hauptbereiche-Ansicht: links Text, rechts Annotation/Feedback/Versionen
- zusätzlicher Kopfbereich mit Rollenwechsel und Arbeitsraum-Switcher
- Dashboard-Karten für offene Aufgaben, Reviews, Rückmeldungen und Risikofälle
- barrierearme, lesefokussierte Oberfläche mit warmem Paper-Look
- responsive Anordnung für Tablet und kleinere Displays

## Feedback-Engine

Die erste Implementierung arbeitet regelbasiert und modular:

- Ebene A: Beleg vorhanden, Länge sinnvoll, Begründungssignale vorhanden
- Ebene B: Aufgabenfokus getroffen, Nacherzählungsrisiko erkannt, Präzision geprüft
- Ebene C: positives und entwicklungsorientiertes didaktisches Feedback
- Ebene D: Architektur vorbereitet für spätere KI-Module mit Logging und austauschbaren Rückgabeformaten

## Rollen und Rechte

- Lehrperson:
  - sieht alle Arbeitsräume
  - kommentiert alle Annotationen
  - reviewt Einreichungen
  - bearbeitet im MVP nur den Basisraum direkt
- Schüler*in:
  - bearbeitet eigene Arbeitskopie
  - sieht Basisraum
  - sieht eingereichte Peer-Arbeiten
  - kommentiert und reviewt eingereichte Arbeiten

## GitHub-Integrationskonzept

**Im MVP**

- Projektstruktur ist repository-tauglich
- Export als JSON-Bundle für Archivierung oder spätere Repo-Synchronisation
- Deployment über Standard-Node-Host möglich

**Spätere Ausbaustufe**

- OAuth mit GitHub für Lehrpersonen
- Mapping: `Workspace` → Branch oder Repo-Fork
- Mapping: `Submission` → Pull Request
- Mapping: `ReviewThread` → Review Comment / Issue Comment
- GitHub Pages nur für rein statische Lesemodi sinnvoll; die kollaborative App braucht ein Node-Backend

## Lokale Entwicklung

```bash
cd /Users/patrickfischer/Documents/New\ project/bahnwaerter_lektueretool
npm start
```

App unter [http://localhost:3017](http://localhost:3017).

Tests:

```bash
npm test
```

## Deployment auf GitHub

1. Repository mit dem Namen `bahnwaerter_lektueretool` anlegen.
2. Projektordner in das Repository übernehmen.
3. Auf einem Node-Host deployen, z. B. Render oder Railway.
4. `npm install` und `npm start` als Standardkommandos verwenden.

Eine Beispielkonfiguration für Render liegt in [render.yaml](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/render.yaml).

## Neue Lektüren anlegen

Im MVP läuft das Anlegen neuer Lektüren datengetrieben:

1. In [data/seed.json](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/data/seed.json) ein neues `project` anlegen.
2. Die zugehörigen `segments` mit freien Abschnittslabels definieren.
3. `tasks`, `rubrics` und `workspaces` ergänzen.
4. Optional Demo-Annotationen und Reviewthreads seed-en.
5. `data/store.json` löschen, damit beim nächsten Start neue Seeds geladen werden.

Die Datenstruktur ist absichtlich textneutral gehalten; sie funktioniert für Roman, Novelle, Drama oder Erzählung gleichermaßen.
