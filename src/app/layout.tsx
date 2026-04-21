import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Share Bill Generator",
  description: "Create and share stunning interactive bills and receipts easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
