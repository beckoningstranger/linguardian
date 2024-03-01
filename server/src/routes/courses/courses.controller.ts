import { Request, Response } from "express";
import { parseCSV } from "../../services/parsecsv.js";

export async function httpPostCSV(req: Request, res: Response) {
  if (req.file?.filename) await parseCSV(req.file.filename);
  res.json({ success: true });
}
