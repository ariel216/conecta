import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;

  const publicRoutes = ["/login-state"];

  if (!token && !publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(process.env.NEXT_CORE_LOGIN!);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
