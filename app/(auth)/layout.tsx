"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="flex w-full flex-col items-center justify-center pt-6 lg:hidden">
        <h1 className="text-gradient mb-2 text-4xl font-bold">murmur.chat</h1>
        <p className="text-xs font-light italic">No eavesdroppers, ever.</p>
      </div>
      <div className="bg-gradient hidden flex-col items-center justify-center p-12 lg:flex lg:w-1/2">
        <div className="text-white">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            murmur.chat
          </h1>
          <p className="text-xl font-light italic">No eavesdroppers, ever.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:pt-36">
        <div className="w-full max-w-md">
          <>{children}</>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
