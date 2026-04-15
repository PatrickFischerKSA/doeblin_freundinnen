import test from "node:test";
import assert from "node:assert/strict";
import { buildParcoursMarkdown } from "../public/kehlmann-reader/export.js";

test("parcours export renders Doeblin headings and answers", () => {
  const markdown = buildParcoursMarkdown({
    modeLabel: "Offene Version",
    classroomName: "Döblin 10A",
    studentName: "Mira S.",
    complete: false,
    completedEntries: 1,
    totalEntries: 24,
    lessons: [
      {
        title: "Lektion 12 · Fallpoetik, Nachwort, moderne Lektüre",
        summary: "Das Nachwort bündelt Realfall, Fallpoetik und Döblins Widerstand gegen einfache Erklärungen.",
        reviewFocus: "Arbeite an Realfallbezug, Fallpoetik und offener Erkenntnisform.",
        pageRange: "S. 108-123",
        entries: [
          {
            title: "Patriarchatskritik ohne Monokausalität",
            moduleTitle: "Epilog, Symbiose und moderne Fallpoetik",
            pageHint: "PDF S. 121-123",
            passageLabel: "Fallpoetik gegen einfache Antworten",
            context: "Die Passage verbindet Gesellschaftskritik mit einer bewussten Offenhaltung des Falls.",
            prompts: [
              "Wie verbindet das Nachwort Gesellschaftskritik mit Warnungen vor einfachen Erklärungen?"
            ],
            answers: {
              observation: "Das Nachwort markiert die Gefahr monokausaler Lesarten.",
              evidence: "Patriarchatskritik, monokausale Lesart, schrecklich unsicher",
              interpretation: "Gerade dadurch bleibt der Text offen für widersprüchliche Zusammenhänge.",
              theory: "Mit dem Dossier zu Schuld und Zusammenhang gelesen wird die Unsicherheit zur Stärke der Fallpoetik.",
              revision: "Noch deutlicher an Klein/Nebbe und an Döblins Sprachkritik binden."
            },
            signalWords: ["Patriarchatskritik", "monokausale Lesart", "schrecklich unsicher"],
            writingFrame: "Gerade diese Offenheit ist produktiv, weil ...",
            theorySections: [
              {
                title: "Dossier: Schuld, Zusammenhang und Erkenntniskritik",
                sourceTitle: "Lokales Dossier zum Epilog und zu Döblins Fallpoetik",
                guidingQuestions: [
                  {
                    prompt: "Wie unterläuft deine Passage einfache Schuldzuschreibungen?",
                    answer: "Sie verschiebt die Deutung auf Zusammenhänge und verweigert eine monokausale Erklärung."
                  }
                ],
                transferQuestions: [
                  {
                    prompt: "Wie macht der Text Zusammenhang wichtiger als eindeutige Verurteilung?",
                    answer: "Die Passage zeigt, dass gesellschaftliche Macht und individuelle Verantwortung nicht sauber getrennt werden."
                  }
                ]
              }
            ]
          }
        ],
        resources: [
          {
            title: "Abschlussauftrag: Den Fall ohne Vereinfachung lesen",
            sourceTitle: "Lokales Dossier zum Epilog und zu Döblins Fallpoetik",
            summary: "Das Dossier dient als Vergleichsfolie für eine Gesamtsicht auf Tat, Milieu und Nachwort.",
            task: "Nutze das Dossier zu Schuld und Zusammenhang, um deine Gesamtsicht auf den Text zu schärfen.",
            taskResponse: "Tragfähig ist vor allem eine Lesart, die Gewalt, Milieu und Prozess zusammendenkt, ohne die Schuldfrage künstlich zu glätten.",
            questions: [
              {
                prompt: "Welche Erklärung überzeugt dich am ehesten?",
                answer: "Am ehesten überzeugt eine Deutung, die Beziehung, Milieu, Gewalt und öffentliche Zuschreibung miteinander verknüpft."
              }
            ]
          }
        ]
      }
    ]
  });

  assert.match(markdown, /# Die beiden Freundinnen und ihr Giftmord - Parcoursdokumentation/);
  assert.match(markdown, /Lektion 12 · Fallpoetik, Nachwort, moderne Lektüre/);
  assert.match(markdown, /Wie verbindet das Nachwort Gesellschaftskritik mit Warnungen vor einfachen Erklärungen\?/);
  assert.match(markdown, /Abschlussauftrag: Den Fall ohne Vereinfachung lesen/);
});
