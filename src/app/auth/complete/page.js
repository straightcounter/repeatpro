
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Store,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Repeat2,
  AlertCircle,
} from "lucide-react";
import { checkBusinessExists } from "@/app/actions/business";

const steps = [
  {
    icon: ShieldCheck,
    title: "Verifying your account",
    description: "Making sure your account is secure.",
  },
  {
    icon: Store,
    title: "Finding your business",
    description: "Checking your RepeatPro workspace.",
  },
  {
    icon: Sparkles,
    title: "Preparing your workspace",
    description: "Getting everything ready for you.",
  },
  {
    icon: CheckCircle2,
    title: "You're all set!",
    description: "Your workspace is ready to go.",
  },
];

export default function AuthCompletePage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("loading");
  const [destination, setDestination] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let completed = false;
    let redirectTimer;

    const interval = setInterval(() => {
      if (!completed && active) {
        setStep((prev) => Math.min(prev + 1, 2));
      }
    }, 1100);

    const verify = async () => {
      try {
        const result = await checkBusinessExists();

        if (!active) return;

        if (!result.success) {
          throw new Error(result.error || "Verification failed");
        }

        completed = true;
        clearInterval(interval);

        const target = result.exists
          ? "/dashboard"
          : "/onboarding";

        setDestination(target);
        setStep(3);
        setStatus("success");

        redirectTimer = setTimeout(() => {
          if (active) {
            router.replace(target);
          }
        }, 850);
      } catch (error) {
        if (!active) return;

        completed = true;
        clearInterval(interval);
        setStatus("error");
      }
    };

    verify();

    return () => {
      active = false;
      clearInterval(interval);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router, attempt]);

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleRetry = () => {
    setStep(0);
    setStatus("loading");
    setDestination("");
    setAttempt((prev) => prev + 1);
  };

  return (
    <main className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-[#F8FAF9]">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#E7F5EE] blur-3xl sm:h-[500px] sm:w-[500px]" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#E7F5EE]/60 blur-3xl sm:h-[450px] sm:w-[450px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex w-full items-center justify-between px-5 py-6 sm:px-10 sm:py-8 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F5B] text-white shadow-sm sm:h-10 sm:w-10">
            <Repeat2 size={21} strokeWidth={2.3} />
          </div>

          <span className="text-xl font-semibold tracking-[-0.04em] text-[#142B22] sm:text-2xl">
            repeatpro<span className="text-[#087F5B]">.</span>
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[#E2EAE5] bg-white px-4 py-2 text-xs font-medium text-[#6B7C73] sm:flex">
          <ShieldCheck size={15} className="text-[#087F5B]" />
          Secure authentication
        </div>
      </header>

      {/* Main content */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          {/* Status label */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#D5EADF] bg-[#E7F5EE] px-4 py-2 text-xs font-medium text-[#087F5B] sm:mb-12">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "error"
                  ? "bg-red-500"
                  : "bg-[#087F5B]"
              }`}
            />
            {status === "error"
              ? "Verification interrupted"
              : status === "success"
                ? "Verification complete"
                : "Setting up your workspace"}
          </div>

          {/* Animated verification illustration */}
          <div className="relative mb-10 flex h-40 w-40 items-center justify-center sm:mb-12 sm:h-48 sm:w-48">
            <motion.div
              animate={{
                rotate: status === "loading" ? 360 : 0,
              }}
              transition={{
                duration: 14,
                repeat: status === "loading" ? Infinity : 0,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border border-dashed border-[#B9DCC9]"
            />

            <motion.div
              animate={{
                rotate: status === "loading" ? -360 : 0,
              }}
              transition={{
                duration: 9,
                repeat: status === "loading" ? Infinity : 0,
                ease: "linear",
              }}
              className="absolute inset-4 rounded-full border border-[#D5EADF] border-t-[#087F5B]"
            />

            <div className="absolute inset-8 rounded-full bg-[#E7F5EE] blur-xl" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#D5EADF] bg-white shadow-[0_12px_45px_rgba(8,127,91,0.08)] sm:h-28 sm:w-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status === "error" ? "error" : step}
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: -15,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: 15,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {status === "error" ? (
                    <AlertCircle
                      size={42}
                      strokeWidth={1.5}
                      className="text-red-500"
                    />
                  ) : (
                    <Icon
                      size={42}
                      strokeWidth={1.5}
                      className="text-[#087F5B]"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Step text */}
          <div className="min-h-[105px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={status === "error" ? "error" : step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-3 text-2xl font-semibold tracking-[-0.035em] text-[#142B22] sm:text-3xl">
                  {status === "error"
                    ? "Something went wrong"
                    : currentStep.title}
                </h1>

                <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#6B7C73] sm:text-base">
                  {status === "error"
                    ? "We couldn't verify your workspace. Please try again."
                    : currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          {status !== "error" ? (
            <div
              className="mt-6 flex items-center gap-2.5"
              role="progressbar"
              aria-label="Workspace setup progress"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={4}
            >
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    width: index === step ? 32 : 8,
                    backgroundColor:
                      index <= step ? "#087F5B" : "#D5EADF",
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>
          ) : (
            <button
              onClick={handleRetry}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#087F5B] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#066B4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F5B]"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          )}

       
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center gap-2 rounded-full bg-[#E7F5EE] px-4 py-2 text-xs font-medium text-[#087F5B]"
              >
                <span>
                  {destination === "/dashboard"
                    ? "Opening your dashboard"
                    : "Setting up your business"}
                </span>
                <ArrowRight size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-center gap-2 px-5 py-6 text-center sm:flex-row sm:justify-between sm:px-10 lg:px-16">
        <span className="text-xs text-[#94A39A]">
          © RepeatPro
        </span>

        <div className="flex items-center gap-1.5 text-xs text-[#94A39A]">
          <ShieldCheck size={14} className="text-[#087F5B]" />
          <span>Secure authentication powered by Clerk</span>
        </div>
      </footer>
    </main>
  );
}
