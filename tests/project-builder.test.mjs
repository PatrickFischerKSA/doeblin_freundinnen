import test from "node:test";
import assert from "node:assert/strict";
import { buildProjectArtifacts, parseSegmentsInput } from "../src/services/project-builder.mjs";

test("parseSegmentsInput splits blocks into titled segments", () => {
  const segments = parseSegmentsInput(`Erster Abschnitt
Hier beginnt der Text.

Zweiter Abschnitt
Hier geht der Text weiter.`);

  assert.equal(segments.length, 2);
  assert.equal(segments[0].title, "Erster Abschnitt");
  assert.equal(segments[1].label, "Abschnitt 2");
});

test("buildProjectArtifacts creates project, tasks, rubric, and workspaces", () => {
  const store = {
    courses: [
      {
        id: "course-1",
        gradeLevel: "9",
        timeframe: "Mai"
      }
    ],
    projects: [],
    users: [
      { id: "teacher-1", role: "teacher", name: "Lehrperson" },
      { id: "student-1", role: "student", name: "Anna" },
      { id: "student-2", role: "student", name: "Ben" }
    ]
  };

  const artifacts = buildProjectArtifacts(store, {
    viewerId: "teacher-1",
    title: "Neue Novelle",
    author: "Autorin",
    segmentsRaw: `Auftakt
Ein erster Abschnitt.

Schluss
Ein letzter Abschnitt.`
  });

  assert.equal(artifacts.project.title, "Neue Novelle");
  assert.equal(artifacts.segments.length, 2);
  assert.equal(artifacts.tasks.length, 2);
  assert.equal(artifacts.rubrics.length, 1);
  assert.equal(artifacts.workspaces.length, 3);
});
