const app = document.body;

const state = {
  loading: true,
  error: "",
  overview: null,
  selectedClassId: null
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Anfrage fehlgeschlagen.");
  }

  return response.json();
}

function currentClassroom() {
  return state.overview?.classes.find((entry) => entry.id === state.selectedClassId) || state.overview?.classes[0] || null;
}

function renderLessonOptions(classroom, key) {
  return state.overview.lessons.map((lesson) => `
    <option value="${lesson.id}" ${lesson.id === classroom[key] ? "selected" : ""}>
      ${escapeHtml(lesson.title)}
    </option>
  `).join("");
}

function renderClassCards() {
  return state.overview.classes.map((classroom) => `
    <button class="class-card ${classroom.id === state.selectedClassId ? "is-active" : ""}" data-action="select-class" data-class-id="${classroom.id}">
      <div class="eyebrow">${escapeHtml(classroom.name)}</div>
      <h2>${escapeHtml(classroom.code)}</h2>
      <p>${escapeHtml(`${classroom.studentCount} Lernende · Ø ${classroom.averageProgress}% Fortschritt`)}</p>
      <p>${escapeHtml(`Peer Review: ${classroom.peerReviewSummary.completedReviews}/${classroom.peerReviewSummary.totalAssignments}`)}</p>
    </button>
  `).join("");
}

