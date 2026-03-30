import {
  compareVersions,
  createAnnotation,
  createComment,
  createProject,
  createSubmissionReview,
  fetchBootstrap,
  requestFeedback,
  saveWorkspaceVersion,
  submitWorkspace,
  updateAnnotation
} from "./modules/api.js";
import {
  applyBootstrap,
  getSelectedAnnotation,
  getSelectedWorkspace,
  resetDraft,
  resetProjectDraft,
  state
} from "./modules/state.js";

const app = document.querySelector("#app");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function highlightQuote(content, quote) {
  if (!quote) {
    return escapeHtml(content);
  }

  const safeContent = escapeHtml(content);
  const safeQuote = escapeHtml(quote);
  const index = safeContent.toLowerCase().indexOf(safeQuote.toLowerCase());

  if (index < 0) {
    return safeContent;
  }

  return [
    safeContent.slice(0, index),
    `<span class="highlight">${safeContent.slice(index, index + safeQuote.length)}</span>`,
    safeContent.slice(index + safeQuote.length)
  ].join("");
}

function currentProject() {
  return state.bootstrap?.project || null;
}

function isTeacherView() {
  return ["teacher", "admin"].includes(state.bootstrap?.viewer?.role);
}

function renderMetrics() {
  return state.bootstrap.dashboard.cards.map((card) => `
    <article class="card metric metric-tone-${card.tone}">
      <div class="metric-label">${escapeHtml(card.label)}</div>
      <div class="metric-value">${escapeHtml(card.value)}</div>
    </article>
  `).join("");
}

function renderViewerPills() {
  return state.bootstrap.users.map((user) => `
    <button class="pill ${user.id === state.viewerId ? "is-active" : ""}" data-action="switch-viewer" data-viewer-id="${user.id}">
      ${escapeHtml(user.name)} · ${escapeHtml(user.role)}
    </button>
  `).join("");
}

function renderProjectPills() {
  return state.bootstrap.projects.map((project) => `
    <button class="pill ${project.id === state.selectedProjectId ? "is-active" : ""}" data-action="switch-project" data-project-id="${project.id}">
      ${escapeHtml(project.title)}
    </button>
  `).join("");
}

function renderWorkspacePills() {
  return state.bootstrap.workspaces.map((workspace) => `
    <button class="pill ${workspace.id === state.selectedWorkspaceId ? "is-active" : ""}" data-action="select-workspace" data-workspace-id="${workspace.id}">
      ${escapeHtml(workspace.title)}
    </button>
  `).join("");
}

function renderTaskList() {
  const currentWorkspace = getSelectedWorkspace();
  const ownTaskIds = new Set((currentWorkspace?.annotations || []).map((annotation) => annotation.taskId));

  if (!state.bootstrap.tasks.length) {
    return '<div class="empty">Für dieses Projekt gibt es noch keine Aufgaben.</div>';
  }

  return state.bootstrap.tasks.map((task) => `
    <article class="task-item">
      <div class="annotation-header">
        <strong>${escapeHtml(task.title)}</strong>
        <span class="badge">${ownTaskIds.has(task.id) ? "bearbeitet" : "offen"}</span>
      </div>
      <p>${escapeHtml(task.prompt)}</p>
      <div class="status-line small">
        <span class="muted">${task.deadline ? `Deadline: ${escapeHtml(task.deadline)}` : "ohne Deadline"}</span>
        ${task.reviewRequired ? '<span class="badge">mit Review</span>' : ""}
      </div>
    </article>
  `).join("");
}

