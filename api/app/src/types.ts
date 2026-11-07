export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "OPEN_ENDED";

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId?: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  category?: string | null;
  explanation?: string | null;
  tags?: string[];
  quizTitle?: string;
  answers?: Answer[];
}

export interface PaginationLinks {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export interface BrowseMeta {
  total: number;
  pageTotal: number;
  page: number;
  lastPage: number;
  limit: number;
  offset: number;
  links: PaginationLinks;
}

export interface QuizQuestionsMeta {
  total: number;
  quizId: string;
}

export interface QuizApiSuccess<T, M = BrowseMeta | QuizQuestionsMeta> {
  success: true;
  data: T;
  meta?: M;
}

export interface BatchQuestionInput {
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  explanation?: string;
  answers: { text: string; isCorrect: boolean }[];
}

export interface BatchImportResult {
  quizId: string;
  questionsCreated: number;
  questions: Question[];
}

export interface QuizMetadata {
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
  categories: string[];
  tags: string[];
}

export interface BrowseQuestionsParams {
  category?: string;
  difficulty?: string;
  type?: string;
  tags?: string;
  limit?: number;
  offset?: number;
  random?: boolean;
}
