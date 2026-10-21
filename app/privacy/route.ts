import { diyarResponse } from "@/lib/diyar-html";

export async function GET(request: Request) {
  return diyarResponse("privacy", "en", request);
}
