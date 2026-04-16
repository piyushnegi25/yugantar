import { Resend } from "resend";

const RESEND_PLACEHOLDER_KEY = "re_xxxxxxxxx";
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";
const DEFAULT_ADMIN_EMAIL = "piyushnegi.bca2022@imsuc.ac.in";
const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface NewOrderEmailItem {
  title: string;
  quantity: number;
  size: string;
  price: number;
}

interface SendNewOrderEmailsInput {
  orderId: string;
  userEmail: string;
  userName?: string;
  items: NewOrderEmailItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface SendOrderStatusUpdateEmailInput {
  orderId: string;
  userEmail: string;
  userName?: string;
  previousStatus?: OrderStatus;
  nextStatus: OrderStatus;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || RESEND_PLACEHOLDER_KEY;

  if (!apiKey || apiKey === RESEND_PLACEHOLDER_KEY) {
    console.warn(
      "Resend email skipped: replace RESEND_API_KEY placeholder re_xxxxxxxxx"
    );
    return null;
  }

  return new Resend(apiKey);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function buildItemsHtml(items: NewOrderEmailItem[]): string {
  return items
    .map((item) => {
      const lineTotal = item.price * item.quantity;
      return `<li>${escapeHtml(item.title)} (Size: ${escapeHtml(
        item.size
      )}) x ${item.quantity} - ${formatCurrency(lineTotal)}</li>`;
    })
    .join("");
}

export async function sendNewOrderEmails({
  orderId,
  userEmail,
  userName,
  items,
  subtotal,
  shipping,
  total,
}: SendNewOrderEmailsInput): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const adminEmail = process.env.ORDER_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;

  const safeOrderId = escapeHtml(orderId);
  const safeUserName = escapeHtml((userName || "there").trim() || "there");
  const safeUserEmail = escapeHtml(userEmail);
  const itemListHtml = buildItemsHtml(items);

  const userHtml = `<p>Hi ${safeUserName},</p>
<p>Your order <strong>${safeOrderId}</strong> has been placed successfully.</p>
<p>Here is your order summary:</p>
<ul>${itemListHtml}</ul>
<p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
<p><strong>Shipping:</strong> ${formatCurrency(shipping)}</p>
<p><strong>Total:</strong> ${formatCurrency(total)}</p>
<p>We will notify you when your order status changes.</p>`;

  const adminHtml = `<p>New order received.</p>
<p><strong>Order ID:</strong> ${safeOrderId}</p>
<p><strong>Customer:</strong> ${safeUserName} (${safeUserEmail})</p>
<ul>${itemListHtml}</ul>
<p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
<p><strong>Shipping:</strong> ${formatCurrency(shipping)}</p>
<p><strong>Total:</strong> ${formatCurrency(total)}</p>`;

  const emailsToSend: Promise<unknown>[] = [];

  if (userEmail) {
    emailsToSend.push(
      resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `Order placed: ${orderId}`,
        html: userHtml,
      })
    );
  }

  if (adminEmail) {
    emailsToSend.push(
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New order received: ${orderId}`,
        html: adminHtml,
      })
    );
  }

  if (emailsToSend.length === 0) {
    return;
  }

  await Promise.all(emailsToSend);
}

export async function sendOrderStatusUpdateEmail({
  orderId,
  userEmail,
  userName,
  previousStatus,
  nextStatus,
}: SendOrderStatusUpdateEmailInput): Promise<void> {
  const resend = getResendClient();
  if (!resend || !userEmail) {
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const safeOrderId = escapeHtml(orderId);
  const safeUserName = escapeHtml((userName || "there").trim() || "there");
  const formattedNextStatus = formatStatus(nextStatus);
  const formattedPreviousStatus = previousStatus
    ? formatStatus(previousStatus)
    : null;

  const html = `<p>Hi ${safeUserName},</p>
<p>Your order <strong>${safeOrderId}</strong> status has been updated to <strong>${escapeHtml(
    formattedNextStatus
  )}</strong>.</p>
${
  formattedPreviousStatus
    ? `<p>Previous status: <strong>${escapeHtml(formattedPreviousStatus)}</strong></p>`
    : ""
}
<p>Thank you for shopping with us.</p>`;

  await resend.emails.send({
    from: fromEmail,
    to: userEmail,
    subject: `Order ${orderId} status: ${formattedNextStatus}`,
    html,
  });
}
