import { makeId } from "./store.mjs";

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "projekt";
}

function ensureUniqueSlug(store, baseSlug) {
  let slug = baseSlug;
  let counter = 2;

  while (store.projects.some((project) => project.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function trimLines(raw) {
  return String(raw || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseSegmentsInput(raw) {
  const blocks = String(raw || "")
    .replace(/\r/g, "")
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = trimLines(block);
    if (!lines.length) {
      return null;
    }

    if (lines.length === 1 && lines[0].includes("|")) {
      const [title, ...rest] = lines[0].split("|");
      return {
        label: `Abschnitt ${index + 1}`,
        title: title.trim() || `Abschnitt ${index + 1}`,
        content: rest.join("|").trim()
      };
    }

    if (lines.length === 1) {
      return {
        label: `Abschnitt ${index + 1}`,
        title: `Abschnitt ${index + 1}`,
        content: lines[0]
      };
    }

    return {
      label: `Abschnitt ${index + 1}`,
      title: lines[0].replace(/^#+\s*/, "") || `Abschnitt ${index + 1}`,
      content: lines.slice(1).join(" ")
    };
  }).filter(Boolean);
}

function normaliseFocus(raw) {
  const parts = String(raw || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length ? parts : ["Textnähe", "Belegarbeit", "Interpretationsplausibilität"];
}

export function buildProjectArtifacts(store, payload) {
  const title = String(payload.title || "").trim();
  if (!title) {
    throw new Error("Ein Projekttitel ist erforderlich.");
  }

  const course = store.courses[0];
  if (!course) {
    throw new Error("Es ist kein Kurs für neue Projekte vorhanden.");
  }

  const segmentDrafts = parseSegmentsInput(payload.segmentsRaw);
  if (!segmentDrafts.length) {
    throw new Error("Bitte gib mindestens einen Abschnitt für die Lektüre ein.");
  }

  const focus = normaliseFocus(payload.feedbackFocus);
  const projectId = makeId("project");
  const slug = ensureUniqueSlug(store, toSlug(title));
  const timestamp = new Date().toISOString();
  const studentUsers = store.users.filter((user) => user.role === "student");

  const project = {
    id: projectId,
    courseId: course.id,
    slug,
    title,
    author: String(payload.author || "Unbekannt").trim(),
    genre: String(payload.genre || "Erzählung").trim(),
    gradeLevel: String(payload.gradeLevel || course.gradeLevel || "").trim(),
    timeframe: String(payload.timeframe || course.timeframe || "").trim(),
    workMode: String(payload.workMode || "Individuelle Arbeitskopien mit Peer-Review").trim(),
    assessmentMode: String(payload.assessmentMode || "Rubrik + Entwicklungsfeedback").trim(),
    createdAt: timestamp,
    settings: {
      studentVisibility: payload.studentVisibility || "course-on-submission",
      reviewAssignmentsPerStudent: Number(payload.reviewAssignmentsPerStudent || 2),
      githubMode: "export-only",
      feedbackFocus: focus
    }
  };

  const segments = segmentDrafts.map((segmentDraft, index) => ({
    id: makeId("segment"),
    projectId,
    order: index + 1,
    label: segmentDraft.label,
    title: segmentDraft.title,
    content: segmentDraft.content
  }));

  const annotationPrompt = String(payload.annotationPrompt || "").trim() ||
    "Markiere zwei Schlüsselstellen und erläutere, wie der Wortlaut Spannung, Perspektive oder Motivik erzeugt.";
  const interpretationPrompt = String(payload.interpretationPrompt || "").trim() ||
    "Formuliere eine Deutungshypothese zu einer zentralen Wirkung des Textes und stütze sie auf einen präzisen Textbeleg.";
  const focusPrompt = focus.join(", ");

  const tasks = [
    {
      id: makeId("task"),
      projectId,
      title: "Zwei Schlüsselstellen annotieren",
      type: "annotation",
      segmentIds: segments.slice(0, Math.min(2, segments.length)).map((segment) => segment.id),
      prompt: annotationPrompt,
      focusPrompt,
      targetAnnotations: Math.min(2, segments.length) || 1,
      deadline: "",
      reviewRequired: false
    },
    {
      id: makeId("task"),
      projectId,
      title: "Deutungshypothese formulieren",
      type: "interpretation",
      segmentIds: [segments.at(-1).id],
      prompt: interpretationPrompt,
      focusPrompt,
      targetAnnotations: 1,
      deadline: "",
      reviewRequired: false
    }
  ];

  const rubrics = [
    {
      id: makeId("rubric"),
      projectId,
      title: "Textnahes Interpretieren",
      criteria: [
        {
          id: makeId("criterion"),
          label: "Textnähe",
          description: "Die Beobachtung verweist auf konkreten Wortlaut oder eine präzise Textstelle."
        },
        {
          id: makeId("criterion"),
          label: "Präzision des Belegs",
          description: "Der Beleg wird nicht nur genannt, sondern genau ausgewertet."
        },
        {
          id: makeId("criterion"),
          label: "Sprachliche Klarheit",
          description: "Die Aussage ist verständlich, knapp und differenziert formuliert."
        },
        {
          id: makeId("criterion"),
          label: "Interpretationsplausibilität",
          description: "Die Deutung geht über Nacherzählung hinaus und bleibt textnah begründet."
        }
      ]
    }
  ];

  const workspaces = [
    {
      id: makeId("workspace"),
      projectId,
      ownerId: payload.viewerId,
      kind: "base",
      title: `Basisraum ${title}`
    },
    ...studentUsers.map((user) => ({
      id: makeId("workspace"),
      projectId,
      ownerId: user.id,
      kind: "student-fork",
      title: `Arbeitskopie ${user.name}`
    }))
  ];

  return {
    project,
    segments,
    tasks,
    rubrics,
    workspaces
  };
}
