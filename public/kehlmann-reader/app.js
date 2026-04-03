import { pdfSource, readerModules, starterPrompt, theoryResources, lessonSets } from "./data.js";
import { buildParcoursMarkdown } from "./export.js";

const mode = window.KEHLMANN_READER_MODE || "open";
const modeLabel = window.KEHLMANN_READER_MODE_LABEL || "Offene Version";
const config = window.KEHLMANN_READER_CONFIG || {};
const app = document.body;

const reviewLevels = [
  { value: "stark", label: "stark" },
  { value: "teilweise", label: "teilweise" },
  { value: "offen", label: "offen" }
];

const defaultState = {
  ready: false,
  loading: true,
  error: "",
  classroom: null,
  student: null,
  progress: null,
  peerReview: null,
  sebFeedback: null,
  sebFeedbackStatus: "idle",
  sebFeedbackError: "",
  sebFeedbackKey: "",
  selectedReviewId: null,
  lessonId: config.forcedLessonId || lessonSets[0].id,
  moduleId: readerModules[0].id,
  entryId: readerModules[0].entries[0].id,
  theoryId: theoryResources[0].id,
  notes: {},
  saveStatus: "idle",
  reviewSaveStatus: "idle",
  lastSavedAt: ""
};

const state = structuredClone(defaultState);
let saveTimer = null;
let feedbackTimer = null;
let sebFeedbackRequestId = 0;
const entryIndex = new Map();
const semanticGroups = {
  historisch: ["historisch", "geschichte", "geschichtlich", "1938", "1939", "vergangenheit"],
  havanna: ["havanna", "kuba"],
  florida: ["florida", "miami", "usa", "amerika"],
  antwerpen: ["antwerpen", "belgien", "großbritannien", "grossbritannien", "england", "frankreich", "niederlande", "holland"],
  evian: ["évian", "evian", "konferenz", "delegation"],
  grenze: ["grenze", "grenzen", "grenzregime", "grenzordnung", "transit", "zwischenraum", "zwischenräume"],
  verweigerung: ["verweigerung", "abwehr", "abweisung", "zurückweisung", "nichtaufnahme", "unterlassung", "untätigkeit"],
  verhandlung: ["verhandlung", "verhandeln", "diplomatie", "beratung", "telegramm", "gespräch"],
  buerokratie: ["bürokratie", "buerokratie", "verwaltung", "amt", "akte", "stempel", "genehmigung", "dekret", "formular", "protokoll"],
  korruption: ["korruption", "bestechung", "bestechlich", "schmiergeld", "gekauft"],
  dokumentartheater: ["dokumentartheater", "dokumentarisch", "protokollnah", "faktizität", "faktizitaet", "quelle", "zeugenschaft"],
  episches_theater: ["episch", "episches", "verfremdung", "kommentar", "montage", "distanz", "zuschaueradressierung"],
  erinnerung: ["erinnerung", "gedenken", "nachgeschichte", "gegenwart", "steinbruch", "mauthausen", "deportation", "deportiert", "auschwitz", "drancy", "gurs", "les milles"],
  perspektive: ["perspektive", "blick", "sicht", "binnenperspektive", "ich-perspektive", "innenperspektive"],
  buff: ["buff", "fritz", "17", "siebzehn", "allein", "jugendlich", "jugendlicher", "jugendliche"],
  gerda: ["gerda", "blachmann", "wilchfort", "miami-lichter", "newsletter", "suizidversuch", "küstenwache", "coast", "guard"],
  schicksal: ["schicksal", "überlebt", "ueberlebt", "ermordet", "überleben", "ueberleben", "internierung", "lager", "drancy", "auschwitz", "fluchtweg", "visa", "vichy"]
};
const semanticLookup = new Map(
  Object.entries(semanticGroups).flatMap(([canonical, variants]) => variants.map((variant) => [variant, canonical]))
);

for (const module of readerModules) {
  for (const entry of module.entries) {
    entryIndex.set(entry.id, { module, entry });
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tokenizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3 || /^\d+$/.test(part));
}

function canonicalToken(token) {
  return semanticLookup.get(token) || token;
}

function conceptSet(value) {
  const text = String(value || "").toLowerCase();
  const set = new Set(tokenizeText(text).map(canonicalToken));
  for (const [canonical, variants] of Object.entries(semanticGroups)) {
    if (variants.some((variant) => text.includes(variant))) {
      set.add(canonical);
    }
  }
  return set;
}

function hasSemanticSignal(value, candidates) {
  const concepts = conceptSet(value);
  return candidates.some((candidate) => concepts.has(canonicalToken(String(candidate).toLowerCase())));
}

function promptOperator(prompt = "") {
  const text = String(prompt).trim().toLowerCase();
  if (/^(nenne|benenne|welche|welcher|welches)/.test(text)) {
    return "Benennen";
  }
  if (/^(erkläre|erlaeutere|warum|wie)/.test(text)) {
    return "Erklären";
  }
  if (/^(zeige|weise|ordne|vergleiche|verbinde)/.test(text)) {
    return "Zeigen";
  }
  if (/^(prüfe|pruefe|entscheide)/.test(text)) {
    return "Prüfen";
  }
  if (/^(beschreibe|bestimme|wähle|waehle)/.test(text)) {
    return "Präzisieren";
  }
  return "Ausarbeiten";
}

function responseLabel(base, index, prompt) {
  return `${base} ${index + 1} · ${promptOperator(prompt)}`;
}

function responsePlaceholder(prompt = "") {
  const operator = promptOperator(prompt);
  if (operator === "Benennen") {
    return "Antworte knapp und präzise. Nenne die Beobachtung und sichere sie am Wortlaut.";
  }
  if (operator === "Erklären") {
    return "Erkläre in 2-4 Sätzen: Beobachtung, Textsignal, Wirkung.";
  }
  if (operator === "Zeigen") {
    return "Zeige die Aussage am Text: nenne ein Signal und leite daraus eine Deutung ab.";
  }
  if (operator === "Prüfen") {
    return "Prüfe die Möglichkeit genau und entscheide dich begründet.";
  }
  return "Arbeite die Frage in 2-4 präzisen, textnahen Sätzen aus.";
}

async function fetchBootstrap() {
  const response = await fetch("/reader-api/bootstrap", { credentials: "same-origin" });
  if (response.status === 401) {
    window.location.replace(window.location.pathname + window.location.search);
    return new Promise(() => {});
  }
  if (!response.ok) {
    throw new Error("Die Reader-Sitzung konnte nicht geladen werden.");
  }
  return response.json();
}

async function fetchSebFeedback(payload) {
  const response = await fetch("/reader-api/seb-feedback", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || "Das SEB-Fachfeedback konnte nicht geladen werden.");
  }

  return response.json();
}

function applyBootstrap(payload) {
  state.classroom = payload.classroom;
  state.student = payload.student;
  state.progress = payload.progress;
  state.peerReview = payload.peerReview;
  state.notes = payload.work.notes || {};
  state.lessonId = config.forcedLessonId
    || (mode === "seb" ? payload.classroom.activeSebLessonId : payload.work.selectedLessonId)
    || state.lessonId;
  state.moduleId = payload.work.moduleId || state.moduleId;
  state.entryId = payload.work.entryId || state.entryId;
  state.theoryId = payload.work.theoryId || state.theoryId;
  state.lastSavedAt = payload.work.updatedAt || "";

  if (state.peerReview?.assignments?.length) {
    const stillVisible = state.peerReview.assignments.some((assignment) => assignment.id === state.selectedReviewId);
    if (!stillVisible) {
      state.selectedReviewId = state.peerReview.assignments[0].id;
    }
  } else {
    state.selectedReviewId = null;
  }
}

function sebFeedbackPayload() {
  const entry = currentEntry();
  return {
    lessonId: state.lessonId,
    moduleId: state.moduleId,
    entryId: state.entryId,
    theoryId: state.theoryId,
    note: noteForEntry(entry?.id || state.entryId)
  };
}

function sebFeedbackKeyFor(payload) {
  return [
    payload.lessonId,
    payload.moduleId,
    payload.entryId,
    payload.theoryId,
    payload.note?.observation || "",
    payload.note?.evidence || "",
    payload.note?.interpretation || "",
    payload.note?.theory || "",
    payload.note?.revision || ""
  ].join("::");
}

async function requestSebFeedback({ showLoading = false, force = false } = {}) {
  if (mode !== "seb" || !state.ready) {
    return;
  }

  ensureSelection();
  const payload = sebFeedbackPayload();
  const feedbackKey = sebFeedbackKeyFor(payload);
  if (!force && state.sebFeedbackStatus === "ready" && state.sebFeedbackKey === feedbackKey) {
    return;
  }

  const requestId = ++sebFeedbackRequestId;
  state.sebFeedbackStatus = showLoading || !state.sebFeedback ? "loading" : "refreshing";
  state.sebFeedbackError = "";
  if (showLoading) {
    render();
  }

  try {
    const feedback = await fetchSebFeedback(payload);
    if (requestId !== sebFeedbackRequestId) {
      return;
    }

    state.sebFeedback = feedback;
    state.sebFeedbackKey = feedbackKey;
    state.sebFeedbackStatus = "ready";
    state.sebFeedbackError = "";
    render();
  } catch (error) {
    if (requestId !== sebFeedbackRequestId) {
      return;
    }

    state.sebFeedbackStatus = "error";
    state.sebFeedbackError = error.message;
    render();
  }
}

