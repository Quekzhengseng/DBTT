import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WTS Travel Assistant",
  description: "AI-powered travel assistant for WTS Travel & Tours Singapore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#22337c" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}