
"use server";

import { supabase } from "@/lib/supabase/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const businessTypes = [
  "salon",
  "bakery",
  "shop",
];

export async function createBusiness(formData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be signed in.",
      };
    }

    const user = await currentUser();

    const email = user?.emailAddresses?.find(
      (item) => item.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return {
        success: false,
        error: "No primary email found on your account.",
      };
    }

    const shopName = String(formData.shopName || "").trim();
    const ownerName = String(formData.ownerName || "").trim();
    const phone = String(formData.phone || "").trim();
    const address = String(formData.address || "").trim();
    const businessType = String(formData.businessType || "").trim();

    if (
      !shopName ||
      !ownerName ||
      !phone ||
      !address ||
      !businessType
    ) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      };
    }

    if (
      shopName.length > 120 ||
      ownerName.length > 120 ||
      phone.length > 20 ||
      address.length > 500 ||
      !/^\+?[0-9\s()-]{7,20}$/.test(phone) ||
      !businessTypes.includes(businessType)
    ) {
      return {
        success: false,
        error: "Please check the details you entered.",
      };
    }

    const { data: existing, error: lookupError } = await supabase
      .from("businesses")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      return {
        success: true,
        alreadyExists: true,
      };
    }

    const { error } = await supabase.from("businesses").insert({
      clerk_user_id: userId,
      email,
      shop_name: shopName,
      owner_name: ownerName,
      phone,
      address,
      business_type: businessType,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: true, alreadyExists: true };
      }

      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Create business error:", error);

    return {
      success: false,
      error: "Unable to create your business. Please try again.",
    };
  }
}
