
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export const instant = false;

export default async function ProtectedLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#142B22]">
      <Sidebar />
      <MobileHeader />

      <main className="min-h-screen pb-[calc(84px+env(safe-area-inset-bottom))] lg:ml-[280px] lg:pb-0">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
