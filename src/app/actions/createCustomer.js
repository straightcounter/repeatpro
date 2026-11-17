
"use server";

import { supabase } from "@/lib/supabase/server";

export async function createCustomer({ name, phone, businessId }) {
  try {
    const customerName = name?.trim();
    const customerPhone = phone?.trim();

    // 1. Validate customer details
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

    // 2. Fetch business details
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, shop_name, google_review_url")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      return {
        success: false,
        message: "Business not found.",
      };
    }

    // 3. Check whether customer already exists
    const { data: existingCustomer, error: checkError } = await supabase
      .from("customers")
      .select("id, name, phone")
      .eq("business_id", businessId)
      .eq("phone", customerPhone)
      .maybeSingle();

    if (checkError) {
      console.error("Customer check error:", checkError);

      return {
        success: false,
        message: "Unable to verify customer. Please try again.",
      };
    }

    // CASE 2: Existing customer
    // No insert, no WhatsApp API call, no reminder scheduling
    if (existingCustomer) {
      return {
        success: true,
        message: "Customer already registered.",
        data: existingCustomer,
        googleReviewUrl: business.google_review_url || null,
        reminderScheduled: false,
        alreadyRegistered: true,
      };
    }

    // CASE 1: New customer

    // 4. Save new customer in Supabase
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        business_id: businessId,
        name: customerName,
        phone: customerPhone,
      })
      .select("id, business_id, name, phone, created_at")
      .single();

    if (customerError || !customer) {
      console.error("Create customer error:", customerError);

      return {
        success: false,
        message: "Unable to save customer. Please try again.",
      };
    }

    // 5. Send Thank You WhatsApp through VPS API
    let thankYouSent = false;

    try {
      const response = await fetch(
        `${process.env.REPEATPRO_API_URL}/api/messages/thank-you`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId: business.id,
            customerId: customer.id,
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        thankYouSent = true;
        console.log("Thank You WhatsApp submitted:", customer.id);
      } else {
        console.error("Thank You WhatsApp failed:", result);
      }
    } catch (error) {
      console.error("Thank You API error:", error.message);
    }

    // 6. Fetch revisit message template
    const { data: template, error: templateError } = await supabase
      .from("message_templates")
      .select("id, revisit_message")
      .eq("business_id", businessId)
      .maybeSingle();

    if (templateError) {
      console.error("Fetch template error:", templateError);
    }

    let reminderScheduled = false;

    // 7. Schedule revisit reminder after 24 hours
    if (template?.revisit_message?.trim()) {
      const scheduledAt = new Date(
        new Date(customer.created_at).getTime() +
          24 * 60 * 60 * 1000
      ).toISOString();

      const message = template.revisit_message
        .replaceAll("{customer_name}", customerName)
        .replaceAll("{business_name}", business.shop_name || "");

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

    // 8. Return success for new customer
    return {
      success: true,
      message: "Customer registered successfully.",
      data: customer,
      googleReviewUrl: business.google_review_url || null,
      thankYouSent,
      reminderScheduled,
      alreadyRegistered: false,
    };
  } catch (error) {
    console.error("Create customer error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
