import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiRouter } from "./routes/api.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use("/api", apiRouter);
  app.use(express.static(publicDir));

  app.get("*", (_request, response) => {
    response.sendFile(path.join(publicDir, "index.html"));
  });

  return app;
}