async function saveProgress() {
  clearTimeout(saveTimer);
  state.saveStatus = "saving";
  render();

  try {
    const response = await fetch("/reader-api/progress", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode,
        lessonId: state.lessonId,
        moduleId: state.moduleId,
        entryId: state.entryId,
        theoryId: state.theoryId,
        notes: state.notes
      })
    });

    if (!response.ok) {
      throw new Error("Arbeitsstand konnte nicht gespeichert werden.");
    }

    const payload = await response.json();
    applyBootstrap(payload);
    state.saveStatus = "saved";
    render();
    if (mode === "seb") {
      requestSebFeedback();
    }
  } catch (error) {
    state.saveStatus = "error";
    state.error = error.message;
    render();
  }
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveProgress();
  }, 500);
}

function queueSebFeedback() {
  if (mode !== "seb") {
    return;
  }

  clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    requestSebFeedback();
  }, 700);
}

function availableLessons() {
  const allowedLessonIds = state.classroom?.lessonIds || lessonSets.map((lesson) => lesson.id);

  if (config.forcedLessonId) {
    return lessonSets.filter((lesson) => lesson.id === config.forcedLessonId);
  }

  if (mode === "seb") {
    const activeLessonId = state.classroom?.activeSebLessonId || state.lessonId;
    return lessonSets.filter((lesson) => lesson.id === activeLessonId);
  }

  return lessonSets.filter((lesson) => allowedLessonIds.includes(lesson.id));
}

function currentLesson() {
  return availableLessons().find((lesson) => lesson.id === state.lessonId) || availableLessons()[0] || lessonSets[0];
}

function entriesForLesson(lesson = currentLesson()) {
  if (Array.isArray(lesson?.entryIds) && lesson.entryIds.length) {
    return lesson.entryIds
      .map((entryId) => entryIndex.get(entryId)?.entry)
      .filter(Boolean);
  }

  return (lesson?.moduleIds || [])
    .flatMap((moduleId) => readerModules.find((module) => module.id === moduleId)?.entries || []);
}

function modulesForLesson(lesson = currentLesson()) {
  const lessonEntries = entriesForLesson(lesson);
  const modules = new Map();

  for (const entry of lessonEntries) {
    const meta = entryIndex.get(entry.id);
    if (!meta) {
      continue;
    }

    if (!modules.has(meta.module.id)) {
      modules.set(meta.module.id, {
        ...meta.module,
        entries: []
      });
    }

    modules.get(meta.module.id).entries.push(meta.entry);
  }

  return readerModules
    .filter((module) => modules.has(module.id))
    .map((module) => modules.get(module.id));
}

function currentModule() {
  return modulesForLesson().find((module) => module.id === state.moduleId) || modulesForLesson()[0];
}

function currentEntry() {
  return currentModule()?.entries.find((entry) => entry.id === state.entryId) || currentModule()?.entries[0];
}

function theoryIdsFor(module = currentModule(), entry = currentEntry()) {
  const ids = [
    ...(currentLesson()?.recommendedTheoryIds || []),
    ...(module?.relatedTheoryIds || []),
    ...(entry?.relatedTheoryIds || [])
  ];
  return [...new Set(ids)].filter((id) => theoryResources.some((resource) => resource.id === id));
}

function theoryOptionsFor(module = currentModule(), entry = currentEntry()) {
  const ids = theoryIdsFor(module, entry);
  if (!ids.length) {
    return theoryResources;
  }

  return ids
    .map((id) => theoryResources.find((resource) => resource.id === id))
    .filter(Boolean);
}

function ensureSelection() {
  const lessons = availableLessons();
  if (!lessons.some((lesson) => lesson.id === state.lessonId)) {
    state.lessonId = lessons[0]?.id || lessonSets[0].id;
  }

  const visibleModules = modulesForLesson();
  if (!visibleModules.some((module) => module.id === state.moduleId)) {
    state.moduleId = visibleModules[0]?.id || readerModules[0].id;
  }

  const module = currentModule();
  if (module && !module.entries.some((entry) => entry.id === state.entryId)) {
    state.entryId = module.entries[0]?.id || state.entryId;
  }

  const theories = theoryOptionsFor();
  if (!theories.some((resource) => resource.id === state.theoryId)) {
    state.theoryId = theories[0]?.id || theoryResources[0].id;
  }
}

function currentTheory() {
  const options = theoryOptionsFor();
  return options.find((resource) => resource.id === state.theoryId) || options[0] || theoryResources[0];
}

function resourceAssignmentsForLesson(lesson = currentLesson()) {
  return (lesson?.resourceAssignments || [])
    .map((assignment) => {
      const resource = theoryResources.find((entry) => entry.id === assignment.resourceId);
      if (!resource) {
        return null;
      }

      return {
        ...assignment,
        resource
      };
    })
    .filter(Boolean);
}

function resourceResponseKey(lessonId, resourceId) {
  return `lesson-resource::${lessonId}::${resourceId}`;
}

function noteForEntry(entryId) {
  const raw = state.notes[entryId] || {};
  return {
    observation: "",
    evidence: "",
    interpretation: "",
    theory: "",
    revision: "",
    focusAnswers: [],
    theoryResponses: {},
    ...raw
  };
}

function focusAnswersFor(entry = currentEntry()) {
  const note = noteForEntry(entry.id);
  return entry.prompts.map((_, index) => note.focusAnswers?.[index] || "");
}

function theoryResponseFor(entry = currentEntry(), theory = currentTheory()) {
  const note = noteForEntry(entry.id);
  const stored = note.theoryResponses?.[theory.id] || {};
  const transferPrompts = transferPromptsFor(entry, theory);

  return {
    guidingAnswers: theory.questions.map((_, index) => stored.guidingAnswers?.[index] || ""),
    transferAnswers: transferPrompts.map((_, index) => stored.transferAnswers?.[index] || "")
  };
}

function resourceResponseForAssignment(assignment, lesson = currentLesson()) {
  const raw = state.notes[resourceResponseKey(lesson.id, assignment.resourceId)] || {};
  return {
    taskResponse: raw.taskResponse || "",
    questionAnswers: assignment.questions.map((_, index) => raw.questionAnswers?.[index] || "")
  };
}

function trimmed(value) {
  return String(value || "").trim();
}

function documentationStatusForEntry(entry = currentEntry(), theory = currentTheory()) {
  const note = noteForEntry(entry.id);
  const focusAnswers = focusAnswersFor(entry);
  const theoryResponses = theoryResponseFor(entry, theory);
  const checks = [
    { label: "Beobachtung", complete: Boolean(trimmed(note.observation)) },
    { label: "Textanker / Wortlaut", complete: Boolean(trimmed(note.evidence)) },
    { label: "Deutung", complete: Boolean(trimmed(note.interpretation)) },
    { label: "Theoriebezug", complete: Boolean(trimmed(note.theory)) },
    { label: "Revision / nächster Schritt", complete: Boolean(trimmed(note.revision)) },
    ...entry.prompts.map((prompt, index) => ({
      label: `Fokusfrage ${index + 1}: ${prompt}`,
      complete: Boolean(trimmed(focusAnswers[index]))
    })),
    ...theory.questions.map((question, index) => ({
      label: `Leitfrage ${index + 1}: ${question}`,
      complete: Boolean(trimmed(theoryResponses.guidingAnswers[index]))
    })),
    ...transferPromptsFor(entry, theory).map((prompt, index) => ({
      label: `Transfer ${index + 1}: ${prompt}`,
      complete: Boolean(trimmed(theoryResponses.transferAnswers[index]))
    }))
  ];

  return {
    completed: checks.filter((item) => item.complete).length,
    total: checks.length,
    missing: checks.filter((item) => !item.complete).map((item) => item.label)
  };
}

function documentationStatusForAssignment(assignment, lesson = currentLesson()) {
  const response = resourceResponseForAssignment(assignment, lesson);
  const checks = [
    { label: "Arbeitsauftrag schriftlich beantworten", complete: Boolean(trimmed(response.taskResponse)) },
    ...assignment.questions.map((question, index) => ({
      label: `Ressourcenfrage ${index + 1}: ${question}`,
      complete: Boolean(trimmed(response.questionAnswers[index]))
    }))
  ];

  return {
    completed: checks.filter((item) => item.complete).length,
    total: checks.length,
    missing: checks.filter((item) => !item.complete).map((item) => item.label)
  };
}

function completion(module) {
  const completed = module.entries.filter((entry) => {
    const note = noteForEntry(entry.id);
    return note.observation.trim() || note.interpretation.trim() || note.theory.trim();
  }).length;

  return `${completed}/${module.entries.length}`;
}

function progressForCurrentLesson() {
  const lesson = currentLesson();
  return state.progress?.lessonProgress?.find((entry) => entry.id === lesson.id) || null;
}

function isParcoursComplete() {
  return Boolean(
    state.progress &&
    state.progress.totalEntries > 0 &&
    state.progress.completedEntries >= state.progress.totalEntries
  );
}

function currentReviewAssignment() {
  return state.peerReview?.assignments?.find((assignment) => assignment.id === state.selectedReviewId) || state.peerReview?.assignments?.[0] || null;
}

function pageRangeForLesson(lesson = currentLesson()) {
  const pageNumbers = entriesForLesson(lesson)
    .map((entry) => Number(entry.pageNumber || 0))
    .filter(Boolean);

  if (!pageNumbers.length) {
    return "";
  }

  const first = Math.min(...pageNumbers);
  const last = Math.max(...pageNumbers);
  return first === last ? `S. ${first}` : `S. ${first}-${last}`;
}

