import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { theoryResources } from "../public/kehlmann-reader/data.js";
import { kehlmannReaderApiRouter } from "./routes/kehlmann-reader-api.mjs";
import { hasOpenAccess, isSafeExamBrowserRequest, parseCookies } from "./services/access.mjs";
import { getEntriesForLesson, getLessonSetById, getLessonSetsWithCounts } from "./services/kehlmann-reader-progress.mjs";
import {
  buildReaderBootstrap,
  createOrResumeStudent,
  readReaderStore,
  updateReaderStore
} from "./services/kehlmann-reader-store.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const readerDir = path.join(publicDir, "kehlmann-reader");
const teacherDir = path.join(publicDir, "kehlmann-teacher");
const readerAssetDir = path.join(publicDir, "reader/assets");
const OPEN_PASSWORD = process.env.OPEN_VERSION_PASSWORD || process.env.KEHLMANN_OPEN_VERSION_PASSWORD || "giftmord";
const TEACHER_PASSWORD = process.env.TEACHER_DASHBOARD_PASSWORD || "doeblin_berlin";
const OPEN_COOKIE = "kehlmann_open_access";
const STUDENT_COOKIE = "kehlmann_reader_student";
const CLASS_COOKIE = "kehlmann_reader_class";
const TEACHER_COOKIE = "kehlmann_teacher_access";
const SEB_CONFIG_KEY_HASH = process.env.SEB_CONFIG_KEY_HASH || process.env.KEHLMANN_SEB_CONFIG_KEY_HASH || "";
const READER_PDF_SOURCE = "/reader/assets/doeblin-freundinnen.pdf";

function teacherRuntimeConfig() {
  return {
    openPassword: OPEN_PASSWORD,
    openUrl: "/open",
    sebUrl: "/seb",
    teacherUrl: "/teacher",
    teacherEntryUrl: "/teacher-entry",
    hasSebConfigKeyHash: Boolean(SEB_CONFIG_KEY_HASH)
  };
}

