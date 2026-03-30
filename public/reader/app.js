import { pdfSource, readerModules, starterPrompt, theoryResources, lessonSets } from "./data.js";

const mode = window.THIEL_READER_MODE || "open";
const modeLabel = window.THIEL_READER_MODE_LABEL || "Offene Version";
const config = window.THIEL_READER_CONFIG || {};
const app = document.body;

const defaultState = {
  ready: false,
  loading: true,
  error: "",
  classroom: null,
  student: null,
  progress: null,
  lessonId: config.forcedLessonId || lessonSets[0].id,
  moduleId: readerModules[0].id,
  entryId: readerModules[0].entries[0].id,
  theoryId: theoryResources[0].id,
  notes: {},
  saveStatus: "idle",
  lastSavedAt: ""
};

const state = structuredClone(defaultState);
let saveTimer = null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fetchBootstrap() {
  const response = await fetch("/reader-api/bootstrap", { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error("Die Reader-Sitzung konnte nicht geladen werden.");
  }
  return response.json();
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
    state.progress = payload.progress;
    state.lastSavedAt = payload.work.updatedAt;
    state.saveStatus = "saved";
    render();
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

function modulesForLesson(lesson = currentLesson()) {
  return lesson.moduleIds
    .map((moduleId) => readerModules.find((module) => module.id === moduleId))
    .filter(Boolean);
}

function currentModule() {
  return modulesForLesson().find((module) => module.id === state.moduleId) || modulesForLesson()[0];
}

function currentEntry() {
  return currentModule()?.entries.find((entry) => entry.id === state.entryId) || currentModule()?.entries[0];
}

function theoryIdsFor(module = currentModule(), entry = currentEntry()) {
  const ids = [...(module?.relatedTheoryIds || []), ...(entry?.relatedTheoryIds || [])];
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

function noteForEntry(entryId) {
  return state.notes[entryId] || {
    observation: "",
    evidence: "",
    interpretation: "",
    theory: "",
    revision: ""
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

function transferPromptsFor(entry, theory) {
  return [
    `Beziehe "${entry.passageLabel}" gezielt auf ${theory.shortTitle.toLowerCase()} und sichere deine Aussage mit mindestens zwei Wörtern aus dem Text.`,
    ...theory.transferPrompts.slice(0, 2)
  ];
}

function feedbackFor(note, module, entry) {
  const body = `${note.observation} ${note.interpretation} ${note.theory}`.toLowerCase();
  const evidence = note.evidence.toLowerCase();
  const theory = note.theory.toLowerCase();
  const signals = ["zeigt", "verdeutlicht", "deutet", "wirkt", "weil"];
  const summarySignals = ["dann", "danach", "passiert", "anschließend"];
  const positives = [];
  const steps = [];
  const relatedTheories = theoryOptionsFor(module, entry);

  if (evidence.trim().length >= 8) {
    positives.push("Du arbeitest bereits mit konkreten Wortsignalen aus dem Text.");
  } else {
    steps.push("Ergänze ein oder zwei Wörter aus dem PDF-Wortlaut als präzisen Textanker.");
  }

  if (signals.some((signal) => body.includes(signal))) {
    positives.push("Deine Notiz enthält bereits eine deutende Begründung.");
  } else {
    steps.push("Formuliere deutlicher, was die Stelle zeigt, andeutet oder bewirkt.");
  }

  if (summarySignals.some((signal) => body.includes(signal))) {
    steps.push("Achte darauf, nicht nur den Ablauf zu erzählen, sondern die sprachliche Wirkung zu erklären.");
  }

  if (note.theory.trim().length >= 20) {
    positives.push("Du verknüpfst die Passage schon mit einer Theorie-Linse.");
  } else if (relatedTheories.length) {
    steps.push(`Ziehe zusätzlich eine Theorie-Linse heran: ${relatedTheories.map((resource) => resource.shortTitle).join(", ")}.`);
  }

  if (module.lens && !body.includes(module.lens.toLowerCase().split(",")[0])) {
    steps.push(`Binde deine Beobachtung noch stärker an die Linse des Moduls: ${module.lens.toLowerCase()}.`);
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

  if (!steps.length) {
    steps.push("Die Notiz ist schon tragfähig. Präzisiere im nächsten Schritt noch die Gesamtwirkung der Szene.");
  }

  return { positives, steps };
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
    return `
      <button class="lesson-pill ${lesson.id === state.lessonId ? "is-active" : ""}" data-action="select-lesson" data-lesson-id="${lesson.id}" ${mode === "seb" || config.forcedLessonId ? "disabled" : ""}>
        <span>${escapeHtml(lesson.title)}</span>
        <small>${escapeHtml(progress ? `${progress.completedEntries}/${progress.totalEntries}` : lesson.moduleIds.length + " Module")}</small>
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

function renderPassageNavigator(module) {
  return module.entries.map((entry) => `
    <button class="passage-card ${entry.id === state.entryId ? "is-active" : ""}" data-action="select-entry" data-entry-id="${entry.id}">
      <span class="passage-page">${escapeHtml(entry.pageHint)}</span>
      <strong>${escapeHtml(entry.passageLabel)}</strong>
      <span>${escapeHtml(entry.prompts[0])}</span>
    </button>
  `).join("");
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

  return `
    <section class="panel notebook">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Notizbuch</div>
          <h2>${escapeHtml(entry.title)}</h2>
        </div>
        <button class="button secondary" data-action="export-notes">Markdown exportieren</button>
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
      </form>

      <div class="feedback-box">
        <h3>Arbeitsfeedback</h3>
        <div class="feedback-columns">
          <div>
            <strong>Stärken</strong>
            <ul>${feedback.positives.length ? feedback.positives.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Noch keine textnahe Stärke sichtbar.</li>"}</ul>
          </div>
          <div>
            <strong>Nächste Schritte</strong>
            <ul>${feedback.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPdfPanel(entry, module) {
  return `
    <article class="panel pdf-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Text im PDF</div>
          <h2>${escapeHtml(entry.passageLabel)}</h2>
        </div>
        <div class="pdf-head-actions">
          <span class="status-badge">${escapeHtml(entry.pageHint)}</span>
          <a class="button secondary" href="${pdfUrlForEntry(entry)}" target="_blank" rel="noreferrer">PDF separat öffnen</a>
        </div>
      </div>

      <div class="pdf-focus-box">
        <strong>Arbeitsfokus</strong>
        <p>${escapeHtml(module.briefing)}</p>
      </div>

      <div class="passage-nav">
        ${renderPassageNavigator(module)}
      </div>

      <div class="pdf-frame-wrap">
        <iframe class="pdf-frame" src="${pdfUrlForEntry(entry)}" title="Bahnwärter Thiel PDF"></iframe>
      </div>
    </article>
  `;
}

function renderTheoryPanel(module, entry) {
  const theory = currentTheory();
  const transferPrompts = transferPromptsFor(entry, theory);

  return `
    <article class="panel theory-panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Theorie-Linse</div>
          <h2>${escapeHtml(theory.title)}</h2>
        </div>
        <a class="button secondary" href="${escapeHtml(theory.openUrl)}" target="_blank" rel="noreferrer">Video extern öffnen</a>
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
        <div class="video-wrap">
          <video class="theory-video" controls preload="metadata">
            <source src="${escapeHtml(theory.embedUrl)}" type="video/mp4">
          </video>
        </div>
        <p class="video-note">
          Falls das Video im Browser nicht direkt lädt, kannst du es jederzeit über den externen Link öffnen.
        </p>
      </div>
    </article>
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
          <div class="eyebrow">Bahnwärter Thiel · ${escapeHtml(modeLabel)}</div>
          <h1>Engmaschiges PDF-Lesetool für die ganze Novelle</h1>
          <p>
            ${mode === "seb"
              ? "Diese SEB-Fassung arbeitet mit einem klaren Lektionen-Set. Die Textpassagen und Theorie-Linsen sind auf die aktuelle Prüfungseinheit fokussiert."
              : "Der Text ist vollständig integriert. Links steuerst du den Textpfad und die Theorie-Linsen, in der Mitte liest du die Passage im PDF, rechts verbindest du Textbeobachtung, Theoriebezug und Überarbeitung."}
          </p>
        </div>
        <div class="hero-actions">
          <span class="status-badge">${escapeHtml(modeLabel)}</span>
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
          ${renderNotebook(entry)}
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

function exportNotes() {
  const lines = [
    "# Bahnwärter Thiel Lesetool",
    "",
    `Modus: ${modeLabel}`,
    `Klasse: ${state.classroom?.name || "-"}`,
    `Bearbeitung: ${state.student?.displayName || "-"}`,
    `Lektion: ${currentLesson().title}`,
    ""
  ];

  for (const lesson of availableLessons()) {
    lines.push(`## ${lesson.title}`);
    lines.push(lesson.summary);
    lines.push("");

    for (const module of modulesForLesson(lesson)) {
      lines.push(`### ${module.title}`);
      lines.push(module.task);
      lines.push("");

      for (const entry of module.entries) {
        const note = noteForEntry(entry.id);
        lines.push(`#### ${entry.title}`);
        lines.push(`Seite: ${entry.pageHint}`);
        lines.push(`Passage: ${entry.passageLabel}`);
        lines.push(`Kontext: ${entry.context}`);
        lines.push(`Signalwörter: ${note.evidence || entry.signalWords.join(", ")}`);
        lines.push(`Beobachtung: ${note.observation || "-"}`);
        lines.push(`Deutung: ${note.interpretation || "-"}`);
        lines.push(`Theoriebezug: ${note.theory || "-"}`);
        lines.push(`Revision: ${note.revision || "-"}`);
        lines.push("");
      }
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bahnwaerter-thiel-lesetool-${mode}.md`;
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
  }

  if (action === "select-module") {
    state.moduleId = target.dataset.moduleId;
    state.entryId = currentModule().entries[0].id;
    ensureSelection();
    render();
    queueSave();
  }

  if (action === "select-entry") {
    state.entryId = target.dataset.entryId;
    ensureSelection();
    render();
    queueSave();
  }

  if (action === "select-theory") {
    state.theoryId = target.dataset.theoryId;
    render();
    queueSave();
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
  }

  if (action === "export-notes") {
    exportNotes();
  }
});

document.addEventListener("input", (event) => {
  const form = event.target.closest("#note-form");
  if (!form) {
    return;
  }

  updateNoteField(event.target.name, event.target.value);
  queueSave();
});

async function init() {
  render();

  try {
    const payload = await fetchBootstrap();
    state.classroom = payload.classroom;
    state.student = payload.student;
    state.progress = payload.progress;
    state.notes = payload.work.notes || {};
    state.lessonId = config.forcedLessonId
      || (mode === "seb" ? payload.classroom.activeSebLessonId : payload.work.selectedLessonId)
      || state.lessonId;
    state.moduleId = payload.work.moduleId || state.moduleId;
    state.entryId = payload.work.entryId || state.entryId;
    state.theoryId = payload.work.theoryId || state.theoryId;
    state.lastSavedAt = payload.work.updatedAt || "";
    state.ready = true;
    state.loading = false;
    state.error = "";
    ensureSelection();
    render();
  } catch (error) {
    state.loading = false;
    state.ready = false;
    state.error = error.message;
    render();
  }
}

init();
