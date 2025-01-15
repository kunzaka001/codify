"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

import { openDatabase } from "@/lib/openDatabase";

import placeholdUserImage from "../assets/placeholdUser.png";

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
  userName: string | null;
}

export default function Home() {
  const router = useRouter();
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

  const handleUserPageNav = () => {
    router.push("/user");
  };

  return (
    <>
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
        <div className="flex-grow flex justify-center items-center">
          <h1 className="font-bold text-center">This is a home page</h1>
        </div>
      </div>
    </>
  );
}
