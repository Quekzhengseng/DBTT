import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Travel Assistant",
  description: "AI-powered travel assistant with document retrieval",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
