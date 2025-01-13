"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link.js";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import app from "../lib/firebase-config.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { openDatabase } from "../lib/openDatabase";

import {
  SquareLibrary,
  Trophy,
  CircleHelp,
  Timer,
  BotMessageSquare,
  BrainCog,
} from "lucide-react";

import CodifyLogo from "./assets/CodifyNewLogo.png";

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
}

export default function Home() {
  const router = useRouter();
  const storeName = "userData";

  useEffect(() => {
    const checkIfDataExists = async () => {
      try {
        const db = (await openDatabase()) as IDBDatabase;

        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = () => {
          if (request.result && request.result.length > 0) {
            router.push("/home");
          } else {
            console.log("No data found in the store.");
          }
        };

        request.onerror = (event: Event) => {
          const errorEvent = event as ErrorEvent;
          if (errorEvent.target) {
            console.error(
              "Error checking IndexedDB",
              (errorEvent.target as IDBRequest).error
            );
          }
        };
      } catch (error) {
        console.error("Error opening database:", error);
      }
    };

    checkIfDataExists();
  }, [router]);

  async function addOrUpdateUserData(data: UserData) {
    const db = await openDatabase();

    return new Promise<string>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      if (!data.id) {
        reject(new Error("User data must contain an 'id' field"));
        return;
      }

      const request = store.put(data);

      request.onsuccess = () => {
        resolve("Data saved successfully!");
      };

      request.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        if (errorEvent.target) {
          reject((errorEvent.target as IDBRequest).error);
        }
      };
    });
  }

  const signinWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      openDatabase();
      addOrUpdateUserData({
        id: user.uid,
        email: user.email,
        userImg: user.photoURL,
      });
      if (router) {
        router.push("/home");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
      } else {
        console.error(
          "An unknown error occurred while signing in with Google."
        );
      }
    }
  };

  const reasons = [
    {
      title: "Topic-Based Quizzes",
      description:
        "Choose from a range of development topics like web development, data science, and cybersecurity, tailored for developers at all skill levels to sharpen their expertise.",
      icon: <SquareLibrary className="size-6" />,
    },
    {
      title: "Global Leaderboards",
      description:
        "Compete with developers worldwide and see where you stand. Track your progress, compare scores, and strive for the top in your favorite topics.",
      icon: <Trophy className="size-6" />,
    },
    {
      title: "Difficulty Adjustment",
      description:
        "Increase or decrease in difficulty based on your knowledge, And improved more..",
      icon: <CircleHelp className="size-6" />,
    },
    {
      title: "Timed Quiz",
      description:
        "Challenge yourself with fast-paced, tech-focused questions that push your knowledge and speed. Perfect for testing your expertise in a high-stakes environment!?",
      icon: <Timer className="size-6" />,
    },
    {
      title: "LLM Helper",
      description:
        "A powerful AI-driven assistant designed to enhance learning and productivity. This Large Language Model Helper provides instant answers, coding solutions, and insightful explanations to assist developers in solving challenges efficiently.",
      icon: <BotMessageSquare className="size-6" />,
    },
    {
      title: "Machine Learning Analysis",
      description:
        "Harness the power of Machine Learning to analyze data, identify patterns, and make intelligent evaluations. This feature leverages advanced models to provide actionable insights and predictions for complex challenges.",
      icon: <BrainCog className="size-6" />,
    },
  ];

  return (
    <>
      <section className="flex justify-center items-center pt-32">
        <div className="container flex justify-center items-center">
          <div className="grid items-center gap-8 lg:grid-cols-2 justify-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
                <span className="text-green-500">Codify</span> for Developers:
                Test and Elevate Your Tech Skills
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Boost your tech skills with Codify for Devs—an interactive quiz
                platform designed for developers. Tackle questions on coding,
                tech trivia, and best practices to learn, practice, and stay
                sharp.
              </p>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  className="w-full jello-vertical sm:w-auto"
                  onClick={signinWithGoogle}
                >
                  Dive In!
                </Button>
                <Link href="https://github.com/kunzaka001/codify">
                  <Button
                    variant="outline"
                    className="w-full jello-vertical sm:w-auto"
                  >
                    Github
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rotate-in-center">
              <Image
                src={CodifyLogo}
                alt="Codify Logo"
                className="max-h-96 w-full rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />

      <section className="flex justify-center items-center">
        <div className="container">
          <div className="mb-10 md:mb-20">
            <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
              Features
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <div key={i} className="flex flex-col">
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                  {reason.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
