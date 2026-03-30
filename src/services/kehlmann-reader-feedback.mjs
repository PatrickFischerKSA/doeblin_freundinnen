import { lessonSets, readerModules, theoryResources } from "../../public/kehlmann-reader/data.js";

const moduleById = new Map(readerModules.map((module) => [module.id, module]));
const theoryById = new Map(theoryResources.map((resource) => [resource.id, resource]));
const lessonById = new Map(lessonSets.map((lesson) => [lesson.id, lesson]));

const analyticalSignals = [
  "zeigt",
  "verdeutlicht",
  "markiert",
  "inszeniert",
  "steigert",
  "kontrastiert",
  "lenkt",
  "fokussiert",
  "deutet",
  "signalisiert",
  "macht sichtbar",
  "lässt erkennen",
  "stellt heraus",
  "verdichtet"
];

const summarySignals = [
  "zuerst",
  "dann",
  "danach",
  "anschließend",
  "später",
  "passiert",
  "erzählt",
  "geht es um"
];

const languageSignals = [
  "wort",
  "wörter",
  "formulierung",
  "bild",
  "metapher",
  "satz",
  "satzbau",
  "perspektive",
  "wiederholung",
  "rhythmus",
  "verben",
  "adjektiv",
  "erzähler"
];

const vagueJudgements = [
  "interessant",
  "spannend",
  "traurig",
  "krass",
  "heftig",
  "wichtig",
  "stark",
  "schlimm",
  "gut",
  "schön"
];

function normalize(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenize(value = "") {
  return normalize(value)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 4);
}

function unique(items) {
  return [...new Set(items)];
}

function pickKeywords(...sources) {
  return unique(sources.flatMap((source) => tokenize(source))).slice(0, 18);
}

function countHits(text, candidates) {
  return candidates.filter((candidate) => text.includes(candidate)).length;
}

function ratio(hits, total) {
  if (!total) {
    return 0;
  }
  return hits / total;
}

function levelFor(score) {
  if (score >= 0.8) {
    return "sehr stark";
  }
  if (score >= 0.62) {
    return "tragfähig";
  }
  if (score >= 0.42) {
    return "im Ansatz stark, aber noch unscharf";
  }
  return "noch deutlich zu schärfen";
}

function moduleAndEntry(moduleId, entryId) {
  const module = moduleById.get(moduleId) || readerModules[0];
  const entry = module.entries.find((candidate) => candidate.id === entryId) || module.entries[0];
  return { module, entry };
}

function collectExpectedTerms(module, entry, theoryId, lessonId) {
  const theory = theoryById.get(theoryId) || theoryResources[0];
  const lesson = lessonById.get(lessonId) || lessonSets[0];

  return {
    promptKeywords: pickKeywords(...entry.prompts, entry.context, module.task, module.lens, lesson.reviewFocus),
    theoryKeywords: pickKeywords(theory.title, ...theory.keyIdeas, ...theory.questions),
    signalKeywords: unique(entry.signalWords.map((word) => normalize(word))).filter(Boolean)
  };
}

function criterion(label, score, rationale) {
  return {
    label,
    score: Math.round(score * 100),
    level: levelFor(score),
    rationale
  };
}

