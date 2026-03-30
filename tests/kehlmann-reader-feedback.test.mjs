import test from "node:test";
import assert from "node:assert/strict";
import { evaluateReaderSebFeedback } from "../src/services/kehlmann-reader-feedback.mjs";

test("Kehlmann SEB feedback rewards documentarisch gestützte Analyse", () => {
  const result = evaluateReaderSebFeedback({
    lessonId: "lesson-04-havanna-macht",
    moduleId: "havanna",
    entryId: "havanna-1",
    theoryId: "dokumentartheater",
    note: {
      observation:
        "Benitez spricht wie ein zynischer Funktionär und legt die Logik der Landegenehmigungen mit Stempeln, Unterschriften und Amtswörtern offen. Die Szene wirkt fast wie eine kommentierte Akte auf der Bühne.",
      evidence:
        "bestechlich, Landegenehmigungen, erfunden, Stempel",
      interpretation:
        "Die Passage zeigt, dass Recht hier nicht Schutz, sondern ein manipuliertes Verfahren ist. Gerade weil Benitez die Korruption offen ausspricht, wird die politische Willkür nicht psychologisch verschleiert, sondern als Systemlogik sichtbar gemacht.",
      theory:
        "Dokumentartheaterartig ist die Szene, weil sie Faktizität, Verwaltungswörter und historische Verfahrenslogik aufruft. Die Sprache wirkt protokollnah und entlarvt politische Realität eher, als dass sie bloß Einfühlung erzeugt.",
      revision:
        "Ich will die Deutung noch schärfen, indem ich genauer erkläre, wie Stempel und Unterschrift als Zeichen institutioneller Gewalt funktionieren."
    }
  });

  assert.ok(result.overallScore >= 70);
  assert.ok(result.profile.find((item) => item.label === "Textbindung").score >= 70);
  assert.ok(result.strengths.some((item) => item.includes("textinternen Spur")));
  assert.ok(result.nextMoves.length > 0);
});

test("Kehlmann SEB feedback flags pauschale Reaktion ohne historische oder theatrale Schärfe", () => {
  const result = evaluateReaderSebFeedback({
    lessonId: "lesson-10-rueckweg-erinnerung",
    moduleId: "rueckweg",
    entryId: "rueckweg-4",
    theoryId: "im-steinbruch",
    note: {
      observation:
        "Am Ende ist alles einfach traurig und schlimm.",
      evidence:
        "",
      interpretation:
        "Dann erzählen die Figuren noch etwas und man merkt, dass alles schlecht ist.",
      theory:
        "Das hat mit Erinnerung zu tun.",
      revision:
        "Ich schreibe es später besser."
    }
  });

  assert.ok(result.overallScore < 65);
  assert.equal(result.profile.find((item) => item.label === "Deutungstiefe").level, "noch deutlich zu schärfen");
  assert.ok(result.cautions.some((item) => item.includes("Wertwörter") || item.includes("Ereignisabfolge")));
  assert.ok(result.nextMoves.some((item) => item.includes("Signal") || item.includes("Wirkungsverb")));
});
