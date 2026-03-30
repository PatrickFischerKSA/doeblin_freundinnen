import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAnnotationFeedback } from "../src/services/feedback-engine.mjs";

test("feedback engine rewards evidence and reasoning", () => {
  const result = evaluateAnnotationFeedback({
    annotation: {
      quote: "Das lange Zögern verwandelte die Bewegung in eine Entscheidung.",
      body: "Das Wort \"Entscheidung\" zeigt, dass die Szene nicht nur eine Bewegung beschreibt, sondern Spannung erzeugt, weil das innere Zögern sichtbar wird."
    },
    task: {
      prompt: "Untersuche Spannung im Wortlaut",
      focusPrompt: "Spannung, Wortlaut, Wirkung"
    },
    segmentText: "Das lange Zögern verwandelte die Bewegung in eine Entscheidung."
  });

  assert.equal(result.checks.find((check) => check.id === "quote-present").passed, true);
  assert.equal(result.checks.find((check) => check.id === "reasoning-signal").passed, true);
  assert.ok(result.rating > 0.6);
});

test("feedback engine flags summary-like annotation", () => {
  const result = evaluateAnnotationFeedback({
    annotation: {
      quote: "",
      body: "Zuerst passiert nichts und dann geht die Figur hinaus."
    },
    task: {
      prompt: "Deute die Wirkung der Szene",
      focusPrompt: "Wirkung, Deutung"
    },
    segmentText: "Die Figur trat nicht sofort auf die Schwelle."
  });

  assert.equal(result.checks.find((check) => check.id === "quote-present").passed, false);
  assert.equal(result.checks.find((check) => check.id === "summary-risk").passed, false);
  assert.ok(result.nextSteps.length > 0);
});
