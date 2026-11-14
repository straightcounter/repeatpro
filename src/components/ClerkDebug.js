
"use client";

import { useAuth, useClerk } from "@clerk/nextjs";

export default function ClerkDebug() {
  const { isLoaded, userId } = useAuth();
  const clerk = useClerk();

  return (
    <div className="rounded-xl border border-[#E2EAE5] bg-white p-4 text-sm text-[#142B22]">
      <p>Clerk loaded: {String(isLoaded)}</p>
      <p>User ID: {userId || "Not signed in"}</p>
      <p>Clerk instance loaded: {String(clerk.loaded)}</p>
    </div>
  );
}
