import test from "node:test";
import assert from "node:assert/strict";
import { compareWorkspaceVersions } from "../src/services/versioning.mjs";

test("version compare detects changed annotation after feedback", () => {
  const annotations = [
    {
      id: "annotation-1",
      segmentId: "segment-2",
      type: "motiv"
    }
  ];
  const annotationVersions = [
    {
      id: "annotation-version-1",
      annotationId: "annotation-1",
      reason: "created"
    },
    {
      id: "annotation-version-2",
      annotationId: "annotation-1",
      reason: "feedback-revision"
    }
  ];
  const baseVersion = {
    id: "workspace-version-1",
    annotationVersionIds: [
      "annotation-version-1"
    ]
  };
  const headVersion = {
    id: "workspace-version-2",
    annotationVersionIds: [
      "annotation-version-2"
    ]
  };

  const result = compareWorkspaceVersions({
    baseVersion,
    headVersion,
    annotations,
    annotationVersions
  });

  assert.equal(result.summary.changedCount, 1);
  assert.equal(result.summary.revisionAfterFeedbackCount, 1);
});
