import { renderStaticHome } from "@/lib/static-home";

export async function GET() {
  return new Response(await renderStaticHome(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
