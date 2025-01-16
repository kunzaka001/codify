import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codify",
  description: "Quiz App for Devs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
