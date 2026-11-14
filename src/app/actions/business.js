"use server";

import { supabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function checkBusinessExists() {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      exists: false,
      error: "Unauthorized",
    };
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

    

  if (error) {
    console.log("ERROR ",error)
    return {
      success: false,
      exists: false,
      error: error.message,
    };
  }

  return {
    success: true,
    exists: !!data,
    error: null,
  };
}
