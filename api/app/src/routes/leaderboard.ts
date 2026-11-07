import { Elysia, t } from "elysia";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import db from "../../libs/firebase-db";

const scoreBody = t.Object({
  name: t.Optional(t.Nullable(t.String())),
  email: t.Nullable(t.String()),
  score: t.Number(),
});

export const leaderboardRoutes = new Elysia()
  .post(
    "/submitscore",
    async ({ body, set }) => {
      const { email, score } = body;
      const name = body.name?.trim() || "Unknown User";

      if (!email) {
        set.status = 400;
        return { success: false, error: "Email is required" };
      }

      try {
        await setDoc(doc(db, "Leaderboard", email), { name, score });
        await setDoc(doc(db, "Users", email), { name, highScore: score });
        return { success: true };
      } catch (error) {
        set.status = 500;
        return { success: false, error: (error as Error).message };
      }
    },
    { body: scoreBody }
  )
  .get("/getleaderboard", async ({ set }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Leaderboard"));
      const data = querySnapshot.docs.map((entry) => ({
        email: entry.id,
        ...entry.data(),
      }));
      return { data };
    } catch (error) {
      set.status = 500;
      return { error: (error as Error).message };
    }
  });
