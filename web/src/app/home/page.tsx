"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

import { openDatabase } from "@/lib/openDatabase";

import placeholdUserImage from "../assets/placeholdUser.png";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AlertCircle, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import apiEndpoint from "@/lib/config";

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
  userName: string | null;
}

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    string | undefined
  >(undefined);

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

  const handleUserPageNav = () => {
    router.push("/user");
  };

  const handleSubmit = () => {
    if (!selectedCategory || !selectedDifficulty) {
      toast("Error!", {
        description: "Cant continue please fill out all the forms",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } else {
      router.push(
        `/quizCasual?mode=casual&category=${selectedCategory}&difficulty=${selectedDifficulty}`
      );
    }
  };

  const handleSubmitRank = () => {
    router.push(`/quizCasual?mode=rank&category=any&difficulty=hard`);
  };

  return (
    <>
      <Toaster position="top-center" />
      <title>Homepage</title>
      <div className="min-h-screen flex flex-col">
        {/* Header with Avatar and Trophy */}
        <div className="flex justify-end p-4">
          <div className="flex flex-col items-center">
            <div
              className="group cursor-pointer mb-4"
              onClick={handleUserPageNav}
            >
              <Avatar className="transform transition-transform duration-300 group-hover:scale-105">
                <AvatarImage
                  src={userData?.userImg ?? placeholdUserImage.src}
                />
                <AvatarFallback>
                  {userData?.userName ? userData.userName.slice(0, 2) : "US"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="group cursor-pointer">
              <Trophy
                className="transform transition-transform duration-300 group-hover:scale-105"
                onClick={() => {
                  router.push("/leaderboard");
                }}
              />
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="relative">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-50">
            <Alert className="border-l-4 border-yellow-500 text-yellow-700">
              <AlertCircle className="h-4 w-4" color="#e3d002" />
              <AlertTitle>Caution!</AlertTitle>
              <AlertDescription>
                Codify is now in Beta and Currently Incompleted. Only Casual
                Play is Available. Have fun!
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Main Content - Cards */}
        <div className="flex-grow flex justify-center items-center pt-20">
          {/* Container for cards with responsive layout */}
          <div className="w-full max-w-6xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-stretch">
              {/* Casual Play Card */}
              <Card className="shadow-lg rounded-2xl flex-1 max-w-sm mx-auto lg:mx-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Casual Play
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    Casual Play. Practice your knowledge about a topic of your
                    choice!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button className="w-full">Play!</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>
                          Ready to Dive in? Choose your options!
                        </DrawerTitle>
                        <DrawerDescription>
                          Choose your options for casual mode.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="w-full space-y-3 px-4 py-2">
                        <Select
                          onValueChange={(value) => setSelectedCategory(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              <SelectItem value="code">Code</SelectItem>
                              <SelectItem value="linux">Linux</SelectItem>
                              <SelectItem value="react">React</SelectItem>
                              <SelectItem value="devops">Devops</SelectItem>
                              <SelectItem value="django">Django</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) =>
                            setSelectedDifficulty(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Difficulties" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Difficulty</SelectLabel>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                              <SelectItem value="any">
                                Any Difficulty
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <DrawerFooter>
                        <Button onClick={handleSubmit}>Let's go!</Button>
                        <DrawerClose>
                          <Button className="w-full" variant="outline">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>

              {/* Competitive Card */}
              <Card className="shadow-lg rounded-2xl flex-1 max-w-sm mx-auto lg:mx-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Competitive
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    Competitive mode challenges you to be the best and top the
                    leaderboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button className="w-full">Play!</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Ready!?</DrawerTitle>
                        <DrawerDescription>
                          Get ready to grind some score. It will be hard mode!
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button onClick={handleSubmitRank}>Let's go!</Button>
                        <DrawerClose>
                          <Button className="w-full" variant="outline">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
