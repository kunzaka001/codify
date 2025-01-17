import { Elysia } from "elysia";
import "dotenv/config";

const app = new Elysia()
  .get("/quiz", async ({ query }) => {
    const { category = "code", limit = "10" } = query;
    const API_KEY = process.env.QUIZ_API_KEY;

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
      return data;
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .listen(3000);

console.log(`Elysia app running at http://localhost:3000`);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
