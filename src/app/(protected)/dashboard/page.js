"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Repeat2,
  Link2,
  Copy,
  Check,
  Download,
  QrCode,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

import { getBusinessDetails } from "@/app/actions/getBusinessDetails";

const stats = [
  {
    label: "Total Customers",
    value: "248",
    description: "Customers added to your business",
    icon: Users,
  },
  {
    label: "Revisits Completed",
    value: "86",
    description: "Customers who visited again",
    icon: Repeat2,
  },
];

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);

    async function loadBusiness() {
      setLoading(true);
      setError("");

      try {
        const res = await getBusinessDetails();

        if (!res.success) {
          setError(res.message || "Unable to load business.");
          return;
        }

        setBusiness(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load business details.");
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, []);

  const customerLink = business?.id
    ? `${process.env.NEXT_CUSTOM_URL}/customer/${business.id}`
    : "";

  const copyLink = async () => {
    if (!customerLink) return;

    try {
      await navigator.clipboard.writeText(customerLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Unable to copy link:", err);
    }
  };

  const downloadQR = async () => {
    if (!customerLink || downloading) return;

    setDownloading(true);

    try {
      const qrUrl =
        `https://api.qrserver.com/v1/create-qr-code/` +
        `?size=600x600&format=png&data=${encodeURIComponent(customerLink)}`;

      const response = await fetch(qrUrl);

      if (!response.ok) {
        throw new Error("Unable to generate QR code");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = `repeatpro-${business.id}-qr.png`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (err) {
      console.error("QR download failed:", err);
      alert("Unable to download QR code. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-7 text-[#292524] sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-9">
        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-[#78716C]">
                    {stat.label}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F4] text-[#57534E]">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>
                </div>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                  {stat.value}
                </h2>

                <p className="mt-2 text-xs text-[#A8A29E]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Customer Engagement */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Customer Engagement
            </h2>

            <p className="mt-1 text-sm text-[#78716C]">
              Share your business link and QR code with customers.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white">
            {/* Customer Link */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F4]">
                  <Link2
                    size={20}
                    className="text-[#57534E]"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">Customer Link</h3>

                  <p className="mt-1 text-xs text-[#A8A29E]">
                    Share this link with your customers.
                  </p>

                  <p className="mt-3 break-all text-sm font-medium text-[#57534E]">
                    {loading
                      ? "Generating your business link..."
                      : customerLink || "Business link unavailable"}
                  </p>

                  {error && (
                    <p className="mt-2 text-xs text-red-500">{error}</p>
                  )}
                </div>
              </div>

              <button
                onClick={copyLink}
                disabled={!customerLink}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <div className="mx-5 border-t border-[#F0EEEB] sm:mx-6" />

            {/* QR Code */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F4]">
                  <QrCode
                    size={20}
                    className="text-[#57534E]"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">QR Code</h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#A8A29E]">
                    Download your unique QR code and display it at your shop.
                  </p>
                </div>
              </div>

              <button
                onClick={downloadQR}
                disabled={!customerLink || downloading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#292524] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#44403C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />

                {downloading ? "Downloading..." : "Download QR"}
              </button>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Integrations
            </h2>

            <p className="mt-1 text-sm text-[#78716C]">
              Manage your connected services.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF3]">
                <MessageCircle
                  size={23}
                  className="text-[#16A34A]"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold">WhatsApp</h3>

                <p className="mt-1 text-xs text-[#A8A29E]">
                  Customer messaging and reminders
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-[#F0FDF4] px-3 py-2 text-xs font-semibold text-[#15803D]">
              <CheckCircle2 size={15} />
              Connected
            </div>
          </div>
        </section>

        <footer className="pt-2 text-center text-xs text-[#A8A29E]">
          RepeatPro · Grow through every revisit
        </footer>
      </div>
    </main>
  );
}