function transferPromptsFor(entry, theory) {
  return [
    `Beziehe "${entry.passageLabel}" gezielt auf ${theory.shortTitle.toLowerCase()} und sichere deine Aussage mit mindestens zwei Wörtern aus dem Text.`,
    ...theory.transferPrompts.slice(0, 2)
  ];
}

function feedbackFor(note, module, entry) {
  const body = `${note.observation} ${note.interpretation} ${note.theory}`;
  const evidence = note.evidence;
  const theory = note.theory;
  const signals = ["zeigt", "verdeutlicht", "deutet", "wirkt", "weil", "macht sichtbar", "inszeniert"];
  const summarySignals = ["dann", "danach", "passiert", "anschließend", "erzählt"];
  const historicalSignals = [
    "historisch",
    "havanna",
    "florida",
    "antwerpen",
    "evian",
    "évian",
    "grenze",
    "transit",
    "verweigerung",
    "schröder",
    "buff",
    "gerda",
    "belgien",
    "niederlande",
    "frankreich",
    "großbritannien",
    "england",
    "deportation",
    "auschwitz",
    "drancy",
    "gurs",
    "les milles",
    "schicksal",
    "überlebt",
    "ermordet"
  ];
  const precisionSignals = ["wort", "formulierung", "kontrast", "bühne", "montage", "szene", "satz", "bild", "perspektive", "rhythmus", "protokollnah", "zeugenschaft"];
  const positives = [];
  const cautions = [];
  const steps = [];
  const relatedTheories = theoryOptionsFor(module, entry);
  const lesson = currentLesson();
  const combined = `${body} ${evidence}`;

  if (evidence.trim().length >= 8) {
    positives.push("Du arbeitest bereits mit konkreten Wortsignalen aus dem Text und löst dich damit von bloßer Nacherzählung.");
  } else {
    steps.push("Ergänze ein oder zwei Wörter aus dem PDF-Wortlaut als präzisen Textanker.");
  }

  if (hasSemanticSignal(body, signals)) {
    positives.push("Deine Notiz enthält bereits eine deutende Bewegung: Du sagst nicht nur, was geschieht, sondern was die Passage funktional leistet.");
  } else {
    steps.push("Formuliere deutlicher, was die Stelle zeigt, andeutet oder bewirkt.");
  }

  if (hasSemanticSignal(body, summarySignals)) {
    cautions.push("An einigen Stellen rutscht die Antwort noch in Ablauf oder Nacherzählung. Fachlich stärker wird sie, wenn du die Inszenierung statt nur das Geschehen erklärst.");
    steps.push("Achte darauf, nicht nur den Ablauf zu erzählen, sondern die sprachliche Wirkung zu erklären.");
  }

  if (note.theory.trim().length >= 20) {
    positives.push("Du verknüpfst die Passage schon mit einer Theorie-Linse.");
  } else if (relatedTheories.length) {
    steps.push(`Ziehe zusätzlich eine Theorie-Linse heran: ${relatedTheories.map((resource) => resource.shortTitle).join(", ")}.`);
  }

  if (module.lens && !hasSemanticSignal(body, tokenizeText(module.lens))) {
    steps.push(`Binde deine Beobachtung noch stärker an die Linse des Moduls: ${module.lens.toLowerCase()}.`);
  }

  if (hasSemanticSignal(combined, historicalSignals)) {
    positives.push("Die Antwort signalisiert bereits, dass du die Szene historisch rahmst und nicht nur isoliert als Einzelschicksal liest.");
  } else if (relatedTheories.some((resource) => ["evian-konferenz", "evian-deutschlandfunk", "susanne-heim-grenzen", "ndr-st-louis", "fritz-buff-reisebericht", "ushmm-voyage", "ushmm-return-europe", "ushmm-wartime-fate", "gerda-blachmann", "historischer-kontext"].includes(resource.id))) {
    steps.push("Schärfe die historische Dimension ausdrücklich: Benenne die Station, Konferenzlogik, Grenzordnung oder Passagierperspektive, die die Passage strukturiert.");
  }

  if (hasSemanticSignal(combined, precisionSignals)) {
    positives.push("Du gehst teilweise schon an sprachliche oder szenische Präzision heran, statt nur allgemein zu urteilen.");
  } else {
    cautions.push("Die Deutung bleibt noch zu allgemein. Im Moment fehlen noch klar benannte Signale wie Wortwahl, Kontrast, Bühnenbild, Perspektive oder Montage.");
    steps.push("Arbeite nicht nur mit Wertungen. Benenne genauer Wortwahl, Bühnenkonstellation, Perspektive, Kontrast oder Montage.");
  }

  if (entry.relatedTheoryIds?.includes("naturalismus")) {
    const naturalismTerms = ["milieu", "arbeit", "körper", "wirklichkeit", "druck", "sozial"];
    if (naturalismTerms.some((term) => theory.includes(term))) {
      positives.push("Der Theoriebezug zur naturalistischen Darstellung ist schon sichtbar.");
    }
  }

  if (entry.relatedTheoryIds?.includes("perspektive")) {
    const perspectiveTerms = ["erzähler", "perspektive", "nähe", "distanz", "wahrnehmung"];
    if (perspectiveTerms.some((term) => theory.includes(term))) {
      positives.push("Du achtest bereits darauf, wie die Erzählperspektive die Deutung lenkt.");
    }
  }

  if (entry.relatedTheoryIds?.includes("novelle")) {
    const novellaTerms = ["wendepunkt", "novelle", "konflikt", "verdichtung", "motiv"];
    if (novellaTerms.some((term) => theory.includes(term))) {
      positives.push("Du bindest die Passage schon an die Formlogik der Novelle zurück.");
    }
  }

  if (lesson?.id === "lesson-14-fritz-buff-primärquelle" && !body.includes("17") && !body.includes("allein")) {
    steps.push("Nutze die Primärquelle noch schärfer: Halte ausdrücklich fest, dass Fritz Buff erst 17 war und allein reiste, und prüfe, wie das die Passage verändert.");
  }

  if (lesson?.id === "lesson-15-ushmm-nachgeschichte" && !hasSemanticSignal(combined, ["gerda", "belgien", "niederlande", "frankreich", "großbritannien", "deportation", "überlebt", "ermordet", "schicksal"])) {
    cautions.push("Für die USHMM-Schlusseinheit bleibt die Nachgeschichte noch zu blass. Im Moment fehlt der Sprung von der Hafenkrise zu Verteilung, Verfolgung oder ungleichen Kriegsschicksalen.");
    steps.push("Nenne ausdrücklich Gerda Blachmann oder eines der Aufnahmeländer und verbinde die Passage zusätzlich mit Verteilung, Nachgeschichte, Deportation oder Überleben.");
  }

  if (!note.observation.trim() || !note.interpretation.trim()) {
    cautions.push("Die Grundstruktur der Antwort ist noch zu dünn. Eine tragfähige Deutung braucht mindestens Beobachtung, Textsignal und Folgerung.");
  }

  if (!steps.length) {
    steps.push("Die Notiz ist schon tragfähig. Schärfe im nächsten Schritt noch genauer, wie Textsignal, historische Einordnung und Deutung ineinandergreifen.");
  }

  const summary = positives.length
    ? "Die Notiz hat bereits eine belastbare Richtung, muss aber noch enger an Textsignal und Analysefunktion gebunden werden."
    : "Die Notiz ist im Ansatz da, braucht aber noch deutlich mehr Textnähe, Präzision und fachliche Zuspitzung.";

  return {
    summary,
    positives: positives.slice(0, 4),
    cautions: cautions.slice(0, 4),
    steps: steps.slice(0, 5)
  };
}

function pdfUrlForEntry(entry) {
  return `${pdfSource}#page=${entry.pageNumber || 1}&zoom=page-width`;
}

function renderSidebar() {
  return modulesForLesson().map((module) => `
    <button class="module-pill ${module.id === state.moduleId ? "is-active" : ""}" data-action="select-module" data-module-id="${module.id}">
      <span>${escapeHtml(module.title)}</span>
      <strong>${completion(module)}</strong>
    </button>
  `).join("");
}

function renderLessonRail() {
  return availableLessons().map((lesson) => {
    const progress = state.progress?.lessonProgress?.find((entry) => entry.id === lesson.id);
    const entryCount = Array.isArray(lesson.entryIds) ? lesson.entryIds.length : lesson.moduleIds.length;
    return `
      <button class="lesson-pill ${lesson.id === state.lessonId ? "is-active" : ""}" data-action="select-lesson" data-lesson-id="${lesson.id}" ${mode === "seb" || config.forcedLessonId ? "disabled" : ""}>
        <span>${escapeHtml(lesson.title)}</span>
        <small>${escapeHtml(progress ? `${progress.completedEntries}/${progress.totalEntries} Passagen` : `${entryCount} Passagen · ${pageRangeForLesson(lesson)}`)}</small>
      </button>
    `;
  }).join("");
}

function renderTheorySelector(module, entry) {
  return theoryOptionsFor(module, entry).map((resource) => `
    <button class="theory-pill ${resource.id === state.theoryId ? "is-active" : ""}" data-action="select-theory" data-theory-id="${resource.id}">
      <span>${escapeHtml(resource.shortTitle)}</span>
      <small>${escapeHtml(resource.sourceTitle)}</small>
    </button>
  `).join("");
}

function renderEntryTabs(module) {
  return module.entries.map((entry) => `
    <button class="entry-tab ${entry.id === state.entryId ? "is-active" : ""}" data-action="select-entry" data-entry-id="${entry.id}">
      ${escapeHtml(entry.title)}
    </button>
  `).join("");
}

