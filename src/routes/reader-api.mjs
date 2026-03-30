import { Router } from "express";
import {
  buildReaderBootstrap,
  buildTeacherOverview,
  createClassroom,
  readReaderStore,
  regenerateClassroomCode,
  saveReaderProgress,
  updateClassroomSettings,
  updateReaderStore
} from "../services/reader-store.mjs";
import { parseCookies } from "../services/access.mjs";

export const readerApiRouter = Router();

const STUDENT_COOKIE = "thiel_reader_student";
const TEACHER_COOKIE = "thiel_teacher_access";

function getStudentId(request) {
  return parseCookies(request.headers.cookie || "")[STUDENT_COOKIE] || null;
}

function hasTeacherAccess(request) {
  return parseCookies(request.headers.cookie || "")[TEACHER_COOKIE] === "1";
}

function badRequest(response, message, status = 400) {
  response.status(status).json({ error: message });
}

readerApiRouter.get("/bootstrap", async (request, response) => {
  const store = await readReaderStore();
  const studentId = getStudentId(request);
  if (!studentId) {
    return badRequest(response, "Reader-Sitzung fehlt.", 401);
  }

  const bootstrap = buildReaderBootstrap(store, studentId);
  if (!bootstrap) {
    return badRequest(response, "Reader-Sitzung nicht gefunden.", 401);
  }

  response.json(bootstrap);
});

readerApiRouter.post("/progress", async (request, response) => {
  const studentId = getStudentId(request);
  if (!studentId) {
    return badRequest(response, "Reader-Sitzung fehlt.", 401);
  }

  try {
    const result = await updateReaderStore(async (store) => {
      saveReaderProgress(store, studentId, request.body);
      return buildReaderBootstrap(store, studentId);
    });

    response.json(result);
  } catch (error) {
    badRequest(response, error.message);
  }
});

readerApiRouter.get("/teacher/bootstrap", async (request, response) => {
  if (!hasTeacherAccess(request)) {
    return badRequest(response, "Lehrkraft-Zugang erforderlich.", 401);
  }

  const store = await readReaderStore();
  response.json(buildTeacherOverview(store));
});

readerApiRouter.post("/teacher/classes", async (request, response) => {
  if (!hasTeacherAccess(request)) {
    return badRequest(response, "Lehrkraft-Zugang erforderlich.", 401);
  }

  try {
    const result = await updateReaderStore(async (store) => {
      createClassroom(store, request.body);
      return buildTeacherOverview(store);
    });
    response.status(201).json(result);
  } catch (error) {
    badRequest(response, error.message);
  }
});

readerApiRouter.patch("/teacher/classes/:classId", async (request, response) => {
  if (!hasTeacherAccess(request)) {
    return badRequest(response, "Lehrkraft-Zugang erforderlich.", 401);
  }

  try {
    const result = await updateReaderStore(async (store) => {
      updateClassroomSettings(store, request.params.classId, request.body);
      return buildTeacherOverview(store);
    });
    response.json(result);
  } catch (error) {
    badRequest(response, error.message);
  }
});

readerApiRouter.post("/teacher/classes/:classId/regenerate", async (request, response) => {
  if (!hasTeacherAccess(request)) {
    return badRequest(response, "Lehrkraft-Zugang erforderlich.", 401);
  }

  try {
    const result = await updateReaderStore(async (store) => {
      regenerateClassroomCode(store, request.params.classId);
      return buildTeacherOverview(store);
    });
    response.json(result);
  } catch (error) {
    badRequest(response, error.message);
  }
});
