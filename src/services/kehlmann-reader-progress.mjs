import { lessonSets, readerModules } from "../../public/kehlmann-reader/data.js";

const modulesById = new Map(readerModules.map((module) => [module.id, module]));

function completed(note = {}) {
  return Boolean(
    String(note.observation || "").trim() ||
    String(note.interpretation || "").trim() ||
    String(note.theory || "").trim()
  );
}

function withLessonEntries(lesson) {
  const entries = lesson.moduleIds.flatMap((moduleId) => modulesById.get(moduleId)?.entries || []);
  return {
    ...lesson,
    entries
  };
}

export function getLessonSetsWithCounts() {
  return lessonSets.map((lesson) => {
    const material = withLessonEntries(lesson);
    return {
      ...lesson,
      moduleCount: lesson.moduleIds.length,
      entryCount: material.entries.length
    };
  });
}

export function getLessonSetById(lessonId) {
  return lessonSets.find((lesson) => lesson.id === lessonId) || lessonSets[0];
}

export function getEntriesForLesson(lessonId) {
  return withLessonEntries(getLessonSetById(lessonId)).entries;
}

export function calculateReaderProgress(notes = {}) {
  const allEntries = readerModules.flatMap((module) => module.entries);
  const completedEntries = allEntries.filter((entry) => completed(notes[entry.id]));
  const lessonProgress = lessonSets.map((lesson) => {
    const material = withLessonEntries(lesson);
    const done = material.entries.filter((entry) => completed(notes[entry.id])).length;
    return {
      id: lesson.id,
      title: lesson.title,
      completedEntries: done,
      totalEntries: material.entries.length,
      percent: material.entries.length ? Math.round((done / material.entries.length) * 100) : 0
    };
  });

  return {
    completedEntries: completedEntries.length,
    totalEntries: allEntries.length,
    percent: allEntries.length ? Math.round((completedEntries.length / allEntries.length) * 100) : 0,
    evidenceEntries: allEntries.filter((entry) => String(notes[entry.id]?.evidence || "").trim()).length,
    theoryEntries: allEntries.filter((entry) => String(notes[entry.id]?.theory || "").trim()).length,
    completedLessonIds: lessonProgress.filter((lesson) => lesson.completedEntries === lesson.totalEntries).map((lesson) => lesson.id),
    lessonProgress
  };
}

export function summarizeStudentWork(student, classroom, work) {
  const progress = calculateReaderProgress(work?.notes || {});
  return {
    id: student.id,
    displayName: student.displayName,
    classId: classroom.id,
    className: classroom.name,
    selectedLessonId: work?.selectedLessonId || classroom.activeSebLessonId || lessonSets[0].id,
    moduleId: work?.moduleId || null,
    entryId: work?.entryId || null,
    lastMode: work?.lastMode || "open",
    lastSeenAt: student.lastSeenAt || work?.updatedAt || student.createdAt,
    updatedAt: work?.updatedAt || student.lastSeenAt || student.createdAt,
    progress
  };
}
