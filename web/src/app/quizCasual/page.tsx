"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizBox from "@/components/quizBox";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { openDatabase } from "@/lib/openDatabase";

import db from "@/lib/firebase-db";
import { doc, getDoc } from "firebase/firestore";

import apiEndpoint from "@/lib/config";

interface Question {
  question: string;
  description: string | null;
  answers: {
    id: string;
    text: string;
  }[];
  correctAnswers: string[];
  explanation: string | null;
  tags: string[];
  difficulty: string;
  category: string;
}

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
  userName: string | null;
  highScore: number;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState("none");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [highScore, setHighScore] = useState(Number);
  const [percentage, setPercentage] = useState(0);
  const [timer, setTimer] = useState(15);
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get("mode") || "";
    setMode(modeParam);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        const db = await openDatabase();
        const transaction = db.transaction("userData", "readonly");
        const objectStore = transaction.objectStore("userData");
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            setUserData(cursor.value);
          }
        };
      } catch (error) {
        console.error("Error opening database:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchQuizData() {
      const categoryParam = searchParams.get("category") || "";
      const difficultyParam = searchParams.get("difficulty") || "";
      const modeParam = searchParams.get("mode") || "";
      setMode(modeParam);

      try {
        const params = new URLSearchParams({
          mode: modeParam,
          category: categoryParam,
        });

        if (difficultyParam) {
          params.set("difficulty", difficultyParam);
        }

        const response = await fetch(`${apiEndpoint}/quiz?${params.toString()}`);
        const payload = await response.json().catch(() => null);

        const serverError =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : null;

        if (!response.ok) {
          throw new Error(serverError || response.statusText || `HTTP ${response.status}`);
        }

        if (!Array.isArray(payload)) {
          throw new Error(serverError || "Unexpected response from the server");
        }

        if (payload.length === 0) {
          setError(
            "No questions found for that category and difficulty. Please choose another combination."
          );
          return;
        }

        setQuizData(payload);
        setCategory(categoryParam);
        setDifficulty(difficultyParam);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Unable to load quiz: ${err.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizData();
  }, [searchParams]);

  useEffect(() => {
    async function getFieldFromDocument(email: string) {
      const docRef = doc(db, "Users", email);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fieldValue = docSnap.get("highScore");
          setHighScore(fieldValue);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    }
    if (userData?.email) {
      getFieldFromDocument(userData.email);
    }
  }, [userData?.email]);

  useEffect(() => {
    if (isLoading) return;

    if (timer <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isLoading, timer]);

  const handleQuestionChange = (currentIndex: number) => {
    const progress = (currentIndex + 1) * 10;
    setPercentage(progress);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center min-h-screen px-4">
        <QuizBox
          quizData={quizData}
          onQuestionChange={handleQuestionChange}
          mode={mode}
          userEmail={userData?.email}
          userName={userData?.userName}
          highScore={highScore}
          isTimeUp={isTimeUp}
        />
      </div>

      {mode === "casual" ? (
        <div className="absolute top-0 right-0 mr-5 mt-4 h-16 w-16">
          <CircularProgressbar
            value={percentage}
            text={`${percentage.toFixed(0)}%`}
            styles={buildStyles({
              pathColor: "#22c55e",
              textColor: "#22c55e",
              trailColor: "#d1fae5",
            })}
          />
        </div>
      ) : mode === "rank" ? (
        <div className="absolute top-0 right-0 mr-5 mt-4 h-16 w-16">
          <CircularProgressbar
            value={timer}
            text={`${timer.toFixed(0)}`}
            styles={buildStyles({
              pathColor: "#22c55e",
              textColor: "#22c55e",
              trailColor: "#d1fae5",
            })}
          />
        </div>
      ) : null}

      <div className="absolute top-0 left-0 ml-5 mt-4">
        <h1>
          Category: {category || "No Category Selected"}, Difficulty:{" "}
          {difficulty || "No Difficulty Selected"}
        </h1>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function Quiz_Casual() {
  return (
    <>
      <title>Quiz</title>
      <Suspense fallback={<div>Loading...</div>}>
        <QuizContent />
      </Suspense>
    </>
  );
}
