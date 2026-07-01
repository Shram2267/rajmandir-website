/**
 * Sends a WhatsApp alert via the user's Snapto (Red Lava) account.
 * Best-effort only — a notification failure must never break the sync itself,
 * so all errors are swallowed here (and logged to the server console).
 */
export async function sendSyncErrorAlert(message: string) {
  const phoneId = process.env.SNAPTO_PHONE_ID;
  const authToken = process.env.SNAPTO_AUTH_TOKEN;
  const to = process.env.SNAPTO_NOTIFY_NUMBER;
  const templateName = process.env.SNAPTO_TEMPLATE_NAME || "website_sync_error";

  if (!phoneId || !authToken || !to) {
    console.error("[sync] Snapto not configured, skipping WhatsApp alert. Sync error was:", message);
    return;
  }

  try {
    const res = await fetch(
      `https://wa.redlava.in/api/v1/whatsapp/sendMessage?phoneId=${phoneId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-phone-id": phoneId,
          Authorization: authToken.startsWith("Basic ") ? authToken : `Basic ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateName,
          language: "en",
          to,
          templateVariables: [message.slice(0, 200)],
        }),
      }
    );

    if (!res.ok) {
      console.error("[sync] Snapto WhatsApp alert failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[sync] Snapto WhatsApp alert threw:", err);
  }
}
