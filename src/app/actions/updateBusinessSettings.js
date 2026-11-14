"use server";

import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";


export async function updateBusinessSettings({ googleReviewUrl, discount }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized. Please sign in.",
        data: null,
      };
    }

    const updates = {};

    if (googleReviewUrl !== undefined) {
      if (typeof googleReviewUrl !== "string") {
        return {
          success: false,
          message: "Invalid Google Review URL.",
          data: null,
        };
      }

      const url = googleReviewUrl.trim();

      if (url) {
        try {
          const parsed = new URL(url);

          if (parsed.protocol !== "https:") {
            throw new Error("Invalid protocol");
          }
        } catch {
          return {
            success: false,
            message: "Enter a valid HTTPS review URL.",
            data: null,
          };
        }
      }

      updates.google_review_url = url || null;
    }

    if (discount !== undefined) {
      const value = Number(discount);

      if (
        discount === null ||
        discount === "" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      ) {
        return {
          success: false,
          message: "Discount must be between 0 and 100.",
          data: null,
        };
      }

      updates.discount = value;
    }

    if (Object.keys(updates).length === 0) {
      return {
        success: false,
        message: "No changes provided.",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from("businesses")
      .update(updates)
      .eq("clerk_user_id", userId)
      .select("id, google_review_url, discount")
      .maybeSingle();

    if (error) {
      console.error("Update settings error:", error);

      return {
        success: false,
        message: "Failed to update settings.",
        data: null,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Business not found.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Settings updated successfully.",
      data: {
        googleReviewUrl: data.google_review_url ?? "",
        discount: Number(data.discount ?? 0),
      },
    };
  } catch (error) {
    console.error("Update settings error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
}
