
"use server";

import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function getBusinessDetails() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized. Please sign in.",
        data: null,
      };
    }

    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id, shop_name, owner_name, phone, address, business_type, discount, google_review_url"
      )
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Get business details error:", error);

      return {
        success: false,
        message: "Failed to fetch business details.",
        data: null,
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Business profile not found.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Business details fetched successfully.",
      data: {
        id: data.id,
        shopName: data.shop_name,
        ownerName: data.owner_name,
        phone: data.phone,
        address: data.address,
        businessType: data.business_type,
        discount: data.discount ?? 0,
        googleReviewUrl: data.google_review_url ?? "",
      },
    };
  } catch (error) {
    console.error("Get business details error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
}
