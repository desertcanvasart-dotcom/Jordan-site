import { diyarResponse } from "@/lib/diyar-html";

export async function GET(request: Request) {
  return diyarResponse("about-trust", "en", request);
}
