import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Literature Review",
  description:
    "A novel, academically researched approach to automatically generate literature reviews. For any field of study.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-gray-800">
              Auto Literature Review
            </a>
            <nav className="space-x-4">
              <a href="/changelog" className="hover:text-gray-900">
                Changelog
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
