import { NextResponse } from "next/server";

import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/((?!login).*)", // Match all routes except /login
]);

export default convexAuthNextjsMiddleware((request) => {
  // Check if the requested route is protected and the user is not authenticated
  if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
    // Extract the current URL
    const currentUrl = new URL(request.url);

    // Create a redirect parameter with the current path and query
    const searchParams = new URLSearchParams({
      redirect: currentUrl.pathname + currentUrl.search,
    });

    // Construct the login URL with the redirect parameter if the current path is not root
    const loginRedirectUrl = new URL("/login", request.url);
    if (currentUrl.pathname !== "/") {
      loginRedirectUrl.search = searchParams.toString();
    }

    // Redirect the user to the login page
    return NextResponse.redirect(loginRedirectUrl);
  }

  // If the route is not protected or the user is authenticated, continue to the requested page
  return NextResponse.next();
});

export const config = {
  // The following matcher runs middleware on all routes except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
