export default function convertCodeToLanguageName(code: string): string {
  switch (code) {
    case "FR":
      return "French";
    case "EN":
      return "English";
    case "DE":
      return "German";
    case "CN":
      return "Chinese";
    case "SE":
      return "Swedish";
    default:
      return "";
  }
}
