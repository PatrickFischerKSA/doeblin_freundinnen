import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiRouter } from "./routes/api.mjs";
import { hasOpenAccess, isSafeExamBrowserRequest } from "./services/access.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const readerDir = path.join(publicDir, "reader");
const OPEN_PASSWORD = process.env.OPEN_VERSION_PASSWORD || "thiel";
const OPEN_COOKIE = "thiel_open_access";
const SEB_CONFIG_KEY_HASH = process.env.SEB_CONFIG_KEY_HASH || "";

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
          h1 {
            margin: 0 0 12px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: clamp(2rem, 5vw, 3.6rem);
            line-height: 0.95;
          }
          p {
            line-height: 1.6;
            color: var(--muted);
          }
          .cards {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          .card {
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 18px;
            background: rgba(255,255,255,0.72);
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
          input {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 12px 14px;
            font: inherit;
            margin: 10px 0 12px;
            background: rgba(255,255,255,0.9);
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          .notice {
            border-left: 4px solid var(--accent);
            padding: 14px;
            background: rgba(180,92,57,0.09);
            border-radius: 0 14px 14px 0;
            color: #62463d;
          }
        </style>
      </head>
      <body class="${bodyClass}">
        ${body}
      </body>
    </html>
  `;
}

function renderLandingPage() {
  return renderShellPage({
    title: "Bahnwärter Thiel Lesetool",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Konkrete Umsetzung</div>
          <h1>Bahnwärter Thiel Lesetool</h1>
          <p>
            Zwei zugängliche Fassungen für den Unterricht: eine offene Variante mit Passwort und eine SEB-Variante
            ohne weiteres Passwort. Beide führen direkt in ein konkretes, textnahes Lesetool mit Szenen, Signalwörtern,
            Deutungsnotizen und lokal gespeicherten Arbeitsständen.
          </p>
        </section>
        <section class="cards">
          <article class="card">
            <div class="eyebrow">Offene Version</div>
            <h2>Passwortgeschützt</h2>
            <p>Für Unterricht, Hausaufgaben oder offene Lernsettings. Das Passwort wird getrennt weitergegeben und nicht auf der Startseite angezeigt.</p>
            <a class="button" href="/open">Zur offenen Version</a>
          </article>
          <article class="card">
            <div class="eyebrow">Safe Exam Browser</div>
            <h2>SEB-only</h2>
            <p>Öffnet nur innerhalb von Safe Exam Browser. Optional kann zusätzlich ein fixer Config-Key-Hash erzwungen werden.</p>
            <a class="button" href="/seb">Zur SEB-Version</a>
          </article>
          <article class="card">
            <div class="eyebrow">Studio</div>
            <h2>Plattform-Backbone</h2>
            <p>Die generische Mehrprojekt-Plattform mit Annotationen, Reviews und Projektanlage bleibt separat verfügbar.</p>
            <a class="button secondary" href="/studio">Zum Studio</a>
          </article>
        </section>
      </main>
    `
  });
}

function renderOpenLoginPage() {
  return renderShellPage({
    title: "Offene Version entsperren",
    body: `
      <main class="page">
        <section class="panel">
          <div class="eyebrow">Offene Version</div>
          <h1>Lesetool entsperren</h1>
          <p>Diese Version ist für offene Unterrichtssituationen gedacht und wird über ein separates Unterrichtspasswort freigeschaltet.</p>
          <form method="post" action="/auth/open">
            <label for="password">Passwort</label>
            <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Passwort eingeben">
            <div class="row">
              <button type="submit">Freischalten</button>
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

function renderReaderPage(mode) {
  const modeLabel = mode === "seb" ? "Safe Exam Browser" : "Offene Version";
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bahnwärter Thiel Lesetool</title>
        <link rel="stylesheet" href="/reader/styles.css">
      </head>
      <body>
        <script>
          window.THIEL_READER_MODE = "${mode}";
          window.THIEL_READER_MODE_LABEL = "${modeLabel}";
        </script>
        <script type="module" src="/reader/app.js"></script>
      </body>
    </html>
  `;
}

export function createApp() {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", apiRouter);
  app.use("/reader", express.static(readerDir));

  app.get("/", (_request, response) => {
    response.send(renderLandingPage());
  });

  app.post("/auth/open", (request, response) => {
    if (request.body.password !== OPEN_PASSWORD) {
      response.status(401).send(renderShellPage({
        title: "Falsches Passwort",
        body: `
          <main class="page">
            <section class="panel">
              <div class="eyebrow">Offene Version</div>
              <h1>Passwort stimmt nicht</h1>
              <p>Bitte versuche es erneut oder gehe zur Übersicht zurück.</p>
              <div class="row">
                <a class="button" href="/open">Erneut versuchen</a>
                <a class="button secondary" href="/">Zur Übersicht</a>
              </div>
            </section>
          </main>
        `
      }));
      return;
    }

    response.setHeader("Set-Cookie", `${OPEN_COOKIE}=1; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`);
    response.redirect(303, "/open");
  });

  app.get("/auth/logout", (_request, response) => {
    response.setHeader("Set-Cookie", `${OPEN_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
    response.redirect("/");
  });

  app.get("/open", (request, response) => {
    if (!hasOpenAccess(request, OPEN_COOKIE)) {
      response.send(renderOpenLoginPage());
      return;
    }

    response.send(renderReaderPage("open"));
  });

  app.get("/seb", (request, response) => {
    if (!isSafeExamBrowserRequest(request, SEB_CONFIG_KEY_HASH)) {
      response.status(403).send(renderSebBlockedPage());
      return;
    }

    response.send(renderReaderPage("seb"));
  });

  app.get("/studio", (_request, response) => {
    response.sendFile(path.join(publicDir, "index.html"));
  });

  app.get("/studio/*", (_request, response) => {
    response.sendFile(path.join(publicDir, "index.html"));
  });

  app.use(express.static(publicDir));

  return app;
}
