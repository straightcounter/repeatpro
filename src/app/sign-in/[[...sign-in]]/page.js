import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import { ArrowUpRight, Check, Repeat2 } from "lucide-react";
import ClerkDebug from "@/components/ClerkDebug";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#087F5B] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-52 -left-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#087F5B]">
            <Repeat2 size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-semibold tracking-tight">
            repeatpro<span className="text-[#A7F3D0]">.</span>
          </span>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#D1FAE5]">
            <span className="h-2 w-2 rounded-full bg-[#A7F3D0]" />A smarter way
            to run your business
          </div>

          <h1 className="text-5xl font-semibold leading-[1.12] tracking-[-0.045em] xl:text-6xl">
            Better relationships.
            <br />
            <span className="text-[#A7F3D0]">Better business.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#D1FAE5]/85">
            Keep your customers close, your business organized, and every
            opportunity within reach.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Everything organized in one place",
              "Simple tools for everyday business",
              "More time to focus on growth",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <Check size={14} />
                </div>
                <span className="text-sm text-white/85">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-6 text-sm text-white/65">
          <span>©RepeatPro</span>
          <span className="flex items-center gap-1">
            Built for better business
            <ArrowUpRight size={14} />
          </span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col bg-white">
        <div className="flex items-center gap-2 px-6 pt-7 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#087F5B] text-white">
            <Repeat2 size={20} />
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#142B22]">
            repeatpro.
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-9">
              <span className="mb-4 inline-block rounded-full bg-[#E7F5EE] px-3 py-1.5 text-xs font-medium text-[#087F5B]">
                WELCOME TO REPEATPRO
              </span>

              <h2 className="text-3xl font-semibold tracking-tight text-[#142B22] sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#6B7C73]">
                Sign in to your account to continue managing your business.
              </p>
            </div>

            <div className="w-full min-h-[400px]">

              <Suspense
                fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#E7F5EE] border-t-[#087F5B]" />
                  </div>
                }
              >
                <SignIn
                  routing="path"
                  path="/sign-in"
                  forceRedirectUrl="/auth/complete"
                  signUpForceRedirectUrl="/auth/complete"
                  appearance={{
                    variables: {
                      colorPrimary: "#087F5B",
                      colorText: "#142B22",
                      colorBackground: "#FFFFFF",
                    },
                    elements: {
                      rootBox: "w-full",
                      cardBox: "!shadow-none !border-0",
                      card: "!shadow-none !border-0",
                    },
                  }}
                />
              </Suspense>
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-[#94A39A]">
              Secure access to your RepeatPro workspace.
            </p>
          </div>
        </div>

        <div className="px-6 pb-7 text-center text-xs text-[#94A39A]">
          © RepeatPro. All rights reserved.
        </div>
      </section>
    </main>
  );
}
