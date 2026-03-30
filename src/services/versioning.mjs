import { makeId } from "./store.mjs";

function indexById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

export function compareWorkspaceVersions({ baseVersion, headVersion, annotations, annotationVersions }) {
  const annotationsById = indexById(annotations);
  const versionsById = indexById(annotationVersions);

  const baseEntries = new Map((baseVersion.annotationVersionIds || []).map((versionId) => {
    const version = versionsById.get(versionId);
    return [version.annotationId, version];
  }));
  const headEntries = new Map((headVersion.annotationVersionIds || []).map((versionId) => {
    const version = versionsById.get(versionId);
    return [version.annotationId, version];
  }));

  const added = [];
  const changed = [];
  const removed = [];

  for (const [annotationId, headEntry] of headEntries.entries()) {
    const annotation = annotationsById.get(annotationId);
    const baseEntry = baseEntries.get(annotationId);

    if (!baseEntry) {
      added.push({
        annotationId,
        annotationType: annotation.type,
        segmentId: annotation.segmentId,
        title: headEntry.title || annotation.type
      });
      continue;
    }

    if (baseEntry.id !== headEntry.id) {
      changed.push({
        annotationId,
        annotationType: annotation.type,
        segmentId: annotation.segmentId,
        beforeVersionId: baseEntry.id,
        afterVersionId: headEntry.id,
        changedAfterFeedback: headEntry.reason === "feedback-revision"
      });
    }
  }

  for (const [annotationId, baseEntry] of baseEntries.entries()) {
    if (headEntries.has(annotationId)) {
      continue;
    }

    const annotation = annotationsById.get(annotationId);
    removed.push({
      annotationId,
      annotationType: annotation.type,
      segmentId: annotation.segmentId,
      removedVersionId: baseEntry.id
    });
  }

  return {
    baseVersionId: baseVersion.id,
    headVersionId: headVersion.id,
    added,
    changed,
    removed,
    summary: {
      addedCount: added.length,
      changedCount: changed.length,
      removedCount: removed.length,
      revisionAfterFeedbackCount: changed.filter((entry) => entry.changedAfterFeedback).length
    }
  };
}

export function createWorkspaceVersion({ workspaceId, label, note, viewerId, annotations, annotationVersions, previousVersion }) {
  const currentAnnotationVersionIds = annotations.map((annotation) => annotation.currentVersionId);
  const timestamp = new Date().toISOString();

  const version = {
    id: makeId("workspace-version"),
    workspaceId,
    label: label || `Arbeitsstand ${new Date(timestamp).toLocaleDateString("de-CH")}`,
    note: note || "",
    createdAt: timestamp,
    createdBy: viewerId,
    annotationVersionIds: currentAnnotationVersionIds
  };

  if (!previousVersion) {
    return {
      version,
      compare: {
        baseVersionId: null,
        headVersionId: version.id,
        added: currentAnnotationVersionIds.map((versionId) => {
          const annotationVersion = annotationVersions.find((item) => item.id === versionId);
          return {
            annotationId: annotationVersion.annotationId,
            title: annotationVersion.title || "Neue Annotation"
          };
        }),
        changed: [],
        removed: [],
        summary: {
          addedCount: currentAnnotationVersionIds.length,
          changedCount: 0,
          removedCount: 0,
          revisionAfterFeedbackCount: 0
        }
      }
    };
  }

  return {
    version,
    compare: compareWorkspaceVersions({
      baseVersion: previousVersion,
      headVersion: version,
      annotations,
      annotationVersions
    })
  };
}