function renderPassageNavigator(lesson = currentLesson()) {
  return entriesForLesson(lesson).map((entry) => {
    const module = entryIndex.get(entry.id)?.module;
    return `
    <button class="passage-card ${entry.id === state.entryId ? "is-active" : ""}" data-action="select-entry" data-entry-id="${entry.id}">
      <span class="passage-page">${escapeHtml(entry.pageHint)}</span>
      <strong>${escapeHtml(entry.passageLabel)}</strong>
      <small>${escapeHtml(module?.title || "")}</small>
      <span>${escapeHtml(entry.prompts[0])}</span>
    </button>
  `;
  }).join("");
}

function renderSignalWords(entry) {
  const note = noteForEntry(entry.id);
  return entry.signalWords.map((word) => `
    <button class="signal-chip ${note.evidence.includes(word) ? "is-active" : ""}" data-action="toggle-signal" data-word="${escapeHtml(word)}">
      ${escapeHtml(word)}
    </button>
  `).join("");
}

function renderPromptList() {
  return starterPrompt.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderLessonMediaPanel(lesson = currentLesson()) {
  const media = Array.isArray(lesson?.chapterMedia) ? lesson.chapterMedia : [];
  if (!media.length) {
    return "";
  }

  return `
    <section class="lesson-media-panel">
      <div class="section-head">
        <strong>Bildauftakt dieser Lektion</strong>
        <span class="status-badge">${escapeHtml(`${media.length} Quelle${media.length === 1 ? "" : "n"}`)}</span>
      </div>
      <div class="lesson-media-grid">
        ${media.map((item) => `
          <article class="lesson-media-card">
            <div class="lesson-media-frame">
              <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || item.title || "Historische Bildquelle")}">
            </div>
            <div class="lesson-media-copy">
              <div class="eyebrow">Kapitelauftakt</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.caption)}</p>
            </div>
            <div class="lesson-media-task">
              <strong>Arbeitsimpuls</strong>
              <p>${escapeHtml(item.focusPrompt)}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFocusQuestions(entry) {
  return `
    <ul class="question-list">
      ${entry.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}
    </ul>
  `;
}

