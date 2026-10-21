import { diyarResponse } from "@/lib/diyar-html";

export async function GET(request: Request) {
  return diyarResponse("cancellation-policy", "en", request);
}
