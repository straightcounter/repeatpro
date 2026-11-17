
"use client";

import { useState, useTransition } from "react";
import {
  Heart,
  CalendarClock,
  Megaphone,
  Pencil,
  X,
  Check,
  Loader2,
  MessageSquareText,
  ArrowUpRight,
  Send,
} from "lucide-react";

import { saveMessageTemplate } from "@/app/actions/messages";
import { sendCampaign } from "@/app/actions/campaign";

const messageTypes = [
  {
    key: "thank_you_message",
    title: "Thank You",
    description: "Make every customer feel appreciated after their visit.",
    icon: Heart,
    tag: "After visit",
  },
  {
    key: "revisit_message",
    title: "Revisit Reminder",
    description: "Bring customers back with a timely reminder.",
    icon: CalendarClock,
    tag: "Scheduled",
  },
  {
    key: "campaign_message",
    title: "Campaign",
    description: "Share offers, updates, and special announcements.",
    icon: Megaphone,
    tag: "Promotional",
  },
];

export default function MessagesClient({ initialTemplates }) {
  const [templates, setTemplates] = useState({
    thank_you_message: initialTemplates?.thank_you_message || "",
    revisit_message: initialTemplates?.revisit_message || "",
    campaign_message: initialTemplates?.campaign_message || "",
  });

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const [showCampaignConfirm, setShowCampaignConfirm] = useState(false);
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);

  const openEditor = (type) => {
    setDraft(templates[type.key]);
    setEditing(type);
    setError("");
    setSuccess("");
  };

  const closeEditor = () => {
    if (isPending) return;

    setEditing(null);
    setDraft("");
    setError("");
  };

  const handleSave = () => {
    if (!editing || isPending) return;

    const type = editing.key;
    const message = draft;
    const title = editing.title;

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    if (message.length > 5000) {
      setError("Message must be under 5000 characters.");
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const result = await saveMessageTemplate(type, message);

        if (!result.success) {
          setError(result.error || "Unable to save message.");
          return;
        }

        setTemplates((prev) => ({
          ...prev,
          [type]: message,
        }));

        setEditing(null);
        setSuccess(`${title} template updated successfully.`);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const openCampaignConfirm = () => {
    setError("");
    setSuccess("");
    setShowCampaignConfirm(true);
  };

  const closeCampaignConfirm = () => {
    if (isSendingCampaign) return;

    setShowCampaignConfirm(false);
    setError("");
  };

  const handleSendCampaign = async () => {
    if (isSendingCampaign || !templates.campaign_message.trim()) return;

    setIsSendingCampaign(true);
    setError("");
    setSuccess("");

    try {
      const result = await sendCampaign();

      if (!result.success) {
        setError(
          result.error ||
          result.message ||
          "Failed to send campaign."
        );
        return;
      }

      setShowCampaignConfirm(false);

      setSuccess(
        `Campaign completed! ${result.sent} messages submitted, ${result.failed} failed.`
      );
    } catch (error) {
      setError("Something went wrong while sending the campaign.");
    } finally {
      setIsSendingCampaign(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] px-4 py-6 text-[#172B22] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#32835D]">
              <MessageSquareText size={15} />
              Communication
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Message Templates
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">
              Create and manage the messages your customers receive.
              Keep every interaction personal and consistent.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#E2EBE4] bg-white px-4 py-2 text-xs font-medium text-[#4D6B59]">
            <span className="h-2 w-2 rounded-full bg-[#3D9968]" />
            3 Message Types
          </div>
        </div>

        {/* Success */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-center gap-2 rounded-xl border border-[#CDE8D5] bg-[#EDF8F0] px-4 py-3 text-sm text-[#24764C]"
          >
            <Check size={16} />
            {success}
          </div>
        )}

        {/* Error */}
        {error && !editing && !showCampaignConfirm && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Message Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {messageTypes.map((type) => {
            const Icon = type.icon;
            const message = templates[type.key];

            return (
              <div
                key={type.key}
                className="flex min-w-0 flex-col rounded-2xl border border-[#E4EBE5] bg-white p-5 shadow-[0_4px_24px_rgba(30,70,45,0.025)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDF6EF] text-[#32835D]">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <span className="rounded-full bg-[#F3F7F3] px-3 py-1.5 text-[11px] font-medium text-[#698172]">
                    {type.tag}
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {type.title}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#839087]">
                    {type.description}
                  </p>
                </div>

                <div className="mt-6 flex-1">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#89988E]">
                      Message Preview
                    </span>

                    <span className="text-xs text-[#9BA9A0]">
                      {message.length} characters
                    </span>
                  </div>

                  <div className="min-h-52 rounded-xl border border-[#E9EFEB] bg-[#F8FAF8] p-4 sm:p-5">
                    {message ? (
                      <p className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#40594A]">
                        {message}
                      </p>
                    ) : (
                      <div className="flex min-h-36 flex-col items-center justify-center gap-3 text-center">
                        <MessageSquareText
                          size={23}
                          strokeWidth={1.5}
                          className="text-[#B1C4B6]"
                        />

                        <p className="max-w-48 text-sm leading-6 text-[#9AA99E]">
                          No message added yet.
                          Create your first template.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openEditor(type)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#267A50] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1D6340]"
                >
                  <Pencil size={15} />
                  Edit Message
                  <ArrowUpRight size={15} className="ml-1 opacity-70" />
                </button>

                {/* Send Campaign Button */}
                {type.key === "campaign_message" && (
                  <button
                    onClick={openCampaignConfirm}
                    disabled={!message.trim() || isSendingCampaign}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#267A50] bg-[#E7F5EE] px-4 py-3 text-sm font-medium text-[#087F5B] transition hover:bg-[#D5EEDF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={16} />
                    Send Campaign
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E4EBE5] bg-white px-4 py-4">
          <MessageSquareText
            size={17}
            className="mt-0.5 shrink-0 text-[#57916D]"
          />

          <p className="text-xs leading-6 text-[#829087]">
            Your templates are saved for your business.
            Revisit reminders are scheduled separately, while thank-you
            and campaign messages are used when needed.
          </p>
        </div>
      </div>

      {/* Edit Message Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172B22]/40 p-4 backdrop-blur-[4px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditor();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-message-title"
            className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#E2EAE3] bg-white shadow-[0_24px_80px_rgba(15,50,30,0.16)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EDF1ED] px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="edit-message-title"
                  className="text-lg font-semibold text-[#172B22]"
                >
                  Edit {editing.title}
                </h2>

                <p className="mt-1 text-sm text-[#829087]">
                  Customize the message your customers will receive.
                </p>
              </div>

              <button
                onClick={closeEditor}
                disabled={isPending}
                aria-label="Close editor"
                className="rounded-lg p-2 text-[#829087] transition hover:bg-[#F1F5F1] hover:text-[#172B22] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="message-editor"
                  className="text-sm font-medium text-[#40594A]"
                >
                  Message Content
                </label>

                <span className="text-xs text-[#9BA9A0]">
                  {draft.length} / 5000
                </span>
              </div>

              <textarea
                id="message-editor"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={isPending}
                autoFocus
                spellCheck
                maxLength={5000}
                placeholder="Write your message here..."
                rows={9}
                className="w-full resize-y rounded-xl border border-[#DDE8DF] bg-[#FAFCFA] px-4 py-4 text-sm leading-7 text-[#294535] outline-none transition placeholder:text-[#A4B3A8] focus:border-[#40976A] focus:ring-2 focus:ring-[#40976A]/10 disabled:opacity-60"
              />

              <p className="mt-2 text-xs leading-5 text-[#829087]">
                Line breaks and spacing will be preserved in your saved template.
              </p>

              {error && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#EDF1ED] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                onClick={closeEditor}
                disabled={isPending}
                className="rounded-xl border border-[#E2EAE3] bg-white px-5 py-2.5 text-sm font-medium text-[#5D7163] transition hover:bg-[#F5F8F5] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isPending || !draft.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#267A50] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D6340] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Confirmation Modal */}
      {showCampaignConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#142B22]/45 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-confirm-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E2EAE5] bg-white shadow-[0_24px_80px_rgba(15,50,30,0.18)]"
          >
            <div className="p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F5EE] text-[#087F5B]">
                <Megaphone size={23} strokeWidth={1.8} />
              </div>

              <h2
                id="campaign-confirm-title"
                className="text-xl font-semibold tracking-tight text-[#142B22]"
              >
                Send Campaign?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6B7C73]">
                This will send your saved campaign message to the customers
                selected by your campaign API. Do you want to continue?
              </p>

              <div className="mt-5 rounded-xl border border-[#E2EAE5] bg-[#F8FAF9] p-4">
                <div className="mb-3 flex items-center gap-2 text-[#087F5B]">
                  <MessageSquareText size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Message Preview
                  </span>
                </div>

                <p className="max-h-44 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-[#40594A]">
                  {templates.campaign_message}
                </p>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  onClick={closeCampaignConfirm}
                  disabled={isSendingCampaign}
                  className="flex-1 rounded-xl border border-[#E2EAE5] bg-white px-4 py-3 text-sm font-medium text-[#40594A] transition hover:bg-[#F8FAF9] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendCampaign}
                  disabled={isSendingCampaign}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#087F5B] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#066B4D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingCampaign ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Confirm & Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
