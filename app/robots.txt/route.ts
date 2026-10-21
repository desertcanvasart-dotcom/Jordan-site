import { siteOrigin } from "@/lib/business";
export function GET(request: Request) {
  const protectedPaths = "Disallow: /api/\nDisallow: /admin/\nDisallow: /studio/";
  const allowed = ["Googlebot", "Bingbot", "GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"];
  const body = `${allowed.map(bot => `User-agent: ${bot}\nAllow: /\n${protectedPaths}`).join("\n\n")}\n\nUser-agent: AhrefsBot\nDisallow: /\n\nUser-agent: *\n${protectedPaths}\n\nSitemap: ${siteOrigin(request)}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
