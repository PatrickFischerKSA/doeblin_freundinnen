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
6. Nach dem ersten Deploy die öffentliche Render-URL aufrufen.
7. Offene Version: `/open` mit Passwort `thiel`
8. SEB-Version: `/seb`

Hinweise:

- `OPEN_VERSION_PASSWORD` ist im Blueprint bereits auf `thiel` gesetzt.
- `SEB_CONFIG_KEY_HASH` bleibt absichtlich leer und kann in Render als geheime Variable ergänzt werden, wenn die SEB-Version an eine konkrete SEB-Konfiguration gebunden werden soll.
- Die dateibasierte Server-Persistenz ist auf Render flüchtig. Browser-Notizen im konkreten Thiel-Reader bleiben clientseitig erhalten, serverseitige Projektänderungen dagegen nicht dauerhaft über Container-Neustarts hinweg.

## Lokaler Smoke-Test vor dem Deploy

```bash
npm install
npm test
npm start
```
