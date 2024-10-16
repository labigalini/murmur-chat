import Link from "next/link";

import "@/styles/globals.css";

import { Notifications } from "./_components/Notifications";
import { ProfileButton } from "./_components/ProfileButton";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4 px-4 py-16 lg:px-24 lg:py-32">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="text-gradient text-4xl font-bold">
          murmur-chat
        </Link>
        <div className="flex justify-end gap-4">
          <Notifications />
          <ProfileButton />
        </div>
      </div>

      <div className="z-10 h-full w-full max-w-5xl flex-shrink-0 overflow-hidden rounded-lg border text-sm lg:flex">
        <main className="h-full w-full">{children}</main>
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
  );
}
