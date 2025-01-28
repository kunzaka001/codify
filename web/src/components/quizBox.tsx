"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function QuizBox({
  quizData,
  onQuestionChange,
}: {
  quizData: Question[];
  onQuestionChange: (currentIndex: number) => void;
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    onQuestionChange(currentQuestionIndex);
  }, [currentQuestionIndex, onQuestionChange]);

  if (!quizData || quizData.length === 0) {
    return <p>No quiz data available</p>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerClick = (answerId: string) => {
    if (isAnswerSelected) return;

    setSelectedAnswer(answerId);
    const correctAnswer = currentQuestion.correctAnswers.includes(answerId);
    setIsAnswerCorrect(correctAnswer);
    setIsAnswerSelected(true);

    if (correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setIsAnswerSelected(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleUserPageNav = () => {
    router.push("/home");
  };

  if (isQuizComplete) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quiz Complete!</h1>
        <p className="text-xl">
          Your score: {score}/{quizData.length}
        </p>
        <Button onClick={handleUserPageNav}>Back to Home</Button>
      </div>
    );
  }

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
                  isAnswerSelected &&
                  currentQuestion.correctAnswers.includes(answer.id)
                    ? "bg-green-500 text-white"
                    : selectedAnswer === answer.id
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
      <CardFooter className="flex justify-end">
        {isAnswerSelected && (
          <Button onClick={handleNextQuestion}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  );
}
