"use client";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <>
      <title>Homepage</title>
      <div className="h-screen flex flex-col">
        <div className="flex justify-end p-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <h1 className="font-bold text-center">This is a home page</h1>
        </div>
      </div>
    </>
  );
}
