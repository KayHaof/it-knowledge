export function validateRelationships({ lessons, interviews, roadmaps, documentIdentities }, diagnostics) {
  validateGlobalIdentities(documentIdentities, diagnostics);
  const lessonsById = new Map(lessons.map((entry) => [entry.data.id, entry]));

  for (const lesson of lessons) {
    const { id } = lesson.data;
    for (const relation of lesson.data.prerequisites ?? []) {
      validateLessonReference(id, relation, 'prerequisite', lesson.file, lessonsById, diagnostics);
    }
    for (const relation of lesson.data.related ?? []) {
      validateLessonReference(id, relation, 'related', lesson.file, lessonsById, diagnostics);
    }
    if (lesson.data.next) {
      validateLessonReference(id, lesson.data.next, 'next', lesson.file, lessonsById, diagnostics);
    }
    if (lesson.data.replacedBy) {
      validateLessonReference(
        id,
        lesson.data.replacedBy,
        'replacedBy',
        lesson.file,
        lessonsById,
        diagnostics,
      );
    }
  }

  detectPrerequisiteCycles(lessons, lessonsById, diagnostics);

  const interviewIds = new Map();
  const questionTexts = new Map();
  for (const interview of interviews) {
    const previousFile = interviewIds.get(interview.data.id);
    if (previousFile) {
      diagnostics.error(
        'interview.duplicate-id',
        `Interview ID \`${interview.data.id}\` đã tồn tại ở ${previousFile}.`,
        interview.file,
      );
    } else interviewIds.set(interview.data.id, interview.file);
    const normalizedQuestion = normalizeQuestion(interview.data.question);
    const previousQuestion = questionTexts.get(normalizedQuestion);
    if (previousQuestion) {
      diagnostics.error(
        'interview.duplicate-question',
        `Câu hỏi trùng với ${previousQuestion}.`,
        interview.file,
      );
    } else questionTexts.set(normalizedQuestion, interview.file);
    for (const lessonId of interview.data.relatedLessons ?? []) {
      if (!lessonsById.has(lessonId)) {
        diagnostics.error(
          'interview.related-lesson',
          `relatedLessons tham chiếu lesson không tồn tại: ${lessonId}.`,
          interview.file,
        );
      }
    }
  }

  const roadmapIds = new Map();
  for (const roadmap of roadmaps) {
    const previousFile = roadmapIds.get(roadmap.data.id);
    if (previousFile) {
      diagnostics.error(
        'roadmap.duplicate-id',
        `Roadmap ID \`${roadmap.data.id}\` đã tồn tại ở ${previousFile}.`,
        roadmap.file,
      );
    } else roadmapIds.set(roadmap.data.id, roadmap.file);
    const seenSteps = new Set();
    for (const step of roadmap.data.steps) {
      if (!lessonsById.has(step.lessonId)) {
        diagnostics.error(
          'roadmap.lesson',
          `Roadmap tham chiếu lesson không tồn tại: ${step.lessonId}.`,
          roadmap.file,
        );
      }
      if (seenSteps.has(step.lessonId)) {
        diagnostics.warning(
          'roadmap.duplicate-step',
          `Roadmap lặp lesson: ${step.lessonId}.`,
          roadmap.file,
        );
      }
      seenSteps.add(step.lessonId);
    }
  }
}

function validateGlobalIdentities(identities, diagnostics) {
  const ids = new Map();
  const slugs = new Map();
  for (const identity of identities) {
    if (identity.id) {
      const previous = ids.get(identity.id);
      if (previous) {
        diagnostics.error(
          'identity.duplicate-id',
          `ID \`${identity.id}\` đã tồn tại ở ${previous}.`,
          identity.file,
        );
      } else ids.set(identity.id, identity.file);
    }
    if (identity.slug) {
      const previous = slugs.get(identity.slug);
      if (previous) {
        diagnostics.error(
          'identity.duplicate-slug',
          `Slug \`${identity.slug}\` đã tồn tại ở ${previous}.`,
          identity.file,
        );
      } else slugs.set(identity.slug, identity.file);
    }
  }
}

function validateLessonReference(ownerId, targetId, kind, file, lessonsById, diagnostics) {
  if (ownerId === targetId) {
    diagnostics.error('relation.self', `${kind} không được tự tham chiếu ${ownerId}.`, file);
  } else if (!lessonsById.has(targetId)) {
    diagnostics.error('relation.missing', `${kind} tham chiếu lesson không tồn tại: ${targetId}.`, file);
  }
}

function detectPrerequisiteCycles(lessons, lessonsById, diagnostics) {
  const state = new Map();
  const stack = [];
  const reported = new Set();
  function visit(id) {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      const cycleStart = stack.indexOf(id);
      const cycle = [...stack.slice(cycleStart), id];
      const signature = [...new Set(cycle)].sort().join('|');
      if (!reported.has(signature)) {
        reported.add(signature);
        diagnostics.error(
          'prerequisite.cycle',
          `Phát hiện chu kỳ prerequisite: ${cycle.join(' -> ')}.`,
          lessonsById.get(id)?.file ?? '',
        );
      }
      return;
    }
    state.set(id, 'visiting');
    stack.push(id);
    for (const dependency of lessonsById.get(id)?.data.prerequisites ?? []) {
      if (lessonsById.has(dependency)) visit(dependency);
    }
    stack.pop();
    state.set(id, 'done');
  }
  for (const lesson of lessons) visit(lesson.data.id);
}

function normalizeQuestion(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
