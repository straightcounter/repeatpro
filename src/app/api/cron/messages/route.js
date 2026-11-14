
import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const authorization = request.headers.get("authorization");

    if (
      !process.env.CRON_SECRET ||
      authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: messages, error: claimError } = await supabase.rpc(
      "claim_due_messages",
      { batch_size: 20 }
    );

    if (claimError) {
      console.error("Scheduler claim error:", claimError);

      return NextResponse.json(
        { success: false, message: "Unable to claim messages" },
        { status: 500 }
      );
    }

    if (!messages?.length) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No scheduled messages due.",
      });
    }

    let processed = 0;
    let failed = 0;

    for (const item of messages) {
      try {
        console.log("\n==============================");
        console.log("REPEATPRO MESSAGE SIMULATION");
        console.log("==============================");
        console.log("Message ID:", item.id);
        console.log("Business ID:", item.business_id);
        console.log("Customer ID:", item.customer_id);
        console.log("Scheduled At:", item.scheduled_at);
        console.log("Message:", item.message);
        console.log("==============================\n");

        const { error: updateError } = await supabase
          .from("scheduled_messages")
          .update({
            status: "simulated",
            processed_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", item.id)
          .eq("status", "processing");

        if (updateError) throw updateError;

        processed++;
      } catch (error) {
        failed++;

        console.error("Message processing failed:", item.id, error);

        const { error: failureError } = await supabase
          .from("scheduled_messages")
          .update({
            status: "failed",
            last_error: String(error?.message || error),
          })
          .eq("id", item.id)
          .eq("status", "processing");

        if (failureError) {
          console.error("Unable to record failure:", failureError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      claimed: messages.length,
      processed,
      failed,
    });
  } catch (error) {
    console.error("Scheduler error:", error);

    return NextResponse.json(
      { success: false, message: "Scheduler failed" },
      { status: 500 }
    );
  }
}
