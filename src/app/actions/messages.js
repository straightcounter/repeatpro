"use server";

import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const allowedTypes = [
  "thank_you_message",
  "revisit_message",
  "campaign_message",
];

export async function saveMessageTemplate(type, message) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!allowedTypes.includes(type)) {
      return { success: false, error: "Invalid message type" };
    }

    if (typeof message !== "string" || !message.trim()) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (message.length > 5000) {
      return { success: false, error: "Message is too long" };
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }

    const { data: existing, error: lookupError } = await supabase
      .from("message_templates")
      .select("id")
      .eq("business_id", business.id)
      .maybeSingle();

    if (lookupError) throw lookupError;

    let result;

    if (existing) {
      result = await supabase
        .from("message_templates")
        .update({
          [type]: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .eq("business_id", business.id);
    } else {
      result = await supabase
        .from("message_templates")
        .upsert(
          {
            business_id: business.id,
            [type]: message,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "business_id" }
        );
    }

    if (result.error) throw result.error;

    revalidatePath("/messages");

    return { success: true };
  } catch (error) {
    console.error("Save template error:", error);

    return {
      success: false,
      error: "Failed to save message. Please try again.",
    };
  }
}