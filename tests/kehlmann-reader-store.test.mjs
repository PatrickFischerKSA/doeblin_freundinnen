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

test("createClassroom generates a code and all current lesson ids", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10B" });

  assert.equal(store.classes.length, 1);
  assert.equal(classroom.name, "Klasse 10B");
  assert.match(classroom.code, /^KEHL-[A-Z0-9]{6}$/);
  assert.equal(classroom.lessonIds.length, 15);
  assert.equal(classroom.activeSebLessonId, classroom.lessonIds[0]);
  assert.ok(classroom.lessonIds.includes("lesson-11-kehlmann-haltung"));
  assert.ok(classroom.lessonIds.includes("lesson-12-theaterformen"));
  assert.ok(classroom.lessonIds.includes("lesson-13-evian-grenzen-verantwortung"));
  assert.ok(classroom.lessonIds.includes("lesson-14-fritz-buff-primärquelle"));
  assert.ok(classroom.lessonIds.includes("lesson-15-ushmm-nachgeschichte"));
});

test("regenerateClassroomCode replaces the existing class code", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10C" });
  const previousCode = classroom.code;

  regenerateClassroomCode(store, classroom.id);

  assert.notEqual(classroom.code, previousCode);
  assert.match(classroom.code, /^KEHL-[A-Z0-9]{6}$/);
});

test("student registration reuses same learner and stores progress under selected class code", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10D" });

  const first = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "open",
    lessonId: "lesson-12-theaterformen"
  });
  const firstSelectedLessonId = first.work.selectedLessonId;

  const second = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "seb",
    lessonId: "lesson-11-kehlmann-haltung"
  });

  assert.equal(store.students.length, 1);
  assert.equal(first.student.id, second.student.id);
  assert.equal(first.classroom.id, classroom.id);
  assert.equal(firstSelectedLessonId, "lesson-12-theaterformen");
  assert.equal(second.work.selectedLessonId, "lesson-11-kehlmann-haltung");

  saveReaderProgress(store, first.student.id, {
    mode: "open",
    lessonId: "lesson-11-kehlmann-haltung",
    moduleId: "diplomatie",
    entryId: "diplomatie-3",
    theoryId: "im-steinbruch",
    notes: {
      "diplomatie-3": {
        observation: "Kehlmann zeigt Humanität als Deal.",
        evidence: "halbe Million, Garantie, Fotograf",
        interpretation: "Rettung wird an politisches Kalkül gebunden.",
        theory: "Mit dem Interview und Im Steinbruch gelesen wird Verantwortung als Gegenwartsfrage sichtbar.",
        revision: "Noch genauer auf Bildpolitik eingehen."
      }
    }
  });

  const overview = buildTeacherOverview(store);
  const overviewClass = overview.classes.find((entry) => entry.id === classroom.id);
  const student = overviewClass.students.find((entry) => entry.displayName === "Nora S.");

  assert.equal(student.progress.completedEntries, 1);
  assert.equal(student.progress.lessonProgress.some((lesson) => lesson.id === "lesson-11-kehlmann-haltung"), true);
});
