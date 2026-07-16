import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import PwaRegister from "../components/pwa-register";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HSK Pixel Town - Game ôn từ tiếng Trung",
  description: "Game nhập vai 2D pixel ôn từ vựng HSK theo chủ đề, hỗ trợ chơi offline và đồng bộ tiến trình.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${spaceGrotesk.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fffdf8]"><PwaRegister />{children}</body>
    </html>
  );
}
