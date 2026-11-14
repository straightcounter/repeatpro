
"use client";

import { useEffect, useState } from "react";
import {
  Store,
  Star,
  Percent,
  ChevronRight,
  X,
  Check,
  Loader2,
  Settings2,
  AlertCircle,
} from "lucide-react";
import { getBusinessDetails } from "@/app/actions/getBusinessDetails";
import { updateBusinessSettings } from "@/app/actions/updateBusinessSettings";


export default function SettingsPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function loadBusiness() {
    setLoading(true);
    setError("");

    try {
      const res = await getBusinessDetails();

      if (!res.success) {
        setError(res.message);
        return;
      }

      setBusiness(res.data);
    } catch {
      setError("Unable to load business details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusiness();
  }, []);

  function openModal(type) {
    setModal(type);
    setSaveError("");

    setValue(
      type === "review"
        ? business.googleReviewUrl || ""
        : String(business.discount ?? 0)
    );
  }

  function closeModal() {
    if (saving) return;
    setModal(null);
    setSaveError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setSaveError("");

    try {
      const payload =
        modal === "review"
          ? { googleReviewUrl: value.trim() }
          : { discount: Number(value) };

      const res = await updateBusinessSettings(payload);

      if (!res.success) {
        setSaveError(res.message);
        return;
      }

      setBusiness((prev) => ({
        ...prev,
        googleReviewUrl: res.data.googleReviewUrl,
        discount: res.data.discount,
      }));

      setModal(null);
    } catch {
      setSaveError("Unable to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const reviewAdded = Boolean(business?.googleReviewUrl);
  const discountAdded = Number(business?.discount) > 0;

  return (
    <main className="min-h-screen bg-background px-4 py-7 text-foreground sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">

        {loading ? (
          <div className="flex items-center justify-center py-24 text-primary">
            <Loader2 size={26} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-surface p-8 text-center">
            <AlertCircle
              size={25}
              className="mx-auto mb-3 text-primary"
            />
            <p className="text-sm text-secondary-text">
              {error}
            </p>
            <button
              onClick={loadBusiness}
              className="mt-4 text-sm font-semibold text-primary"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">

            {/* Business Profile */}
            <section>
              <h2 className="mb-3 text-sm font-semibold">
                Business profile
              </h2>

              <div className="rounded-2xl bg-surface p-5 shadow-sm shadow-foreground/5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Store size={25} strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold">
                      {business.shopName || "Your business"}
                    </h3>
                    <p className="mt-1 text-xs font-medium capitalize text-primary">
                      {business.businessType || "Business"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Detail
                    label="Owner name"
                    value={business.ownerName}
                  />
                  <Detail
                    label="Phone number"
                    value={business.phone}
                  />
                  <Detail
                    label="Business type"
                    value={business.businessType}
                  />
                  <Detail
                    label="Address"
                    value={business.address}
                  />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <h2 className="mb-3 text-sm font-semibold">
                Preferences
              </h2>

              <div className="overflow-hidden rounded-2xl bg-surface px-5 shadow-sm shadow-foreground/5 sm:px-6">

                <Preference
                  icon={Star}
                  title="Google Reviews"
                  subtitle={
                    reviewAdded
                      ? "Review link added"
                      : "Add your Google review link"
                  }
                  active={reviewAdded}
                  onClick={() => openModal("review")}
                />

                <div className="h-px bg-border" />

                <Preference
                  icon={Percent}
                  title="Discount"
                  subtitle={
                    discountAdded
                      ? `${business.discount}% discount`
                      : "No discount set"
                  }
                  active={discountAdded}
                  onClick={() => openModal("discount")}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(20,43,34,0.12)] backdrop-blur-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                  {modal === "review" ? (
                    <Star size={21} />
                  ) : (
                    <Percent size={21} />
                  )}
                </div>

                <h2
                  id="modal-title"
                  className="text-xl font-semibold tracking-tight"
                >
                  {modal === "review"
                    ? "Google Reviews"
                    : "Customer Discount"}
                </h2>

                <p className="mt-1.5 text-sm text-secondary-text">
                  {modal === "review"
                    ? "Paste your Google review link below."
                    : "Enter the discount percentage."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
                className="rounded-full p-2 text-secondary-text hover:bg-background"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label
                htmlFor="setting-input"
                className="mb-2 block text-sm font-medium"
              >
                {modal === "review"
                  ? "Review URL"
                  : "Discount (%)"}
              </label>

              <input
                id="setting-input"
                type={modal === "review" ? "url" : "number"}
                min={modal === "discount" ? 0 : undefined}
                max={modal === "discount" ? 100 : undefined}
                step={modal === "discount" ? "any" : undefined}
                required={modal === "discount"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  modal === "review"
                    ? "https://g.page/r/..."
                    : "e.g. 10"
                }
                disabled={saving}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-3.5 text-base outline-none transition placeholder:text-muted-text focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              {saveError && (
                <p role="alert" className="mt-3 text-xs text-red-600">
                  {saveError}
                </p>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-background px-4 py-3 text-sm font-medium text-secondary-text"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-xs text-muted-text">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function Preference({
  icon: Icon,
  title,
  subtitle,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 py-5 text-left transition"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
        </p>
        <p className="mt-1 truncate text-xs text-secondary-text">
          {subtitle}
        </p>
      </div>

      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          active ? "bg-primary" : "bg-muted-text/50"
        }`}
        title={active ? "Configured" : "Not configured"}
      />

      <ChevronRight
        size={17}
        className="shrink-0 text-muted-text transition group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </button>
  );
}
