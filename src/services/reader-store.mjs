import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeId } from "./store.mjs";
import { getLessonSetsWithCounts, summarizeStudentWork } from "./reader-progress.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const dataDir = path.join(projectRoot, "data");
const readerStorePath = path.join(dataDir, "reader-store.json");

let inMemoryReaderStore = null;

function now() {
  return new Date().toISOString();
}

function normalizeCode(value = "") {
  return String(value).trim().toUpperCase();
}

function normalizeName(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function defaultReaderStore() {
  const timestamp = now();
  return {
    classes: [
      {
        id: "reader-class-9a",
        name: "Klasse 9A",
        code: "THIEL-9A",
        lessonIds: getLessonSetsWithCounts().map((lesson) => lesson.id),
        activeSebLessonId: "lesson-gewalt",
        allowOpen: true,
        allowSeb: true,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    students: [],
    work: []
  };
}

async function ensureReaderStoreFile() {
  try {
    await fs.access(readerStorePath);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(readerStorePath, `${JSON.stringify(defaultReaderStore(), null, 2)}\n`);
  }
}

export async function readReaderStore() {
  if (inMemoryReaderStore) {
    return structuredClone(inMemoryReaderStore);
  }

  await ensureReaderStoreFile();
  const raw = await fs.readFile(readerStorePath, "utf8");
  inMemoryReaderStore = JSON.parse(raw);
  return structuredClone(inMemoryReaderStore);
}

export async function writeReaderStore(nextStore) {
  inMemoryReaderStore = structuredClone(nextStore);
  await fs.writeFile(readerStorePath, `${JSON.stringify(nextStore, null, 2)}\n`);
  return structuredClone(inMemoryReaderStore);
}

export async function updateReaderStore(mutator) {
  const store = await readReaderStore();
  const result = await mutator(store);
  await writeReaderStore(store);
  return result;
}

export function getClassroomByCode(store, code) {
  const normalized = normalizeCode(code);
  return store.classes.find((entry) => normalizeCode(entry.code) === normalized) || null;
}

export function getClassroomById(store, classId) {
  return store.classes.find((entry) => entry.id === classId) || null;
}

export function getStudent(store, studentId) {
  return store.students.find((entry) => entry.id === studentId) || null;
}

export function getStudentWork(store, studentId) {
  return store.work.find((entry) => entry.studentId === studentId) || null;
}

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return `THIEL-${Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")}`;
}

function createWork(studentId, classroom) {
  const timestamp = now();
  return {
    id: makeId("reader-work"),
    studentId,
    classId: classroom.id,
    selectedLessonId: classroom.activeSebLessonId || classroom.lessonIds[0],
    moduleId: null,
    entryId: null,
    theoryId: null,
    notes: {},
    lastMode: "open",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function createOrResumeStudent(store, { classCode, displayName, mode, lessonId }) {
  const classroom = getClassroomByCode(store, classCode);
  if (!classroom) {
    throw new Error("Klassen-Code nicht gefunden.");
  }

  if (mode === "open" && classroom.allowOpen === false) {
    throw new Error("Diese Klasse ist aktuell nicht für die offene Version freigeschaltet.");
  }

  if (mode === "seb" && classroom.allowSeb === false) {
    throw new Error("Diese Klasse ist aktuell nicht für die SEB-Version freigeschaltet.");
  }

  const safeName = normalizeName(displayName);
  if (!safeName || safeName.length < 2) {
    throw new Error("Bitte gib einen klaren Namen oder ein Namenskürzel an.");
  }

  let student = store.students.find((entry) => (
    entry.classId === classroom.id &&
    normalizeName(entry.displayName).toLowerCase() === safeName.toLowerCase()
  ));

  const timestamp = now();
  if (!student) {
    student = {
      id: makeId("reader-student"),
      classId: classroom.id,
      displayName: safeName,
      createdAt: timestamp,
      lastSeenAt: timestamp
    };
    store.students.push(student);
  } else {
    student.lastSeenAt = timestamp;
  }

  let work = getStudentWork(store, student.id);
  if (!work) {
    work = createWork(student.id, classroom);
    store.work.push(work);
  }

  work.classId = classroom.id;
  work.lastMode = mode;
  work.updatedAt = timestamp;

  if (lessonId && classroom.lessonIds.includes(lessonId)) {
    work.selectedLessonId = lessonId;
  }

  return { classroom, student, work };
}

export function saveReaderProgress(store, studentId, payload) {
  const student = getStudent(store, studentId);
  const classroom = student ? getClassroomById(store, student.classId) : null;
  const work = getStudentWork(store, studentId);

  if (!student || !classroom || !work) {
    throw new Error("Reader-Sitzung nicht gefunden.");
  }

  student.lastSeenAt = now();
  work.selectedLessonId = classroom.lessonIds.includes(payload.lessonId) ? payload.lessonId : work.selectedLessonId;
  work.moduleId = payload.moduleId || work.moduleId;
  work.entryId = payload.entryId || work.entryId;
  work.theoryId = payload.theoryId || work.theoryId;
  work.lastMode = payload.mode || work.lastMode;
  work.notes = payload.notes || {};
  work.updatedAt = now();

  return { classroom, student, work };
}

export function buildReaderBootstrap(store, studentId) {
  const student = getStudent(store, studentId);
  const classroom = student ? getClassroomById(store, student.classId) : null;
  const work = getStudentWork(store, studentId);

  if (!student || !classroom || !work) {
    return null;
  }

  return {
    student,
    classroom,
    work,
    progress: summarizeStudentWork(student, classroom, work).progress
  };
}

export function buildTeacherOverview(store) {
  const lessons = getLessonSetsWithCounts();

  return {
    lessons,
    classes: store.classes.map((classroom) => {
      const students = store.students
        .filter((student) => student.classId === classroom.id)
        .map((student) => summarizeStudentWork(student, classroom, getStudentWork(store, student.id)))
        .sort((left, right) => right.progress.percent - left.progress.percent);

      const averageProgress = students.length
        ? Math.round(students.reduce((sum, student) => sum + student.progress.percent, 0) / students.length)
        : 0;

      return {
        ...classroom,
        studentCount: students.length,
        averageProgress,
        students
      };
    })
  };
}

export function createClassroom(store, { name }) {
  const safeName = normalizeName(name);
  if (!safeName) {
    throw new Error("Klassenname fehlt.");
  }

  const timestamp = now();
  const classroom = {
    id: makeId("reader-class"),
    name: safeName,
    code: randomCode(),
    lessonIds: getLessonSetsWithCounts().map((lesson) => lesson.id),
    activeSebLessonId: "lesson-gewalt",
    allowOpen: true,
    allowSeb: true,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  store.classes.push(classroom);
  return classroom;
}

export function updateClassroomSettings(store, classId, payload) {
  const classroom = getClassroomById(store, classId);
  if (!classroom) {
    throw new Error("Klasse nicht gefunden.");
  }

  if (payload.name) {
    classroom.name = normalizeName(payload.name);
  }

  if (Array.isArray(payload.lessonIds) && payload.lessonIds.length) {
    classroom.lessonIds = payload.lessonIds;
  }

  if (payload.activeSebLessonId && classroom.lessonIds.includes(payload.activeSebLessonId)) {
    classroom.activeSebLessonId = payload.activeSebLessonId;
  }

  if (typeof payload.allowOpen === "boolean") {
    classroom.allowOpen = payload.allowOpen;
  }

  if (typeof payload.allowSeb === "boolean") {
    classroom.allowSeb = payload.allowSeb;
  }

  classroom.updatedAt = now();
  return classroom;
}

export function regenerateClassroomCode(store, classId) {
  const classroom = getClassroomById(store, classId);
  if (!classroom) {
    throw new Error("Klasse nicht gefunden.");
  }

  classroom.code = randomCode();
  classroom.updatedAt = now();
  return classroom;
}
