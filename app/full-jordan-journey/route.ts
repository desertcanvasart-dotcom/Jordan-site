import { diyarResponse } from "@/lib/diyar-html";

export async function GET(request: Request) {
  return diyarResponse("full-jordan-journey", "en", request);
}
