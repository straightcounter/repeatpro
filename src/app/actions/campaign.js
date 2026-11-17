
"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/server";

export async function sendCampaign() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }

    const { data: customers, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("business_id", business.id)
      .limit(10);

    if (customerError) throw customerError;

    if (!customers?.length) {
      return { success: false, error: "No customers found" };
    }

    const response = await fetch(
      `${process.env.REPEATPRO_API_URL}/api/campaign/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: business.id,
          customerIds: customers.map((customer) => customer.id),
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Campaign error:", error);

    return {
      success: false,
      error: "Failed to send campaign",
    };
  }
}