function renderShellPage({ title, body, bodyClass = "" }) {
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <style>
          :root {
            --bg: #f3efe7;
            --surface: rgba(255,255,255,0.12);
            --border: rgba(48,66,55,0.16);
            --text: #213026;
            --muted: #66736b;
            --accent: #b45c39;
            --forest: #314335;
            --shadow: 0 20px 60px rgba(30, 42, 36, 0.12);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            font-family: "Avenir Next", "Segoe UI", sans-serif;
            color: var(--text);
            background: linear-gradient(180deg, #f4f0e6 0%, #ece6d7 100%);
            position: relative;
            overflow-x: hidden;
          }
          .site-background {
            position: fixed;
            inset: 0;
            overflow: hidden;
            z-index: 0;
            pointer-events: none;
            background:
              radial-gradient(circle at top left, rgba(125, 74, 58, 0.15), transparent 26%),
              radial-gradient(circle at top right, rgba(61, 48, 43, 0.08), transparent 32%),
              linear-gradient(180deg, rgba(244, 240, 230, 0.96) 0%, rgba(236, 230, 215, 0.94) 100%);
          }
          .site-background::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(90deg, transparent 0, transparent 7%, rgba(71, 54, 47, 0.06) 7.2%, transparent 7.5%, transparent 100%),
              linear-gradient(180deg, transparent 0, transparent 72%, rgba(122, 87, 72, 0.05) 72.2%, transparent 72.5%, transparent 100%);
            opacity: 0.8;
          }
          .site-background::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 18% 18%, rgba(180, 92, 57, 0.12), transparent 0 18%),
              radial-gradient(circle at 82% 14%, rgba(49, 67, 53, 0.08), transparent 0 20%);
          }
          .page {
            max-width: 1120px;
            margin: 0 auto;
            padding: 28px 20px 48px;
            display: grid;
            gap: 20px;
            position: relative;
            z-index: 1;
          }
          .panel {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 28px;
            box-shadow: var(--shadow);
            padding: 24px;
            backdrop-filter: blur(14px);
          }
          .eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 12px;
            color: var(--muted);
            margin-bottom: 10px;
          }
          h1, h2 {
            margin: 0 0 12px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
          }
          h1 {
            font-size: clamp(2rem, 5vw, 3.6rem);
            line-height: 0.95;
          }
          p, li {
            line-height: 1.6;
            color: var(--muted);
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          .button, button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            border-radius: 999px;
            padding: 12px 18px;
            background: var(--forest);
            color: #f6f2ea;
            text-decoration: none;
            cursor: pointer;
          }
          .button.secondary, button.secondary {
            background: rgba(49,67,53,0.1);
            color: var(--forest);
          }
          input, select {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 12px 14px;
            font: inherit;
            margin: 10px 0 12px;
            background: rgba(255,255,255,0.78);
          }
          .notice {
            border-left: 4px solid var(--accent);
            padding: 14px;
            background: rgba(180,92,57,0.09);
            border-radius: 0 14px 14px 0;
            color: #62463d;
          }
          .form-grid {
            display: grid;
            gap: 10px;
          }
          .small-list {
            margin: 0;
            padding-left: 18px;
          }
          .teacher-entry-layout {
            display: grid;
            gap: 20px;
            grid-template-columns: minmax(280px, 0.38fr) minmax(0, 1fr);
          }
          .teacher-entry-sidebar,
          .teacher-entry-viewer,
          .teacher-entry-passage-list {
            display: grid;
            gap: 12px;
          }
          .teacher-entry-resource-list {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .lesson-nav-card,
          .passage-nav-card,
          .resource-nav-card {
            display: grid;
            gap: 8px;
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 14px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(12px);
            text-decoration: none;
            color: var(--text);
          }
          .lesson-nav-card.is-active,
          .passage-nav-card.is-active,
          .resource-nav-card.is-active {
            border-color: rgba(180, 92, 57, 0.45);
            background: rgba(180, 92, 57, 0.14);
          }
          .meta-grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
          .meta-card {
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 14px;
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(12px);
          }
          .iframe-shell {
            min-height: 72vh;
            border: 1px solid var(--border);
            border-radius: 20px;
            overflow: hidden;
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(10px);
          }
          .iframe-shell iframe {
            width: 100%;
            min-height: 72vh;
            border: none;
          }
          .prompt-panel {
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(12px);
          }
          .resource-panel {
            display: grid;
            gap: 14px;
          }
          .lesson-media-panel {
            display: grid;
            gap: 14px;
          }
          .lesson-media-grid {
            display: grid;
            gap: 14px;
          }
          .lesson-media-card {
            display: grid;
            gap: 12px;
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 14px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(12px);
          }
          .lesson-media-frame {
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid var(--border);
            background: linear-gradient(180deg, rgba(240, 234, 223, 0.1), rgba(230, 222, 205, 0.05));
            padding: 12px;
          }
          .lesson-media-frame img {
            display: block;
            width: 100%;
            height: 300px;
            object-fit: contain;
            object-position: center center;
          }
          .lesson-media-task {
            border-left: 4px solid var(--accent);
            padding: 12px 14px;
            border-radius: 0 14px 14px 0;
            background: rgba(180,92,57,0.09);
          }
          @media (max-width: 960px) {
            .teacher-entry-layout {
              grid-template-columns: 1fr;
            }
            .iframe-shell,
            .iframe-shell iframe {
              min-height: 58vh;
            }
          }
        </style>
      </head>
      <body class="${bodyClass}">
        <div class="site-background" aria-hidden="true"></div>
        ${body}
      </body>
    </html>
  `;
}

function lessonMeta(lessonId) {
  if (!lessonId) {
    return null;
  }

  return getLessonSetById(lessonId);
}

function renderLandingPage() {
  const lessons = getLessonSetsWithCounts();
  return renderShellPage({
    title: "Döblin Lernlandschaft",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Alfred Döblin</div>
          <h1>Die beiden Freundinnen und ihr Giftmord</h1>
          <p>
            Autonome Lernlandschaft mit integriertem PDF, Registrierung, offenen und
            SEB-geschützten Zugängen, Lehrer*innen-Dashboard, Klassen-Codes, Peer Review und
            differenziertem Fachfeedback. Die Einheit verbindet Literatur bewusst mit
            Forensik, Rechtswissenschaft und Geschichte.
          </p>
          <div class="row">
            <a class="button" href="/open">Offene Version</a>
            <a class="button secondary" href="/seb">SEB-Version</a>
            <a class="button secondary" href="/teacher-entry">Lehrer*inneneingang</a>
            <a class="button secondary" href="/teacher">Lehrer*innen-Dashboard</a>
          </div>
        </section>
        <section class="panel">
          <div class="eyebrow">Autonome Lernpfade</div>
          <ul class="small-list">
            ${lessons.map((lesson) => `<li><strong>${lesson.title}:</strong> ${lesson.summary}</li>`).join("")}
          </ul>
        </section>
      </main>
    `
  });
}

