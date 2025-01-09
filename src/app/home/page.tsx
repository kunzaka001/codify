"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <>
      <title>Homepage</title>
      <div className="h-screen flex justify-center items-center">
        <h1 className="font-bold">THis is a home page</h1>
      </div>
    </>
  );
}
