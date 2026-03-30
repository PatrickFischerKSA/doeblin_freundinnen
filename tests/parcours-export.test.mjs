import test from "node:test";
import assert from "node:assert/strict";
import { buildParcoursMarkdown } from "../public/kehlmann-reader/export.js";

test("parcours export includes lesson questions and student answers", () => {
  const markdown = buildParcoursMarkdown({
    modeLabel: "Offene Version",
    classroomName: "Klasse 10B",
    studentName: "Nora S.",
    complete: true,
    completedEntries: 12,
    totalEntries: 12,
    lessons: [
      {
        title: "Lektion 11 · Kehlmanns Haltung und persönliche Involvierung",
        summary: "Kehlmann, Verantwortung und Gegenwartsbezug.",
        reviewFocus: "Kehlmanns Haltung sichtbar machen.",
        pageRange: "S. 23-77",
        entries: [
          {
            title: "Humanität im Modus des Deals",
            moduleTitle: "Diplomatie",
            pageHint: "S. 57",
            passageLabel: "Humanität im Modus des Deals",
            context: "Rettung erscheint als Deal.",
            prompts: [
              "Wie macht die Passage Kehlmanns Zugriff auf historische Verantwortung sichtbar?"
            ],
            signalWords: ["halbe Million", "Garantie"],
            writingFrame: "Mit Kehlmanns Aussagen gelesen wird deutlich, dass ...",
            answers: {
              observation: "Die Szene koppelt Rettung an Geld und öffentliche Bilder.",
              evidence: "halbe Million, Garantie, Fotograf",
              interpretation: "Kehlmann zeigt bewusst, dass Humanität politisch deformiert wird.",
              theory: "Im Podcast und in Im Steinbruch wird Verantwortung als Gegenwartsfrage markiert.",
              revision: "Noch genauer zeigen, wie Bildpolitik die Szene strukturiert."
            }
          }
        ]
      }
    ]
  });

  assert.match(markdown, /Lektion 11 · Kehlmanns Haltung und persönliche Involvierung/);
  assert.match(markdown, /Fragen:/);
  assert.match(markdown, /Wie macht die Passage Kehlmanns Zugriff auf historische Verantwortung sichtbar\?/);
  assert.match(markdown, /Antworten:/);
  assert.match(markdown, /Beobachtung: Die Szene koppelt Rettung an Geld und öffentliche Bilder\./);
  assert.match(markdown, /Theoriebezug: Im Podcast und in Im Steinbruch wird Verantwortung als Gegenwartsfrage markiert\./);
});
