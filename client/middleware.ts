export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/FR/dashboard/:path",
    "/lists/:path",
    "/FR/dictionary/:path*",
    "/social/:path*",
    "/learn/:path*",
    "/languages/:path*",
    "/nativeLanguage/:path*",
  ],
};
