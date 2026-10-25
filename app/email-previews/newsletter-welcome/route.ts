import fs from "node:fs";
import path from "node:path";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const templatePath = path.join(process.cwd(), "email-preview.html");
  // Preview new assets locally before they have been deployed to tiles.run.
  let html = fs
    .readFileSync(templatePath, "utf8")
    .replaceAll('src="https://www.tiles.run/email-', 'src="/email-');

  // Development-only fallbacks for clients that strip head CSS or block images.
  const options = new URL(request.url).searchParams;
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
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
