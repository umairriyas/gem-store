import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Normalises category URLs to lowercase.
 *
 * Sanity stores category names capitalised ("Blue-sapphire", "Emerald"), so
 * links were being generated as /Blue-sapphire while the canonical form is
 * /blue-sapphire. This cannot live in next.config.ts redirects because Next's
 * path matching is case-insensitive, which turns a case-only redirect into a
 * loop.
 *
 * MUST live at the project root, next to next.config.ts. Next.js does not
 * read middleware from inside app/.
 */

// Paths middleware must never touch.
const SKIP_PREFIXES = [
  "/_next",
  "/api",
  "/studio",
  "/product", // product slugs are already lowercase and must not be rewritten
];

const SKIP_EXACT = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/og-gemstone.jpg",
  "/twitter-gemstone.jpg",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SKIP_EXACT.has(pathname)) return NextResponse.next();
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Only single-segment paths are category routes: /Blue-sapphire, /Emerald
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return NextResponse.next();

  const segment = segments[0];

  // Anything with a file extension is a static asset.
  if (segment.includes(".")) return NextResponse.next();

  const normalised = segment.toLowerCase();

  // Exact string comparison, so no loop: this only fires when the incoming
  // path genuinely differs from its lowercase form.
  if (segment === normalised) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${normalised}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    // Everything except Next internals, the API, Sanity Studio and static files.
    "/((?!_next/static|_next/image|api|studio|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};