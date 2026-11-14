import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/server";
import MessagesClient from "@/components/MessagesClient";

export default async function MessagesPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (businessError || !business) {
    redirect("/onboarding");
  }

  const { data: templates, error } = await supabase
    .from("message_templates")
    .select("thank_you_message, revisit_message, campaign_message")
    .eq("business_id", business.id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load message templates");
  }

  return <MessagesClient initialTemplates={templates} />;
}