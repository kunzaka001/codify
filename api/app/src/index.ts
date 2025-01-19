import { Elysia } from "elysia";
import "dotenv/config";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/quiz", async ({ query }) => {
    const { category = "code", limit = "10" } = query;
    const API_KEY = process.env.QUIZ_API_KEY;

    const mapData = (data: any[]) => {
      return data.map((item) => ({
        question: item.question,
        description: item.description,
        answers: Object.entries(item.answers)
          .filter(([key, value]) => value !== null)
          .map(([key, value]) => ({ id: key, text: value })),
        correctAnswers: Object.entries(item.correct_answers)
          .filter(([key, value]) => value === "true")
          .map(([key]) => key.replace("_correct", "")),
        explanation: item.explanation,
        tags: item.tags.map((tag: { name: string }) => tag.name),
        difficulty: item.difficulty,
        category: item.category,
      }));
    };

    if (!API_KEY) {
      return {
        error: "API key is missing. Please check your environment variables.",
      };
    }

    try {
      const response = await fetch(
        `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${category}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      return mapData(data);
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .listen(3000);

console.log(`Elysia app running at http://localhost:3000`);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
