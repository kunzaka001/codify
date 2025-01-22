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
        `/quizCasual?category=${selectedCategory}&difficulty=${selectedDifficulty}`
      );
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <title>Homepage</title>
      <div className="h-screen flex flex-col">
        <div className="flex justify-end p-4">
          <div className="group cursor-pointer" onClick={handleUserPageNav}>
            <Avatar className="transform transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={userData?.userImg ?? placeholdUserImage.src} />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex-col flex-grow flex justify-center items-center">
          <h1 className="font-bold text-center">This is a home page</h1>
          <Drawer>
            <DrawerTrigger>
              <Button>Play!</Button>
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
                <Select onValueChange={(value) => setSelectedCategory(value)}>
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
                <Select onValueChange={(value) => setSelectedDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="any">Any Difficulty</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <DrawerFooter>
                <Button onClick={handleSubmit}>Submit</Button>
                <DrawerClose>
                  <Button className="w-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
