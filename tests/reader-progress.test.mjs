import test from "node:test";
import assert from "node:assert/strict";
import { calculateReaderProgress, getLessonSetsWithCounts } from "../src/services/reader-progress.mjs";
import { createOrResumeStudent, regenerateClassroomCode, updateClassroomSettings } from "../src/services/reader-store.mjs";

function makeReaderStore() {
  return {
    classes: [
      {
        id: "class-1",
        name: "Klasse 9A",
        code: "THIEL-9A",
        lessonIds: getLessonSetsWithCounts().map((lesson) => lesson.id),
        activeSebLessonId: "lesson-gewalt",
        allowOpen: true,
        allowSeb: true,
        createdAt: "2026-03-30T08:00:00.000Z",
        updatedAt: "2026-03-30T08:00:00.000Z"
      }
    ],
    students: [],
    work: []
  };
}

test("calculateReaderProgress counts completed entries and lesson coverage", () => {
  const progress = calculateReaderProgress({
    "auftakt-1": {
      observation: "Der Einstieg bleibt sachlich."
    },
    "kapelle-1": {
      interpretation: "Der Raum wird sakral überhöht.",
      theory: "Das passt zur novellentypischen Verdichtung."
    }
  });

  assert.equal(progress.completedEntries, 2);
  assert.equal(progress.theoryEntries, 1);
  assert.equal(progress.lessonProgress.find((lesson) => lesson.id === "lesson-auftakt").completedEntries, 2);
});

test("createOrResumeStudent reuses class code and keeps one student per class/name", () => {
  const store = makeReaderStore();
  const first = createOrResumeStudent(store, {
    classCode: "thiel-9a",
    displayName: "Lina K.",
    mode: "open",
    lessonId: "lesson-auftakt"
  });
  const second = createOrResumeStudent(store, {
    classCode: "THIEL-9A",
    displayName: "Lina   K.",
    mode: "seb",
    lessonId: "lesson-gewalt"
  });

  assert.equal(store.students.length, 1);
  assert.equal(first.student.id, second.student.id);
  assert.equal(second.work.selectedLessonId, "lesson-gewalt");
});

test("teacher class settings can update active SEB lesson and regenerate code", () => {
  const store = makeReaderStore();
  const before = store.classes[0].code;

  updateClassroomSettings(store, "class-1", {
    activeSebLessonId: "lesson-unfall",
    allowOpen: false
  });
  regenerateClassroomCode(store, "class-1");

  assert.equal(store.classes[0].activeSebLessonId, "lesson-unfall");
  assert.equal(store.classes[0].allowOpen, false);
  assert.notEqual(store.classes[0].code, before);
});
