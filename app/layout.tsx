import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Link from "next/link";

import { Toaster } from "@/components/ui/toaster";

import { Notifications } from "./_components/Notifications";
import { ProfileButton } from "./_components/ProfileButton";
import { ConvexClientProvider } from "./_context/ConvexClientProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "murmur-chat",
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
  // children,
  chat,
}: Readonly<{
  // children: React.ReactNode;
  chat: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ConvexClientProvider>
            <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4 px-4 py-16 lg:px-24 lg:py-32">
              <div className="flex w-full max-w-5xl items-center justify-between">
                <Link href="#" className="text-gradient text-4xl font-bold">
                  murmur-chat
                </Link>
                <div className="flex justify-end gap-4">
                  <Notifications />
                  <ProfileButton />
                </div>
              </div>

              <div className="z-10 h-full w-full max-w-5xl flex-shrink-0 rounded-lg border text-sm lg:flex">
                <main className="h-full w-full">{chat}</main>
              </div>

              <div className="flex w-full max-w-5xl items-start justify-end text-xs text-muted-foreground md:text-sm">
                <p className="max-w-[150px] sm:max-w-lg">
                  by{" "}
                  <a className="font-semibold" href="https://spiteful.io/">
                    spiteful.io
                  </a>
                </p>
              </div>
            </div>
            <Toaster />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
