import { ConvexClientProvider } from "@/app/(helpers)/ConvexClientProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Notifications } from "./(components)/Notifications";
import { ProfileButton } from "./(components)/ProfileButton";
import { Toaster } from "@/components/ui/toaster";

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
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <div className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
            <div className="flex justify-between max-w-5xl w-full items-center">
              <Link href="#" className="text-4xl font-bold text-gradient">
                murmur-chat
              </Link>
              <div className="flex justify-end gap-2">
                <Notifications />
                <ProfileButton />
              </div>
            </div>

            <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
              {children}
            </div>

            <div className="flex justify-end max-w-5xl w-full items-start text-xs md:text-sm text-muted-foreground ">
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
      </body>
    </html>
  );
}
