"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import apiEndpoint from "@/lib/config";

import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  email: string;
  score: number;
  name: string;
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: LeaderboardEntry[] }>(
          `${apiEndpoint}/getleaderboard`
        );
        const sortedData = response.data.data.sort((a, b) => b.score - a.score);
        setData(sortedData);
        console.log(sortedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-4">
        <DataTable data={data} />
      </div>
      <Button
        onClick={() => {
          router.push("/home");
        }}
      >
        Back
      </Button>
    </div>
  );
}
