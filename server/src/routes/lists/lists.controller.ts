import { Request, Response } from "express";
import { parseCSV } from "../../services/parsecsv.js";
import {
  getAllListsForLanguage,
  getOneListByListNumber,
  updateUnlockedReviewModes,
} from "../../models/lists.model.js";
import { SupportedLanguage } from "../../types.js";
import { Types } from "mongoose";

export async function httpPostCSV(req: Request, res: Response) {
  if (req.file?.filename) {
    // Needs proper validation
    const newListId = (await parseCSV({
      filename: req.file.filename,
      author: req.body.author,
      language: req.body.language,
      listName: req.body.listName,
    })) as unknown as Types.ObjectId;

    // Now check whether we can unlock review modes
    await updateUnlockedReviewModes(newListId);
  } else {
    res.json({
      success: false,
      message: "Missing information, could not parse file",
    });
  }
  res.json({ success: true });
}

export async function httpGetOneListByListNumber(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);

  return res.status(200).json(await getOneListByListNumber(listNumber));
}

export async function httpGetAllListsForLanguage(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getAllListsForLanguage(language));
}
