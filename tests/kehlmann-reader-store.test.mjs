import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTeacherOverview,
  createClassroom,
  createOrResumeStudent,
  regenerateClassroomCode,
  saveReaderProgress
} from "../src/services/kehlmann-reader-store.mjs";

function emptyStore() {
  return {
    classes: [],
    students: [],
    work: [],
    reviews: []
  };
}

test("createClassroom generates a WAHL code and all current lesson ids", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10B" });

  assert.equal(store.classes.length, 1);
  assert.equal(classroom.name, "Klasse 10B");
  assert.match(classroom.code, /^WAHL-[A-Z0-9]{6}$/);
  assert.equal(classroom.lessonIds.length, 12);
  assert.ok(classroom.lessonIds.includes("lesson-08-berlin-oder-bleiben"));
  assert.ok(classroom.lessonIds.includes("lesson-10-fieber-und-rettung"));
  assert.ok(classroom.lessonIds.includes("lesson-12-libellen-und-offenes-ende"));
});

test("regenerateClassroomCode replaces the existing class code", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10C" });
  const previousCode = classroom.code;

  regenerateClassroomCode(store, classroom.id);

  assert.notEqual(classroom.code, previousCode);
  assert.match(classroom.code, /^WAHL-[A-Z0-9]{6}$/);
});

test("student registration reuses same learner and stores progress in selected lesson", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10D" });

  const first = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "open",
    lessonId: "lesson-08-berlin-oder-bleiben"
  });

  const second = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "seb",
    lessonId: "lesson-10-fieber-und-rettung"
  });

  assert.equal(store.students.length, 1);
  assert.equal(first.student.id, second.student.id);
  assert.equal(second.work.selectedLessonId, "lesson-10-fieber-und-rettung");

  saveReaderProgress(store, first.student.id, {
    mode: "open",
    lessonId: "lesson-10-fieber-und-rettung",
    moduleId: "krise",
    entryId: "krise-4",
    theoryId: "wasser-motivik",
    notes: {
      "krise-4": {
        observation: "Viktor erscheint im Traum als Seemann und in der Wirklichkeit als Pflegender.",
        evidence: "Seemann, Wickel, neu bezogene Decke",
        interpretation: "Die Passage macht Rettung nicht pathetisch, sondern praktisch und körperlich erfahrbar.",
        theory: "Mit der Wasser-Motivik gelesen kippt das Meer hier von Bedrohung in eine vorsichtige Rettungsbewegung.",
        revision: "Noch genauer auf Ida und den Vaterverlust beziehen."
      }
    }
  });

  const overview = buildTeacherOverview(store);
  const overviewClass = overview.classes.find((entry) => entry.id === classroom.id);
  const student = overviewClass.students.find((entry) => entry.displayName === "Nora S.");

  assert.equal(student.progress.completedEntries, 1);
  assert.equal(student.progress.lessonProgress.some((lesson) => lesson.id === "lesson-10-fieber-und-rettung"), true);
});