function renderProjectMeta() {
  const project = currentProject();
  const workspace = getSelectedWorkspace();

  return `
    <article class="workspace-item">
      <div class="workspace-meta">
        <h4>${escapeHtml(project.title)}</h4>
        <span class="badge">${escapeHtml(project.genre)}</span>
      </div>
      <div class="meta-list">
        <p><strong>Autor*in:</strong> ${escapeHtml(project.author)}</p>
        <p><strong>Klassenstufe:</strong> ${escapeHtml(project.gradeLevel || state.bootstrap.course.gradeLevel || "offen")}</p>
        <p><strong>Zeitraum:</strong> ${escapeHtml(project.timeframe || state.bootstrap.course.timeframe || "offen")}</p>
        <p><strong>Arbeitsmodus:</strong> ${escapeHtml(project.workMode)}</p>
        <p><strong>Bewertungsmodus:</strong> ${escapeHtml(project.assessmentMode)}</p>
        <p><strong>GitHub-Modus:</strong> ${escapeHtml(project.settings.githubMode)}</p>
      </div>
      ${workspace ? `
        <p class="footnote">
          Aktiver Arbeitsraum: <strong>${escapeHtml(workspace.title)}</strong> · ${workspace.permissions.canEdit ? "editierbar" : "lesend oder reviewend"}
        </p>
      ` : ""}
    </article>
  `;
}

function renderTeacherSetupForm() {
  if (!isTeacherView()) {
    return "";
  }

  const studentCount = state.bootstrap.users.filter((user) => user.role === "student").length;

  return `
    <section class="overview-grid">
      <article class="panel">
        <h2 class="section-title">Lehrpersonen-Setup</h2>
        <p class="footnote">
          Lege hier eine neue Lektüre direkt im MVP an. Das System erzeugt automatisch einen Basisraum sowie ${studentCount} persönliche Arbeitskopien.
        </p>
        <form id="project-form" class="form-grid">
          <label class="form-label">
            Projekttitel
            <input name="title" value="${escapeHtml(state.projectDraft.title)}" placeholder="z. B. Lektüreprojekt Novelle">
          </label>

          <label class="form-label">
            Autor*in
            <input name="author" value="${escapeHtml(state.projectDraft.author)}" placeholder="z. B. Gerhart Hauptmann">
          </label>

          <label class="form-label">
            Genre
            <input name="genre" value="${escapeHtml(state.projectDraft.genre)}" placeholder="Roman, Novelle, Drama ...">
          </label>

          <label class="form-label">
            Klassenstufe
            <input name="gradeLevel" value="${escapeHtml(state.projectDraft.gradeLevel)}" placeholder="z. B. 9">
          </label>

          <label class="form-label">
            Zeitraum
            <input name="timeframe" value="${escapeHtml(state.projectDraft.timeframe)}" placeholder="z. B. April bis Mai">
          </label>

          <label class="form-label">
            Arbeitsmodus
            <input name="workMode" value="${escapeHtml(state.projectDraft.workMode)}">
          </label>

          <label class="form-label">
            Bewertungsmodus
            <input name="assessmentMode" value="${escapeHtml(state.projectDraft.assessmentMode)}">
          </label>

          <label class="form-label">
            Sichtbarkeit
            <select name="studentVisibility">
              <option value="course-on-submission" ${state.projectDraft.studentVisibility === "course-on-submission" ? "selected" : ""}>Kurssicht nach Einreichung</option>
              <option value="private" ${state.projectDraft.studentVisibility === "private" ? "selected" : ""}>nur eigene Arbeitskopie</option>
            </select>
          </label>

          <label class="form-label">
            Peer-Reviews pro Schüler*in
            <input name="reviewAssignmentsPerStudent" type="number" min="0" max="10" value="${escapeHtml(state.projectDraft.reviewAssignmentsPerStudent)}">
          </label>

          <label class="form-label">
            Feedbackschwerpunkte
            <input name="feedbackFocus" value="${escapeHtml(state.projectDraft.feedbackFocus)}" placeholder="Textnähe, Belegarbeit, Klarheit">
          </label>

          <label class="form-label">
            Aufgabe für Annotationen
            <textarea name="annotationPrompt" placeholder="Leer lassen für eine sinnvolle Standardaufgabe.">${escapeHtml(state.projectDraft.annotationPrompt)}</textarea>
          </label>

          <label class="form-label">
            Aufgabe für Deutungshypothesen
            <textarea name="interpretationPrompt" placeholder="Leer lassen für eine sinnvolle Standardaufgabe.">${escapeHtml(state.projectDraft.interpretationPrompt)}</textarea>
          </label>

          <label class="form-label">
            Segmente der Lektüre
            <textarea name="segmentsRaw" placeholder="Abschnittstitel&#10;Hier steht der Abschnittstext.&#10;&#10;Nächster Abschnitt&#10;Hier steht der nächste Abschnitt.">${escapeHtml(state.projectDraft.segmentsRaw)}</textarea>
          </label>

          <div class="form-actions">
            <button class="button" type="submit">Projekt anlegen</button>
            <button class="button secondary" type="button" data-action="reset-project-draft">Formular leeren</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <h2 class="section-title">Projekt-Metadaten</h2>
        ${renderProjectMeta()}
      </article>
    </section>
  `;
}

