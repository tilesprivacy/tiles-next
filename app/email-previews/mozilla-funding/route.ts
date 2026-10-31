import { toPlainText } from "@react-email/render";
import { buildFundingNewsletter } from "@/emails/mozilla-funding-newsletter";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const emailHtml = buildFundingNewsletter();
  const options = new URL(request.url).searchParams;
  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };

  if (options.get("format") === "text") {
    return new Response(toPlainText(emailHtml), {
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Preview the repository's image assets; email links still use public URLs.
  let html = emailHtml.replaceAll(
    'src="https://www.tiles.run/',
    'src="/',
  );
  // Deterministic local preview only; received mail can still be transformed
  // by the email client. This does not change the sendable HTML.
  if (options.get("theme") === "dark" || options.get("theme") === "light") {
    html = html.replaceAll(
      "@media (prefers-color-scheme: dark)",
      options.get("theme") === "dark" ? "@media all" : "@media not all",
    );
  }
  if (options.get("styles") === "inline") {
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  }
  if (options.get("images") === "off") {
    html = html.replace(
      /(<img\b[^>]*\bsrc=")[^"]*(")/gi,
      "$1/email-preview-image-blocked.png$2",
    );
  }

  return new Response(html, {
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}
