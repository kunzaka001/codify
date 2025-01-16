"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { openDatabase } from "../../lib/openDatabase";

import placeholdUserImage from "../assets/placeholdUser.png";

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
  userName: string | null;
}

export default function User() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction("userData", "readwrite");
      const objectStore = transaction.objectStore("userData");

      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        console.log("User data deleted successfully.");
        router.push("/");
      };

      clearRequest.onerror = (event) => {
        console.error(
          "Failed to delete user data:",
          (event.target as IDBRequest).error
        );
      };
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center justify-center space-y-4 max-w-sm w-full">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={userData?.userImg ?? placeholdUserImage.src} />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-medium sm:text-xl">{userData?.email}</p>
            <p className="text-sm text-gray-500 sm:text-base">
              {userData?.userName}
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              router.push("/home");
            }}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
}
