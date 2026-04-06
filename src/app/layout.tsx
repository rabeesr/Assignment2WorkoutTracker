import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FitnessProvider } from "@/context/FitnessContext";
import Navbar from "@/components/layout/Navbar";
import AIChatbot from "@/components/layout/AIChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitTrack — Unified Fitness Tracker",
  description: "Track workouts, muscle fatigue, recovery, and calories across all your activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FitnessProvider>
          <Navbar />
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
            {children}
          </main>
          <AIChatbot />
        </FitnessProvider>
      </body>
    </html>
  );
}
