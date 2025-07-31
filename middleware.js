import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const PROTECTED_PATHS = ["/", "/qlead-summary", "/qlead-table", "/googleads_qleads", "/banking"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  const isPublicFile = PUBLIC_FILE.test(pathname);
  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Redirect to lock screen if trying to access protected route without token
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/lock-screen";
    return NextResponse.redirect(url);
  }

  // Prevent redirect loop: if already logged in and going to lock-screen, redirect home
  if (pathname === "/lock-screen" && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
