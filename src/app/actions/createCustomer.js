"use server";

import { supabase } from "@/lib/supabase/server";

export async function createCustomer({ name, phone, businessId }) {
  try {
    const customerName = name?.trim();
    const customerPhone = phone?.trim();

    if (!customerName || !customerPhone || !businessId) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      return {
        success: false,
        message: "Enter a valid 10-digit phone number.",
      };
    }

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, google_review_url")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      return {
        success: false,
        message: "Business not found.",
      };
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        business_id: businessId,
        name: customerName,
        phone: customerPhone,
      })
      .select("id, business_id, name, phone, created_at")
      .single();

    if (customerError) {
      console.error("Create customer error:", customerError);

      return {
        success: false,
        message: "Unable to save customer. Please try again.",
      };
    }

    // Fetch business revisit message template
    const { data: template, error: templateError } = await supabase
      .from("message_templates")
      .select("id, revisit_message")
      .eq("business_id", businessId)
      .maybeSingle();

    if (templateError) {
      console.error("Fetch template error:", templateError);
    }

    let reminderScheduled = false;

    if (template?.revisit_message?.trim()) {
      // Schedule message 7 days after registration
      const scheduledAt = new Date(
        new Date(customer.created_at).getTime() +
          7 * 24 * 60 * 60 * 1000
      ).toISOString();

      // Replace template placeholders
      const message = template.revisit_message
        .replaceAll("{customer_name}", customerName)
        .replaceAll("{business_name}", business.name || "");

      const { error: scheduleError } = await supabase
        .from("scheduled_messages")
        .insert({
          business_id: businessId,
          customer_id: customer.id,
          template_id: template.id,
          message,
          scheduled_at: scheduledAt,
          status: "pending",
          attempts: 0,
        });

      if (scheduleError) {
        console.error("Schedule message error:", scheduleError);
      } else {
        reminderScheduled = true;
      }
    }

    return {
      success: true,
      message: reminderScheduled
        ? "Customer registered and revisit reminder scheduled successfully."
        : "Customer registered successfully.",
      data: customer,
      googleReviewUrl: business.google_review_url || null,
      reminderScheduled,
    };
  } catch (error) {
    console.error("Create customer error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}