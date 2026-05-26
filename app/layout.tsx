import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalEats - Tu comida favorita",
  description: "Descubre restaurantes locales y pide en minutos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] dark:bg-[#0a0a0a] text-zinc-900 dark:text-white transition-colors">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
