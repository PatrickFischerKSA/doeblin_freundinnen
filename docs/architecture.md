# Architektur

## Ziel

Dieses Repo liefert eine einzelne, abgeschlossene Unterrichtseinheit zu *Die Reise der Verlorenen*. Es ist nicht als Mehrwerk-Plattform gedacht.

## Laufzeitmodell

- Express liefert Landing, offene Version, SEB-Version und Lehrer*innen-Dashboard.
- Der Reader selbst ist eine modulare Vanilla-JS-Oberfläche.
- Klassen, Schüler*innen, Arbeitsstände und Peer Reviews werden in `data/kehlmann-reader-store.json` gespeichert.

## Kernmodule

- [app.mjs](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/src/app.mjs): Routing, Zugangskontrolle, HTML-Shells
- [kehlmann-reader-api.mjs](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/src/routes/kehlmann-reader-api.mjs): Reader- und Lehrer*innen-API
- [kehlmann-reader-store.mjs](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/src/services/kehlmann-reader-store.mjs): Persistenz und Klassenlogik
- [kehlmann-reader-progress.mjs](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/src/services/kehlmann-reader-progress.mjs): Lektions- und Fortschrittsauswertung
- [kehlmann-reader-feedback.mjs](/Users/patrickfischer/Documents/New project/reise_der_verlorenen/src/services/kehlmann-reader-feedback.mjs): differenzierte SEB-Feedbackdiagnostik

## Zugangslogik

- `/open`: Passwort + Klassen-Code + Name
- `/seb`: nur im Safe Exam Browser, dann Klassen-Code + Name
- `/teacher`: Lehrer*innen-Passwort

## Erweiterungspfad

- weitere Lektionssets innerhalb desselben Werks
- feinere Review-Rubriken
- Exportfunktionen für Lehrkräfte
- optional persistentes Storage statt Dateisystem
