import { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins, Nunito, Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ShopVibe — Fashion & Lifestyle",
  description: "Discover the latest trends in fashion and lifestyle at ShopVibe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={cn(poppins.variable, nunito.variable, spaceMono.variable)}>
      <body suppressHydrationWarning>
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
        </Suspense>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
