import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { QuizApiError } from "./lib/quizapi";
import { leaderboardRoutes } from "./routes/leaderboard";
import { quizRoutes } from "./routes/quiz";

const port = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .use(cors())
  .onError(({ code, error, set }) => {
    if (error instanceof QuizApiError) {
      set.status = error.status;
      return {
        success: false,
        error: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        error: "Validation failed",
        details: (error as { all?: unknown }).all,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return { success: false, error: "Route not found" };
    }

    console.error(error);
    set.status = 500;
    return { success: false, error: "Internal server error" };
  })
  .get("/", () => ({
    success: true,
    data: {
      name: "Codify API",
      endpoints: [
        "GET /quiz",
        "GET /questions",
        "GET /metadata",
        "POST /quizzes/:id/questions/batch",
        "POST /submitscore",
        "GET /getleaderboard",
      ],
    },
  }))
  .use(quizRoutes)
  .use(leaderboardRoutes)
  .listen(port, () => {
    console.log(`Elysia app running at http://localhost:${port}`);
  });

export type App = typeof app;
