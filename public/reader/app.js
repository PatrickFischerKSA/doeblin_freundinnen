import { readerModules, starterPrompt } from "./data.js";

const mode = window.THIEL_READER_MODE || "open";
const modeLabel = window.THIEL_READER_MODE_LABEL || "Offene Version";
const storageKey = `thiel-reader-${mode}`;
const app = document.body;

const defaultState = {
  moduleId: readerModules[0].id,
  entryId: readerModules[0].entries[0].id,
  notes: {}
};

const state = loadState();

function loadState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return structuredClone(defaultState);
    }

    return {
      ...structuredClone(defaultState),
      ...JSON.parse(raw)
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState() {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function currentModule() {
  return readerModules.find((module) => module.id === state.moduleId) || readerModules[0];
}

function currentEntry() {
  return currentModule().entries.find((entry) => entry.id === state.entryId) || currentModule().entries[0];
}

function noteForEntry(entryId) {
  return state.notes[entryId] || {
    observation: "",
    evidence: "",
    interpretation: "",
    revision: ""
  };
}

function completion(module) {
  const completed = module.entries.filter((entry) => {
    const note = noteForEntry(entry.id);
    return note.observation.trim() || note.interpretation.trim();
  }).length;

  return `${completed}/${module.entries.length}`;
}

function feedbackFor(note, module) {
  const body = `${note.observation} ${note.interpretation}`.toLowerCase();
  const evidence = note.evidence.toLowerCase();
  const signals = ["zeigt", "verdeutlicht", "deutet", "wirkt", "weil"];
  const summarySignals = ["dann", "danach", "passiert", "anschließend"];
  const positives = [];
  const steps = [];

  if (evidence.trim().length >= 8) {
    positives.push("Du arbeitest bereits mit konkreten textnahen Signalen.");
  } else {
    steps.push("Ergänze mindestens ein Signalwort oder eine kurze Wortgruppe aus der Szene.");
  }

  if (signals.some((signal) => body.includes(signal))) {
    positives.push("Deine Notiz enthält bereits eine deutende Begründung.");
  } else {
    steps.push("Formuliere deutlicher, was die Stelle zeigt oder andeutet.");
  }

  if (summarySignals.some((signal) => body.includes(signal))) {
    steps.push("Achte darauf, nicht nur den Ablauf zu erzählen, sondern die sprachliche Wirkung zu erklären.");
  }

  if (module.lens && !body.includes(module.lens.toLowerCase().split(",")[0])) {
    steps.push(`Binde deine Beobachtung noch stärker an die Linse des Moduls: ${module.lens.toLowerCase()}.`);
  }

  if (!steps.length) {
    steps.push("Die Notiz ist schon tragfähig. Präzisiere im nächsten Schritt noch die Gesamtwirkung der Szene.");
  }

  return { positives, steps };
}

function renderSidebar() {
  return readerModules.map((module) => `
    <button class="module-pill ${module.id === state.moduleId ? "is-active" : ""}" data-action="select-module" data-module-id="${module.id}">
      <span>${escapeHtml(module.title)}</span>
      <strong>${completion(module)}</strong>
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

function renderNotebook(entry) {
  const note = noteForEntry(entry.id);
  const feedback = feedbackFor(note, currentModule());

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
          <textarea name="observation" placeholder="Was fällt an Raum, Figur, Perspektive oder Stimmung auf?">${escapeHtml(note.observation)}</textarea>
        </label>
        <label>
          Signalwörter / Wortlaut
          <textarea name="evidence" placeholder="Signalwörter oder kurze Wortgruppen aus der Szene">${escapeHtml(note.evidence)}</textarea>
        </label>
        <label>
          Deutung
          <textarea name="interpretation" placeholder="Was zeigt diese Stelle? Welche Wirkung entsteht?">${escapeHtml(note.interpretation)}</textarea>
        </label>
        <label>
          Revision / nächster Schritt
          <textarea name="revision" placeholder="Was würdest du nach Feedback noch schärfen?">${escapeHtml(note.revision)}</textarea>
        </label>
      </form>

      <div class="feedback-box">
        <h3>Arbeitsfeedback</h3>
        <div class="feedback-columns">
          <div>
            <strong>Stärken</strong>
            <ul>${feedback.positives.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>Noch keine textnahe Stärke sichtbar.</li>"}</ul>
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

function render() {
  const module = currentModule();
  const entry = currentEntry();

  app.innerHTML = `
    <main class="reader-shell">
      <section class="hero">
        <div>
          <div class="eyebrow">Bahnwärter Thiel · ${escapeHtml(modeLabel)}</div>
          <h1>Konkretes Lesetool für textnahe Arbeit</h1>
          <p>
            Kuratierte Szenen, Signalwörter und ein lokales Notizbuch für Close Reading.
            Die Notizen bleiben im Browser erhalten und lassen sich am Ende als Markdown sichern.
          </p>
        </div>
        <div class="hero-actions">
          <span class="status-badge">${escapeHtml(modeLabel)}</span>
          ${mode === "open" ? '<a class="button secondary" href="/auth/logout">Passwort zurücksetzen</a>' : ""}
        </div>
      </section>

      <section class="layout">
        <aside class="panel sidebar">
          <div class="panel-head">
            <div>
              <div class="eyebrow">${escapeHtml(starterPrompt.title)}</div>
              <h2>Module</h2>
            </div>
          </div>
          <ul class="prompt-list">${renderPromptList()}</ul>
          <div class="module-list">${renderSidebar()}</div>
        </aside>

        <section class="content-column">
          <article class="panel scene-panel">
            <div class="panel-head">
              <div>
                <div class="eyebrow">${escapeHtml(module.lens)}</div>
                <h2>${escapeHtml(module.title)}</h2>
              </div>
              <span class="status-badge">${escapeHtml(module.briefing)}</span>
            </div>

            <p class="task-callout"><strong>Arbeitsauftrag:</strong> ${escapeHtml(module.task)}</p>
            <div class="entry-tabs">${renderEntryTabs(module)}</div>
            <div class="scene-card">
              <div class="scene-meta">
                <span class="status-badge">${escapeHtml(entry.pageHint)}</span>
                <span class="status-badge">Signalwörter statt Langzitat</span>
              </div>
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.context)}</p>
              <div class="signal-grid">${renderSignalWords(entry)}</div>
              <div class="prompt-box">
                <strong>Fokusfrage</strong>
                <p>${escapeHtml(entry.prompt)}</p>
              </div>
            </div>
          </article>

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
  persistState();
}

function exportNotes() {
  const lines = [
    `# Bahnwärter Thiel Lesetool`,
    ``,
    `Modus: ${modeLabel}`,
    ``
  ];

  for (const module of readerModules) {
    lines.push(`## ${module.title}`);
    lines.push(module.task);
    lines.push("");

    for (const entry of module.entries) {
      const note = noteForEntry(entry.id);
      lines.push(`### ${entry.title}`);
      lines.push(`Seitenhinweis: ${entry.pageHint}`);
      lines.push(`Kontext: ${entry.context}`);
      lines.push(`Signalwörter: ${note.evidence || entry.signalWords.join(", ")}`);
      lines.push(`Beobachtung: ${note.observation || "-"}`);
      lines.push(`Deutung: ${note.interpretation || "-"}`);
      lines.push(`Revision: ${note.revision || "-"}`);
      lines.push("");
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

  if (action === "select-module") {
    state.moduleId = target.dataset.moduleId;
    state.entryId = currentModule().entries[0].id;
    persistState();
    render();
  }

  if (action === "select-entry") {
    state.entryId = target.dataset.entryId;
    persistState();
    render();
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
});

render();
