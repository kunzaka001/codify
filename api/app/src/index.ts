import { Elysia } from "elysia";
import "dotenv/config";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/quiz", async ({ query }) => {
    const { category = "code", difficulty = "easy", limit = "10" } = query;
    const API_KEY = process.env.QUIZ_API_KEY;

    const checkData = (dataCategory: any) => {
      return dataCategory || "Not Available";
    };

    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const mapData = (data: any[]) => {
      return data.map((item) => {
        const answers = Object.entries(item.answers)
          .filter(([key, value]) => value !== null)
          .map(([key, value]) => ({ id: key, text: value }));

        // Shuffle the answers
        shuffleArray(answers);

        return {
          question: item.question,
          description: item.description,
          answers: answers,
          correctAnswers: Object.entries(item.correct_answers)
            .filter(([key, value]) => value === "true")
            .map(([key]) => key.replace("_correct", "")),
          explanation: checkData(item.explanation),
          tags: item.tags.map((tag: { name: string }) => tag.name),
          difficulty: item.difficulty,
          category: item.category,
        };
      });
    };

    if (!API_KEY) {
      return {
        error: "API key is missing. Please check your environment variables.",
      };
    }

    let response;

    try {
      if (difficulty == "any") {
        response = await fetch(
          `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${category}&limit=${limit}`
        );
      } else {
        response = await fetch(
          `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=${category}&difficulty=${difficulty}&limit=${limit}`
        );
      }

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
