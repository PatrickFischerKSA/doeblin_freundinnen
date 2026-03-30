import { Router } from "express";
import { createBootstrap } from "../services/bootstrap.mjs";
import { evaluateAnnotationFeedback } from "../services/feedback-engine.mjs";
import { readStore, updateStore, makeId } from "../services/store.mjs";
import { compareWorkspaceVersions, createWorkspaceVersion } from "../services/versioning.mjs";

export const apiRouter = Router();

function badRequest(response, message) {
  response.status(400).json({ error: message });
}

function getViewer(store, viewerId) {
  return store.users.find((user) => user.id === viewerId);
}

function getWorkspace(store, workspaceId) {
  return store.workspaces.find((workspace) => workspace.id === workspaceId);
}

function getAnnotation(store, annotationId) {
  return store.annotations.find((annotation) => annotation.id === annotationId);
}

function assertWorkspaceEditable({ viewer, workspace }) {
  if (!viewer || !workspace) {
    return "Arbeitsraum oder Nutzer*in nicht gefunden.";
  }

  if (viewer.role === "teacher" || viewer.role === "admin") {
    if (workspace.kind === "base") {
      return null;
    }

    return "Lehrpersonen kommentieren Schülerarbeiten im MVP, bearbeiten sie aber nicht direkt.";
  }

  if (workspace.ownerId !== viewer.id) {
    return "Dieser Arbeitsraum ist nicht editierbar.";
  }

  return null;
}

function findOrCreateThread(store, { targetType, targetId, kind, visibility }) {
  let thread = store.threads.find((entry) => (
    entry.targetType === targetType &&
    entry.targetId === targetId &&
    entry.kind === kind
  ));

  if (!thread) {
    thread = {
      id: makeId("thread"),
      targetType,
      targetId,
      kind,
      visibility,
      messages: []
    };
    store.threads.push(thread);
  }

  return thread;
}

function currentTimestamp() {
  return new Date().toISOString();
}

apiRouter.get("/bootstrap", async (request, response) => {
  const store = await readStore();
  const viewerId = request.query.viewerId || store.users[0].id;
  response.json(createBootstrap(store, viewerId));
});

