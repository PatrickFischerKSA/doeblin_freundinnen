# Deployment

## GitHub Actions

Die CI-Pipeline in [.github/workflows/ci.yml](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/.github/workflows/ci.yml) führt bei Pushes auf `main` und bei Pull Requests folgende Schritte aus:

1. Checkout
2. Node.js 24 einrichten
3. `npm install`
4. `npm test`

Damit ist sichergestellt, dass Kernlogik und API-nahe Services vor einem Merge geprüft werden.

## Render

Das Projekt enthält bereits ein [render.yaml](/Users/patrickfischer/Documents/New project/bahnwaerter_lektueretool/render.yaml).

Empfohlenes Vorgehen:

1. Repository mit Render verbinden.
2. `render.yaml` automatisch erkennen lassen.
3. Branch `main` als Deploy-Quelle verwenden.
4. Build Command: `npm install`
5. Start Command: `npm start`

## Lokaler Smoke-Test vor dem Deploy

```bash
npm install
npm test
npm start
```
