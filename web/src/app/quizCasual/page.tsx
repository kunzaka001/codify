"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Question {
  question: string;
  description: string;
  answers: {
    id: string;
    text: string;
  }[];
  correctAnswers: string[];
  explanation: string;
  tags: string[];
  difficulty: string;
  category: string;
}

export default function Quiz_Casual() {
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const searchParams = useSearchParams();

  const handleAnswerClick = (answerId: string) => {
    setSelectedAnswer(answerId);

    const correctAnswer =
      quizData[currentQuestionIndex].correctAnswers.includes(answerId);
    setIsAnswerCorrect(correctAnswer);
  };

  const currentQuestion = quizData[currentQuestionIndex];

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
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchQuizData();
  }, [searchParams]);

  if (isLoading == true) {
    return <div>Loading</div>;
  }
  if (error) {
    console.log(error);
  }

  //LOG
  console.log(quizData);

  return (
    <>
      <title>Quiz</title>
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
          <CardHeader>
            <CardTitle>{currentQuestion.question}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="flex flex-col gap-4 pt-3">
              {currentQuestion.answers.map((answer) => (
                <Label
                  key={answer.id}
                  onClick={() => handleAnswerClick(answer.id)}
                  className={`w-full px-3 py-2 border rounded-md text-center cursor-pointer 
                    ${
                      selectedAnswer === answer.id
                        ? isAnswerCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                >
                  {answer.text}
                </Label>
              ))}
            </div>
            {isAnswerCorrect !== null && (
              <p className="pt-3 text-center">
                {isAnswerCorrect
                  ? "Correct!"
                  : `Incorrect! Explanation: ${currentQuestion.explanation}`}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentQuestionIndex > 0 && (
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setSelectedAnswer(null);
                  setIsAnswerCorrect(null);
                }}
              >
                Back
              </Button>
            )}
            {currentQuestionIndex < quizData.length - 1 && (
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setSelectedAnswer(null);
                  setIsAnswerCorrect(null);
                }}
              >
                Next Question
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
