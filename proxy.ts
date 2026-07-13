import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(firstSegment) ? firstSegment : defaultLocale;
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-site-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
