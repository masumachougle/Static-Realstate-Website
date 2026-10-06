import { Resend } from "resend";
import type { Contact } from "@shared/schema";

const resendApiKey = process.env.RESEND_API_KEY;
const notificationEmail =
  process.env.RESEND_NOTIFICATION_EMAIL ?? "info@ksenzaproperties.ae";
const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "KSENZA Hayat Properties <info@ksenzaproperties.ae>";

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!resend) {
    resend = new Resend(resendApiKey);
  }

  return resend;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPropertyInterest(value: string | null): string {
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

function formatTimeSlot(value: string | null): string {
  if (!value) return "Not specified";

  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function buildContactEmailHtml(contact: Contact): string {
  const isViewing = contact.propertyInterest === "viewing";
  const title = isViewing ? "New Viewing Request" : "New Contact Inquiry";
  const rows = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Interest", formatPropertyInterest(contact.propertyInterest)],
    ...(contact.propertyTitle
      ? [["Property", contact.propertyTitle] as const]
      : []),
    ...(contact.preferredDate
      ? [["Preferred Date", contact.preferredDate] as const]
      : []),
    ...(contact.preferredTime
      ? [["Preferred Time", formatTimeSlot(contact.preferredTime)] as const]
      : []),
    ...(contact.notes ? [["Notes", contact.notes] as const] : []),
    ["Message", contact.message],
  ];

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
      <p style="margin: 20px 0 0; font-size: 12px; color: #999;">
        Submission ID: ${escapeHtml(contact.id)}
      </p>
    </div>
  `;
}

export async function sendContactNotificationEmail(
  contact: Contact,
): Promise<void> {
  const client = getResendClient();
  const isViewing = contact.propertyInterest === "viewing";
  const subject = isViewing
    ? `New Viewing Request — ${contact.name}`
    : `New Contact Inquiry — ${contact.name}`;

  const { error } = await client.emails.send({
    from: fromEmail,
    to: [notificationEmail],
    replyTo: contact.email,
    subject,
    html: buildContactEmailHtml(contact),
  });

  if (error) {
    throw new Error(error.message);
  }
}