export function evaluateReaderSebFeedback({ lessonId, moduleId, entryId, theoryId, note }) {
  const { module, entry } = moduleAndEntry(moduleId, entryId);
  const theory = theoryById.get(theoryId) || theoryResources[0];
  const lesson = lessonById.get(lessonId) || lessonSets[0];
  const observation = normalize(note?.observation);
  const evidence = normalize(note?.evidence);
  const interpretation = normalize(note?.interpretation);
  const theoryText = normalize(note?.theory);
  const revision = normalize(note?.revision);
  const combined = `${observation} ${evidence} ${interpretation} ${theoryText}`.trim();

  const expected = collectExpectedTerms(module, entry, theory.id, lesson.id);
  const promptHits = countHits(combined, expected.promptKeywords);
  const theoryHits = countHits(theoryText || interpretation, expected.theoryKeywords);
  const signalHits = countHits(evidence || combined, expected.signalKeywords);
  const analysisHits = countHits(combined, analyticalSignals);
  const summaryHits = countHits(combined, summarySignals);
  const languageHits = countHits(combined, languageSignals);
  const vagueHits = countHits(interpretation, vagueJudgements);
  const observationTokens = tokenize(observation);
  const interpretationTokens = tokenize(interpretation);
  const overlap = observationTokens.filter((token) => interpretationTokens.includes(token)).length;
  const overlapRatio = ratio(overlap, Math.max(interpretationTokens.length, 1));
  const hasCausalChain = /(weil|dadurch|sodass|indem|weshalb|wodurch)/.test(combined);
  const hasContrast = /(während|hingegen|dagegen|im gegensatz|zugleich|einerseits|andererseits)/.test(combined);
  const hasRevisionMove = /(präzisieren|schärfen|ergänzen|stärker|genauer|deutlicher|ausbauen)/.test(revision);

  const textAnchoringScore = Math.min(1, (
    ratio(signalHits, Math.max(expected.signalKeywords.length, 1)) * 0.55 +
    (evidence ? 0.25 : 0) +
    (languageHits > 0 ? 0.2 : 0)
  ));

  const interpretiveDepthScore = Math.min(1, (
    Math.min(analysisHits / 3, 1) * 0.4 +
    (hasCausalChain ? 0.22 : 0) +
    (hasContrast ? 0.16 : 0) +
    (summaryHits === 0 ? 0.12 : 0) +
    (overlapRatio < 0.7 ? 0.1 : 0)
  ));

  const conceptualFitScore = Math.min(1, (
    ratio(promptHits, Math.max(expected.promptKeywords.length, 1)) * 0.45 +
    ratio(theoryHits, Math.max(expected.theoryKeywords.length, 1)) * 0.35 +
    (module.relatedTheoryIds?.includes(theory.id) || entry.relatedTheoryIds?.includes(theory.id) ? 0.2 : 0.05)
  ));

  const precisionScore = Math.min(1, (
    Math.min(languageHits / 3, 1) * 0.4 +
    (vagueHits === 0 ? 0.22 : 0) +
    (evidence.includes(",") ? 0.12 : 0) +
    (interpretationTokens.length >= 10 ? 0.16 : 0) +
    (observationTokens.length >= 8 ? 0.1 : 0)
  ));

  const revisionReadinessScore = Math.min(1, (
    (revision ? 0.25 : 0) +
    (hasRevisionMove ? 0.25 : 0) +
    (textAnchoringScore >= 0.55 ? 0.25 : 0) +
    (interpretiveDepthScore >= 0.55 ? 0.25 : 0)
  ));

  const profile = [
    criterion(
      "Textbindung",
      textAnchoringScore,
      textAnchoringScore >= 0.62
        ? "Die Ausarbeitung bleibt nicht im Allgemeinen, sondern bindet Deutung sichtbar an Signalwörter, Wortmaterial oder erzähltechnische Beobachtungen."
        : "Die Notiz nennt bereits Textmaterial, arbeitet aber noch nicht stabil genug am sprachlichen Detail, um die Deutung wirklich aus dem Wortlaut zu entwickeln."
    ),
    criterion(
      "Deutungstiefe",
      interpretiveDepthScore,
      interpretiveDepthScore >= 0.62
        ? "Die Antwort erklärt nicht nur, was in der Passage geschieht, sondern entwickelt eine Wirkungsaussage mit innerer Begründung und funktionalem Zusammenhang."
        : "Die Deutung ist angelegt, kippt aber noch zu leicht in Benennung oder Ablauf. Zwischen Beobachtung und Folgerung fehlt noch mehr argumentative Spannung."
    ),
    criterion(
      "Begriffliche Präzision",
      precisionScore,
      precisionScore >= 0.62
        ? "Die Formulierungen greifen erkennbar an Wörter, Kontraste, Perspektivsignale oder andere sprachliche Markierungen des Textes."
        : "Die Antwort benutzt noch zu oft allgemeine Urteile. Fachlich tragfähig wird sie erst, wenn der Text an konkreten sprachlichen Phänomenen aufgeschlossen wird."
    ),
    criterion(
      "Theorieintegration",
      conceptualFitScore,
      conceptualFitScore >= 0.62
        ? `Die Theorie-Linse ${theory.shortTitle.toLowerCase()} wird nicht nur genannt, sondern produktiv auf die Passage zurückgebunden.`
        : `Die Theorie-Linse ${theory.shortTitle.toLowerCase()} ist als Stichwort erkennbar, wird aber noch nicht systematisch auf die konkrete Passage heruntergebrochen.`
    ),
    criterion(
      "Revisionsreife",
      revisionReadinessScore,
      revisionReadinessScore >= 0.62
        ? "Die Ausarbeitung ist schon so strukturiert, dass eine gezielte Überarbeitung an Schärfung und Verdichtung ansetzen kann."
        : "Vor einer eigentlichen Feinarbeit muss die Antwort noch klarer zwischen Beobachtung, Beleg, Deutung und nächstem Überarbeitungsschritt unterscheiden."
    )
  ];

  const strengths = [];
  const cautions = [];
  const nextMoves = [];
  const prompts = [];

  if (textAnchoringScore >= 0.62) {
    strengths.push("Die Antwort arbeitet bereits mit einer textinternen Spur, statt die Szene nur paraphrasierend zu umkreisen.");
  } else {
    cautions.push(`Die Deutung bleibt noch zu weit vom Wortlaut entfernt. Für diese Passage wären besonders tragfähig: ${entry.signalWords.slice(0, 3).join(", ")}.`);
    nextMoves.push("Nimm zwei Wörter oder Formulierungen aus der Passage und erkläre für jedes einzeln, welche Wirkung es im Zusammenhang entfaltet.");
  }

  if (interpretiveDepthScore >= 0.62) {
    strengths.push("Zwischen Beobachtung und Deutung ist schon eine argumentative Bewegung sichtbar; die Passage wird funktional gelesen, nicht nur nacherzählt.");
  } else {
    cautions.push("Die Antwort benennt bereits etwas Richtiges, entwickelt daraus aber noch keinen voll belastbaren Deutungsgang.");
    nextMoves.push("Schreibe einen Satz, der ausdrücklich mit einem Wirkungsverb beginnt, und verknüpfe ihn mit einem Kausalsatz: Was zeigt die Stelle genau, weil welches Detail so gesetzt ist?");
  }

  if (conceptualFitScore >= 0.62) {
    strengths.push(`Die Theorie-Linse ${theory.shortTitle.toLowerCase()} stützt die Analyse bereits erkennbar, weil sie auf die konkrete Passage zurückgeführt wird.`);
  } else {
    cautions.push(`Die Theorie-Linse ${theory.shortTitle.toLowerCase()} erscheint noch eher als Etikett denn als Analyseinstrument.`);
    nextMoves.push(`Formuliere einen Satz, der die Passage ausdrücklich mit ${theory.shortTitle.toLowerCase()} verbindet und dabei ein konkretes Signal aus dem Text mit einem Theoriebegriff zusammenführt.`);
  }

  if (precisionScore < 0.62) {
    nextMoves.push("Ersetze mindestens ein allgemeines Werturteil durch eine genauere sprachliche Beobachtung: nicht 'stark' oder 'wichtig', sondern etwa Wortwahl, Kontrast, Erzähldistanz oder Wiederholung.");
  }

  if (revisionReadinessScore < 0.62) {
    nextMoves.push("Nutze das Revisionsfeld nicht nur organisatorisch, sondern fachlich: Formuliere dort, welche These du schärfen willst und an welchem Wortmaterial du das im zweiten Durchgang überprüfst.");
  }

  if (summaryHits > 0 && interpretiveDepthScore < 0.7) {
    cautions.push("An einigen Stellen rutscht die Antwort noch in Ereignisabfolge. Für ein Oberstufenniveau muss deutlicher werden, wie der Text etwas inszeniert, nicht nur was geschieht.");
  }

  if (vagueHits > 0) {
    cautions.push("Mehrere Wertwörter bleiben noch ungesichert. Ohne sprachlichen Nachweis wirken sie fachlich zu pauschal.");
  }

  prompts.push(`Welche Formulierung der Passage trägt deine Deutung am stärksten, und was genau macht sie funktional bedeutsam?`);
  prompts.push(`Wie verändert sich deine Aussage, wenn du ${theory.shortTitle.toLowerCase()} nicht nur nennst, sondern an einem einzelnen Signal der Passage demonstrierst?`);
  prompts.push(`Welche Gegenlesart wäre möglich, und woran könntest du im Wortlaut zeigen, dass deine Deutung dennoch plausibler ist?`);

  const overallScore = Math.round(((textAnchoringScore + interpretiveDepthScore + conceptualFitScore + precisionScore + revisionReadinessScore) / 5) * 100);
  const emphasis = interpretiveDepthScore < textAnchoringScore
    ? "Die fachlich nächste Entwicklungsstufe liegt weniger im Finden weiterer Zitate als im Ausbau ihrer interpretatorischen Funktion."
    : "Die nächste Qualitätssteigerung liegt vor allem in noch engerer sprachlicher Absicherung deiner bereits entwickelten Deutung.";

  return {
    heading: `Fachfeedback zu ${entry.title}`,
    summary:
      `Die Antwort zeigt bereits einen erkennbaren analytischen Ansatz, bewegt sich aber noch nicht durchgehend auf dem Niveau einer belastbaren, textgestützten Interpretation. ${emphasis}`,
    overallScore,
    profile,
    strengths: strengths.slice(0, 3),
    cautions: cautions.slice(0, 4),
    nextMoves: nextMoves.slice(0, 4),
    prompts: prompts.slice(0, 3),
    metadata: {
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      theoryTitle: theory.title,
      promptHits,
      theoryHits,
      signalHits
    }
  };
}
