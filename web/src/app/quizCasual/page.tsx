"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizBox from "@/components/quizBox";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

function QuizCasualComponent({
  onQuestionChange,
}: {
  onQuestionChange: (currentIndex: number) => void;
}) {
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchQuizData() {
      const category = searchParams.get("category") || null;
      const difficulty = searchParams.get("difficulty") || null;

      try {
        const response = await fetch(
          `http://localhost:3000/quiz?category=${category}&difficulty=${difficulty}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: Question[] = await response.json();
        setQuizData(data);
        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to fetch data: ${err.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizData();
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <QuizBox quizData={quizData} onQuestionChange={onQuestionChange} />
    </div>
  );
}

export default function Quiz_Casual() {
  const [percentage, setPercentage] = useState(0);

  const handleQuestionChange = (currentIndex: number) => {
    const progress = ((currentIndex + 1) / 10) * 100; // Assuming 10 total questions
    setPercentage(progress);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <title>Quiz</title>
      <div className="absolute top-0 right-0 mr-5 mt-4 h-16 w-16">
        <CircularProgressbar
          minValue={0}
          maxValue={100}
          value={percentage}
          text={`${percentage.toFixed(0)}%`}
          styles={buildStyles({
            pathColor: "#22c55e",
            textColor: "#22c55e",
            trailColor: "#d1fae5",
          })}
        />
      </div>
      <QuizCasualComponent onQuestionChange={handleQuestionChange} />
    </Suspense>
  );
}
