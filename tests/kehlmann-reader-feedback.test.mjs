import test from "node:test";
import assert from "node:assert/strict";
import { evaluateReaderSebFeedback } from "../src/services/kehlmann-reader-feedback.mjs";

test("SEB feedback rewards textnahe and motivated 22-Bahnen analysis", () => {
  const feedback = evaluateReaderSebFeedback({
    lessonId: "lesson-12-libellen-und-offenes-ende",
    moduleId: "aufbruch",
    entryId: "aufbruch-3",
    theoryId: "wasser-motivik",
    note: {
      observation:
        "Die Libellenpassage verbindet Naturwissen mit Tildas neuer Beweglichkeit. Das Erklären wirkt erst komisch und wird dann zu einer vorsichtigen Liebessprache.",
      evidence: "Libelle, 95%, keine Angst, rückwärtsfliegen",
      interpretation:
        "Die Szene zeigt, dass Tilda ihre Gefühle nicht mehr abwehrt, sondern in ein Bewegungs- und Jagdbild übersetzt. Gerade dadurch kippt Wissen in Beziehung.",
      theory:
        "Mit dem Wasser- und Bewegungsdossier gelesen wird deutlich, dass die Libelle wie die 22 Bahnen für Kontrolle steht, hier aber in eine offenere Bewegungsform übergeht.",
      revision: "Noch genauer mit dem offenen Ende und Viktors Wiederkommen verknüpfen."
    }
  });

  assert.ok(feedback.overallScore >= 70);
  assert.match(feedback.summary, /tragfähig|erkennbare Richtung/i);
  assert.equal(feedback.profile.length, 4);
  assert.ok(feedback.strengths.some((item) => /Text|Theorie|Roman/i.test(item)));
});

test("SEB feedback flags vague summary without enough motif or text anchoring", () => {
  const feedback = evaluateReaderSebFeedback({
    lessonId: "lesson-10-fieber-und-rettung",
    moduleId: "krise",
    entryId: "krise-3",
    theoryId: "familienrollen",
    note: {
      observation: "Die Stelle ist traurig und wichtig.",
      evidence: "",
      interpretation: "Dann ist alles schlimm und man merkt, dass die Familie Probleme hat.",
      theory: "Es geht um Familie.",
      revision: ""
    }
  });

  assert.ok(feedback.overallScore < 70);
  assert.ok(feedback.cautions.length >= 1);
  assert.ok(feedback.nextMoves.some((item) => /Textanker|Meer|Vaterverlust|Rettung|Linse/i.test(item)));
});
