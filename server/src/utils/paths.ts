import { join } from "path";

export const csvUploadPath = (...segments: string[]) =>
  join(process.cwd(), "data", "csvUploads", ...segments);