function renderNotebook(entry) {
  const note = noteForEntry(entry.id);
  const feedback = feedbackFor(note, currentModule(), entry);
  const theory = currentTheory();
  const focusAnswers = focusAnswersFor(entry);
  const theoryResponses = theoryResponseFor(entry, theory);
  const documentation = documentationStatusForEntry(entry, theory);

  return `
    <section class="panel notebook">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Notizbuch</div>
          <h2>${escapeHtml(entry.title)}</h2>
        </div>
        <button class="button secondary" data-action="export-notes">Markdown exportieren</button>
      </div>

      <div class="documentation-status-box ${documentation.missing.length ? "is-warning" : "is-complete"}">
        <strong data-doc-summary="entry">${escapeHtml(`Dokumentationsstand: ${documentation.completed}/${documentation.total}`)}</strong>
        <p data-doc-missing="entry">${documentation.missing.length
          ? escapeHtml(`Noch offen: ${documentation.missing.join(" · ")}`)
          : "Alle Fokusfragen, Leitfragen und Transferfragen sind schriftlich dokumentiert."
        }</p>
      </div>

      <form id="note-form" class="note-grid">
        <label>
          Beobachtung
          <textarea name="observation" placeholder="Was fällt an Raum, Figur, Sprache oder Stimmung auf?">${escapeHtml(note.observation)}</textarea>
        </label>
        <label>
          Signalwörter / Wortlaut
          <textarea name="evidence" placeholder="Kurze Wortgruppen aus dem eingebetteten PDF">${escapeHtml(note.evidence)}</textarea>
        </label>
        <label>
          Deutung
          <textarea name="interpretation" placeholder="Was zeigt diese Stelle? Welche Wirkung entsteht?">${escapeHtml(note.interpretation)}</textarea>
        </label>
        <label>
          Theoriebezug
          <textarea name="theory" placeholder="Verbinde die Passage mit Novelle, Naturalismus oder Erzählperspektive.">${escapeHtml(note.theory)}</textarea>
        </label>
        <label>
          Revision / nächster Schritt
          <textarea name="revision" placeholder="Was würdest du nach Feedback oder erneuter Lektüre noch schärfen?">${escapeHtml(note.revision)}</textarea>
        </label>

        <section class="structured-section">
          <div class="section-head">
            <strong>Fokusfragen schriftlich beantworten</strong>
            <span class="status-badge" data-doc-count="focus">${escapeHtml(`${focusAnswers.filter((value) => trimmed(value)).length}/${entry.prompts.length}`)}</span>
          </div>
          ${entry.prompts.map((prompt, index) => `
            <label>
              ${escapeHtml(responseLabel("Fokusfrage", index, prompt))}
              <span class="field-prompt">${escapeHtml(prompt)}</span>
              <textarea data-note-array="focusAnswers" data-index="${index}" placeholder="${escapeHtml(responsePlaceholder(prompt))}">${escapeHtml(focusAnswers[index])}</textarea>
            </label>
          `).join("")}
        </section>

        <section class="structured-section">
          <div class="section-head">
            <strong>${escapeHtml(`Leitfragen zu ${theory.shortTitle}`)}</strong>
            <span class="status-badge" data-doc-count="guiding">${escapeHtml(`${theoryResponses.guidingAnswers.filter((value) => trimmed(value)).length}/${theory.questions.length}`)}</span>
          </div>
          ${theory.questions.map((question, index) => `
            <label>
              ${escapeHtml(responseLabel("Leitfrage", index, question))}
              <span class="field-prompt">${escapeHtml(question)}</span>
              <textarea data-note-theory-section="guidingAnswers" data-index="${index}" placeholder="${escapeHtml(responsePlaceholder(question))}">${escapeHtml(theoryResponses.guidingAnswers[index])}</textarea>
            </label>
          `).join("")}
        </section>

        <section class="structured-section">
          <div class="section-head">
            <strong>Transfer zur Passage schriftlich festhalten</strong>
            <span class="status-badge" data-doc-count="transfer">${escapeHtml(`${theoryResponses.transferAnswers.filter((value) => trimmed(value)).length}/${transferPromptsFor(entry, theory).length}`)}</span>
          </div>
          ${transferPromptsFor(entry, theory).map((prompt, index) => `
            <label>
              ${escapeHtml(responseLabel("Transfer", index, prompt))}
              <span class="field-prompt">${escapeHtml(prompt)}</span>
              <textarea data-note-theory-section="transferAnswers" data-index="${index}" placeholder="${escapeHtml(responsePlaceholder(prompt))}">${escapeHtml(theoryResponses.transferAnswers[index])}</textarea>
            </label>
          `).join("")}
        </section>
      </form>

      ${mode === "seb" ? "" : `
        <div class="feedback-box">
          <h3>Arbeitsfeedback</h3>
          <p class="feedback-summary">${escapeHtml(feedback.summary)}</p>
          <div class="feedback-columns">
            <div>
              <strong>Stärken</strong>
              <ul>${feedback.positives.length ? feedback.positives.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Noch keine textnahe Stärke sichtbar.</li>"}</ul>
            </div>
            <div>
              <strong>Diagnose</strong>
              <ul>${feedback.cautions.length ? feedback.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Keine akute Schwachstelle sichtbar; jetzt vor allem noch präziser absichern.</li>"}</ul>
            </div>
            <div>
              <strong>Nächste Schritte</strong>
              <ul>${feedback.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
      `}
    </section>
  `;
}

function renderSebFeedbackPanel() {
  if (mode !== "seb") {
    return "";
  }

  const entry = currentEntry();
  const theory = currentTheory();
  const feedback = state.sebFeedback;

  if (state.sebFeedbackStatus === "loading" && !feedback) {
    return `
      <section class="panel seb-feedback-panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Analytisches Fachfeedback</div>
            <h2>Diagnose wird aufgebaut</h2>
          </div>
        </div>
        <div class="empty-box">Die aktuelle Passage wird gerade im Hinblick auf Textbindung, Deutungstiefe, Theorieintegration und Revisionsreife ausgewertet.</div>
      </section>
    `;
  }

  if (state.sebFeedbackStatus === "error") {
    return `
      <section class="panel seb-feedback-panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Analytisches Fachfeedback</div>
            <h2>Fachfeedback momentan nicht verfügbar</h2>
          </div>
          <button class="button secondary" data-action="refresh-seb-feedback">Erneut prüfen</button>
        </div>
        <div class="empty-box">${escapeHtml(state.sebFeedbackError || "Die Auswertung konnte nicht erstellt werden.")}</div>
      </section>
    `;
  }

  if (!feedback) {
    return "";
  }

  return `
    <section class="panel seb-feedback-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Analytisches Fachfeedback</div>
          <h2>${escapeHtml(feedback.heading)}</h2>
        </div>
        <div class="seb-feedback-actions">
          <span class="status-badge">${escapeHtml(`${feedback.overallScore}/100`)}</span>
          <button class="button secondary" data-action="refresh-seb-feedback">Neu auswerten</button>
        </div>
      </div>

      <div class="seb-feedback-summary">
        <p>${escapeHtml(feedback.summary)}</p>
        <div class="seb-feedback-meta">
          <span class="theory-tag">${escapeHtml(entry.passageLabel)}</span>
          <span class="theory-tag">${escapeHtml(theory.shortTitle)}</span>
          <span class="theory-tag">${escapeHtml(feedback.metadata.lessonTitle)}</span>
          ${state.sebFeedbackStatus === "refreshing" ? '<span class="theory-tag">aktualisiert …</span>' : ""}
        </div>
      </div>

      <div class="seb-profile-grid">
        ${feedback.profile.map((item) => `
          <article class="seb-profile-card">
            <div class="seb-profile-head">
              <strong>${escapeHtml(item.label)}</strong>
              <span class="status-badge">${escapeHtml(`${item.score}/100`)}</span>
            </div>
            <div class="eyebrow">${escapeHtml(item.level)}</div>
            <p>${escapeHtml(item.rationale)}</p>
          </article>
        `).join("")}
      </div>

      <div class="seb-feedback-columns">
        <article class="seb-feedback-card is-positive">
          <h3>Tragfähige Ansätze</h3>
          <ul class="question-list">
            ${feedback.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="seb-feedback-card is-caution">
          <h3>Fachliche Schärfungszonen</h3>
          <ul class="question-list">
            ${feedback.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>

      <div class="seb-feedback-columns">
        <article class="seb-feedback-card">
          <h3>Konkrete Revisionsaufträge</h3>
          <ol class="question-list seb-feedback-steps">
            ${feedback.nextMoves.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
        </article>

        <article class="seb-feedback-card">
          <h3>Weiterführende Rückfragen</h3>
          <ul class="question-list">
            ${feedback.prompts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>
  `;
}

function renderPdfPanel(entry, module) {
  const lesson = currentLesson();
  return `
    <article class="panel pdf-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Text im PDF</div>
          <h2>${escapeHtml(entry.passageLabel)}</h2>
        </div>
        <div class="pdf-head-actions">
          <span class="status-badge">${escapeHtml(entry.pageHint)}</span>
          <span class="status-badge">${escapeHtml(pageRangeForLesson(lesson))}</span>
          <a class="button secondary" href="${pdfUrlForEntry(entry)}" target="_blank" rel="noreferrer">PDF separat öffnen</a>
        </div>
      </div>

      <div class="pdf-focus-box">
        <strong>Arbeitsfokus</strong>
        <p>${escapeHtml(module.briefing)}</p>
      </div>

      ${renderLessonMediaPanel(lesson)}

      <div class="lesson-passages-box">
        <strong>Relevante Passagen dieser Lektion</strong>
        <p>${escapeHtml(`${lesson.title} führt durch ${entriesForLesson(lesson).length} gezielt ausgewählte Passagen im Seitenkorridor ${pageRangeForLesson(lesson)}.`)}</p>
      </div>

      <div class="passage-nav">
        ${renderPassageNavigator(lesson)}
      </div>

      <div class="pdf-frame-wrap">
        <iframe class="pdf-frame" src="${pdfUrlForEntry(entry)}" title="Die Reise der Verlorenen PDF"></iframe>
      </div>
    </article>
  `;
}

function renderTheoryPanel(module, entry) {
  const theory = currentTheory();
  const transferPrompts = transferPromptsFor(entry, theory);
  const mediaMarkup = theory.mediaType === "pdf"
    ? `
      <div class="pdf-frame-wrap">
        <iframe class="pdf-frame" src="${escapeHtml(theory.embedUrl)}#page=1&zoom=page-width" title="${escapeHtml(theory.title)}"></iframe>
      </div>
      <p class="video-note">Der Sekundärtext ist direkt eingebettet und kann zusätzlich extern geöffnet werden.</p>
    `
    : theory.mediaType === "html"
      ? `
      <div class="pdf-frame-wrap">
        <iframe class="pdf-frame" src="${escapeHtml(theory.embedUrl)}" title="${escapeHtml(theory.title)}"></iframe>
      </div>
      <p class="video-note">Das historische Dossier ist direkt eingebettet; externe Quellen- und Audio-Links findest du zusätzlich im Dossier und über die Buttons.</p>
    `
    : `
      <div class="video-wrap">
        <video class="theory-video" controls preload="metadata">
          <source src="${escapeHtml(theory.embedUrl)}" type="video/mp4">
        </video>
      </div>
      <p class="video-note">
        Falls das Video im Browser nicht direkt lädt, kannst du es jederzeit über den externen Link öffnen.
      </p>
    `;

  return `
    <article class="panel theory-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Theorie-Linse</div>
          <h2>${escapeHtml(theory.title)}</h2>
        </div>
        <div class="chip-row">
          <a class="button secondary" href="${escapeHtml(theory.openUrl)}" target="_blank" rel="noreferrer">${theory.mediaType === "pdf" ? "PDF extern öffnen" : theory.mediaType === "html" ? "Quelle extern öffnen" : "Video extern öffnen"}</a>
          ${theory.audioUrl
            ? `<a class="button secondary" href="${escapeHtml(theory.audioUrl)}" target="_blank" rel="noreferrer">${escapeHtml(theory.audioLabel || "Audio extern öffnen")}</a>`
            : ""
          }
        </div>
      </div>

      <div class="theory-summary">
        <p>${escapeHtml(theory.summary)}</p>
        <div class="theory-tag-row">
          ${theory.keyIdeas.map((idea) => `<span class="theory-tag">${escapeHtml(idea)}</span>`).join("")}
        </div>
      </div>

      <div class="theory-grid">
        <div class="theory-card">
          <strong>Leitfragen</strong>
          <ul class="question-list">
            ${theory.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
          </ul>
        </div>
        <div class="theory-card">
          <strong>Transfer zur Passage</strong>
          <ul class="question-list">
            ${transferPrompts.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="writing-frame-box">
        <strong>Schreibhilfe</strong>
        <p>${escapeHtml(theory.writingFrame)}</p>
      </div>

      <div class="video-card">
        ${mediaMarkup}
      </div>
    </article>
  `;
}

function renderResourceAssignmentsPanel() {
  const assignments = resourceAssignmentsForLesson();
  if (!assignments.length) {
    return "";
  }

  return `
    <article class="panel resource-assignment-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Ressourcen-Aufträge</div>
          <h2>Podcast, Dossiers, Sekundärtexte und Theorie als Arbeitsstationen</h2>
        </div>
      </div>

      <div class="resource-assignment-grid">
        ${assignments.map((assignment) => {
          const { resource, title, summary, task, questions } = assignment;
          const response = resourceResponseForAssignment(assignment);
          const documentation = documentationStatusForAssignment(assignment);
          return `
          <section class="resource-assignment-card">
            <div class="panel-head">
              <div>
                <div class="eyebrow">${escapeHtml(resource.sourceTitle)}</div>
                <h3>${escapeHtml(title)}</h3>
              </div>
              <div class="chip-row">
                <a class="button secondary" href="${escapeHtml(resource.openUrl)}" target="_blank" rel="noreferrer">${resource.mediaType === "pdf" ? "PDF extern öffnen" : resource.mediaType === "html" ? "Quelle extern öffnen" : "Medium extern öffnen"}</a>
                ${resource.audioUrl
                  ? `<a class="button secondary" href="${escapeHtml(resource.audioUrl)}" target="_blank" rel="noreferrer">${escapeHtml(resource.audioLabel || "Audio extern öffnen")}</a>`
                  : ""
                }
              </div>
            </div>

            <p>${escapeHtml(summary)}</p>

            <div class="documentation-status-box ${documentation.missing.length ? "is-warning" : "is-complete"}" data-doc-box="resource" data-resource-id="${resource.id}">
              <strong data-doc-summary="resource">${escapeHtml(`Dokumentationsstand: ${documentation.completed}/${documentation.total}`)}</strong>
              <p data-doc-missing="resource">${documentation.missing.length
                ? escapeHtml(`Noch offen: ${documentation.missing.join(" · ")}`)
                : "Der Ressourcen-Auftrag ist vollständig schriftlich dokumentiert."
              }</p>
            </div>

            <div class="resource-task-box">
              <strong>Konkreter Arbeitsauftrag</strong>
              <p>${escapeHtml(task)}</p>
            </div>

            <div class="theory-grid">
              <div class="theory-card">
                <strong>Leitfragen zur Ressource</strong>
                <ul class="question-list">
                  ${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
                </ul>
              </div>
              <div class="theory-card">
                <strong>Warum diese Ressource hier wichtig ist</strong>
                <p>${escapeHtml(resource.summary)}</p>
              </div>
            </div>

            <section class="structured-section">
              <div class="section-head">
                <strong>Arbeitsauftrag schriftlich beantworten</strong>
              </div>
              <label>
                ${escapeHtml(title)}
                <span class="field-prompt">${escapeHtml(task)}</span>
                <textarea data-resource-id="${resource.id}" data-resource-field="taskResponse" placeholder="Halte hier deine zusammenhängende Antwort zum Ressourcen-Auftrag fest.">${escapeHtml(response.taskResponse)}</textarea>
              </label>
            </section>

            <section class="structured-section">
              <div class="section-head">
                <strong>Leitfragen schriftlich beantworten</strong>
                <span class="status-badge" data-doc-count="resource-questions" data-resource-id="${resource.id}">${escapeHtml(`${response.questionAnswers.filter((value) => trimmed(value)).length}/${questions.length}`)}</span>
              </div>
              ${questions.map((question, index) => `
                <label>
                  ${escapeHtml(responseLabel("Ressourcenfrage", index, question))}
                  <span class="field-prompt">${escapeHtml(question)}</span>
                  <textarea data-resource-id="${resource.id}" data-resource-field="questionAnswers" data-index="${index}" placeholder="${escapeHtml(responsePlaceholder(question))}">${escapeHtml(response.questionAnswers[index])}</textarea>
                </label>
              `).join("")}
            </section>

            <div class="video-card">
              ${resource.mediaType === "pdf"
                ? `<div class="pdf-frame-wrap"><iframe class="pdf-frame" src="${escapeHtml(resource.embedUrl)}#page=1&zoom=page-width" title="${escapeHtml(resource.title)}"></iframe></div>`
                : resource.mediaType === "html"
                  ? `<div class="pdf-frame-wrap"><iframe class="pdf-frame" src="${escapeHtml(resource.embedUrl)}" title="${escapeHtml(resource.title)}"></iframe></div>`
                  : `<div class="video-wrap"><video class="theory-video" controls preload="metadata"><source src="${escapeHtml(resource.embedUrl)}" type="video/mp4"></video></div>`
              }
            </div>
          </section>
        `;
        }).join("")}
      </div>
    </article>
  `;
}

function renderReviewList() {
  return state.peerReview.assignments.map((assignment) => `
    <button class="review-pill ${assignment.id === state.selectedReviewId ? "is-active" : ""}" data-action="select-review" data-review-id="${assignment.id}">
      <span>${escapeHtml(assignment.reviewee?.displayName || "Peer")}</span>
      <small>${escapeHtml(`${assignment.status} · ${assignment.reviewee?.lessonPortfolio?.completedEntries || 0}/${assignment.reviewee?.lessonPortfolio?.totalEntries || 0} Passagen`)}</small>
    </button>
  `).join("");
}

function renderCriterionFields(review) {
  return state.peerReview.criteria.map((criterion) => {
    const value = review.criteria.find((entry) => entry.id === criterion.id) || { id: criterion.id, level: "", comment: "" };
    return `
      <article class="criterion-card">
        <div>
          <strong>${escapeHtml(criterion.label)}</strong>
          <p>${escapeHtml(criterion.prompt)}</p>
        </div>
        <label>
          Einschätzung
          <select name="criterion-level" data-criterion-id="${criterion.id}">
            <option value="">bitte wählen</option>
            ${reviewLevels.map((level) => `<option value="${level.value}" ${value.level === level.value ? "selected" : ""}>${escapeHtml(level.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          Kommentar
          <textarea name="criterion-comment" data-criterion-id="${criterion.id}" placeholder="Woran sieht die Person deine Einschätzung konkret im Text?">${escapeHtml(value.comment)}</textarea>
        </label>
      </article>
    `;
  }).join("");
}

function renderPeerPortfolio(review) {
  const entries = review.reviewee?.lessonPortfolio?.entries || [];
  if (!entries.length) {
    return '<div class="empty-box">Für diese Lektion liegt von dieser Person noch kein bearbeiteter Passagenausschnitt vor.</div>';
  }

  return entries.map((entry) => `
    <article class="peer-entry-card">
      <div class="peer-entry-head">
        <div>
          <div class="eyebrow">${escapeHtml(entry.pageHint)}</div>
          <h3>${escapeHtml(entry.title)}</h3>
        </div>
        <span class="status-badge">${escapeHtml(entry.passageLabel)}</span>
      </div>
      ${entry.observation ? `<p><strong>Beobachtung:</strong> ${escapeHtml(entry.observation)}</p>` : ""}
      ${entry.evidence ? `<p><strong>Textanker:</strong> ${escapeHtml(entry.evidence)}</p>` : ""}
      ${entry.interpretation ? `<p><strong>Deutung:</strong> ${escapeHtml(entry.interpretation)}</p>` : ""}
      ${entry.theory ? `<p><strong>Theoriebezug:</strong> ${escapeHtml(entry.theory)}</p>` : ""}
      ${entry.revision ? `<p><strong>Revision:</strong> ${escapeHtml(entry.revision)}</p>` : ""}
    </article>
  `).join("");
}

function renderPeerReviewPanel() {
  if (mode !== "open" || !state.peerReview?.enabled) {
    return "";
  }

  if (!state.peerReview.assignments?.length) {
    return `
      <section class="panel review-panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Peer Review</div>
            <h2>Derzeit keine Zuweisungen</h2>
          </div>
        </div>
        <div class="empty-box">Sobald weitere Schüler*innen in dieser Klasse arbeiten oder die Lehrkraft Peer Review aktiviert, erscheinen hier deine Review-Aufträge.</div>
      </section>
    `;
  }

  const review = currentReviewAssignment();
  const reviewStatusLabel = {
    idle: "",
    saving: "speichert Review ...",
    saved: "Review gespeichert",
    error: "Review konnte nicht gespeichert werden"
  }[state.reviewSaveStatus] || "";

  return `
    <section class="panel review-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Peer Review</div>
          <h2>Zugewiesene Rückmeldungen</h2>
        </div>
        <span class="status-badge">${escapeHtml(`${state.peerReview.stats.completedAssignedCount}/${state.peerReview.stats.assignedCount} abgeschlossen`)}</span>
      </div>

      <div class="notice-box">
        <strong>Arbeitsrahmen</strong>
        <p>${escapeHtml(state.peerReview.instructions)}</p>
        <p>${escapeHtml(`Review-Lektion: ${lessonSets.find((lesson) => lesson.id === state.peerReview.lessonId)?.title || state.peerReview.lessonId}`)}</p>
      </div>

      <div class="review-layout">
        <aside class="review-sidebar">
          <div class="review-pill-list">
            ${renderReviewList()}
          </div>
        </aside>

        <div class="review-main">
          <div class="panel-head">
            <div>
              <div class="eyebrow">Peer-Arbeit</div>
              <h2>${escapeHtml(review.reviewee?.displayName || "Peer")}</h2>
            </div>
            <span class="status-badge">${escapeHtml(review.status)}</span>
          </div>

          <div class="review-meta-grid">
            <div class="status-card">
              <span class="eyebrow">Bearbeitete Passagen</span>
              <strong>${escapeHtml(`${review.reviewee?.lessonPortfolio?.completedEntries || 0}/${review.reviewee?.lessonPortfolio?.totalEntries || 0}`)}</strong>
            </div>
            <div class="status-card">
              <span class="eyebrow">Zuletzt aktualisiert</span>
              <strong>${escapeHtml(review.reviewee?.updatedAt ? new Date(review.reviewee.updatedAt).toLocaleString("de-CH") : "-")}</strong>
            </div>
          </div>

          <div class="peer-portfolio">
            ${renderPeerPortfolio(review)}
          </div>

          <form id="peer-review-form" class="review-form">
            <input type="hidden" name="reviewId" value="${review.id}">
            <div class="criteria-grid">
              ${renderCriterionFields(review)}
            </div>

            <label>
              Wichtiger Textanker aus der besprochenen Arbeit
              <textarea name="quotedEvidence" placeholder="Welche Formulierung oder welches Signalwort soll in der Überarbeitung unbedingt erhalten oder präzisiert werden?">${escapeHtml(review.quotedEvidence || "")}</textarea>
            </label>
            <label>
              Stärken
              <textarea name="strengths" placeholder="Was gelingt der Person textnah oder deutungsstark bereits gut?">${escapeHtml(review.strengths || "")}</textarea>
            </label>
            <label>
              Nächste Schritte
              <textarea name="nextSteps" placeholder="Welche konkrete Überarbeitung würdest du als Nächstes empfehlen?">${escapeHtml(review.nextSteps || "")}</textarea>
            </label>
            <label>
              Rückfrage
              <textarea name="question" placeholder="Welche Rückfrage hilft der Person, ihre Deutung weiter zu schärfen?">${escapeHtml(review.question || "")}</textarea>
            </label>

            <div class="row">
              <button type="submit" data-submit-status="draft">Entwurf speichern</button>
              <button type="submit" class="button secondary" data-submit-status="submitted">Review abschicken</button>
              ${reviewStatusLabel ? `<span class="inline-status">${escapeHtml(reviewStatusLabel)}</span>` : ""}
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderTopStatus() {
  const lesson = currentLesson();
  const progress = progressForCurrentLesson();
  const saveLabel = {
    idle: "bereit",
    saving: "speichert ...",
    saved: state.lastSavedAt ? `gespeichert · ${new Date(state.lastSavedAt).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}` : "gespeichert",
    error: "Speicherfehler"
  }[state.saveStatus] || "bereit";

  return `
    <section class="status-strip">
      <div class="status-card">
        <span class="eyebrow">Klasse</span>
        <strong>${escapeHtml(state.classroom?.name || "-")}</strong>
      </div>
      <div class="status-card">
        <span class="eyebrow">Bearbeitung</span>
        <strong>${escapeHtml(state.student?.displayName || "-")}</strong>
      </div>
      <div class="status-card">
        <span class="eyebrow">Aktive Lektion</span>
        <strong>${escapeHtml(lesson?.title || "-")}</strong>
      </div>
      <div class="status-card">
        <span class="eyebrow">Fortschritt</span>
        <strong>${escapeHtml(progress ? `${progress.completedEntries}/${progress.totalEntries}` : "-")}</strong>
      </div>
      <div class="status-card">
        <span class="eyebrow">Peer Reviews</span>
        <strong>${escapeHtml(state.peerReview?.stats ? `${state.peerReview.stats.completedAssignedCount}/${state.peerReview.stats.assignedCount}` : "-")}</strong>
      </div>
      <div class="status-card">
        <span class="eyebrow">Status</span>
        <strong>${escapeHtml(saveLabel)}</strong>
      </div>
    </section>
  `;
}

function renderProgressBox() {
  return `
    <div class="progress-box">
      ${state.progress?.lessonProgress?.map((lesson) => `
        <div class="progress-row">
          <span>${escapeHtml(lesson.title)}</span>
          <strong>${escapeHtml(`${lesson.completedEntries}/${lesson.totalEntries}`)}</strong>
        </div>
      `).join("") || ""}
    </div>
  `;
}

function renderParcoursExportPanel() {
  const complete = isParcoursComplete();
  const answered = state.progress?.completedEntries || 0;
  const total = state.progress?.totalEntries || 0;

  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Parcours-Export</div>
          <h2>${complete ? "Parcours abgeschlossen" : "Parcours dokumentieren"}</h2>
        </div>
        <button class="button secondary" data-action="export-notes">${complete ? "Fragen und Antworten exportieren" : "Zwischenstand exportieren"}</button>
      </div>
      <div class="notice-box">
        <strong>${complete ? "Alle Stationen sind bearbeitet." : "Export bereits jetzt möglich."}</strong>
        <p>${escapeHtml(`Der Export enthält alle Lektionen, Fokusfragen und die dazu eingetragenen Antworten. Aktuell sind ${answered} von ${total} Passagen bearbeitet.`)}</p>
      </div>
    </section>
  `;
}

function render() {
  if (state.loading) {
    app.innerHTML = '<main class="reader-shell"><section class="panel"><h1>Lädt ...</h1><p>Arbeitsumgebung wird vorbereitet.</p></section></main>';
    return;
  }

  if (state.error && !state.ready) {
    app.innerHTML = `<main class="reader-shell"><section class="panel"><h1>Reader nicht verfügbar</h1><p>${escapeHtml(state.error)}</p></section></main>`;
    return;
  }

  ensureSelection();
  const module = currentModule();
  const entry = currentEntry();
  const lesson = currentLesson();

  app.innerHTML = `
    <main class="reader-shell">
      <section class="hero">
        <div>
          <div class="eyebrow">Daniel Kehlmann · Die Reise der Verlorenen · ${escapeHtml(modeLabel)}</div>
          <h1>Engmaschiges PDF-Lesetool für das gesamte Drama</h1>
          <p>
            ${mode === "seb"
              ? "Diese SEB-Fassung arbeitet jetzt mit fünfzehn eng geführten Lektionen. Dazu kommen die historische Vertiefung zu Évian, die USHMM-Dossiers zur Reise, zur Rückkehr nach Europa und zu den Kriegsschicksalen der Passagiere, das Video von Gerda Blachmann, der Deutschlandfunk-Beitrag mit Audio-Link, der NDR-Überblick, Fritz Buffs Reisebericht mit Bildseiten und Soundfile, Susanne Heim sowie die Theorieeinheiten zu Kehlmanns eigener Haltung und zu epischem und dokumentarischem Theater, jeweils mit direkter Passageführung im PDF."
              : "Das Drama ist vollständig integriert. Links steuerst du fünfzehn engere Lektionssets und Theorie-Linsen, darunter die historische Vertiefung zu Évian, die USHMM-Dossiers zur Reise, zur Rückkehr nach Europa und zu den Kriegsschicksalen der Passagiere, das Video von Gerda Blachmann, den Deutschlandfunk-Beitrag mit Audio-Link, den NDR-Überblick, Fritz Buffs Reisebericht mit Bildseiten und Soundfile, Susanne Heim sowie die Theorieeinheiten zu Kehlmanns persönlicher Involvierung und zu epischem und dokumentarischem Theater. In der Mitte springst du direkt zu den relevanten PDF-Passagen, rechts verbindest du szenische Beobachtung, Theoriebezug, Überarbeitung und Peer Review."}
          </p>
        </div>
        <div class="hero-actions">
          <span class="status-badge">${escapeHtml(modeLabel)}</span>
          <span class="status-badge">15 Lektionen</span>
          <span class="status-badge">${escapeHtml(lesson.reviewFocus)}</span>
          ${mode === "open" ? '<a class="button secondary" href="/auth/logout">Abmelden</a>' : ""}
        </div>
      </section>

      ${renderTopStatus()}

      ${state.error ? `<section class="panel"><p>${escapeHtml(state.error)}</p></section>` : ""}

      <section class="layout">
        <aside class="panel sidebar">
          <div class="panel-head">
            <div>
              <div class="eyebrow">${escapeHtml(starterPrompt.title)}</div>
              <h2>Textpfad</h2>
            </div>
          </div>
          <ul class="prompt-list">${renderPromptList()}</ul>

          <section class="lesson-box">
            <div class="eyebrow">Lektionssets</div>
            <div class="lesson-list">
              ${renderLessonRail()}
            </div>
            <div class="sidebar-task">
              <strong>${escapeHtml(lesson.title)}</strong>
              <p>${escapeHtml(mode === "seb" ? lesson.sebPrompt : lesson.summary)}</p>
              <p>${escapeHtml(`Seitenkorridor: ${pageRangeForLesson(lesson)} · ${entriesForLesson(lesson).length} Passagen`)}</p>
            </div>
          </section>

          ${renderProgressBox()}
          <div class="module-list">${renderSidebar()}</div>

          <div class="sidebar-task">
            <strong>${escapeHtml(module.title)}</strong>
            <p>${escapeHtml(module.task)}</p>
          </div>

          <section class="theory-sidebar">
            <div class="eyebrow">Theorie-Ressourcen</div>
            <div class="theory-pill-list">
              ${renderTheorySelector(module, entry)}
            </div>
          </section>
        </aside>

        ${renderPdfPanel(entry, module)}

        <section class="content-column">
          <article class="panel scene-panel">
            <div class="panel-head">
              <div>
                <div class="eyebrow">${escapeHtml(module.lens)}</div>
                <h2>${escapeHtml(entry.title)}</h2>
              </div>
              <span class="status-badge">${escapeHtml(entry.pageHint)}</span>
            </div>

            <div class="entry-tabs">${renderEntryTabs(module)}</div>
            <div class="scene-card">
              <h3>${escapeHtml(entry.passageLabel)}</h3>
              <p>${escapeHtml(entry.context)}</p>
              <div class="signal-grid">${renderSignalWords(entry)}</div>
              <div class="prompt-box">
                <strong>Fokusfragen</strong>
                ${renderFocusQuestions(entry)}
              </div>
              <div class="writing-frame-box">
                <strong>Satzstarter</strong>
                <p>${escapeHtml(entry.writingFrame)}</p>
              </div>
            </div>
          </article>

          ${renderTheoryPanel(module, entry)}
          ${renderResourceAssignmentsPanel()}
          ${renderNotebook(entry)}
          ${renderSebFeedbackPanel()}
          ${renderPeerReviewPanel()}
          ${renderParcoursExportPanel()}
        </section>
      </section>
    </main>
  `;
}

function updateNoteField(field, value) {
  const entry = currentEntry();
  state.notes[entry.id] = {
    ...noteForEntry(entry.id),
    [field]: value
  };
  state.saveStatus = "idle";
}

function updateNoteArrayField(field, index, value) {
  const entry = currentEntry();
  const note = noteForEntry(entry.id);
  const nextValues = Array.isArray(note[field]) ? [...note[field]] : [];
  nextValues[index] = value;
  state.notes[entry.id] = {
    ...note,
    [field]: nextValues
  };
  state.saveStatus = "idle";
}

function updateTheoryAnswer(section, index, value) {
  const entry = currentEntry();
  const theory = currentTheory();
  const note = noteForEntry(entry.id);
  const stored = note.theoryResponses?.[theory.id] || {};
  const nextSection = Array.isArray(stored[section]) ? [...stored[section]] : [];
  nextSection[index] = value;

  state.notes[entry.id] = {
    ...note,
    theoryResponses: {
      ...(note.theoryResponses || {}),
      [theory.id]: {
        ...stored,
        [section]: nextSection
      }
    }
  };
  state.saveStatus = "idle";
}

function updateResourceResponse(resourceId, field, index, value) {
  const lesson = currentLesson();
  const key = resourceResponseKey(lesson.id, resourceId);
  const current = state.notes[key] || {};

  if (field === "questionAnswers") {
    const nextAnswers = Array.isArray(current.questionAnswers) ? [...current.questionAnswers] : [];
    nextAnswers[index] = value;
    state.notes[key] = {
      ...current,
      questionAnswers: nextAnswers
    };
  } else {
    state.notes[key] = {
      ...current,
      [field]: value
    };
  }

  state.saveStatus = "idle";
}

function updateLiveDocumentation() {
  const entry = currentEntry();
  const theory = currentTheory();
  if (entry && theory) {
    const focusAnswers = focusAnswersFor(entry);
    const theoryResponses = theoryResponseFor(entry, theory);
    const documentation = documentationStatusForEntry(entry, theory);
    const summary = document.querySelector('[data-doc-summary="entry"]');
    const missing = document.querySelector('[data-doc-missing="entry"]');
    const focusCount = document.querySelector('[data-doc-count="focus"]');
    const guidingCount = document.querySelector('[data-doc-count="guiding"]');
    const transferCount = document.querySelector('[data-doc-count="transfer"]');
    const entryBox = summary?.closest(".documentation-status-box");

    if (summary) {
      summary.textContent = `Dokumentationsstand: ${documentation.completed}/${documentation.total}`;
    }

    if (missing) {
      missing.textContent = documentation.missing.length
        ? `Noch offen: ${documentation.missing.join(" · ")}`
        : "Alle Fokusfragen, Leitfragen und Transferfragen sind schriftlich dokumentiert.";
    }

    if (entryBox) {
      entryBox.classList.toggle("is-warning", Boolean(documentation.missing.length));
      entryBox.classList.toggle("is-complete", !documentation.missing.length);
    }

    if (focusCount) {
      focusCount.textContent = `${focusAnswers.filter((value) => trimmed(value)).length}/${entry.prompts.length}`;
    }

    if (guidingCount) {
      guidingCount.textContent = `${theoryResponses.guidingAnswers.filter((value) => trimmed(value)).length}/${theory.questions.length}`;
    }

    if (transferCount) {
      transferCount.textContent = `${theoryResponses.transferAnswers.filter((value) => trimmed(value)).length}/${transferPromptsFor(entry, theory).length}`;
    }
  }

  for (const assignment of resourceAssignmentsForLesson()) {
    const documentation = documentationStatusForAssignment(assignment);
    const box = document.querySelector(`[data-doc-box="resource"][data-resource-id="${assignment.resourceId}"]`);
    const summary = box?.querySelector('[data-doc-summary="resource"]');
    const missing = box?.querySelector('[data-doc-missing="resource"]');
    const count = document.querySelector(`[data-doc-count="resource-questions"][data-resource-id="${assignment.resourceId}"]`);
    const response = resourceResponseForAssignment(assignment);

    if (summary) {
      summary.textContent = `Dokumentationsstand: ${documentation.completed}/${documentation.total}`;
    }

    if (missing) {
      missing.textContent = documentation.missing.length
        ? `Noch offen: ${documentation.missing.join(" · ")}`
        : "Der Ressourcen-Auftrag ist vollständig schriftlich dokumentiert.";
    }

    if (box) {
      box.classList.toggle("is-warning", Boolean(documentation.missing.length));
      box.classList.toggle("is-complete", !documentation.missing.length);
    }

    if (count) {
      count.textContent = `${response.questionAnswers.filter((value) => trimmed(value)).length}/${assignment.questions.length}`;
    }
  }
}

function updateReviewField(field, value) {
  const review = currentReviewAssignment();
  if (!review) {
    return;
  }

  review[field] = value;
  state.reviewSaveStatus = "idle";
}

function updateReviewCriterion(criterionId, field, value) {
  const review = currentReviewAssignment();
  if (!review) {
    return;
  }

  const current = review.criteria.find((entry) => entry.id === criterionId);
  if (current) {
    current[field] = value;
  }
  state.reviewSaveStatus = "idle";
}

async function submitReview(status) {
  const review = currentReviewAssignment();
  if (!review) {
    return;
  }

  state.reviewSaveStatus = "saving";
  render();

  try {
    const response = await fetch(`/reader-api/reviews/${review.id}`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status,
        criteria: review.criteria,
        quotedEvidence: review.quotedEvidence,
        strengths: review.strengths,
        nextSteps: review.nextSteps,
        question: review.question
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "Peer Review konnte nicht gespeichert werden.");
    }

    const payload = await response.json();
    applyBootstrap(payload);
    state.reviewSaveStatus = "saved";
    render();
  } catch (error) {
    state.reviewSaveStatus = "error";
    state.error = error.message;
    render();
  }
}

function exportNotes() {
  const markdown = buildParcoursMarkdown({
    modeLabel,
    classroomName: state.classroom?.name || "-",
    studentName: state.student?.displayName || "-",
    complete: isParcoursComplete(),
    completedEntries: state.progress?.completedEntries || 0,
    totalEntries: state.progress?.totalEntries || 0,
    lessons: availableLessons().map((lesson) => ({
      title: lesson.title,
      summary: lesson.summary,
      reviewFocus: lesson.reviewFocus,
      pageRange: pageRangeForLesson(lesson),
      resources: resourceAssignmentsForLesson(lesson).map((assignment) => {
        const response = resourceResponseForAssignment(assignment, lesson);
        const documentation = documentationStatusForAssignment(assignment, lesson);

        return {
          title: assignment.title,
          sourceTitle: assignment.resource.sourceTitle,
          summary: assignment.summary,
          task: assignment.task,
          taskResponse: response.taskResponse,
          questions: assignment.questions.map((question, index) => ({
            prompt: question,
            answer: response.questionAnswers[index] || ""
          })),
          documentation
        };
      }),
      entries: entriesForLesson(lesson).map((entry) => {
        const note = noteForEntry(entry.id);
        const module = entryIndex.get(entry.id)?.module;
        const exportTheories = theoryOptionsFor(module, entry);
        const documentationTheory = exportTheories.find((resource) => resource.id === state.theoryId) || exportTheories[0];
        const theorySections = theoryIdsFor(module, entry)
          .map((theoryId) => theoryResources.find((resource) => resource.id === theoryId))
          .filter(Boolean)
          .map((theory) => {
            const stored = note.theoryResponses?.[theory.id] || {};
            const transferPrompts = transferPromptsFor(entry, theory);

            return {
              title: theory.title,
              sourceTitle: theory.sourceTitle,
              guidingQuestions: theory.questions.map((question, index) => ({
                prompt: question,
                answer: stored.guidingAnswers?.[index] || ""
              })),
              transferQuestions: transferPrompts.map((prompt, index) => ({
                prompt,
                answer: stored.transferAnswers?.[index] || ""
              }))
            };
          });

        return {
          title: entry.title,
          moduleTitle: module?.title || "-",
          pageHint: entry.pageHint,
          passageLabel: entry.passageLabel,
          context: entry.context,
          prompts: entry.prompts,
          signalWords: entry.signalWords,
          writingFrame: entry.writingFrame,
          focusAnswers: entry.prompts.map((prompt, index) => ({
            prompt,
            answer: note.focusAnswers?.[index] || ""
          })),
          theorySections,
          documentation: documentationTheory ? documentationStatusForEntry(entry, documentationTheory) : null,
          answers: {
            observation: note.observation || "-",
            evidence: note.evidence || "-",
            interpretation: note.interpretation || "-",
            theory: note.theory || "-",
            revision: note.revision || "-"
          }
        };
      })
    }))
  });

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `die-reise-der-verlorenen-parcours-${mode}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const action = target.dataset.action;

  if (action === "select-lesson" && !target.disabled) {
    state.lessonId = target.dataset.lessonId;
    ensureSelection();
    render();
    queueSave();
    queueSebFeedback();
  }

  if (action === "select-module") {
    state.moduleId = target.dataset.moduleId;
    state.entryId = currentModule().entries[0].id;
    ensureSelection();
    render();
    queueSave();
    queueSebFeedback();
  }

  if (action === "select-entry") {
    state.entryId = target.dataset.entryId;
    state.moduleId = entryIndex.get(target.dataset.entryId)?.module.id || state.moduleId;
    ensureSelection();
    render();
    queueSave();
    queueSebFeedback();
  }

  if (action === "select-theory") {
    state.theoryId = target.dataset.theoryId;
    render();
    queueSave();
    queueSebFeedback();
  }

  if (action === "toggle-signal") {
    const entry = currentEntry();
    const word = target.dataset.word;
    const note = noteForEntry(entry.id);
    const tokens = note.evidence
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);

    const nextTokens = tokens.includes(word)
      ? tokens.filter((token) => token !== word)
      : [...tokens, word];

    updateNoteField("evidence", nextTokens.join(", "));
    render();
    queueSave();
    queueSebFeedback();
  }

  if (action === "select-review") {
    state.selectedReviewId = target.dataset.reviewId;
    state.reviewSaveStatus = "idle";
    render();
  }

  if (action === "export-notes") {
    exportNotes();
  }

  if (action === "refresh-seb-feedback") {
    requestSebFeedback({ showLoading: true, force: true });
  }
});

document.addEventListener("input", (event) => {
  const noteForm = event.target.closest("#note-form");
  if (noteForm) {
    if (event.target.dataset.noteArray) {
      updateNoteArrayField(event.target.dataset.noteArray, Number(event.target.dataset.index || 0), event.target.value);
    } else if (event.target.dataset.noteTheorySection) {
      updateTheoryAnswer(event.target.dataset.noteTheorySection, Number(event.target.dataset.index || 0), event.target.value);
    } else {
      updateNoteField(event.target.name, event.target.value);
    }
    queueSave();
    queueSebFeedback();
    updateLiveDocumentation();
    return;
  }

  if (event.target.dataset.resourceId) {
    updateResourceResponse(
      event.target.dataset.resourceId,
      event.target.dataset.resourceField,
      Number(event.target.dataset.index || 0),
      event.target.value
    );
    queueSave();
    updateLiveDocumentation();
    return;
  }

  const reviewForm = event.target.closest("#peer-review-form");
  if (reviewForm) {
    if (event.target.name === "criterion-level") {
      updateReviewCriterion(event.target.dataset.criterionId, "level", event.target.value);
    } else if (event.target.name === "criterion-comment") {
      updateReviewCriterion(event.target.dataset.criterionId, "comment", event.target.value);
    } else {
      updateReviewField(event.target.name, event.target.value);
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "peer-review-form") {
    return;
  }

  event.preventDefault();
  const submitter = event.submitter;
  const status = submitter?.dataset.submitStatus || "draft";
  submitReview(status);
});

async function init() {
  render();

  try {
    const payload = await fetchBootstrap();
    applyBootstrap(payload);
    state.ready = true;
    state.loading = false;
    state.error = "";
    ensureSelection();
    render();
    if (mode === "seb") {
      await requestSebFeedback({ showLoading: true, force: true });
    }
  } catch (error) {
    state.loading = false;
    state.ready = false;
    state.error = error.message;
    render();
  }
}

init();
