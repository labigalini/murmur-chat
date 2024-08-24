import { Notifications } from "@/app/(components)/Notifications";
import { ProfileButton } from "@/app/(components)/ProfileButton";
import { ConvexClientProvider } from "@/app/(helpers)/ConvexClientProvider";
import { StickyHeader } from "@/components/layout/sticky-header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Murmur Chat",
  description:
    "Murmur is a private chat app where conversations are short-lived and secure.",
  // icon
  // image
  // keywords
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <ConvexClientProvider>
            <StickyHeader className="px-4 py-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>Murmur Chat</div>
                <div className="flex items-center gap-4">
                  <Notifications />
                  <ProfileButton />
                </div>
              </div>
            </StickyHeader>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
