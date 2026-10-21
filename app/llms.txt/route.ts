import { aiGuide } from "@/lib/ai-guide";
export function GET(request: Request) { return new Response(aiGuide(request), { headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
