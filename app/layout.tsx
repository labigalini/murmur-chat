import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { CommandMenu } from "@/components/ui/command-menu";
import { Toaster } from "@/components/ui/toaster";

import { AuthProvider } from "./_context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "murmur-chat | no eavesdroppers, ever",
  description:
    "Murmur is a private chat app where conversations are short-lived and secure.",
  // icon
  // image
  // keywords
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <>{children}</>
            <CommandMenu />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
