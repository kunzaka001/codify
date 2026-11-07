import type {
  BatchImportResult,
  BatchQuestionInput,
  BrowseQuestionsParams,
  Question,
  QuizApiSuccess,
  QuizMetadata,
} from "../types";

const DEFAULT_BASE_URL = "https://quizapi.io/api/v1";

export class QuizApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 502, details?: unknown) {
    super(message);
    this.name = "QuizApiError";
    this.status = status;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions {
  method?: "GET" | "POST";
  query?: Record<string, QueryValue>;
  body?: unknown;
}

function getBaseUrl(): string {
  return (process.env.QUIZ_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function getApiKey(): string {
  const apiKey = process.env.QUIZ_API_KEY;
  if (!apiKey) {
    throw new QuizApiError("QUIZ_API_KEY is not configured", 500);
  }
  return apiKey;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        Accept: "application/json",
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw new QuizApiError(
      `Unable to reach quiz provider: ${(error as Error).message}`,
      502
    );
  }

  const rawBody = await response.text();
  let payload: any = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = null;
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new QuizApiError(
      payload?.error ??
        `Quiz provider request failed with status ${response.status}`,
      response.status,
      payload?.details
    );
  }

  return payload as T;
}

export function browseQuestions(
  params: BrowseQuestionsParams = {}
): Promise<QuizApiSuccess<Question[]>> {
  return request<QuizApiSuccess<Question[]>>("/questions", {
    query: {
      category: params.category,
      difficulty: params.difficulty,
      type: params.type,
      tags: params.tags,
      limit: params.limit,
      offset: params.offset,
      random: params.random ? "true" : undefined,
    },
  });
}

export function getQuizQuestions(
  quizId: string,
  includeAnswers = false
): Promise<QuizApiSuccess<Question[]>> {
  return request<QuizApiSuccess<Question[]>>("/questions", {
    query: {
      quiz_id: quizId,
      include_answers: includeAnswers ? "true" : undefined,
    },
  });
}

export function getMetadata(): Promise<QuizApiSuccess<QuizMetadata>> {
  return request<QuizApiSuccess<QuizMetadata>>("/metadata");
}

export function batchImportQuestions(
  quizId: string,
  questions: BatchQuestionInput[]
): Promise<QuizApiSuccess<BatchImportResult>> {
  return request<QuizApiSuccess<BatchImportResult>>(
    `/quizzes/${encodeURIComponent(quizId)}/questions/batch`,
    {
      method: "POST",
      body: { questions },
    }
  );
}
