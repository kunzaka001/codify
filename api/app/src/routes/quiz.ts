import { Elysia, t } from "elysia";

import {
  batchImportQuestions,
  browseQuestions,
  getMetadata,
  getQuizQuestions,
  QuizApiError,
} from "../lib/quizapi";
import type {
  BatchQuestionInput,
  BrowseQuestionsParams,
  Question,
} from "../types";

const CATEGORY_ALIASES: Record<string, string> = {
  code: "Programming",
};

const categoryQuery = t.Optional(t.String());
const difficultyQuery = t.Optional(t.String());
const typeQuery = t.Optional(t.String());
const tagsQuery = t.Optional(t.String());
const limitQuery = t.Optional(t.Numeric({ minimum: 1, maximum: 50 }));
const offsetQuery = t.Optional(t.Numeric({ minimum: 0 }));
const randomQuery = t.Optional(t.String());

const browseQuery = t.Object({
  quiz_id: t.Optional(t.String()),
  include_answers: t.Optional(t.String()),
  category: categoryQuery,
  difficulty: difficultyQuery,
  type: typeQuery,
  tags: tagsQuery,
  limit: limitQuery,
  offset: offsetQuery,
  random: randomQuery,
});

const legacyQuizQuery = t.Object({
  mode: t.Optional(t.String()),
  category: categoryQuery,
  difficulty: difficultyQuery,
  type: typeQuery,
  tags: tagsQuery,
  limit: limitQuery,
  offset: offsetQuery,
  random: randomQuery,
});

const answerInput = t.Object({
  text: t.String({ minLength: 1 }),
  isCorrect: t.Boolean(),
});

const batchBody = t.Object({
  questions: t.Array(
    t.Object({
      text: t.String({ minLength: 1 }),
      type: t.Union([
        t.Literal("MULTIPLE_CHOICE"),
        t.Literal("TRUE_FALSE"),
        t.Literal("OPEN_ENDED"),
      ]),
      difficulty: t.Union([
        t.Literal("EASY"),
        t.Literal("MEDIUM"),
        t.Literal("HARD"),
        t.Literal("EXPERT"),
      ]),
      explanation: t.Optional(t.String()),
      answers: t.Array(answerInput, { minItems: 2 }),
    }),
    { minItems: 1, maxItems: 50 }
  ),
});

function normalize(value?: string): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "any") return undefined;
  return trimmed;
}

function normalizeCategory(value?: string): string | undefined {
  const category = normalize(value);
  if (!category) return undefined;
  return CATEGORY_ALIASES[category.toLowerCase()] ?? category;
}

function toBrowseParams(query: {
  category?: string;
  difficulty?: string;
  type?: string;
  tags?: string;
  limit?: number;
  offset?: number;
  random?: string;
}): BrowseQuestionsParams {
  return {
    category: normalizeCategory(query.category),
    difficulty: normalize(query.difficulty),
    type: normalize(query.type),
    tags: normalize(query.tags),
    limit: query.limit,
    offset: query.offset,
    random: query.random === "true",
  };
}

function toLegacyQuestion(question: Question) {
  const answers = question.answers ?? [];

  return {
    id: question.id,
    question: question.text,
    description: null,
    answers: answers.map(({ id, text }) => ({ id, text })),
    correctAnswers: answers.filter((answer) => answer.isCorrect).map((answer) => answer.id),
    explanation: question.explanation ?? null,
    tags: question.tags ?? [],
    difficulty: question.difficulty,
    category: question.category ?? "Not Available",
  };
}

function validateBatch(questions: BatchQuestionInput[]) {
  const details: { index: number; message: string }[] = [];

  questions.forEach((question, index) => {
    if (question.type === "TRUE_FALSE" && question.answers.length !== 2) {
      details.push({
        index,
        message: "TRUE_FALSE questions must have exactly 2 answers",
      });
    }

    if (
      question.type !== "OPEN_ENDED" &&
      !question.answers.some((answer) => answer.isCorrect)
    ) {
      details.push({
        index,
        message: "At least one answer must be correct",
      });
    }
  });

  if (details.length > 0) {
    throw new QuizApiError("Validation failed", 422, details);
  }
}

export const quizRoutes = new Elysia()
  .get(
    "/quiz",
    async ({ query }) => {
      const isRank = query.mode === "rank";
      const limit = query.limit ?? (isRank ? 20 : 10);

      const result = await browseQuestions({
        ...toBrowseParams(query),
        limit,
      });

      return result.data.map(toLegacyQuestion);
    },
    { query: legacyQuizQuery }
  )
  .get(
    "/questions",
    async ({ query }) => {
      if (query.quiz_id) {
        return getQuizQuestions(query.quiz_id, query.include_answers === "true");
      }

      return browseQuestions(toBrowseParams(query));
    },
    { query: browseQuery }
  )
  .get("/metadata", () => getMetadata())
  .post(
    "/quizzes/:id/questions/batch",
    async ({ params, body }) => {
      const questions = body.questions as BatchQuestionInput[];
      validateBatch(questions);
      return batchImportQuestions(params.id, questions);
    },
    { body: batchBody }
  );
