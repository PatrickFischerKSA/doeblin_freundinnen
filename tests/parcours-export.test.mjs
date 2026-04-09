import test from "node:test";
import assert from "node:assert/strict";
import { buildParcoursMarkdown } from "../public/kehlmann-reader/export.js";

test("parcours export renders 22 Bahnen headings and answers", () => {
  const markdown = buildParcoursMarkdown({
    modeLabel: "Offene Version",
    classroomName: "22 Bahnen 10A",
    studentName: "Nora S.",
    complete: false,
    completedEntries: 1,
    totalEntries: 24,
    lessons: [
      {
        title: "Lektion 12 · Libellen, Schiff und Wiederkommen",
        summary: "Das Ende bindet neue Gefühle, offene Zukunft und die Rückkehr ins Schwimmbad zusammen.",
        reviewFocus: "Arbeite an Libellenmotiv, Schiffsbild und offener Schlussform.",
        pageRange: "S. 192-204",
        entries: [
          {
            title: "Libellenwissen und neue Gefühle",
            moduleTitle: "Nach der Krise: Entlastung, Liebe und offenes Ende",
            pageHint: "S. 192",
            passageLabel: "Naturwissen als Liebessprache",
            context: "Die Passage verbindet Naturwissen mit Tildas neuer Beweglichkeit.",
            prompts: [
              "Warum ist die Libellenpassage mehr als eine schrullige Wissensszene?"
            ],
            answers: {
              observation: "Tilda erklärt Libellenwissen.",
              evidence: "Libelle, 95%, keine Angst",
              interpretation: "Das Wissen wird zu einer Sprache für neue Gefühle.",
              theory: "Mit der Wasser-Motivik gelesen kippt Kontrolle in Offenheit.",
              revision: "Noch stärker mit dem Ende verbinden."
            },
            signalWords: ["Libelle", "95%", "keine Angst"],
            writingFrame: "Die Libelle wird wichtig, weil ...",
            theorySections: [
              {
                title: "Dossier: Wasser, Bahnen, Tauchen und Rettung",
                sourceTitle: "Lokales Dossier zur Motivik",
                guidingQuestions: [
                  {
                    prompt: "Welche Funktion hat Wasser in deiner Passage?",
                    answer: "Wasser bleibt als Bewegungs- und Rettungsraum im Hintergrund präsent."
                  }
                ],
                transferQuestions: [
                  {
                    prompt: "Wie verbindet die Passage Wissen und Bewegung?",
                    answer: "Die Libelle wird zum Bild neuer innerer Beweglichkeit."
                  }
                ]
              }
            ]
          }
        ],
        resources: [
          {
            title: "Abschlussauftrag: Externe Inputs bündeln",
            sourceTitle: "Dropbox-Ordner und verlinkte Zusatzinputs",
            summary: "Der Materialpool dient als Vergleichsfolie für das Ende.",
            task: "Vergleiche das Romanende mit einem Zusatzmaterial.",
            taskResponse: "Ein Außenimpuls bestätigt die Offenheit des Endes, vereinfacht sie aber zugleich etwas.",
            questions: [
              {
                prompt: "Welches Zusatzmaterial passt am besten zum Ende?",
                answer: "Ein Videoimpuls, der die offene Schlussbewegung thematisiert."
              }
            ]
          }
        ]
      }
    ]
  });

  assert.match(markdown, /# 22 Bahnen - Parcoursdokumentation/);
  assert.match(markdown, /Lektion 12 · Libellen, Schiff und Wiederkommen/);
  assert.match(markdown, /Warum ist die Libellenpassage mehr als eine schrullige Wissensszene\?/);
  assert.match(markdown, /Abschlussauftrag: Externe Inputs bündeln/);
});
