import { renderLinuxWaitlistEmailHtml } from "@/lib/linux-waitlist-email";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const html = renderLinuxWaitlistEmailHtml({
    FIRST_NAME: "Ankesh",
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
