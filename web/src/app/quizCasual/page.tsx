"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

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

  const handleAnswerClick = (answerId: string) => {
    setSelectedAnswer(answerId);

    const correctAnswer =
      quizData[currentQuestionIndex].correctAnswers.includes(answerId);
    setIsAnswerCorrect(correctAnswer);
  };

  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    async function fetchQuizData() {
      try {
        const response = await fetch("http://localhost:3000/quiz");
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
  }, []);

  if (isLoading == true) {
    return <div>Loading</div>;
  }
  if (error) {
    console.log(error);
  }

  return (
    <>
      <title>Quiz</title>
      <div>
        <h2>Question: {currentQuestion.question}</h2>
        <p>Description: {currentQuestion.description}</p>

        <div className="space-x-4 pt-3">
          {currentQuestion.answers.map((answer) => (
            <Button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              style={{
                backgroundColor:
                  selectedAnswer === answer.id
                    ? isAnswerCorrect
                      ? "green"
                      : "red"
                    : "",
              }}
            >
              {answer.text}
            </Button>
          ))}
        </div>

        {isAnswerCorrect !== null && (
          <p>
            {isAnswerCorrect
              ? "Correct!"
              : "Incorrect. " + currentQuestion.explanation}
          </p>
        )}

        <div className="pt-8">
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
        </div>
      </div>
    </>
  );
}
