
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  HeartHandshake,
  Loader2,
  LockKeyhole,
  Sparkles,
  UserRound,
  Phone,
} from "lucide-react";

import { createCustomer } from "@/app/actions/createCustomer";
import { useParams } from "next/navigation";

export default function CustomerClient() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || completed) return;

    setError("");

    const customerName = name.trim();
    const customerPhone = phone.trim();

    if (!customerName || !customerPhone) {
      setError("Please enter your name and phone number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const result = await createCustomer({
        name: customerName,
        phone: customerPhone,
        businessId: id,
      });

      if (!result.success) {
        setError(result.message || "Something went wrong.");
        return;
      }

      setCompleted(true);

      if (result.googleReviewUrl) {
        const url = new URL(result.googleReviewUrl);

        const allowedHosts = [
          "google.com",
          "www.google.com",
          "maps.google.com",
          "g.page",
          "www.g.page",
          "search.google.com",
        ];

        const isAllowed =
          url.protocol === "https:" &&
          allowedHosts.includes(url.hostname);

        if (!isAllowed) {
          setError("Review link is currently unavailable.");
          return;
        }

        window.location.assign(url.toString());
      } else {
        setError("Review link is currently unavailable.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#E8E1D8] bg-white py-3.5 pl-11 pr-4 text-sm text-[#312C28] outline-none transition-all placeholder:text-[#B3A99E] focus:border-[#B58A68] focus:ring-4 focus:ring-[#B58A68]/10";

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#F8F5EF] px-4 py-8 text-[#312C28] sm:px-6">
      <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-[#F3E3D2]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#EFE4D9]/80 blur-3xl" />

      <div className="relative z-10 w-full max-w-[430px]">
        <div className="rounded-[28px] border border-[#EEE7DE] bg-white p-6 shadow-[0_20px_80px_-35px_rgba(65,45,30,0.18)] sm:p-9">

          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#312C28] text-white">
                <Sparkles size={17} strokeWidth={1.8} />
              </div>

              <span className="text-sm font-semibold tracking-tight">
                RepeatPro
              </span>
            </div>

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A79C91]">
              Made for you
            </span>
          </div>

          {/* Welcome */}
          <div className="mt-12">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8EADB] text-[#A36A44]">
              <HeartHandshake size={27} strokeWidth={1.6} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B58A68]">
              A warm welcome
            </p>

            <h1 className="max-w-[320px] text-[32px] font-semibold leading-[1.15] tracking-[-0.045em] sm:text-[36px]">
              A little hello goes a long way.
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#8B8177]">
              We're happy you're here. Just a couple of details
              before you continue.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label
                htmlFor="customer-name"
                className="mb-2 block text-xs font-semibold text-[#51463C]"
              >
                Your name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A99E]"
                />

                <input
                  id="customer-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  disabled={loading || completed}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="mb-2 block text-xs font-semibold text-[#51463C]"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A99E]"
                />

                <input
                  id="customer-phone"
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setPhone(value);
                  }}
                  maxLength={10}
                  disabled={loading || completed}
                  required
                  className={inputClass}
                />
              </div>

              <p className="mt-2 text-[11px] text-[#A79C91]">
                Enter your 10-digit mobile number.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {completed && (
              <div className="flex items-center gap-2 rounded-xl bg-[#F0F8EF] px-4 py-3 text-xs font-medium text-[#348348]">
                <Check size={16} />
                Your details have been saved.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || completed}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#312C28] px-5 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4B4038] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Just a moment...
                </>
              ) : completed ? (
                <>
                  <Check size={18} />
                  Registered
                </>
              ) : (
                <>
                  Continue to Google
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>

            <p className="text-center text-[11px] leading-5 text-[#A79C91]">
              By continuing, you share these details with this
              business. Leaving a Google review is optional.
            </p>
          </form>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-center gap-1.5 border-t border-[#F1ECE6] pt-5">
            <LockKeyhole
              size={12}
              className="text-[#A79C91]"
            />

            <span className="text-[11px] text-[#A79C91]">
              Powered by
            </span>

            <span className="text-[11px] font-semibold text-[#51463C]">
              RepeatPro
            </span>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-[#A79C91]">
          Made for meaningful connections.
        </p>
      </div>
    </main>
  );
}
