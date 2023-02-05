import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@server/core/auth/session"; // must import from main file to edge runtime error
 
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession(request, response, sessionOptions);
  const { user } = session;

  if (user && user.email && user.userUID) {
    return response;
  } else {
    return NextResponse.rewrite(new URL("/api/errors/401", request.url));
  }
}

export const config = {
  matcher: [
    "/api/dashboard/:function*",
    "/api/investments/:function*",
    "/api/predictions/:function*",
    "/api/preferences/:function*",
    "/api/transactions/:function*",
    "/api/user",
  ],
};
