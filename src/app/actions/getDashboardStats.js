
"use server";

import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (businessError || !business) {
      return { success: false, message: "Business not found" };
    }

    const { count, error } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        totalCustomers: count ?? 0,
        revisitsCompleted: 0,
      },
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return {
      success: false,
      message: "Unable to fetch dashboard statistics",
    };
  }
}
