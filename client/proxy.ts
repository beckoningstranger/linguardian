import middleware from "next-auth/middleware";

export const proxy = middleware;

export const config = {
  matcher: [
    "/DE/:path*",
    "/EN/:path*",
    "/CN/:path*",
    "/FR/:path*",
    "/learn/:path*",
    "/lists/:path*",
    "/setNativeLanguage/:path*",
    "/dictionary/:path*",
    "/profile/:path*",
    "/settings/:path",
    "/social/:path*",
    "/welcome",
    "/newLanguage",
  ],
};
