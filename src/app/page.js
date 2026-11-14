"use client"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Link
        href="/sign-in"
        className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
