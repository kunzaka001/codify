"use client";
import { useState, useEffect } from "react";

import { openDatabase } from "../../lib/openDatabase";

interface UserData {
  id: string;
  email: string | null;
  userImg: string | null;
}

export default function User() {
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

  return (
    <>
      <button
        onClick={() => {
          console.log(userData);
        }}
      >
        Click me
      </button>
    </>
  );
}
