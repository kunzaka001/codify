"use client";

import { useState } from "react";
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

export default function QuizBox({ quizData }: { quizData: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Check if the quiz data is available
  if (!quizData || quizData.length === 0) {
    return <p>No quiz data available</p>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerClick = (answerId: string) => {
    setSelectedAnswer(answerId);
    const correctAnswer = currentQuestion.correctAnswers.includes(answerId);
    setIsAnswerCorrect(correctAnswer);
  };

  return (
    <Card className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
      <CardHeader>
        <CardTitle>{currentQuestion.question}</CardTitle>
        {currentQuestion.description && (
          <CardDescription>{currentQuestion.description}</CardDescription>
        )}
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
  );
}
