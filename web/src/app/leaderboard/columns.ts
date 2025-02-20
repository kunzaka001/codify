import { ColumnDef } from "@tanstack/react-table";

type LeaderboardEntry = {
  email: string;
  score: number;
  name: string;
};

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
];