function pageRangeForLesson(lesson) {
  const pageNumbers = getEntriesForLesson(lesson.id)
    .map((entry) => Number(entry.pageNumber || 0))
    .filter(Boolean);

  if (!pageNumbers.length) {
    return "-";
  }

  const first = Math.min(...pageNumbers);
  const last = Math.max(...pageNumbers);
  return first === last ? `S. ${first}` : `S. ${first}-${last}`;
}

function teacherEntryLessons() {
  const lessons = getLessonSetsWithCounts();
  return lessons.map((lesson) => ({
    ...lesson,
    pageRange: pageRangeForLesson(lesson),
    entries: getEntriesForLesson(lesson.id)
  }));
}

function resourcesForLesson(lesson) {
  const assignmentIds = Array.isArray(lesson?.resourceAssignments)
    ? lesson.resourceAssignments.map((assignment) => assignment.resourceId)
    : [];
  const ids = assignmentIds.length
    ? assignmentIds
    : (Array.isArray(lesson?.recommendedTheoryIds) ? lesson.recommendedTheoryIds : []);

  return ids
    .map((resourceId) => {
      const resource = theoryResources.find((entry) => entry.id === resourceId);
      if (!resource) {
        return null;
      }

      const assignment = lesson.resourceAssignments?.find((entry) => entry.resourceId === resourceId);
      return {
        resource,
        assignment
      };
    })
    .filter(Boolean);
}

