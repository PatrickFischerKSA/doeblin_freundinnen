# Deployment

## GitHub Actions

Die CI im Repo führt bei Pushes und Pull Requests `npm test` aus.

## Render

Das Repo enthält eine passende [render.yaml](/Users/patrickfischer/Documents/New project/wahl_22bahnen/render.yaml) für einen Node Web Service.

Empfohlenes Vorgehen:

1. Repo in Render verbinden
2. Blueprint oder Web Service anlegen
3. `npm install` als Build Command
4. `npm start` als Start Command
5. Variablen setzen:
   `OPEN_VERSION_PASSWORD`, `TEACHER_DASHBOARD_PASSWORD`, optional `SEB_CONFIG_KEY_HASH`
6. Nach dem ersten Deploy `/teacher-entry` und `/teacher` testen
7. Eine Testklasse anlegen und `open` sowie `seb` einmal mit Testnamen durchspielen

## Wichtige Hinweise

- GitHub Pages reicht nicht aus, weil Passwort- und SEB-Logik Serverrouten brauchen.
- `data/kehlmann-reader-store.json` ist Laufzeitdatenbestand und sollte nicht versioniert werden.
- Auf Render-Free ist dateibasierte Persistenz flüchtig. Für dauerhafte Kursdaten braucht es später externes Storage oder einen persistenten Datenträger auf einem passenden Plan.
- Die App erzeugt den Store beim ersten Start selbst, auch wenn der `data`-Ordner noch leer ist.
