import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL =
  Deno.env.get("RESEND_NOTIFICATION_EMAIL") ?? "info@ksenzaproperties.ae";
const FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "KSENZA Hayat Properties <info@ksenzaproperties.ae>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ContactPayload = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest?: string | null;
  message: string;
  propertyTitle?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  notes?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPropertyInterest(value: string | null | undefined): string {
  if (!value) return "Not specified";
  const labels: Record<string, string> = {
    buying: "Buying Property",
    selling: "Selling Property",
    renting: "Renting",
    investment: "Investment Consulting",
    management: "Property Management",
    viewing: "Property Viewing",
  };
  return labels[value] ?? value;
}

function formatTimeSlot(value: string | null | undefined): string {
  if (!value) return "Not specified";
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function buildContactEmailHtml(contact: ContactPayload): string {
  const isViewing = contact.propertyInterest === "viewing";
  const title = isViewing ? "New Viewing Request" : "New Contact Inquiry";
  const rows: Array<[string, string]> = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Interest", formatPropertyInterest(contact.propertyInterest)],
  ];
  if (contact.propertyTitle) rows.push(["Property", contact.propertyTitle]);
  if (contact.preferredDate) rows.push(["Preferred Date", contact.preferredDate]);
  if (contact.preferredTime) {
    rows.push(["Preferred Time", formatTimeSlot(contact.preferredTime)]);
  }
  if (contact.notes) rows.push(["Notes", contact.notes]);
  rows.push(["Message", contact.message]);

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: 600; width: 160px; vertical-align: top; color: #333;">
            ${escapeHtml(label)}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #555; white-space: pre-wrap;">
            ${escapeHtml(value)}
          </td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="margin: 0 0 16px; color: #7f142e;">${title}</h2>
      <p style="margin: 0 0 20px; color: #666;">
        A new ${isViewing ? "viewing request" : "contact form submission"} was received on the Ksenza Hayat Properties website.
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border: 1px solid #eee; border-radius: 8px;">
        <tbody>${tableRows}</tbody>
      </table>
      ${
        contact.id
          ? `<p style="margin: 20px 0 0; font-size: 12px; color: #999;">Submission ID: ${escapeHtml(contact.id)}</p>`
          : ""
      }
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const contact = (await req.json()) as ContactPayload;
    if (!contact?.name || !contact?.email || !contact?.message) {
      return new Response(JSON.stringify({ error: "Invalid contact payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isViewing = contact.propertyInterest === "viewing";
    const subject = isViewing
      ? `New Viewing Request — ${contact.name}`
      : `New Contact Inquiry — ${contact.name}`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFICATION_EMAIL],
        reply_to: contact.email,
        subject,
        html: buildContactEmailHtml(contact),
      }),
    });

    const result = await resendResponse.json();
    if (!resendResponse.ok) {
      throw new Error(result?.message ?? "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
