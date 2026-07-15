import { diyarResponse } from "@/lib/diyar-html";

export async function GET() {
  return diyarResponse("cancellation-policy");
}
