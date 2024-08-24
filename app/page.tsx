"use client";

import ChatBoard from "./(components)/ChatBoard";

export default function Home() {
  return (
    <main className="container">
      <h1 className="text-4xl font-extrabold my-8">My Murmur Chats</h1>
      <ChatBoard />
    </main>
  );
}
