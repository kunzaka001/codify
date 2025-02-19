"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizBox from "@/components/quizBox";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { openDatabase } from "@/lib/openDatabase";

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

function QuizCasualComponent({
  onQuestionChange,
  setCategory,
  setDifficulty,
  setIsLoading,
}: {
  onQuestionChange: (currentIndex: number) => void;
  setCategory: (category: string) => void;
  setDifficulty: (category: string) => void;
  setIsLoading: (loading: boolean) => void;
}) {
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("none");
  const [userData, setUserData] = useState<UserData | null>(null);

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
            console.log("Data retrieved:", cursor.value);
            setUserData(cursor.value);
          } else {
            console.log("No data found");
          }
        };

        request.onerror = (event) => {
          console.error(
            "Failed to retrieve data:",
            (event.target as IDBRequest).error
          );
        };
      } catch (error) {
        console.error("Error opening database:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchQuizData() {
      console.log("Starting fetch..."); //debug
      const category = searchParams.get("category") || "";
      const difficulty = searchParams.get("difficulty") || "";
      const mode = searchParams.get("mode") || "";
      setMode(mode);
      console.log(mode);

      try {
        const response = await fetch(
          `https://codify-api-drxm.onrender.com/quiz?mode=${mode}&category=${category}&difficulty=${difficulty}`
          /* `http://localhost:3000/quiz?mode=${mode}&category=${category}&difficulty=${difficulty}` */
        );
        console.log("Fetch response:", response); //debug

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: Question[] = await response.json();
        setQuizData(data);
        setCategory(category);
        setDifficulty(difficulty);
        console.log(data); // debug
      } catch (err: unknown) {
        console.error("Fetch error:", err); //debug
        if (err instanceof Error) {
          setError(`Failed to fetch data: ${err.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        console.log("Setting loading to false"); //debug
        setIsLoading(false);
      }
    }

    fetchQuizData();
  }, [searchParams, setCategory, setDifficulty, setIsLoading]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <QuizBox
        quizData={quizData}
        onQuestionChange={onQuestionChange}
        mode={mode}
        userEmail={userData?.email}
        userName={userData?.userName}
        highScore={userData?.highScore}
      />
    </div>
  );
}

export default function Quiz_Casual() {
  const [percentage, setPercentage] = useState(0);
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handleQuestionChange = (currentIndex: number) => {
    const progress = (currentIndex + 1) * 10;
    setPercentage(progress);
  };

  return (
    <div className="min-h-screen">
      <title>Quiz</title>
      <QuizCasualComponent
        onQuestionChange={handleQuestionChange}
        setCategory={setCategory}
        setDifficulty={setDifficulty}
        setIsLoading={setIsLoading}
      />
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <h1 className="text-xl">Loading...</h1>
        </div>
      ) : (
        <>
          <div className="absolute top-0 right-0 mr-5 mt-4 h-16 w-16">
            <CircularProgressbar
              minValue={0}
              maxValue={101}
              value={percentage}
              text={`${percentage.toFixed(0)}%`}
              styles={buildStyles({
                pathColor: "#22c55e",
                textColor: "#22c55e",
                trailColor: "#d1fae5",
              })}
            />
          </div>
          <div className="absolute top-0 left-0 ml-5 mt-4">
            <h1>
              Category: {category || "No Category Selected"}, Difficulty:{" "}
              {difficulty || "No Difficulty Selected"}
            </h1>
          </div>
        </>
      )}
    </div>
  );
}
