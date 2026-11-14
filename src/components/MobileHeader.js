
"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Repeat2 } from "lucide-react";

export default function MobileHeader() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#E2EAE5] bg-white/95 px-5 backdrop-blur-xl sm:px-6 lg:hidden">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F5B] text-white">
          <Repeat2 size={20} strokeWidth={2.4} />
        </div>

        <span className="text-[21px] font-semibold tracking-[-0.8px] text-[#142B22]">
          repeatpro
          <span className="text-[#087F5B]">.</span>
        </span>
      </Link>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2EAE5] bg-[#F8FAF9] text-[#6B7C73] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
      >
        <LogOut size={19} strokeWidth={1.9} />
      </button>
    </header>
  );
}
