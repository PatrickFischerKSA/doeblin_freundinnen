import test from "node:test";
import assert from "node:assert/strict";
import { evaluateReaderSebFeedback } from "../src/services/kehlmann-reader-feedback.mjs";

test("SEB feedback rewards textnahe and motivated Doeblin analysis", () => {
  const feedback = evaluateReaderSebFeedback({
    lessonId: "lesson-12-fallpoetik-und-nachwort",
    moduleId: "poetik",
    entryId: "poetik-4",
    theoryId: "schuld-zusammenhang",
    note: {
      observation:
        "Das Nachwort verbindet Patriarchatskritik mit einer deutlichen Warnung vor monokausalen Erklärungen. Gerade dadurch bleibt der Fall um Elli, Link und Grete als Zusammenhang und nicht als Ein-Ursachen-Modell lesbar.",
      evidence: "Patriarchatskritik, monokausale Lesart, schrecklich unsicher, Zusammenhang",
      interpretation:
        "Die Passage zeigt und verdeutlicht, dass Döblin gesellschaftliche Machtverhältnisse sichtbar macht, ohne die Schuldfrage in eine einzige Ursache aufzulösen. Gerade die Fallpoetik des Textes spiegelt einen schrecklich unsicheren Zusammenhang aus Gewalt, Milieu, Prozess und Beziehung.",
      theory:
        "Mit dem Dossier zu Schuld und Zusammenhang gelesen wird deutlich, dass der Text gerade gegen glatte Kausalität arbeitet und Zusammenhang wichtiger macht als eine beruhigende Eindeutigkeit. Die Symbiose von Beziehung, Milieu und Prozess wird damit präziser lesbar.",
      revision: "Noch schärfer an Klein/Nebbe und an der Formulierung der monokausalen Lesart anbinden."
    }
  });

  assert.ok(feedback.overallScore >= 70);
  assert.match(feedback.summary, /tragfähig|erkennbare Richtung/i);
  assert.equal(feedback.profile.length, 4);
  assert.ok(feedback.strengths.some((item) => /Text|Theorie|Roman/i.test(item)));
});

test("SEB feedback flags vague summary without enough motif or text anchoring", () => {
  const feedback = evaluateReaderSebFeedback({
    lessonId: "lesson-06-schwanken-und-entdeckung",
    moduleId: "giftmord",
    entryId: "giftmord-4",
    theoryId: "prozess-gutachten",
    note: {
      observation: "Die Stelle ist traurig und wichtig.",
      evidence: "",
      interpretation: "Dann ist alles schlimm und man merkt, dass es ein großes Problem gibt.",
      theory: "Es geht um den Prozess.",
      revision: ""
    }
  });

  assert.ok(feedback.overallScore < 70);
  assert.ok(feedback.cautions.length >= 1);
  assert.ok(feedback.nextMoves.some((item) => /Textanker|Arsen|Briefe|Witwenphantasie|Ermittlung|Linse/i.test(item)));
});
