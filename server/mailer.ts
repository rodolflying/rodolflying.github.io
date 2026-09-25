import { Resend } from "resend";

// Shared by the Express dev server (server/routes.ts) and the Vercel handler (api/contact.ts).
// Env vars:
//   RESEND_API_KEY     - required to send anything; without it emails are skipped (logged).
//   CONTACT_TO_EMAIL   - inbox that receives new-lead notifications.
//   CONTACT_FROM_EMAIL - verified sender in Resend, e.g. "Star Apps <contacto@tudominio.cl>".
//                        Until a domain is verified, Resend only allows "onboarding@resend.dev"
//                        and only delivers to the account owner's address.

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MailResult {
  admin: boolean;
  autoreply: boolean;
  skipped?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Strip CR/LF so user input can never inject extra headers through the subject line.
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim().slice(0, 150);

function adminHtml(p: ContactPayload) {
  return `
    <h2>Nuevo contacto desde el sitio web</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(p.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(p.email)}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(p.subject)}</p>
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(p.message)}</p>
  `;
}

function autoreplyHtml(p: ContactPayload) {
  return `
    <p>Hola ${escapeHtml(p.name)},</p>
    <p>Recibimos tu mensaje sobre <em>"${escapeHtml(oneLine(p.subject))}"</em>. Te responderemos dentro de las próximas 24 horas hábiles.</p>
    <p>Si es urgente, puedes escribirnos por WhatsApp: <a href="https://wa.me/56956632620">+56 9 5663 2620</a>.</p>
    <p>— Equipo Star Apps</p>
    <hr/>
    <p style="color:#888;font-size:12px">Hi ${escapeHtml(p.name)}, we received your message and will get back to you within 24 business hours.</p>
  `;
}

export async function sendContactEmails(payload: ContactPayload): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Star Apps <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY or CONTACT_TO_EMAIL missing; contact emails skipped.");
    return { admin: false, autoreply: false, skipped: "not-configured" };
  }

  const resend = new Resend(apiKey);

  // The lead notification is the critical one; the autoreply is best-effort.
  const admin = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: `[Web] ${oneLine(payload.subject)} — ${oneLine(payload.name)}`,
    html: adminHtml(payload),
  });
  if (admin.error) {
    console.error("Resend admin email failed:", admin.error);
  }

  const autoreply = await resend.emails.send({
    from,
    to: payload.email,
    replyTo: to,
    subject: "Recibimos tu mensaje — Star Apps",
    html: autoreplyHtml(payload),
  });
  if (autoreply.error) {
    console.error("Resend autoreply failed:", autoreply.error);
  }

  return { admin: !admin.error, autoreply: !autoreply.error };
}
