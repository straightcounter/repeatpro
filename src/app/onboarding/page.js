
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Store,
  Scissors,
  CakeSlice,
  ShoppingBag,
  UtensilsCrossed,
  ShoppingBasket,
  BriefcaseBusiness,
  Check,
  Loader2,
  Repeat2,
  ShieldCheck,
  MapPin,
  UserRound,
  Phone,
} from "lucide-react";
import { createBusiness } from "@/app/actions/createBusiness";
import toast from "react-hot-toast";

const businessTypes = [
  { id: "salon", label: "Salon", icon: Scissors },
  { id: "bakery", label: "Bakery", icon: CakeSlice },
  { id: "shop", label: "Shop", icon: ShoppingBag },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    address: "",
    businessType: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const nextStep = () => {
    if (!form.businessType) {
      setError("Please select your business type.");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      nextStep();
      return;
    }

    if (
      !form.shopName.trim() ||
      !form.ownerName.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      setError("Please complete all the fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createBusiness(form);

      if (!result.success) {
        setError(result.error || "Something went wrong.");
        return;
      }

      toast.success("Welcome to dashboard")
      router.replace("/dashboard");
    } catch {
      toast.error("something went wrong")
      setError("Unable to save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAF9] lg:grid lg:grid-cols-[42%_58%]">
      {/* Left branding panel */}
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#087F5B] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#087F5B]">
            <Repeat2 size={24} strokeWidth={2.3} />
          </div>

          <span className="text-2xl font-semibold tracking-tight">
            repeatpro<span className="text-[#A7F3D0]">.</span>
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#D1FAE5]">
            <span className="h-2 w-2 rounded-full bg-[#A7F3D0]" />
            Your business journey starts here
          </div>

          <h1 className="text-5xl font-semibold leading-[1.13] tracking-[-0.045em] xl:text-6xl">
            Let's build
            <br />
            something
            <br />
            <span className="text-[#A7F3D0]">
              remarkable.
            </span>
          </h1>

          <p className="mt-7 max-w-sm text-lg leading-relaxed text-[#D1FAE5]/85">
            Tell us a little about your business.
            We'll help you create a workspace that
            feels like your own.
          </p>

          <div className="mt-12 space-y-5">
            {[
              "A workspace built around your business",
              "Simple tools to stay organized",
              "Everything you need in one place",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check size={15} />
                </div>
                <span className="text-sm text-white/85">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/20 pt-6 text-sm text-white/60">
          ©  RepeatPro
        </div>
      </aside>


      <section className="flex min-h-screen flex-col bg-white">
        <div className="flex items-center gap-2 px-5 pt-6 sm:px-10 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#087F5B] text-white">
            <Repeat2 size={20} />
          </div>

          <span className="text-xl font-semibold tracking-tight text-[#142B22]">
            repeatpro.
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-[520px]">
            
            <div className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#087F5B]">
                  Business setup
                </span>
                <span className="text-xs font-medium text-[#6B7C73]">
                  Step {step} of 2
                </span>
              </div>

              <div className="flex gap-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      item <= step
                        ? "bg-[#087F5B]"
                        : "bg-[#E2EAE5]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5EE] text-[#087F5B]">
                      <Store size={24} />
                    </div>

                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#142B22] sm:text-4xl">
                      What kind of business
                      <br className="hidden sm:block" />
                      {" "}do you run?
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-[#6B7C73]">
                      Choose the category that best describes
                      your business.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {businessTypes.map((type) => {
                      const Icon = type.icon;
                      const selected = form.businessType === type.id;

                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            updateForm("businessType", type.id)
                          }
                          aria-pressed={selected}
                          className={`group flex min-h-[118px] flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F5B] ${
                            selected
                              ? "border-[#087F5B] bg-[#E7F5EE]"
                              : "border-[#E2EAE5] bg-white hover:border-[#B9DCC9] hover:bg-[#F8FAF9]"
                          }`}
                        >
                          <div className="flex w-full items-start justify-between">
                            <Icon
                              size={24}
                              strokeWidth={1.7}
                              className={
                                selected
                                  ? "text-[#087F5B]"
                                  : "text-[#6B7C73]"
                              }
                            />

                            {selected && (
                              <Check
                                size={17}
                                className="text-[#087F5B]"
                              />
                            )}
                          </div>

                          <span
                            className={`text-sm font-medium ${
                              selected
                                ? "text-[#087F5B]"
                                : "text-[#142B22]"
                            }`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5EE] text-[#087F5B]">
                      <Store size={24} />
                    </div>

                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#142B22] sm:text-4xl">
                      Tell us about
                      <br />
                      your business.
                    </h2>

                    <p className="mt-3 text-sm text-[#6B7C73]">
                      Just a few details to personalize your workspace.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      label="Business / Shop name"
                      icon={Store}
                      placeholder="e.g. Green Leaf Salon"
                      value={form.shopName}
                      onChange={(e) =>
                        updateForm("shopName", e.target.value)
                      }
                      maxLength={120}
                      required
                    />

                    <InputField
                      label="Owner name"
                      icon={UserRound}
                      placeholder="Enter your full name"
                      value={form.ownerName}
                      onChange={(e) =>
                        updateForm("ownerName", e.target.value)
                      }
                      maxLength={120}
                      required
                    />

                    <InputField
                      label="Phone number"
                      icon={Phone}
                      placeholder="e.g. +91 9876543210"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateForm("phone", e.target.value)
                      }
                      maxLength={20}
                      required
                    />

                    <div>
                      <label
                        htmlFor="business-address"
                        className="mb-2 block text-sm font-medium text-[#142B22]"
                      >
                        Business address
                      </label>

                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-4 top-4 text-[#94A39A]"
                        />

                        <textarea
                          id="business-address"
                          rows={3}
                          maxLength={500}
                          required
                          placeholder="Shop number, street, city, state..."
                          value={form.address}
                          onChange={(e) =>
                            updateForm("address", e.target.value)
                          }
                          className="w-full resize-none rounded-xl border border-[#E2EAE5] bg-white py-3.5 pl-11 pr-4 text-sm text-[#142B22] outline-none transition placeholder:text-[#94A39A] focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/10"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <div className="mt-9 flex items-center gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    disabled={loading}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E2EAE5] text-[#142B22] transition hover:bg-[#F8FAF9] disabled:opacity-50"
                    aria-label="Previous step"
                  >
                    <ArrowLeft size={19} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#087F5B] px-6 text-sm font-semibold text-white transition-all hover:bg-[#066B4D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating workspace...
                    </>
                  ) : (
                    <>
                      {step === 1
                        ? "Continue"
                        : "Create my workspace"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#94A39A]">
              <ShieldCheck size={15} className="text-[#087F5B]" />
              Your business information is securely stored.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
  required,
  autoComplete,
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#142B22]"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A39A]"
        />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-[#E2EAE5] bg-white pl-11 pr-4 text-sm text-[#142B22] outline-none transition placeholder:text-[#94A39A] focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/10"
        />
      </div>
    </div>
  );
}
