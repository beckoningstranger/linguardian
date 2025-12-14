import { join } from "path";

export const csvUploadPath = (...segments: string[]) =>
  join(__dirname, "..", "..", "..", "data", "csvUploads", ...segments);
