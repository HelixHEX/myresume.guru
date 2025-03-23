import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
// import { authMiddleware, } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references /nextjs/auth-middleware for more information about configuring your Middleware

const isProtectedRouteClient = createRouteMatcher(["/app(.*)"]);

const postHogMiddleware = (request: NextRequest) => {
  let url = request.nextUrl.clone();
  const hostname = url.pathname.startsWith("/ingest/static/")
    ? "us-assets.i.posthog.com"
    : "us.i.posthog.com";
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("host", hostname);

  url.protocol = "https";
  url.hostname = hostname;
  url.port = "443";
  url.pathname = url.pathname.replace(/^\/ingest/, "");

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  });
};
export default clerkMiddleware((auth, req) => {
  if (isProtectedRouteClient(req) && !req.url.includes("/api/uploadthing"))
    auth.protect();

  // return 
});

// export default clerkMiddleware((auth, req) => {

//   if (isProtectedRouteClient(req) && !req.url.includes("/api/uploadthing"))
//     auth().protect();
// });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