function renderStudents(classroom) {
  if (!classroom.students.length) {
    return '<div class="empty">Noch keine Lernenden in dieser Klasse angemeldet.</div>';
  }

  return classroom.students.map((student) => `
    <article class="student-card">
      <div class="student-head">
        <div>
          <h3>${escapeHtml(student.displayName)}</h3>
          <p>${escapeHtml(`Zuletzt aktiv: ${student.lastSeenAt ? new Date(student.lastSeenAt).toLocaleString("de-CH") : "-"}`)}</p>
        </div>
        <span class="badge">${escapeHtml(`${student.progress.percent}%`)}</span>
      </div>
      <div class="student-metrics">
        <span>${escapeHtml(`${student.progress.completedEntries}/${student.progress.totalEntries} Passagen`)}</span>
        <span>${escapeHtml(`${student.progress.theoryEntries} Theoriebezüge`)}</span>
        <span>${escapeHtml(`${student.progress.evidenceEntries} Textanker`)}</span>
        <span>${escapeHtml(`Letzter Modus: ${student.lastMode}`)}</span>
      </div>
      <div class="student-metrics">
        <span>${escapeHtml(`zugewiesen: ${student.peerReview.completedAssignedCount}/${student.peerReview.assignedCount}`)}</span>
        <span>${escapeHtml(`erhalten: ${student.peerReview.receivedCompletedCount}/${student.peerReview.receivedCount}`)}</span>
      </div>
      <div class="lesson-progress-list">
        ${student.progress.lessonProgress.map((lesson) => `
          <div class="lesson-progress-row">
            <span>${escapeHtml(lesson.title)}</span>
            <strong>${escapeHtml(`${lesson.completedEntries}/${lesson.totalEntries}`)}</strong>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderLessonLinks() {
  return state.overview.lessons.map((lesson) => `
    <article class="lesson-link-card">
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.summary)}</p>
      <div class="lesson-actions">
        <a class="button secondary" href="/kehlmann/open/lesson/${lesson.id}" target="_blank" rel="noreferrer">Offen</a>
        <a class="button secondary" href="/kehlmann/seb/lesson/${lesson.id}" target="_blank" rel="noreferrer">SEB</a>
      </div>
    </article>
  `).join("");
}

function renderCriteriaHelp() {
  return state.overview.reviewCriteria.map((criterion) => `
    <div class="criterion-help">
      <strong>${escapeHtml(criterion.label)}</strong>
      <p>${escapeHtml(criterion.prompt)}</p>
    </div>
  `).join("");
}

function render() {
  if (state.loading) {
    app.innerHTML = '<main class="teacher-shell"><section class="panel"><h1>Lädt ...</h1><p>Dashboard wird vorbereitet.</p></section></main>';
    return;
  }

  if (state.error) {
    app.innerHTML = `<main class="teacher-shell"><section class="panel"><h1>Dashboard nicht verfügbar</h1><p>${escapeHtml(state.error)}</p></section></main>`;
    return;
  }

  const classroom = currentClassroom();

  app.innerHTML = `
    <main class="teacher-shell">
      <section class="hero panel">
        <div>
          <div class="eyebrow">Lehrkraft-Dashboard · Die Reise der Verlorenen</div>
          <h1>Klassen, Codes, Fortschritt und Peer Review</h1>
          <p>Hier steuerst du Klassen-Codes, das aktive SEB-Arbeitsset, Peer-Review-Zuweisungen und den Lernstand der einzelnen Schüler*innen für die Kehlmann-Einheit.</p>
        </div>
        <div class="hero-actions">
          <a class="button secondary" href="/auth/kehlmann/teacher/logout">Abmelden</a>
          <a class="button secondary" href="/kehlmann">Startseite</a>
        </div>
      </section>

      <section class="class-grid">
        ${renderClassCards()}
      </section>

      <section class="dashboard-grid">
        <article class="panel">
          <div class="panel-head">
            <div>
              <div class="eyebrow">Klassensteuerung</div>
              <h2>${escapeHtml(classroom?.name || "Klasse")}</h2>
            </div>
          </div>
          ${classroom ? `
            <form id="class-settings-form" class="form-grid">
              <input type="hidden" name="classId" value="${classroom.id}">
              <label>
                Klassenname
                <input type="text" name="name" value="${escapeHtml(classroom.name)}">
              </label>
              <label>
                Aktive SEB-Lektion
                <select name="activeSebLessonId">
                  ${renderLessonOptions(classroom, "activeSebLessonId")}
                </select>
              </label>
              <label class="toggle">
                <input type="checkbox" name="allowOpen" ${classroom.allowOpen ? "checked" : ""}>
                Offene Version freigeben
              </label>
              <label class="toggle">
                <input type="checkbox" name="allowSeb" ${classroom.allowSeb ? "checked" : ""}>
                SEB-Version freigeben
              </label>
              <div class="review-settings-box">
                <div class="eyebrow">Peer Review</div>
                <label class="toggle">
                  <input type="checkbox" name="peerReviewEnabled" ${classroom.peerReviewEnabled ? "checked" : ""}>
                  Peer Review in der offenen Version aktivieren
                </label>
                <label>
                  Review-Lektion
                  <select name="peerReviewLessonId">
                    ${renderLessonOptions(classroom, "peerReviewLessonId")}
                  </select>
                </label>
                <label>
                  Anzahl Reviews pro Person
                  <input type="number" min="0" max="5" name="requiredPeerReviews" value="${escapeHtml(classroom.requiredPeerReviews)}">
                </label>
                <label>
                  Review-Hinweise
                  <textarea name="peerReviewInstructions" rows="5">${escapeHtml(classroom.peerReviewInstructions || "")}</textarea>
                </label>
                <div class="metrics-row">
                  <span class="badge">${escapeHtml(`zugewiesen: ${classroom.peerReviewSummary.totalAssignments}`)}</span>
                  <span class="badge">${escapeHtml(`abgeschlossen: ${classroom.peerReviewSummary.completedReviews}`)}</span>
                  <span class="badge">${escapeHtml(`offen: ${classroom.peerReviewSummary.pendingReviews}`)}</span>
                </div>
              </div>
              <div class="row">
                <button type="submit">Einstellungen speichern</button>
                <button type="button" class="button secondary" data-action="regenerate-code" data-class-id="${classroom.id}">Code neu erzeugen</button>
              </div>
            </form>
          ` : ""}
          <form id="create-class-form" class="form-grid top-gap">
            <label>
              Neue Klasse anlegen
              <input type="text" name="name" placeholder="z. B. Klasse 10B">
            </label>
            <button type="submit">Klasse erstellen</button>
          </form>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <div class="eyebrow">Review-Rubrik und Lektionslinks</div>
              <h2>Arbeitsrahmen</h2>
            </div>
          </div>
          <div class="criteria-help-grid">
            ${renderCriteriaHelp()}
          </div>
          <div class="lesson-link-grid top-gap">
            ${renderLessonLinks()}
          </div>
        </article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Lernstand und Review-Fortschritt</div>
            <h2>${escapeHtml(classroom?.name || "Klasse")}</h2>
          </div>
        </div>
        <div class="student-grid">
          ${classroom ? renderStudents(classroom) : '<div class="empty">Keine Klasse ausgewählt.</div>'}
        </div>
      </section>
    </main>
  `;
}

async function loadOverview() {
  state.loading = true;
  render();

  try {
    state.overview = await request("/kehlmann-reader-api/teacher/bootstrap");
    state.selectedClassId = state.selectedClassId || state.overview.classes[0]?.id || null;
    state.loading = false;
    state.error = "";
    render();
  } catch (error) {
    state.loading = false;
    state.error = error.message;
    render();
  }
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const action = target.dataset.action;

  if (action === "select-class") {
    state.selectedClassId = target.dataset.classId;
    render();
  }

  if (action === "regenerate-code") {
    try {
      state.overview = await request(`/kehlmann-reader-api/teacher/classes/${target.dataset.classId}/regenerate`, {
        method: "POST"
      });
      render();
    } catch (error) {
      state.error = error.message;
      render();
    }
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "create-class-form") {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      state.overview = await request("/kehlmann-reader-api/teacher/classes", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name")
        })
      });
      state.selectedClassId = state.overview.classes.at(-1)?.id || state.selectedClassId;
      event.target.reset();
      render();
    } catch (error) {
      state.error = error.message;
      render();
    }
  }

  if (event.target.id === "class-settings-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const classId = formData.get("classId");

    try {
      state.overview = await request(`/kehlmann-reader-api/teacher/classes/${classId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: formData.get("name"),
          activeSebLessonId: formData.get("activeSebLessonId"),
          allowOpen: formData.get("allowOpen") === "on",
          allowSeb: formData.get("allowSeb") === "on",
          peerReviewEnabled: formData.get("peerReviewEnabled") === "on",
          peerReviewLessonId: formData.get("peerReviewLessonId"),
          requiredPeerReviews: Number(formData.get("requiredPeerReviews") || 0),
          peerReviewInstructions: formData.get("peerReviewInstructions")
        })
      });
      render();
    } catch (error) {
      state.error = error.message;
      render();
    }
  }
});

loadOverview();
