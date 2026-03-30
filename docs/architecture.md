# Architektur-Notiz

## Zielbild nach dem MVP

Die App ist so geschnitten, dass sie drei Betriebsarten unterstützen kann:

1. **Lokal / Offline-nah**
   Lehrperson nutzt das Tool ohne externe Plattform, etwa im Schulnetz.
2. **Cloud-Backend**
   Persistenz über relationale Datenbank, Sessions und Rollenverwaltung.
3. **GitHub-nah**
   Export, Spiegelung oder echte technische Umsetzung von Arbeitskopien und Reviews über GitHub.

## Erweiterungspfad

### Frontend

- Aktuell: Vanilla-JS mit modularem State
- Später: React oder Svelte möglich, weil API und Domänenlogik bereits getrennt sind

### Persistenz

- Aktuell: `seed.json` + `store.json`
- Später: PostgreSQL oder SQLite mit Repository-Layer

### Feedback-Engine

- Aktuell: heuristische Regelmodule
- Später: Provider-Interface für LLM- oder Moderationsdienste

### Rechte- und Sichtbarkeiten

- Aktuell: rollenbasierte Regeln im Bootstrap-Service
- Später: objektgenaue Policies für Kurs, Gruppe, Aufgabe, Thread und Feedbacksichtbarkeit

## Datenschutz und Schule

- Keine Notensimulation im Feedback-Modul
- Klare Trennung zwischen öffentlichem Peer-Feedback und privatem Lehrkraft-/System-Feedback
- Lokale Betriebsart ohne externe API vorbereitet
- GitHub im Unterricht nur optional und technisch abstrahiert
