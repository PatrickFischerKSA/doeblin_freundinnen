const REASONING_SIGNALS = [
  "zeigt",
  "verdeutlicht",
  "deutet",
  "weil",
  "wirkt",
  "lässt erkennen",
  "macht sichtbar",
  "signalisiert"
];

const SUMMARY_SIGNALS = [
  "passiert",
  "dann",
  "danach",
  "anschließend",
  "zuerst",
  "später",
  "erzählt",
  "geht es um"
];

const PRECISION_SIGNALS = [
  "wort",
  "formulierung",
  "bild",
  "metapher",
  "satzbau",
  "wiederholung",
  "perspektive",
  "motiv"
];

function normaliseText(value) {
  return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAny(text, candidates) {
  return candidates.some((candidate) => text.includes(candidate));
}

function extractKeywords(source) {
  const words = normaliseText(source)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length >= 5);

  return [...new Set(words)].slice(0, 10);
}

export function evaluateAnnotationFeedback({ annotation, task, segmentText }) {
  const body = normaliseText(annotation.body);
  const quote = normaliseText(annotation.quote);
  const focusTerms = extractKeywords(task?.focusPrompt || task?.prompt || "");
  const citedFromSegment = quote.length > 0 && normaliseText(segmentText).includes(quote);
  const directEvidence = quote.length >= 10;
  const hasReasoning = hasAny(body, REASONING_SIGNALS);
  const summaryRisk = hasAny(body, SUMMARY_SIGNALS) && !hasReasoning;
  const mentionsPrecision = hasAny(body, PRECISION_SIGNALS);
  const focusHits = focusTerms.filter((term) => body.includes(term));
  const wordCount = body.split(" ").filter(Boolean).length;
  const hasInterpretiveMove = hasReasoning || body.includes("wirkt") || body.includes("kann");

  const checks = [
    {
      id: "quote-present",
      label: "Direkter Textbeleg vorhanden",
      passed: directEvidence
    },
    {
      id: "quote-grounded",
      label: "Beleg passt zur markierten Textstelle",
      passed: citedFromSegment || !directEvidence
    },
    {
      id: "reasoning-signal",
      label: "Deutung wird sprachlich begründet",
      passed: hasReasoning
    },
    {
      id: "length-window",
      label: "Annotation liegt in sinnvoller Länge",
      passed: wordCount >= 18 && wordCount <= 110
    },
    {
      id: "focus-terms",
      label: "Aufgabenfokus wird aufgegriffen",
      passed: focusTerms.length === 0 || focusHits.length > 0
    },
    {
      id: "summary-risk",
      label: "Kommentar geht über Nacherzählung hinaus",
      passed: !summaryRisk
    }
  ];

  const positives = [];
  const nextSteps = [];
  const prompts = [];

  if (directEvidence) {
    positives.push("Die Annotation arbeitet bereits mit einer konkreten Textstelle.");
  } else {
    nextSteps.push("Füge einen kurzen Wortlaut oder eine präzise paraphrasierte Textreferenz ein.");
  }

  if (hasInterpretiveMove) {
    positives.push("Es ist erkennbar, dass du nicht nur benennst, sondern auch eine Wirkung deutest.");
  } else {
    nextSteps.push("Formuliere deutlicher, was die Stelle zeigt oder andeutet, statt nur zu benennen, was passiert.");
  }

  if (!mentionsPrecision) {
    nextSteps.push("Benenne genauer, woran man deine Beobachtung im Wortlaut erkennt, etwa an Bildsprache, Wiederholung oder Perspektive.");
  }

  if (focusTerms.length > 0 && focusHits.length === 0) {
    nextSteps.push(`Greife einen Fokusbegriff der Aufgabe auf, zum Beispiel: ${focusTerms.slice(0, 3).join(", ")}.`);
  }

  if (summaryRisk) {
    prompts.push("Welche sprachliche oder strukturelle Beobachtung macht deine Deutung plausibel?");
  }

  if (!hasReasoning) {
    prompts.push("Ergänze einen Begründungssatz mit Formulierungen wie \"zeigt\", \"verdeutlicht\" oder \"deutet darauf hin, weil ...\".");
  }

  if (directEvidence && !hasReasoning) {
    prompts.push("Du benennst die Textstelle korrekt, erklärst ihre Wirkung aber noch nicht.");
  }

  if (mentionsPrecision && hasReasoning && directEvidence) {
    positives.push("Die Annotation verbindet Beleg, Beobachtung und Deutungsansatz bereits in einer gut anschlussfähigen Form.");
  }

  const rating = checks.filter((check) => check.passed).length / checks.length;

  return {
    rating,
    checks,
    positives: positives.slice(0, 3),
    nextSteps: nextSteps.slice(0, 4),
    prompts: prompts.slice(0, 3),
    focusHits,
    summary: rating >= 0.66
      ? "Solide textnahe Grundlage mit klaren Ansatzpunkten zur Präzisierung."
      : "Die Annotation ist ausbaufähig und sollte stärker an Wortlaut, Begründung und Aufgabenfokus gebunden werden."
  };
}