function renderSegments() {
  const selectedAnnotation = getSelectedAnnotation();
  const currentWorkspace = getSelectedWorkspace();

  if (!state.bootstrap.segments.length) {
    return '<div class="empty">Dieses Projekt hat noch keine Segmente.</div>';
  }

  return state.bootstrap.segments.map((segment) => {
    const annotationsForSegment = (currentWorkspace?.annotations || []).filter((annotation) => annotation.segmentId === segment.id);
    const active = segment.id === state.selectedSegmentId;
    const highlight = selectedAnnotation?.segmentId === segment.id ? selectedAnnotation.quote : "";

    return `
      <article class="segment-card ${active ? "is-active" : ""}">
        <div class="segment-head">
          <div>
            <div class="eyebrow">${escapeHtml(segment.label)}</div>
            <h3>${escapeHtml(segment.title)}</h3>
          </div>
          <button class="button secondary" data-action="select-segment" data-segment-id="${segment.id}">öffnen</button>
        </div>
        <p data-segment-text data-segment-id="${segment.id}">${highlightQuote(segment.content, highlight)}</p>
        <div class="segment-tools">
          <span class="badge">${annotationsForSegment.length} Annotationen</span>
          ${annotationsForSegment.map((annotation) => `<button class="pill" data-action="select-annotation" data-annotation-id="${annotation.id}">${escapeHtml(annotation.type)}</button>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function renderAnnotationList() {
  const currentWorkspace = getSelectedWorkspace();
  const filterType = state.filters.type;
  const annotations = (currentWorkspace?.annotations || []).filter((annotation) => filterType === "all" || annotation.type === filterType);

  if (!annotations.length) {
    return '<div class="empty">In diesem Arbeitsraum gibt es noch keine sichtbaren Annotationen.</div>';
  }

  return annotations.map((annotation) => `
    <article class="annotation-item ${annotation.id === state.selectedAnnotationId ? "is-active" : ""}">
      <button class="button secondary" data-action="select-annotation" data-annotation-id="${annotation.id}">
        Annotation öffnen
      </button>
      <div class="annotation-header">
        <div>
          <h4>${escapeHtml(annotation.type)}</h4>
          <p>${escapeHtml(annotation.currentVersion.body.slice(0, 150))}${annotation.currentVersion.body.length > 150 ? " ..." : ""}</p>
        </div>
        <div class="status-line small">
          <span class="badge">${escapeHtml(annotation.author.name)}</span>
          <span class="badge">${escapeHtml(segmentLabel(annotation.segmentId))}</span>
        </div>
      </div>
    </article>
  `).join("");
}

function renderVersionHistory() {
  const currentWorkspace = getSelectedWorkspace();
  if (!currentWorkspace?.versions.length) {
    return '<div class="empty">Noch kein gespeicherter Arbeitsstand.</div>';
  }

  return currentWorkspace.versions
    .slice()
    .reverse()
    .map((version) => `
      <article class="version-item">
        <div class="version-meta">
          <strong>${escapeHtml(version.label)}</strong>
          <span class="muted small">${formatDate(version.createdAt)}</span>
        </div>
        <p>${escapeHtml(version.note || "Ohne Zusatznotiz")}</p>
      </article>
    `)
    .join("");
}

function renderThreads(annotation) {
  if (!annotation?.threads?.length) {
    return '<div class="empty">Zu dieser Annotation gibt es noch keine Diskussion.</div>';
  }

  return annotation.threads.map((thread) => `
    <article class="thread-item">
      <div class="thread-meta">
        <strong>${escapeHtml(thread.kind)}</strong>
        <span class="badge">${escapeHtml(thread.visibility)}</span>
      </div>
      <div class="thread-list">
        ${thread.messages.map((message) => `
          <div>
            <div class="thread-meta small">
              <strong>${escapeHtml(message.author?.name || "System")}</strong>
              <span class="muted">${formatDate(message.createdAt)}</span>
            </div>
            <p>${escapeHtml(message.body)}</p>
            ${message.feedback ? `
              <div class="compare-box small">
                <strong>Automatisches Feedback</strong>
                <div class="compare-grid">
                  ${message.feedback.checks.map((check) => `<span>${check.passed ? "✓" : "•"} ${escapeHtml(check.label)}</span>`).join("")}
                </div>
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderSubmissionPanel() {
  const currentWorkspace = getSelectedWorkspace();
  if (!currentWorkspace?.latestSubmission) {
    return '<div class="empty">Noch keine Einreichung für diesen Arbeitsraum.</div>';
  }

  const reviewThread = currentWorkspace.submissionThreads[0];

  return `
    <article class="workspace-item">
      <div class="workspace-meta">
        <h4>Einreichung</h4>
        <span class="badge">${escapeHtml(currentWorkspace.latestSubmission.status)}</span>
      </div>
      <p>${escapeHtml(currentWorkspace.latestSubmission.note || "Ohne Begleitnotiz")}</p>
      <p class="small muted">Erstellt am ${formatDate(currentWorkspace.latestSubmission.createdAt)}</p>
      ${reviewThread ? `
        <div class="thread-list">
          ${reviewThread.messages.map((message) => `
            <article class="thread-item">
              <div class="thread-meta small">
                <strong>${escapeHtml(message.author?.name || "System")}</strong>
                <span>${formatDate(message.createdAt)}</span>
              </div>
              <p>${escapeHtml(message.body)}</p>
            </article>
          `).join("")}
        </div>
      ` : '<div class="empty">Noch keine Review-Nachricht zur Einreichung.</div>'}
    </article>
  `;
}

function renderCompare() {
  if (!state.compareResult) {
    return '<div class="empty">Versionen vergleichen: Speichere einen Arbeitsstand oder vergleiche die letzten zwei Versionen des gewählten Arbeitsraums.</div>';
  }

  return `
    <div class="compare-box">
      <div class="compare-grid">
        <strong>Versionsvergleich</strong>
        <span>Neu: ${state.compareResult.summary.addedCount}</span>
        <span>Geändert: ${state.compareResult.summary.changedCount}</span>
        <span>Entfernt: ${state.compareResult.summary.removedCount}</span>
        <span>Revisionen nach Feedback: ${state.compareResult.summary.revisionAfterFeedbackCount}</span>
      </div>
    </div>
  `;
}

function segmentLabel(segmentId) {
  return state.bootstrap.segments.find((segment) => segment.id === segmentId)?.label || segmentId;
}

function loadDraftFromAnnotation(annotation) {
  resetDraft({
    annotationId: annotation.id,
    segmentId: annotation.segmentId,
    taskId: annotation.taskId || "",
    type: annotation.type,
    tags: (annotation.tags || []).join(", "),
    quote: annotation.quote || "",
    body: annotation.currentVersion.body
  });
}

function renderAnnotationEditor() {
  const workspace = getSelectedWorkspace();
  const hasSegments = state.bootstrap.segments.length > 0;
  const canEdit = workspace?.permissions.canEdit && hasSegments;

  return `
    <form id="annotation-form" class="form-grid">
      <div class="annotation-header">
        <strong>${state.annotationDraft.annotationId ? "Annotation überarbeiten" : "Neue Annotation"}</strong>
        <div class="split-actions">
          <button type="button" class="button secondary" data-action="new-annotation">leeren</button>
          ${state.selectedAnnotationId ? '<button type="button" class="button secondary" data-action="request-feedback">Feedback prüfen</button>' : ""}
        </div>
      </div>

      <label class="form-label">
        Abschnitt
        <select name="segmentId" ${canEdit ? "" : "disabled"}>
          ${state.bootstrap.segments.map((segment) => `
            <option value="${segment.id}" ${segment.id === (state.annotationDraft.segmentId || state.selectedSegmentId) ? "selected" : ""}>${escapeHtml(segment.label)} · ${escapeHtml(segment.title)}</option>
          `).join("")}
        </select>
      </label>

      <label class="form-label">
        Aufgabenzuordnung
        <select name="taskId" ${canEdit ? "" : "disabled"}>
          <option value="">ohne feste Aufgabe</option>
          ${state.bootstrap.tasks.map((task) => `
            <option value="${task.id}" ${task.id === state.annotationDraft.taskId ? "selected" : ""}>${escapeHtml(task.title)}</option>
          `).join("")}
        </select>
      </label>

      <label class="form-label">
        Annotationstyp
        <select name="type" ${canEdit ? "" : "disabled"}>
          ${state.bootstrap.visibleLegend.map((entry) => `
            <option value="${entry.key}" ${entry.key === state.annotationDraft.type ? "selected" : ""}>${escapeHtml(entry.label)}</option>
          `).join("")}
        </select>
      </label>

      <label class="form-label">
        Schlagwörter
        <input name="tags" value="${escapeHtml(state.annotationDraft.tags)}" placeholder="z. B. Schwelle, Geräusch, Perspektive" ${canEdit ? "" : "disabled"}>
      </label>

      <label class="form-label">
        Markierter Wortlaut
        <textarea name="quote" placeholder="Textauswahl aus der linken Spalte oder manuell eingeben" ${canEdit ? "" : "disabled"}>${escapeHtml(state.annotationDraft.quote)}</textarea>
      </label>

      <label class="form-label">
        Deutung / Beobachtung
        <textarea name="body" placeholder="Textnah formulieren: Was zeigt die Stelle, woran erkennt man das und wie wirkt es?" ${canEdit ? "" : "disabled"}>${escapeHtml(state.annotationDraft.body)}</textarea>
      </label>

      <div class="form-actions">
        <button class="button" type="submit" ${canEdit ? "" : "disabled"}>${state.annotationDraft.annotationId ? "Änderung speichern" : "Annotation anlegen"}</button>
        <button class="button secondary" type="button" data-action="save-version" ${workspace?.permissions.canSubmit ? "" : "disabled"}>Arbeitsstand sichern</button>
        <button class="button warning" type="button" data-action="submit-workspace" ${workspace?.permissions.canSubmit ? "" : "disabled"}>Einreichen</button>
      </div>
      ${!hasSegments ? '<p class="footnote">Dieses Projekt enthält noch keine lesbaren Textsegmente.</p>' : ""}
      ${!canEdit && hasSegments ? '<p class="footnote">Dieser Arbeitsraum ist für dich schreibgeschützt. Du kannst aber kommentieren oder reviewen, sobald eine Einreichung vorliegt.</p>' : ""}
    </form>
  `;
}

function renderCommentForm(annotation) {
  const workspace = getSelectedWorkspace();
  if (!annotation || !workspace?.permissions.canComment) {
    return "";
  }

  return `
    <form id="comment-form" class="form-grid">
      <label class="form-label">
        Peer- oder Lehrkraftkommentar
        <textarea name="commentBody" placeholder="Formuliere textnahes Feedback: Was ist schon stark, was sollte am Wortlaut präziser werden?">${escapeHtml(state.commentDraft)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary" type="submit">Kommentar senden</button>
      </div>
    </form>
  `;
}

function renderReviewForm() {
  const workspace = getSelectedWorkspace();
  if (!workspace?.permissions.canReview || !workspace.latestSubmission) {
    return "";
  }

  return `
    <form id="review-form" class="form-grid">
      <label class="form-label">
        Review zur Einreichung
        <textarea name="reviewBody" placeholder="Beschreibe textnah, was schon plausibel ist und welche Revision als Nächstes sinnvoll wäre.">${escapeHtml(state.reviewDraft)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary" type="submit">Review absenden</button>
      </div>
    </form>
  `;
}

function renderApp() {
  const workspace = getSelectedWorkspace();
  const annotation = getSelectedAnnotation();
  const project = currentProject();

  app.innerHTML = `
    <main class="shell">
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-top">
            <div>
              <div class="eyebrow">${escapeHtml(state.bootstrap.course.title)} · ${escapeHtml(project.genre)}</div>
              <h1>${escapeHtml(project.title)}</h1>
              <p>
                Didaktisches MVP für textnahes Arbeiten: Arbeitskopien, Annotationen, Peer-Review, Versionen und automatisierte Rückmeldungen
                in einer GitHub-nahen Lernlogik, ohne GitHub-Zwang im Unterricht.
              </p>
            </div>
            <div class="hero-actions">
              <a class="button" href="/api/export/projects/${project.id}" target="_blank" rel="noreferrer">Projekt exportieren</a>
            </div>
          </div>

          <div>
            <div class="section-title">Rollenansicht</div>
            <div class="viewer-switches">${renderViewerPills()}</div>
          </div>

          <div>
            <div class="section-title">Projekte</div>
            <div class="workspace-pills">${renderProjectPills()}</div>
          </div>

          <div>
            <div class="section-title">Sichtbare Arbeitsräume</div>
            <div class="workspace-pills">${renderWorkspacePills()}</div>
          </div>
        </div>
      </section>

      <section class="dashboard-grid">${renderMetrics()}</section>

      <section class="overview-grid">
        <article class="panel">
          <h2 class="section-title">Aufgaben</h2>
          <div class="task-list">${renderTaskList()}</div>
        </article>
        <article class="panel">
          <h2 class="section-title">Projekt und Arbeitsraum</h2>
          ${renderProjectMeta()}
        </article>
      </section>

      ${renderTeacherSetupForm()}

      <section class="reader-layout">
        <div class="reader-columns">
          <article class="panel">
            <h2 class="section-title">Text und Close Reading</h2>
            <p class="footnote">
              Wähle links eine Textstelle. Wenn du im Text markierst, wird der Wortlaut automatisch in den Annotationsentwurf rechts übernommen.
            </p>
            <div class="segment-list">${renderSegments()}</div>
          </article>
        </div>

        <div class="reader-columns">
          <article class="panel">
            <h2 class="section-title">Annotationen</h2>
            <div class="form-grid">
              <label class="form-label">
                Filter
                <select id="type-filter">
                  <option value="all" ${state.filters.type === "all" ? "selected" : ""}>alle Typen</option>
                  ${state.bootstrap.visibleLegend.map((entry) => `
                    <option value="${entry.key}" ${state.filters.type === entry.key ? "selected" : ""}>${escapeHtml(entry.label)}</option>
                  `).join("")}
                </select>
              </label>
              <div class="annotation-list">${renderAnnotationList()}</div>
            </div>
          </article>

          <article class="panel">
            <h2 class="section-title">Editor und Diskussion</h2>
            ${annotation?.quote ? `
              <div class="quote-callout">
                <strong>Aktuelle Markierung</strong>
                <span>${escapeHtml(annotation.quote)}</span>
              </div>
            ` : ""}
            ${renderAnnotationEditor()}
            ${renderCommentForm(annotation)}
          </article>

          <article class="panel">
            <h2 class="section-title">Feedback-Threads</h2>
            <div class="thread-list">${renderThreads(annotation)}</div>
          </article>

          <article class="panel">
            <h2 class="section-title">Versionen und Review</h2>
            <div class="split-actions">
              <button class="button secondary" data-action="compare-latest" ${workspace?.versions.length >= 2 ? "" : "disabled"}>Letzte zwei Versionen vergleichen</button>
            </div>
            ${renderCompare()}
            <div class="version-list">${renderVersionHistory()}</div>
            ${renderSubmissionPanel()}
            ${renderReviewForm()}
          </article>
        </div>
      </section>
    </main>
  `;
}

async function load(viewerId = state.viewerId, projectId = state.selectedProjectId) {
  const bootstrap = await fetchBootstrap(viewerId, projectId);
  applyBootstrap(bootstrap);

  const selectedAnnotation = getSelectedAnnotation();
  if (selectedAnnotation) {
    loadDraftFromAnnotation(selectedAnnotation);
  } else {
    resetDraft({
      segmentId: state.selectedSegmentId
    });
  }

  renderApp();
}

async function refreshWithBootstrap(bootstrapPayload) {
  const bootstrap = bootstrapPayload.bootstrap || bootstrapPayload;
  applyBootstrap(bootstrap);
  renderApp();
}

function syncDraftFromForm(form) {
  const formData = new FormData(form);
  state.annotationDraft = {
    annotationId: state.annotationDraft.annotationId,
    segmentId: formData.get("segmentId"),
    taskId: formData.get("taskId"),
    type: formData.get("type"),
    tags: formData.get("tags"),
    quote: formData.get("quote"),
    body: formData.get("body")
  };
}

function syncProjectDraftFromForm(form) {
  const formData = new FormData(form);
  state.projectDraft = {
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    gradeLevel: formData.get("gradeLevel"),
    timeframe: formData.get("timeframe"),
    workMode: formData.get("workMode"),
    assessmentMode: formData.get("assessmentMode"),
    studentVisibility: formData.get("studentVisibility"),
    reviewAssignmentsPerStudent: formData.get("reviewAssignmentsPerStudent"),
    feedbackFocus: formData.get("feedbackFocus"),
    annotationPrompt: formData.get("annotationPrompt"),
    interpretationPrompt: formData.get("interpretationPrompt"),
    segmentsRaw: formData.get("segmentsRaw")
  };
}

document.addEventListener("change", (event) => {
  if (event.target.matches("#type-filter")) {
    state.filters.type = event.target.value;
    renderApp();
  }

  if (event.target.closest("#annotation-form")) {
    syncDraftFromForm(event.target.closest("#annotation-form"));
  }

  if (event.target.closest("#project-form")) {
    syncProjectDraftFromForm(event.target.closest("#project-form"));
  }
});

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    return;
  }

  const anchorElement = selection.anchorNode?.parentElement;
  const segmentElement = anchorElement?.closest?.("[data-segment-text]");
  const quote = selection.toString().trim();

  if (!segmentElement || quote.length < 5) {
    return;
  }

  state.selectedSegmentId = segmentElement.dataset.segmentId;
  state.annotationDraft.segmentId = segmentElement.dataset.segmentId;
  state.annotationDraft.quote = quote;
  renderApp();
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const action = target.dataset.action;

  try {
    if (action === "switch-viewer") {
      state.compareResult = null;
      state.commentDraft = "";
      state.reviewDraft = "";
      await load(target.dataset.viewerId, state.selectedProjectId);
    }

    if (action === "switch-project") {
      state.compareResult = null;
      state.selectedProjectId = target.dataset.projectId;
      state.selectedWorkspaceId = null;
      state.selectedAnnotationId = null;
      await load(state.viewerId, target.dataset.projectId);
    }

    if (action === "select-workspace") {
      state.selectedWorkspaceId = target.dataset.workspaceId;
      state.selectedAnnotationId = getSelectedWorkspace()?.annotations[0]?.id || null;
      const selectedAnnotation = getSelectedAnnotation();
      if (selectedAnnotation) {
        loadDraftFromAnnotation(selectedAnnotation);
      } else {
        resetDraft({
          segmentId: state.selectedSegmentId
        });
      }
      state.compareResult = null;
      renderApp();
    }

    if (action === "select-segment") {
      state.selectedSegmentId = target.dataset.segmentId;
      state.annotationDraft.segmentId = target.dataset.segmentId;
      renderApp();
    }

    if (action === "select-annotation") {
      state.selectedAnnotationId = target.dataset.annotationId;
      const annotation = getSelectedAnnotation();
      if (annotation) {
        state.selectedSegmentId = annotation.segmentId;
        loadDraftFromAnnotation(annotation);
      }
      renderApp();
    }

    if (action === "new-annotation") {
      resetDraft({
        segmentId: state.selectedSegmentId,
        quote: state.annotationDraft.quote
      });
      state.selectedAnnotationId = null;
      renderApp();
    }

    if (action === "reset-project-draft") {
      resetProjectDraft();
      renderApp();
    }

    if (action === "request-feedback") {
      const annotation = getSelectedAnnotation();
      if (!annotation) {
        return;
      }

      const bootstrap = await requestFeedback(annotation.id, state.viewerId);
      await refreshWithBootstrap(bootstrap);
      const refreshed = getSelectedWorkspace()?.annotations.find((item) => item.id === annotation.id);
      if (refreshed) {
        state.selectedAnnotationId = refreshed.id;
      }
      renderApp();
    }

    if (action === "save-version") {
      const workspace = getSelectedWorkspace();
      const response = await saveWorkspaceVersion(workspace.id, {
        viewerId: state.viewerId,
        label: `Arbeitsstand ${workspace.versions.length + 1}`,
        note: "Gesichert aus der Oberfläche"
      });
      state.compareResult = response.compare;
      await refreshWithBootstrap(response);
    }

    if (action === "submit-workspace") {
      const workspace = getSelectedWorkspace();
      const bootstrap = await submitWorkspace(workspace.id, {
        viewerId: state.viewerId,
        note: "Einreichung aus dem MVP"
      });
      await refreshWithBootstrap(bootstrap);
    }

    if (action === "compare-latest") {
      const workspace = getSelectedWorkspace();
      const versions = workspace.versions;
      if (versions.length < 2) {
        return;
      }

      const compare = await compareVersions(workspace.id, versions.at(-2).id, versions.at(-1).id);
      state.compareResult = compare;
      renderApp();
    }
  } catch (error) {
    window.alert(error.message);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();

  try {
    if (form.id === "annotation-form") {
      syncDraftFromForm(form);
      const workspace = getSelectedWorkspace();
      const payload = {
        viewerId: state.viewerId,
        segmentId: state.annotationDraft.segmentId,
        taskId: state.annotationDraft.taskId || null,
        type: state.annotationDraft.type,
        tags: state.annotationDraft.tags.split(",").map((item) => item.trim()).filter(Boolean),
        quote: state.annotationDraft.quote,
        body: state.annotationDraft.body,
        reason: "feedback-revision"
      };

      let bootstrap;
      if (state.annotationDraft.annotationId) {
        bootstrap = await updateAnnotation(state.annotationDraft.annotationId, payload);
      } else {
        bootstrap = await createAnnotation(workspace.id, payload);
      }

      await refreshWithBootstrap(bootstrap);
      const currentWorkspace = getSelectedWorkspace();
      const currentAnnotation = currentWorkspace?.annotations[0];
      if (currentAnnotation) {
        state.selectedAnnotationId = currentAnnotation.id;
        loadDraftFromAnnotation(currentAnnotation);
      }
      renderApp();
    }

    if (form.id === "comment-form") {
      const annotation = getSelectedAnnotation();
      const formData = new FormData(form);
      const bootstrap = await createComment(annotation.id, {
        viewerId: state.viewerId,
        body: formData.get("commentBody")
      });
      state.commentDraft = "";
      await refreshWithBootstrap(bootstrap);
    }

    if (form.id === "review-form") {
      const workspace = getSelectedWorkspace();
      const formData = new FormData(form);
      const bootstrap = await createSubmissionReview(workspace.latestSubmission.id, {
        viewerId: state.viewerId,
        body: formData.get("reviewBody"),
        rubricScores: {}
      });
      state.reviewDraft = "";
      await refreshWithBootstrap(bootstrap);
    }

    if (form.id === "project-form") {
      syncProjectDraftFromForm(form);
      const bootstrap = await createProject({
        viewerId: state.viewerId,
        ...state.projectDraft
      });
      state.compareResult = null;
      resetProjectDraft();
      await refreshWithBootstrap(bootstrap);
    }
  } catch (error) {
    window.alert(error.message);
  }
});

load().catch((error) => {
  app.innerHTML = `<main class="shell"><article class="panel"><h1>Startfehler</h1><p>${escapeHtml(error.message)}</p></article></main>`;
});