apiRouter.post("/workspaces/:workspaceId/annotations", async (request, response) => {
  const { workspaceId } = request.params;
  const {
    viewerId,
    segmentId,
    taskId,
    type,
    tags = [],
    quote,
    body
  } = request.body;

  if (!segmentId || !type || !body) {
    return badRequest(response, "segmentId, type und body sind erforderlich.");
  }

  const viewerStore = await readStore();
  const viewer = getViewer(viewerStore, viewerId);
  const workspace = getWorkspace(viewerStore, workspaceId);
  const editError = assertWorkspaceEditable({ viewer, workspace });

  if (editError) {
    return badRequest(response, editError);
  }

  const result = await updateStore(async (store) => {
    const timestamp = currentTimestamp();
    const annotationId = makeId("annotation");
    const annotationVersionId = makeId("annotation-version");

    store.annotationVersions.push({
      id: annotationVersionId,
      annotationId,
      title: `${type} zu ${segmentId}`,
      quote: quote || "",
      body,
      createdAt: timestamp,
      createdBy: viewerId,
      reason: "created"
    });

    store.annotations.push({
      id: annotationId,
      workspaceId,
      segmentId,
      taskId,
      type,
      tags,
      quote: quote || "",
      authorId: viewerId,
      currentVersionId: annotationVersionId,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    return createBootstrap(store, viewerId);
  });

  response.json(result);
});

apiRouter.patch("/annotations/:annotationId", async (request, response) => {
  const { annotationId } = request.params;
  const {
    viewerId,
    type,
    tags = [],
    quote,
    body,
    reason = "edited"
  } = request.body;

  const viewerStore = await readStore();
  const viewer = getViewer(viewerStore, viewerId);
  const annotation = getAnnotation(viewerStore, annotationId);

  if (!annotation) {
    return badRequest(response, "Annotation nicht gefunden.");
  }

  const workspace = getWorkspace(viewerStore, annotation.workspaceId);
  const editError = assertWorkspaceEditable({ viewer, workspace });

  if (editError) {
    return badRequest(response, editError);
  }

  const result = await updateStore(async (store) => {
    const nextAnnotation = getAnnotation(store, annotationId);
    const timestamp = currentTimestamp();
    const versionId = makeId("annotation-version");

    store.annotationVersions.push({
      id: versionId,
      annotationId,
      title: `${type || nextAnnotation.type} überarbeitet`,
      quote: quote ?? nextAnnotation.quote,
      body,
      createdAt: timestamp,
      createdBy: viewerId,
      reason
    });

    nextAnnotation.type = type || nextAnnotation.type;
    nextAnnotation.tags = tags;
    nextAnnotation.quote = quote ?? nextAnnotation.quote;
    nextAnnotation.currentVersionId = versionId;
    nextAnnotation.updatedAt = timestamp;

    return createBootstrap(store, viewerId);
  });

  response.json(result);
});

apiRouter.post("/annotations/:annotationId/comments", async (request, response) => {
  const { annotationId } = request.params;
  const { viewerId, body, visibility = "course" } = request.body;

  if (!body) {
    return badRequest(response, "Kommentartext fehlt.");
  }

  const viewerStore = await readStore();
  const viewer = getViewer(viewerStore, viewerId);
  const annotation = getAnnotation(viewerStore, annotationId);

  if (!viewer || !annotation) {
    return badRequest(response, "Kommentarziel oder Nutzer*in nicht gefunden.");
  }

  const result = await updateStore(async (store) => {
    const thread = findOrCreateThread(store, {
      targetType: "annotation",
      targetId: annotationId,
      kind: "discussion",
      visibility
    });

    thread.messages.push({
      id: makeId("message"),
      authorId: viewerId,
      body,
      createdAt: currentTimestamp(),
      source: viewer.role
    });

    return createBootstrap(store, viewerId);
  });

  response.json(result);
});

apiRouter.post("/annotations/:annotationId/feedback", async (request, response) => {
  const { annotationId } = request.params;
  const { viewerId } = request.body;
  const store = await readStore();
  const annotation = getAnnotation(store, annotationId);

  if (!annotation) {
    return badRequest(response, "Annotation nicht gefunden.");
  }

  const currentVersion = store.annotationVersions.find((version) => version.id === annotation.currentVersionId);
  const task = store.tasks.find((entry) => entry.id === annotation.taskId);
  const segment = store.segments.find((entry) => entry.id === annotation.segmentId);

  const feedback = evaluateAnnotationFeedback({
    annotation: {
      body: currentVersion.body,
      quote: currentVersion.quote
    },
    task,
    segmentText: segment?.content || ""
  });

  const result = await updateStore(async (draft) => {
    const thread = findOrCreateThread(draft, {
      targetType: "annotation",
      targetId: annotationId,
      kind: "automated-feedback",
      visibility: "author-teacher"
    });

    thread.messages.push({
      id: makeId("message"),
      authorId: "system-feedback",
      body: [
        feedback.summary,
        feedback.positives.length ? `Stärken: ${feedback.positives.join(" ")}` : "",
        feedback.nextSteps.length ? `Nächste Schritte: ${feedback.nextSteps.join(" ")}` : "",
        feedback.prompts.length ? `Rückfragen: ${feedback.prompts.join(" ")}` : ""
      ].filter(Boolean).join("\n"),
      createdAt: currentTimestamp(),
      source: "system",
      feedback
    });

    return createBootstrap(draft, viewerId);
  });

  response.json(result);
});

apiRouter.post("/workspaces/:workspaceId/versions", async (request, response) => {
  const { workspaceId } = request.params;
  const { viewerId, label, note } = request.body;
  const store = await readStore();
  const viewer = getViewer(store, viewerId);
  const workspace = getWorkspace(store, workspaceId);
  const editError = assertWorkspaceEditable({ viewer, workspace });

  if (editError) {
    return badRequest(response, editError);
  }

  const result = await updateStore(async (draft) => {
    const workspaceAnnotations = draft.annotations.filter((annotation) => annotation.workspaceId === workspaceId);
    const previousVersion = draft.workspaceVersions
      .filter((version) => version.workspaceId === workspaceId)
      .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))
      .at(-1);

    const creation = createWorkspaceVersion({
      workspaceId,
      label,
      note,
      viewerId,
      annotations: workspaceAnnotations,
      annotationVersions: draft.annotationVersions,
      previousVersion
    });

    draft.workspaceVersions.push(creation.version);
    return {
      bootstrap: createBootstrap(draft, viewerId),
      compare: creation.compare
    };
  });

  response.json(result);
});

