import { diyarResponse } from "@/lib/diyar-html";

export async function GET(request: Request) {
  return diyarResponse("luxury-desert-dead-sea", "en", request);
}
