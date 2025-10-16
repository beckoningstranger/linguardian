// Reusable Regex Rules
export const regexRules = {
  username: {
    pattern: /^[\p{L}\d_.-]+$/u,
    message:
      "Only letters, numbers, dashes, underscores, and periods are allowed",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "A valid email is e.g. johndoe@email.com",
  },
  usernameSlug: {
    pattern: "",
    message: "",
  },
  sentence: {
    pattern: /^[\p{L}\s!?¿()':.,\-\/]+$/u,
    message: "Only letters, spaces, and !?¿()':.,-/ are allowed",
  },
  ipa: {
    pattern: /^[\p{L}\p{M}\p{S}ˈˌː‿\s]+$/u,
    message: "Only valid IPA characters and spaces are allowed",
  },
  hexString24: {
    pattern: /^[a-fA-F0-9]{24}$/,
    message: "Invalid hex string format",
  },
};