apiRouter.get("/workspaces/:workspaceId/versions/:baseVersionId/compare/:headVersionId", async (request, response) => {
  const { workspaceId, baseVersionId, headVersionId } = request.params;
  const store = await readStore();
  const baseVersion = store.workspaceVersions.find((version) => version.id === baseVersionId && version.workspaceId === workspaceId);
  const headVersion = store.workspaceVersions.find((version) => version.id === headVersionId && version.workspaceId === workspaceId);

  if (!baseVersion || !headVersion) {
    return badRequest(response, "Versionen konnten nicht verglichen werden.");
  }

  response.json(compareWorkspaceVersions({
    baseVersion,
    headVersion,
    annotations: store.annotations.filter((annotation) => annotation.workspaceId === workspaceId),
    annotationVersions: store.annotationVersions
  }));
});

apiRouter.post("/workspaces/:workspaceId/submissions", async (request, response) => {
  const { workspaceId } = request.params;
  const { viewerId, note } = request.body;
  const store = await readStore();
  const viewer = getViewer(store, viewerId);
  const workspace = getWorkspace(store, workspaceId);
  const editError = assertWorkspaceEditable({ viewer, workspace });

  if (editError) {
    return badRequest(response, editError);
  }

  const result = await updateStore(async (draft) => {
    const workspaceAnnotations = draft.annotations.filter((annotation) => annotation.workspaceId === workspaceId);
    let latestVersion = draft.workspaceVersions
      .filter((version) => version.workspaceId === workspaceId)
      .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))
      .at(-1);

    if (!latestVersion) {
      const creation = createWorkspaceVersion({
        workspaceId,
        label: "Ersteinreichung",
        note,
        viewerId,
        annotations: workspaceAnnotations,
        annotationVersions: draft.annotationVersions,
        previousVersion: null
      });
      draft.workspaceVersions.push(creation.version);
      latestVersion = creation.version;
    }

    draft.submissions.push({
      id: makeId("submission"),
      workspaceId,
      versionId: latestVersion.id,
      createdAt: currentTimestamp(),
      createdBy: viewerId,
      status: "submitted",
      note: note || ""
    });

    return createBootstrap(draft, viewerId);
  });

  response.json(result);
});

apiRouter.post("/submissions/:submissionId/reviews", async (request, response) => {
  const { submissionId } = request.params;
  const {
    viewerId,
    body,
    rubricScores = {},
    visibility = "course"
  } = request.body;

  if (!body) {
    return badRequest(response, "Reviewtext fehlt.");
  }

  const store = await readStore();
  const viewer = getViewer(store, viewerId);
  const submission = store.submissions.find((entry) => entry.id === submissionId);

  if (!viewer || !submission) {
    return badRequest(response, "Reviewziel oder Nutzer*in nicht gefunden.");
  }

  const result = await updateStore(async (draft) => {
    const thread = findOrCreateThread(draft, {
      targetType: "submission",
      targetId: submissionId,
      kind: "review",
      visibility
    });

    thread.messages.push({
      id: makeId("message"),
      authorId: viewerId,
      body,
      createdAt: currentTimestamp(),
      source: viewer.role,
      rubricScores
    });

    return createBootstrap(draft, viewerId);
  });

  response.json(result);
});

apiRouter.get("/export/projects/:projectId", async (request, response) => {
  const store = await readStore();
  const project = store.projects.find((entry) => entry.id === request.params.projectId);

  if (!project) {
    return badRequest(response, "Projekt nicht gefunden.");
  }

  const exportBundle = {
    exportedAt: currentTimestamp(),
    course: store.courses[0],
    project,
    segments: store.segments,
    tasks: store.tasks,
    rubrics: store.rubrics,
    workspaces: store.workspaces,
    annotations: store.annotations,
    annotationVersions: store.annotationVersions,
    workspaceVersions: store.workspaceVersions,
    submissions: store.submissions,
    threads: store.threads
  };

  response.setHeader("Content-Type", "application/json");
  response.setHeader("Content-Disposition", `attachment; filename="${project.slug}-export.json"`);
  response.send(JSON.stringify(exportBundle, null, 2));
});
