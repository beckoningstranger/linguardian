export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path",
    "/lists/:path",
    "/dictionary/:path*",
    "/social/:path*",
    "/learn/:path*",
    "/languages/:path*",
    "/nativeLanguage/:path*",
  ],
};
