import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kehlmannReaderApiRouter } from "./routes/kehlmann-reader-api.mjs";
import { hasOpenAccess, isSafeExamBrowserRequest, parseCookies } from "./services/access.mjs";
import { getLessonSetById, getLessonSetsWithCounts } from "./services/kehlmann-reader-progress.mjs";
import { createOrResumeStudent, updateReaderStore } from "./services/kehlmann-reader-store.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const readerDir = path.join(publicDir, "kehlmann-reader");
const teacherDir = path.join(publicDir, "kehlmann-teacher");
const OPEN_PASSWORD = process.env.OPEN_VERSION_PASSWORD || process.env.KEHLMANN_OPEN_VERSION_PASSWORD || "kehlmann";
const TEACHER_PASSWORD = process.env.TEACHER_DASHBOARD_PASSWORD || "kursraum";
const OPEN_COOKIE = "kehlmann_open_access";
const STUDENT_COOKIE = "kehlmann_reader_student";
const CLASS_COOKIE = "kehlmann_reader_class";
const TEACHER_COOKIE = "kehlmann_teacher_access";
const SEB_CONFIG_KEY_HASH = process.env.SEB_CONFIG_KEY_HASH || process.env.KEHLMANN_SEB_CONFIG_KEY_HASH || "";

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
            --surface: rgba(255,255,255,0.86);
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
            background:
              radial-gradient(circle at top left, rgba(180, 92, 57, 0.16), transparent 30%),
              radial-gradient(circle at top right, rgba(49, 67, 53, 0.18), transparent 36%),
              linear-gradient(180deg, #f4f0e6 0%, #ece6d7 100%);
          }
          .page {
            max-width: 1120px;
            margin: 0 auto;
            padding: 28px 20px 48px;
            display: grid;
            gap: 20px;
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
            background: rgba(255,255,255,0.9);
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
        </style>
      </head>
      <body class="${bodyClass}">
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
    title: "Die Reise der Verlorenen Lesetool",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Daniel Kehlmann</div>
          <h1>Die Reise der Verlorenen</h1>
          <p>
            Vollständige Unterrichtseinheit mit integriertem PDF, offenen und SEB-geschützten Zugängen,
            Lehrkraft-Dashboard, Klassen-Codes, Peer Review und differenziertem Fachfeedback.
          </p>
          <div class="row">
            <a class="button" href="/open">Offene Version</a>
            <a class="button secondary" href="/seb">SEB-Version</a>
            <a class="button secondary" href="/teacher">Lehrkraft-Dashboard</a>
          </div>
        </section>
        <section class="panel">
          <div class="eyebrow">Lektionssets</div>
          <ul class="small-list">
            ${lessons.map((lesson) => `<li><strong>${lesson.title}:</strong> ${lesson.summary}</li>`).join("")}
          </ul>
        </section>
      </main>
    `
  });
}

function renderStudentAccessPage({ mode, lessonId, errorText = "" }) {
  const isOpen = mode === "open";
  const lesson = lessonMeta(lessonId);
  const formAction = isOpen ? "/auth/open" : "/auth/seb";
  const title = isOpen ? "Die Reise der Verlorenen entsperren" : "SEB-Version öffnen";
  const heading = isOpen ? "Drama-Einheit entsperren" : "SEB-Dramenreader starten";

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
          ${lesson ? `<div class="notice"><strong>Vorgewählte Lektion:</strong> ${lesson.title}<br>${lesson.sebPrompt}</div>` : ""}
          ${errorText ? `<div class="notice"><strong>Hinweis:</strong> ${errorText}</div>` : ""}
          <form method="post" action="${formAction}" class="form-grid">
            <input type="hidden" name="lessonId" value="${lessonId || ""}">
            <label for="classCode">Klassen-Code</label>
            <input id="classCode" name="classCode" type="text" autocomplete="off" placeholder="z. B. KEHL-10A">
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

function renderTeacherLoginPage(errorText = "") {
  return renderShellPage({
    title: "Lehrkraft-Dashboard · Die Reise der Verlorenen",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Lehrkraft-Dashboard</div>
          <h1>Dashboard entsperren</h1>
          <p>Die Lehrkraftansicht verwaltet Klassen-Codes, SEB-Lektionen, Peer Review und Lernfortschritte für diese eine Kehlmann-Einheit.</p>
          ${errorText ? `<div class="notice"><strong>Hinweis:</strong> ${errorText}</div>` : ""}
          <form method="post" action="/auth/teacher" class="form-grid">
            <label for="teacherPassword">Lehrkraft-Passwort</label>
            <input id="teacherPassword" name="password" type="password" autocomplete="current-password" placeholder="Passwort eingeben">
            <div class="row">
              <button type="submit">Dashboard öffnen</button>
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
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lehrkraft-Dashboard · Die Reise der Verlorenen</title>
        <link rel="stylesheet" href="/kehlmann-teacher/styles.css">
      </head>
      <body>
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
        <title>Die Reise der Verlorenen Lesetool</title>
        <link rel="stylesheet" href="/reader/styles.css">
      </head>
      <body>
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

export function createApp() {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/reader-api", kehlmannReaderApiRouter);
  app.use("/reader", express.static(readerDir));
  app.use("/kehlmann-teacher", express.static(teacherDir));

  app.get("/", (_request, response) => {
    response.send(renderLandingPage());
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
    if (request.body.password !== TEACHER_PASSWORD) {
      response.status(401).send(renderTeacherLoginPage("Das Lehrkraft-Passwort stimmt nicht."));
      return;
    }

    response.setHeader("Set-Cookie", `${TEACHER_COOKIE}=1; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
    response.redirect(303, "/teacher");
  });

  app.get("/auth/logout", (_request, response) => {
    clearStudentCookies(response);
    response.redirect("/");
  });

  app.get("/auth/teacher/logout", (_request, response) => {
    response.setHeader("Set-Cookie", `${TEACHER_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
    response.redirect("/");
  });

  app.get("/open", (request, response) => {
    if (!hasOpenAccess(request, OPEN_COOKIE) || !hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "open" }));
      return;
    }

    response.send(renderReaderPage("open"));
  });

  app.get("/open/lesson/:lessonId", (request, response) => {
    if (!hasOpenAccess(request, OPEN_COOKIE) || !hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "open", lessonId: request.params.lessonId }));
      return;
    }

    response.send(renderReaderPage("open", request.params.lessonId));
  });

  app.get("/seb", (request, response) => {
    if (!isSafeExamBrowserRequest(request, SEB_CONFIG_KEY_HASH)) {
      response.status(403).send(renderSebBlockedPage());
      return;
    }

    if (!hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "seb" }));
      return;
    }

    response.send(renderReaderPage("seb"));
  });

  app.get("/seb/lesson/:lessonId", (request, response) => {
    if (!isSafeExamBrowserRequest(request, SEB_CONFIG_KEY_HASH)) {
      response.status(403).send(renderSebBlockedPage());
      return;
    }

    if (!hasStudentSession(request)) {
      response.send(renderStudentAccessPage({ mode: "seb", lessonId: request.params.lessonId }));
      return;
    }

    response.send(renderReaderPage("seb", request.params.lessonId));
  });

  app.get("/teacher", (request, response) => {
    if (!hasTeacherAccess(request)) {
      response.send(renderTeacherLoginPage());
      return;
    }

    response.send(renderTeacherPage());
  });

  return app;
}
