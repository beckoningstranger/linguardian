export { default } from "next-auth/middleware";

// const reg = new RegExp("^[A-Z]{2}$");
// Not sure how to use regex expression in the matcher array yet...
// The above is supposed to cover all string with exactly 2 uppercase letters.

export const config = {
  matcher: [
    // "/" + reg + "/:path*",
    "/DE/:path*",
    "/EN/:path*",
    "/CN/:path*",
    "/FR/:path*",
    "/learn/:path*",
    "/lists/:path*",
    "/setNativeLanguage/:path*",
    "/dictionary/:path*",
    "/profile/:path*",
    "/social/:path*",
    "/welcome",
    "/newLanguage",
  ],
};
