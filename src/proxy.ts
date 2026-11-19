import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import source from "./data/legacy.json";
const intl = createMiddleware(routing);
export default function proxy(request: NextRequest) {
  const routes = source as Record<string, string>;
  const path = decodeURIComponent(request.nextUrl.pathname);
  // Next 16 may revisit Proxy after an internal locale rewrite.
  const internalLocale = request.headers.get("x-next-intl-locale");
  if (
    internalLocale &&
    (path === `/${internalLocale}` || path.startsWith(`/${internalLocale}/`))
  )
    return NextResponse.next();
  const target = routes[path] || routes[path.toLowerCase()];
  if (typeof target === "string" && target !== path) {
    const url = new URL(target, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    return NextResponse.redirect(url, 308);
  }
  if (path !== "/" && path.endsWith("/")) {
    const url = new URL(request.url);
    url.pathname = path.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }
  return intl(request);
}
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|images|fonts|favicon|.*\\.(?:webp|svg|png|jpg|ico|xml|txt|woff2)$).*)",
  ],
};
