
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MessageSquareText,
  Settings2,
  LogOut,
  Repeat2,
  ArrowUpRight,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Messages",
    href: "/message",
    icon: MessageSquareText,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-[#E2EAE5] bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-24 items-center px-7">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#087F5B] text-white">
              <Repeat2 size={23} strokeWidth={2.4} />
            </div>

            <span className="text-[23px] font-semibold tracking-[-0.8px] text-[#142B22]">
              repeatpro
              <span className="text-[#087F5B]">.</span>
            </span>
          </Link>
        </div>

        <div className="mx-6 h-px bg-[#E2EAE5]" />

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-9">
          <p className="mb-4 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94A39A]">
            Workspace
          </p>

          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-13 items-center gap-4 rounded-xl px-4 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#E7F5EE] text-[#087F5B]"
                      : "text-[#6B7C73] hover:bg-[#F8FAF9] hover:text-[#142B22]"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#087F5B]" />
                  )}

                  <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.8}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <ArrowUpRight
                      size={16}
                      className="ml-auto text-[#087F5B]/60"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6">
          <div className="mx-2 mb-5 h-px bg-[#E2EAE5]" />

          <button
            onClick={handleLogout}
            className="flex h-13 w-full items-center gap-4 rounded-xl px-4 text-sm font-medium text-[#6B7C73] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} strokeWidth={1.8} />
            <span>Log out</span>
          </button>

          <p className="mt-5 px-4 text-[11px] text-[#94A39A]">
            © RepeatPro
          </p>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2EAE5] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex h-[68px] max-w-md items-center justify-around px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full min-w-20 flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? "text-[#087F5B]"
                    : "text-[#94A39A]"
                }`}
              >
                {active && (
                  <span className="absolute top-0 h-[2px] w-8 rounded-full bg-[#087F5B]" />
                )}

                <div
                  className={`flex h-9 w-12 items-center justify-center rounded-xl ${
                    active ? "bg-[#E7F5EE]" : ""
                  }`}
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                </div>

                <span className="text-[10px] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
