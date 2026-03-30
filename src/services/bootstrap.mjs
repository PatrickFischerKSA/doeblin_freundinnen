function sortByCreatedAt(items) {
  return [...items].sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function indexById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

function getVisibleWorkspaces({ store, viewer, project }) {
  if (viewer.role === "teacher" || viewer.role === "admin") {
    return store.workspaces;
  }

  return store.workspaces.filter((workspace) => {
    if (workspace.ownerId === viewer.id) {
      return true;
    }

    if (workspace.kind === "base") {
      return true;
    }

    if (project.settings.studentVisibility === "course-on-submission") {
      return store.submissions.some((submission) => submission.workspaceId === workspace.id && submission.status !== "draft");
    }

    return false;
  });
}

function getWorkspacePermissions({ viewer, workspace, latestSubmission }) {
  const isOwner = workspace.ownerId === viewer.id;
  const isTeacher = viewer.role === "teacher" || viewer.role === "admin";

  if (isTeacher) {
    return {
      canEdit: workspace.kind === "base",
      canComment: true,
      canGenerateFeedback: true,
      canSubmit: false,
      canReview: workspace.kind !== "base" && Boolean(latestSubmission)
    };
  }

  return {
    canEdit: isOwner,
    canComment: !isOwner && Boolean(latestSubmission),
    canGenerateFeedback: isOwner,
    canSubmit: isOwner,
    canReview: !isOwner && Boolean(latestSubmission)
  };
}

function buildDashboard({ store, viewer, project, visibleWorkspaces }) {
  if (viewer.role === "teacher" || viewer.role === "admin") {
    const pendingSubmissions = store.submissions.filter((submission) => submission.status === "submitted").length;
    const lowEvidenceWorkspaces = visibleWorkspaces.filter((workspace) => {
      if (workspace.kind === "base") {
        return false;
      }

      const annotations = workspace.annotations || [];
      if (!annotations.length) {
        return true;
      }

      const strongEvidence = annotations.filter((annotation) => annotation.quote.length >= 10).length;
      return strongEvidence / annotations.length < 0.5;
    }).length;

    return {
      type: "teacher",
      cards: [
        {
          label: "Offene Einreichungen",
          value: pendingSubmissions,
          tone: "accent"
        },
        {
          label: "Sichtbare Arbeitsräume",
          value: visibleWorkspaces.length - 1,
          tone: "neutral"
        },
        {
          label: "Risikofall Textnähe",
          value: lowEvidenceWorkspaces,
          tone: lowEvidenceWorkspaces > 0 ? "warning" : "success"
        },
        {
          label: "Peer-Review-Ziel",
          value: project.settings.reviewAssignmentsPerStudent,
          tone: "neutral"
        }
      ]
    };
  }

  const ownWorkspace = visibleWorkspaces.find((workspace) => workspace.ownerId === viewer.id);
  const ownAnnotations = ownWorkspace?.annotations || [];
  const openTasks = store.tasks.filter((task) => {
    const matching = ownAnnotations.filter((annotation) => annotation.taskId === task.id);
    return matching.length < (task.targetAnnotations || 1);
  }).length;
  const reviewablePeers = visibleWorkspaces.filter((workspace) => workspace.ownerId !== viewer.id && workspace.permissions.canReview).length;
  const incomingFeedback = ownWorkspace?.threads.filter((thread) => {
    const latestMessage = thread.messages[thread.messages.length - 1];
    return latestMessage && latestMessage.authorId !== viewer.id;
  }).length || 0;

  return {
    type: "student",
    cards: [
      {
        label: "Offene Aufgaben",
        value: openTasks,
        tone: openTasks > 0 ? "accent" : "success"
      },
      {
        label: "Mögliche Peer-Reviews",
        value: reviewablePeers,
        tone: "neutral"
      },
      {
        label: "Neue Rückmeldungen",
        value: incomingFeedback,
        tone: incomingFeedback > 0 ? "warning" : "neutral"
      },
      {
        label: "Eigene Versionen",
        value: ownWorkspace?.versions.length || 0,
        tone: "neutral"
      }
    ]
  };
}

export function createBootstrap(store, viewerId) {
  const viewer = store.users.find((user) => user.id === viewerId) || store.users[0];
  const project = store.projects[0];
  const course = store.courses[0];
  const usersById = indexById(store.users);
  const visibleWorkspaces = getVisibleWorkspaces({ store, viewer, project });

  const workspaceViews = visibleWorkspaces.map((workspace) => {
    const annotations = store.annotations
      .filter((annotation) => annotation.workspaceId === workspace.id)
      .map((annotation) => {
        const currentVersion = store.annotationVersions.find((version) => version.id === annotation.currentVersionId);
        const threads = sortByCreatedAt(store.threads.filter((thread) => thread.targetType === "annotation" && thread.targetId === annotation.id))
          .map((thread) => ({
            ...thread,
            messages: sortByCreatedAt(thread.messages).map((message) => ({
              ...message,
              author: usersById.get(message.authorId)
            }))
          }));

        return {
          ...annotation,
          author: usersById.get(annotation.authorId),
          currentVersion,
          versions: sortByCreatedAt(
            store.annotationVersions.filter((version) => version.annotationId === annotation.id)
          ),
          threads
        };
      })
      .sort((left, right) => new Date(left.updatedAt) < new Date(right.updatedAt) ? 1 : -1);

    const versions = sortByCreatedAt(store.workspaceVersions.filter((version) => version.workspaceId === workspace.id));
    const latestSubmission = sortByCreatedAt(store.submissions.filter((submission) => submission.workspaceId === workspace.id)).at(-1) || null;
    const submissionThreads = latestSubmission
      ? sortByCreatedAt(store.threads.filter((thread) => thread.targetType === "submission" && thread.targetId === latestSubmission.id))
        .map((thread) => ({
          ...thread,
          messages: sortByCreatedAt(thread.messages).map((message) => ({
            ...message,
            author: usersById.get(message.authorId)
          }))
        }))
      : [];
    const threads = [...submissionThreads, ...annotations.flatMap((annotation) => annotation.threads)];
    const permissions = getWorkspacePermissions({ viewer, workspace, latestSubmission });

    return {
      ...workspace,
      owner: usersById.get(workspace.ownerId),
      annotations,
      versions,
      latestSubmission,
      submissionThreads,
      threads,
      permissions
    };
  });

  const primaryWorkspace = viewer.role === "teacher"
    ? workspaceViews.find((workspace) => workspace.kind === "base") || workspaceViews[0]
    : workspaceViews.find((workspace) => workspace.ownerId === viewer.id) || workspaceViews[0];

  return {
    viewer,
    users: store.users,
    course,
    project,
    segments: store.segments,
    tasks: store.tasks,
    rubrics: store.rubrics,
    workspaces: workspaceViews,
    primaryWorkspaceId: primaryWorkspace?.id || null,
    dashboard: buildDashboard({ store, viewer, project, visibleWorkspaces: workspaceViews }),
    visibleLegend: [
      { key: "free-note", label: "Freie Notiz" },
      { key: "frage", label: "Frage" },
      { key: "deutungshypothese", label: "Deutung" },
      { key: "textbeleg", label: "Textbeleg" },
      { key: "vergleich", label: "Vergleich" },
      { key: "sprachbeobachtung", label: "Sprache" },
      { key: "figur", label: "Figur" },
      { key: "motiv", label: "Motiv" },
      { key: "struktur", label: "Struktur" }
    ]
  };
}
