// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/login']); // Add '/sign-up' if you create it later

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) {
        // Redirect to custom sign-in page, preserving the return URL
        return redirectToSignIn({ returnBackUrl: req.nextUrl.pathname });
      }
    }
  },
  {
    signInUrl: '/login', // Your custom sign-in path
    // signUpUrl: '/sign-up', // Uncomment and set if you add sign-up
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};