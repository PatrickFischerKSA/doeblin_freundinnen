# Deployment

## GitHub Actions

Die CI in [.github/workflows/ci.yml](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/.github/workflows/ci.yml) führt bei Pushes und Pull Requests `npm test` aus.

## Render

Das Repo enthält eine passende [render.yaml](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/render.yaml) für einen Node Web Service.

Empfohlenes Vorgehen:

1. Repo in Render verbinden
2. Blueprint oder Web Service anlegen
3. `npm install` als Build Command
4. `npm start` als Start Command
5. Variablen setzen:
   `OPEN_VERSION_PASSWORD`, `TEACHER_DASHBOARD_PASSWORD`, optional `SEB_CONFIG_KEY_HASH`

## Wichtige Hinweise

- GitHub Pages reicht nicht aus, weil Passwort- und SEB-Logik Serverrouten brauchen.
- `data/kehlmann-reader-store.json` ist Laufzeitdatenbestand und sollte nicht versioniert werden.
- Auf Render ist dateibasierte Persistenz flüchtig. Für dauerhafte Kursdaten braucht es später externes Storage.
