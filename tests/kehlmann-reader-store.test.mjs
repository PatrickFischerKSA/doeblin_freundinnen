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

test("createClassroom generates a DOEB code and all current lesson ids", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10B" });

  assert.equal(store.classes.length, 1);
  assert.equal(classroom.name, "Klasse 10B");
  assert.match(classroom.code, /^DOEB-[A-Z0-9]{6}$/);
  assert.equal(classroom.lessonIds.length, 20);
  assert.ok(classroom.lessonIds.includes("lesson-09-der-fall-vor-gericht"));
  assert.ok(classroom.lessonIds.includes("lesson-10-urteil-und-diskurs"));
  assert.ok(classroom.lessonIds.includes("lesson-12-fallpoetik-und-nachwort"));
  assert.ok(classroom.lessonIds.includes("lesson-17-gerichtsprozesssimulation"));
  assert.ok(classroom.lessonIds.includes("lesson-20-fakt-fiktion-und-forschungspfade"));
});

test("regenerateClassroomCode replaces the existing class code", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10C" });
  const previousCode = classroom.code;

  regenerateClassroomCode(store, classroom.id);

  assert.notEqual(classroom.code, previousCode);
  assert.match(classroom.code, /^DOEB-[A-Z0-9]{6}$/);
});

test("student registration reuses same learner and stores progress in selected lesson", () => {
  const store = emptyStore();
  const classroom = createClassroom(store, { name: "Klasse 10D" });

  const first = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "open",
    lessonId: "lesson-09-der-fall-vor-gericht"
  });

  const second = createOrResumeStudent(store, {
    classCode: classroom.code,
    displayName: "Nora S.",
    mode: "seb",
    lessonId: "lesson-10-urteil-und-diskurs"
  });

  assert.equal(store.students.length, 1);
  assert.equal(first.student.id, second.student.id);
  assert.equal(second.work.selectedLessonId, "lesson-10-urteil-und-diskurs");

  saveReaderProgress(store, first.student.id, {
    mode: "open",
    lessonId: "lesson-10-urteil-und-diskurs",
    moduleId: "prozess",
    entryId: "prozess-3",
    theoryId: "schuld-zusammenhang",
    notes: {
      "prozess-3": {
        observation: "Die Passage verschiebt den Blick weg von einer nackten Täterfrage hin zu Zusammenhängen und Entstehungsbedingungen.",
        evidence: "schuldig-unschuldig, Zusammenhänge, unvermeidlich",
        interpretation: "Gerade dadurch wird der Prozessblock mehr als ein Urteilstext: Er reflektiert, wie der Fall überhaupt lesbar gemacht wird.",
        theory: "Mit dem Dossier zu Schuld und Zusammenhang gelesen zeigt die Stelle, dass Döblin glatte Kausalität misstraut und die Schuldfrage bewusst verunsichert.",
        revision: "Noch genauer an der Beschreibung des Apparats und der Geschworenen schärfen."
      }
    }
  });

  const overview = buildTeacherOverview(store);
  const overviewClass = overview.classes.find((entry) => entry.id === classroom.id);
  const student = overviewClass.students.find((entry) => entry.displayName === "Nora S.");

  assert.equal(student.progress.completedEntries, 1);
  assert.equal(student.progress.lessonProgress.some((lesson) => lesson.id === "lesson-10-urteil-und-diskurs"), true);
});