function renderTeacherEntryPage({ lessonId, entryId } = {}) {
  const config = teacherRuntimeConfig();
  const lessons = teacherEntryLessons();
  const currentLesson = lessons.find((lesson) => lesson.id === lessonId) || lessons[0];
  const currentEntry = currentLesson.entries.find((entry) => entry.id === entryId) || currentLesson.entries[0];
  const pdfUrl = `${READER_PDF_SOURCE}#page=${currentEntry?.pageNumber || 1}&zoom=page-width`;
  const lessonResources = resourcesForLesson(currentLesson);
  const lessonMedia = Array.isArray(currentLesson.chapterMedia) ? currentLesson.chapterMedia : [];
  const selectedResource = lessonResources[0] || null;
  const selectedResourceMarkup = selectedResource
    ? selectedResource.resource.mediaType === "pdf"
      ? `<div class="iframe-shell"><iframe src="${selectedResource.resource.embedUrl}#page=1&zoom=page-width" title="${selectedResource.resource.title}"></iframe></div>`
      : selectedResource.resource.mediaType === "html"
        ? `<div class="iframe-shell"><iframe src="${selectedResource.resource.embedUrl}" title="${selectedResource.resource.title}"></iframe></div>`
      : `
        <div class="prompt-panel">
          <video controls preload="metadata" style="width:100%; border-radius:16px; background:#000;">
            <source src="${selectedResource.resource.embedUrl}" type="video/mp4">
          </video>
        </div>
      `
    : "";

  return renderShellPage({
    title: "Lehrer*inneneingang · Döblin",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Lehrer*inneneingang</div>
          <h1>Alle Aufgaben direkt sehen</h1>
          <p>
            Diese Übersicht ist mit demselben Passwort wie das Lehrer*innen-Dashboard geschützt. Sie zeigt alle Lektionen,
            die zugehörigen Passagen, Fokusfragen, Seitenkorridore und Arbeitsaufträge direkt, ohne dass zuerst ein
            Klassen-Code oder ein Schülerzugang freigeschaltet werden muss.
          </p>
          <div class="row">
            <a class="button" href="/">Zur Startseite</a>
            <a class="button secondary" href="/teacher">Zum Lehrer*innen-Dashboard</a>
            <a class="button secondary" href="/open/lesson/${currentLesson.id}">Diese Lektion im Reader öffnen</a>
          </div>
        </section>

        <section class="panel">
          <div class="eyebrow">Betriebsprotokoll</div>
          <h2>Passwort, Klassen-Code und SEB sauber starten</h2>
          <div class="meta-grid">
            <div class="meta-card">
              <strong>Offene Version</strong>
              <p>${config.openUrl}</p>
            </div>
            <div class="meta-card">
              <strong>SEB-Version</strong>
              <p>${config.sebUrl}</p>
            </div>
            <div class="meta-card">
              <strong>Aktuelles Unterrichtspasswort</strong>
              <p>${config.openPassword}</p>
            </div>
            <div class="meta-card">
              <strong>SEB-Konfiguration</strong>
              <p>${config.hasSebConfigKeyHash ? "Serverseitig zusätzlich an einen SEB-Konfigurationsschlüssel gebunden." : "Keine zusätzliche SEB-Konfigurationsbindung aktiv."}</p>
            </div>
          </div>
          <div class="teacher-entry-resource-list">
            <article class="resource-nav-card">
              <strong>1. Klasse anlegen</strong>
              <span>Im Lehrer*innen-Dashboard eine neue Klasse anlegen. Dabei wird sofort ein eigener Klassen-Code erzeugt.</span>
            </article>
            <article class="resource-nav-card">
              <strong>2. Klassen-Code kopieren</strong>
              <span>Den Code im Dashboard mit <em>Code kopieren</em> übernehmen oder mit <em>Code neu erzeugen</em> austauschen.</span>
            </article>
            <article class="resource-nav-card">
              <strong>3. Offene Version</strong>
              <span>Schüler*innen öffnen <em>${config.openUrl}</em> und melden sich mit Klassen-Code, Namen/Kürzel und dem Passwort <strong>${config.openPassword}</strong> an.</span>
            </article>
            <article class="resource-nav-card">
              <strong>4. SEB-Version</strong>
              <span>Im Dashboard die aktive SEB-Lektion setzen, speichern und dann auf einem Testgerät <em>${config.sebUrl}</em> im Safe Exam Browser prüfen.</span>
            </article>
            <article class="resource-nav-card">
              <strong>5. SEB-Anmeldung</strong>
              <span>Schüler*innen öffnen im Safe Exam Browser <em>${config.sebUrl}</em> und melden sich nur mit Klassen-Code und Namen an.</span>
            </article>
            <article class="resource-nav-card">
              <strong>6. Endkontrolle</strong>
              <span>Immer selbst testen: Klasse angelegt, Code stimmt, Passwort notiert, offene Version funktioniert, SEB zeigt die richtige Lektion.</span>
            </article>
          </div>
        </section>

        <section class="teacher-entry-layout">
          <aside class="panel teacher-entry-sidebar">
            <div>
              <div class="eyebrow">Lektionen</div>
              <h2>Direkter Aufgabenüberblick</h2>
            </div>
            ${lessons.map((lesson) => `
              <a class="lesson-nav-card ${lesson.id === currentLesson.id ? "is-active" : ""}" href="/teacher-entry?lesson=${lesson.id}">
                <strong>${lesson.title}</strong>
                <span>${lesson.summary}</span>
                <span>${lesson.pageRange} · ${lesson.entryCount} Passagen</span>
              </a>
            `).join("")}
          </aside>

          <section class="panel teacher-entry-viewer">
            <div>
              <div class="eyebrow">${currentLesson.title}</div>
              <h2>${currentLesson.summary}</h2>
            </div>

            <div class="meta-grid">
              <div class="meta-card">
                <strong>Review-Fokus</strong>
                <p>${currentLesson.reviewFocus}</p>
              </div>
              <div class="meta-card">
                <strong>SEB-Arbeitsauftrag</strong>
                <p>${currentLesson.sebPrompt}</p>
              </div>
              <div class="meta-card">
                <strong>Seitenkorridor</strong>
                <p>${currentLesson.pageRange}</p>
              </div>
            </div>

            ${lessonMedia.length ? `
              <section class="lesson-media-panel">
                <div class="eyebrow">Bildauftakt dieser Lektion</div>
                <div class="lesson-media-grid">
                  ${lessonMedia.map((item) => `
                    <article class="lesson-media-card">
                      <div class="lesson-media-frame">
                        <img src="${item.src}" alt="${item.alt || item.title}">
                      </div>
                      <div>
                        <strong>${item.title}</strong>
                        <p>${item.caption}</p>
                      </div>
                      <div class="lesson-media-task">
                        <strong>Arbeitsimpuls</strong>
                        <p>${item.focusPrompt}</p>
                      </div>
                    </article>
                  `).join("")}
                </div>
              </section>
            ` : ""}

            <div class="teacher-entry-passage-list">
              <div class="eyebrow">Passagen dieser Lektion</div>
              ${currentLesson.entries.map((entry) => `
                <a class="passage-nav-card ${entry.id === currentEntry.id ? "is-active" : ""}" href="/teacher-entry?lesson=${currentLesson.id}&entry=${entry.id}">
                  <strong>${entry.title}</strong>
                  <span>${entry.pageHint} · ${entry.passageLabel}</span>
                </a>
              `).join("")}
            </div>

              <div class="prompt-panel">
              <div class="eyebrow">Aktuelle Passage</div>
              <h2>${currentEntry.title}</h2>
              <p><strong>${currentEntry.pageHint}</strong> · ${currentEntry.passageLabel}</p>
              <p>${currentEntry.context}</p>
              ${(currentEntry.focusTasks || []).map((task, index) => `
                <div class="lesson-media-task">
                  <strong>Fokusauftrag ${index + 1}</strong>
                  <p>${task.prompt}</p>
                  <p>${task.instruction}</p>
                  <ul class="small-list">
                    ${(task.checklist || []).map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>

            <div class="iframe-shell">
              <iframe src="${pdfUrl}" title="Döblin PDF"></iframe>
            </div>

            ${lessonResources.length ? `
              <section class="resource-panel">
                <div>
                  <div class="eyebrow">Pflichtressourcen dieser Lektion</div>
                  <h2>Podcast, Dossiers, Sekundärtexte und Theorie integriert</h2>
                </div>
                <div class="teacher-entry-resource-list">
                  ${lessonResources.map(({ resource, assignment }) => `
                    <article class="resource-nav-card ${resource.id === selectedResource?.resource?.id ? "is-active" : ""}">
                      <strong>${assignment?.title || resource.title}</strong>
                      <span>${resource.sourceTitle}</span>
                      <span>${assignment?.summary || resource.summary}</span>
                      ${assignment?.task ? `<p><strong>Auftrag:</strong> ${assignment.task}</p>` : ""}
                      ${assignment?.questionTasks?.length ? `
                        <ul class="small-list">
                          ${assignment.questionTasks.map((questionTask) => `<li>${questionTask.prompt}</li>`).join("")}
                        </ul>
                      ` : ""}
                      <div class="row">
                        <a class="button secondary" href="${resource.openUrl}" target="_blank" rel="noreferrer">${resource.mediaType === "pdf" ? "PDF extern öffnen" : resource.mediaType === "html" ? "Quelle extern öffnen" : "Video extern öffnen"}</a>
                        ${resource.audioUrl
                          ? `<a class="button secondary" href="${resource.audioUrl}" target="_blank" rel="noreferrer">${resource.audioLabel || "Audio extern öffnen"}</a>`
                          : ""
                        }
                      </div>
                    </article>
                  `).join("")}
                </div>
                ${selectedResourceMarkup}
              </section>
            ` : ""}
          </section>
        </section>
      </main>
    `
  });
}

function renderStudentAccessPage({ mode, lessonId, errorText = "" }) {
  const isOpen = mode === "open";
  const lesson = lessonMeta(lessonId);
  const formAction = isOpen ? "/auth/open" : "/auth/seb";
  const title = isOpen ? "Döblin entsperren" : "SEB-Version öffnen";
  const heading = isOpen ? "Roman-Reader entsperren" : "SEB-Reader starten";

  return renderShellPage({
    title,
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">${isOpen ? "Offene Version" : "SEB-Version"}</div>
          <h1>${heading}</h1>
          <p>
            ${isOpen
              ? "Diese Version ist für Unterricht, Hausaufgaben oder gemeinsame Analysephasen gedacht und wird über Unterrichtspasswort, Klassen-Code und Namen freigeschaltet."
              : "Diese Version läuft nur im Safe Exam Browser. Für die Zuordnung zur Klasse gibst du nur Klassen-Code und Namen an."}
          </p>
          <div class="notice">
            <strong>So funktioniert die Anmeldung:</strong>
            <br>1. Klassen-Code exakt eingeben.
            <br>2. Deinen Namen oder ein eindeutiges Kürzel eintragen.
            ${isOpen ? "<br>3. Das Unterrichtspasswort eingeben." : ""}
            <br>${isOpen ? "4." : "3."} Auf ${isOpen ? "Freischalten" : "Starten"} klicken und dann direkt in der zugewiesenen Lektion arbeiten.
          </div>
          ${lesson ? `<div class="notice"><strong>Vorgewählte Lektion:</strong> ${lesson.title}<br>${lesson.sebPrompt}</div>` : ""}
          ${errorText ? `<div class="notice"><strong>Hinweis:</strong> ${errorText}</div>` : ""}
          <form method="post" action="${formAction}" class="form-grid">
            <input type="hidden" name="lessonId" value="${lessonId || ""}">
            <label for="classCode">Klassen-Code</label>
            <input id="classCode" name="classCode" type="text" autocomplete="off" placeholder="z. B. DOEB-10A">
            <label for="displayName">Name / Kürzel</label>
            <input id="displayName" name="displayName" type="text" autocomplete="name" placeholder="z. B. Nora S.">
            ${isOpen ? `
              <label for="password">Unterrichtspasswort</label>
              <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Passwort eingeben">
            ` : ""}
            <div class="row">
              <button type="submit">${isOpen ? "Freischalten" : "Starten"}</button>
              <a class="button secondary" href="/">Zur Übersicht</a>
            </div>
          </form>
        </section>
      </main>
    `
  });
}

function normalizeTeacherRedirect(target) {
  return target === "/teacher-entry" ? "/teacher-entry" : "/teacher";
}

function renderTeacherLoginPage(errorText = "", redirectTo = "/teacher") {
  const safeRedirect = normalizeTeacherRedirect(redirectTo);
  const isTeacherEntry = safeRedirect === "/teacher-entry";
  return renderShellPage({
    title: `${isTeacherEntry ? "Lehrer*inneneingang" : "Lehrer*innen-Dashboard"} · Döblin`,
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">${isTeacherEntry ? "Lehrer*inneneingang" : "Lehrer*innen-Dashboard"}</div>
          <h1>${isTeacherEntry ? "Lehrer*inneneingang entsperren" : "Lehrer*innen-Dashboard entsperren"}</h1>
          <p>${isTeacherEntry
            ? "Der Lehrer*inneneingang zeigt alle Lektionen, Passagen und Fragen direkt, ist aber mit demselben Passwort wie das Lehrer*innen-Dashboard geschützt."
            : "Die Lehrer*innenansicht verwaltet Klassen-Codes, SEB-Lektionen, Peer Review und Lernfortschritte für diese eine 22-Bahnen-Einheit."}</p>
          ${errorText ? `<div class="notice"><strong>Hinweis:</strong> ${errorText}</div>` : ""}
          <form method="post" action="/auth/teacher" class="form-grid">
            <input type="hidden" name="redirectTo" value="${safeRedirect}">
            <label for="teacherPassword">Lehrer*innen-Passwort</label>
            <input id="teacherPassword" name="password" type="password" autocomplete="current-password" placeholder="Passwort eingeben">
            <div class="row">
              <button type="submit">${isTeacherEntry ? "Lehrer*inneneingang öffnen" : "Lehrer*innen-Dashboard öffnen"}</button>
              <a class="button secondary" href="${isTeacherEntry ? "/teacher" : "/teacher-entry"}">${isTeacherEntry ? "Zum Lehrer*innen-Dashboard" : "Zum Lehrer*inneneingang"}</a>
              <a class="button secondary" href="/">Zur Übersicht</a>
            </div>
          </form>
        </section>
      </main>
    `
  });
}

function renderSebBlockedPage() {
  return renderShellPage({
    title: "SEB erforderlich",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">SEB-Version</div>
          <h1>Zugriff nur über Safe Exam Browser</h1>
          <div class="notice">
            Diese Fassung akzeptiert nur Anfragen aus Safe Exam Browser.
            ${SEB_CONFIG_KEY_HASH ? " Zusätzlich ist serverseitig ein bestimmter SEB-Konfigurationsschlüssel hinterlegt." : ""}
          </div>
          <p>Starte das Tool direkt im konfigurierten SEB-Fenster oder nutze alternativ die offene Version mit Passwort.</p>
          <div class="row">
            <a class="button secondary" href="/open">Offene Version</a>
            <a class="button secondary" href="/">Zur Übersicht</a>
          </div>
        </section>
      </main>
    `
  });
}

function renderTeacherPage() {
  const config = teacherRuntimeConfig();
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lehrer*innen-Dashboard · Döblin Lernlandschaft</title>
        <link rel="stylesheet" href="/kehlmann-teacher/styles.css">
      </head>
      <body>
        <div class="site-background" aria-hidden="true"></div>
        <script>
          window.KEHLMANN_TEACHER_CONFIG = ${JSON.stringify(config)};
        </script>
        <script type="module" src="/kehlmann-teacher/app.js"></script>
      </body>
    </html>
  `;
}

function renderReaderPage(mode, lessonId) {
  const modeLabel = mode === "seb" ? "Safe Exam Browser" : "Offene Version";
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Döblin Lernlandschaft</title>
        <link rel="stylesheet" href="/reader/styles.css">
      </head>
      <body>
        <div class="site-background" aria-hidden="true"></div>
        <script>
          window.KEHLMANN_READER_MODE = "${mode}";
          window.KEHLMANN_READER_MODE_LABEL = "${modeLabel}";
          window.KEHLMANN_READER_CONFIG = ${JSON.stringify({ forcedLessonId: lessonId || null })};
        </script>
        <script type="module" src="/reader/app.js"></script>
      </body>
    </html>
  `;
}

function getCookies(request) {
  return parseCookies(request.headers.cookie || "");
}

function hasStudentSession(request) {
  const cookies = getCookies(request);
  return Boolean(cookies[STUDENT_COOKIE]);
}

function clearStudentCookies(response) {
  response.append("Set-Cookie", `${OPEN_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  response.append("Set-Cookie", `${STUDENT_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  response.append("Set-Cookie", `${CLASS_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

function clearStudentSessionOnly(response) {
  response.append("Set-Cookie", `${STUDENT_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  response.append("Set-Cookie", `${CLASS_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

function setStudentCookies(response, classroom, student, includeOpenAccess = false) {
  if (includeOpenAccess) {
    response.append("Set-Cookie", `${OPEN_COOKIE}=1; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
  }
  response.append("Set-Cookie", `${STUDENT_COOKIE}=${student.id}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
  response.append("Set-Cookie", `${CLASS_COOKIE}=${classroom.id}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
}

function hasTeacherAccess(request) {
  return getCookies(request)[TEACHER_COOKIE] === "1";
}

function lessonRedirect(mode, lessonId) {
  if (!lessonId) {
    return `/${mode}`;
  }
  return `/${mode}/lesson/${lessonId}`;
}

async function hasValidStudentSession(request) {
  const studentId = getCookies(request)[STUDENT_COOKIE];
  if (!studentId) {
    return false;
  }

  const store = await readReaderStore();
  return Boolean(buildReaderBootstrap(store, studentId));
}

export function createApp() {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/reader-api", kehlmannReaderApiRouter);
  app.use("/reader/assets", express.static(readerAssetDir));
  app.use("/reader", express.static(readerDir));
  app.use("/kehlmann-teacher", express.static(teacherDir));

  app.get("/", (_request, response) => {
    response.send(renderLandingPage());
  });

  app.get("/teacher-entry", (request, response) => {
    if (!hasTeacherAccess(request)) {
      response.send(renderTeacherLoginPage("", "/teacher-entry"));
      return;
    }

    response.send(renderTeacherEntryPage({
      lessonId: request.query.lesson,
      entryId: request.query.entry
    }));
  });

  app.post("/auth/open", async (request, response) => {
    const { password, classCode, displayName, lessonId } = request.body;

    if (password !== OPEN_PASSWORD) {
      response.status(401).send(renderStudentAccessPage({
        mode: "open",
        lessonId,
        errorText: "Das Unterrichtspasswort stimmt nicht."
      }));
      return;
    }

    try {
      const access = await updateReaderStore(async (store) => (
        createOrResumeStudent(store, {
          classCode,
          displayName,
          mode: "open",
          lessonId
        })
      ));

      setStudentCookies(response, access.classroom, access.student, true);
      response.redirect(303, lessonRedirect("open", lessonId));
    } catch (error) {
      response.status(401).send(renderStudentAccessPage({
        mode: "open",
        lessonId,
        errorText: error.message
      }));
    }
  });

  app.post("/auth/seb", async (request, response) => {
    const { classCode, displayName, lessonId } = request.body;

    try {
      const access = await updateReaderStore(async (store) => (
        createOrResumeStudent(store, {
          classCode,
          displayName,
          mode: "seb",
          lessonId
        })
      ));

      setStudentCookies(response, access.classroom, access.student, false);
      response.redirect(303, lessonRedirect("seb", lessonId));
    } catch (error) {
      response.status(401).send(renderStudentAccessPage({
        mode: "seb",
        lessonId,
        errorText: error.message
      }));
    }
  });

  app.post("/auth/teacher", (request, response) => {
    const redirectTo = normalizeTeacherRedirect(request.body.redirectTo);
    if (request.body.password !== TEACHER_PASSWORD) {
    response.status(401).send(renderTeacherLoginPage("Das Lehrer*innen-Passwort stimmt nicht.", redirectTo));
      return;
    }

    response.setHeader("Set-Cookie", `${TEACHER_COOKIE}=1; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
    response.redirect(303, redirectTo);
  });

  app.get("/auth/logout", (_request, response) => {
    clearStudentCookies(response);
    response.redirect("/");
  });

  app.get("/auth/teacher/logout", (_request, response) => {
    response.setHeader("Set-Cookie", `${TEACHER_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
    response.redirect("/");
  });

  app.get("/open", async (request, response) => {
    if (!hasOpenAccess(request, OPEN_COOKIE) || !hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "open" }));
      return;
    }

    if (!(await hasValidStudentSession(request))) {
      clearStudentSessionOnly(response);
      response.send(renderStudentAccessPage({
        mode: "open",
        errorText: "Die frühere Reader-Sitzung war nicht mehr gültig. Bitte melde dich mit Klassen-Code, Namen und Unterrichtspasswort erneut an."
      }));
      return;
    }

    response.send(renderReaderPage("open"));
  });

  app.get("/open/lesson/:lessonId", async (request, response) => {
    if (!hasOpenAccess(request, OPEN_COOKIE) || !hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "open", lessonId: request.params.lessonId }));
      return;
    }

    if (!(await hasValidStudentSession(request))) {
      clearStudentSessionOnly(response);
      response.send(renderStudentAccessPage({
        mode: "open",
        lessonId: request.params.lessonId,
        errorText: "Die frühere Reader-Sitzung war nicht mehr gültig. Bitte melde dich mit Klassen-Code, Namen und Unterrichtspasswort erneut an."
      }));
      return;
    }

    response.send(renderReaderPage("open", request.params.lessonId));
  });

  app.get("/seb", async (request, response) => {
    if (!isSafeExamBrowserRequest(request, SEB_CONFIG_KEY_HASH)) {
      response.status(403).send(renderSebBlockedPage());
      return;
    }

    if (!hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "seb" }));
      return;
    }

    if (!(await hasValidStudentSession(request))) {
      clearStudentSessionOnly(response);
      response.send(renderStudentAccessPage({
        mode: "seb",
        errorText: "Die frühere Reader-Sitzung war nicht mehr gültig. Bitte melde dich mit Klassen-Code und Namen erneut an."
      }));
      return;
    }

    response.send(renderReaderPage("seb"));
  });

  app.get("/seb/lesson/:lessonId", async (request, response) => {
    if (!isSafeExamBrowserRequest(request, SEB_CONFIG_KEY_HASH)) {
      response.status(403).send(renderSebBlockedPage());
      return;
    }

    if (!hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "seb", lessonId: request.params.lessonId }));
      return;
    }

    if (!(await hasValidStudentSession(request))) {
      clearStudentSessionOnly(response);
      response.send(renderStudentAccessPage({
        mode: "seb",
        lessonId: request.params.lessonId,
        errorText: "Die frühere Reader-Sitzung war nicht mehr gültig. Bitte melde dich mit Klassen-Code und Namen erneut an."
      }));
      return;
    }

    response.send(renderReaderPage("seb", request.params.lessonId));
  });

  app.get("/teacher", (request, response) => {
    if (!hasTeacherAccess(request)) {
      response.send(renderTeacherLoginPage("", "/teacher"));
      return;
    }

    response.send(renderTeacherPage());
  });

  return app;
}
