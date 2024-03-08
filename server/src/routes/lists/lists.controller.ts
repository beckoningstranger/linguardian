import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Request, Response } from "express";

import { parseCSV } from "../../services/parsecsv.js";
import {
  getAllListsForLanguage,
  getOnePopulatedListByListNumber,
  updateUnlockedReviewModes,
  getChapterNameByNumber,
} from "../../models/lists.model.js";
import { PopulatedList, SupportedLanguage } from "../../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function httpPostCSV(req: Request, res: Response) {
  try {
    // Needs proper validation
    if (req.file) {
      const { newListId, newListNumber } = await parseCSV({
        filename: req.file.filename,
        author: req.body.author,
        language: req.body.language,
        listName: req.body.listName,
      });

      // Now check whether we can unlock review modes
      await updateUnlockedReviewModes(newListId);
      res.status(200).json({ message: newListNumber });
    }
  } catch (err) {
    res.status(400).json({
      message: `Unable to parse CSV! ${err}`,
    });
  } finally {
    // Remove uploaded file so things don't clog up
    if (req.file)
      try {
        fs.unlink(
          join(__dirname + `/../../../data/csvUploads/${req.file.filename}`),
          () => {
            console.log(`Deleting uploaded file.`);
          }
        );
      } catch (err) {
        console.error(`Error deleting file ${req.file.filename}`);
      }
  }
}

export async function httpGetChapterNameByNumber(req: Request, res: Response) {
  const chapterNumber = parseInt(req.params.chapterNumber);
  const listNumber = parseInt(req.params.listNumber);

  const chapterName = await getChapterNameByNumber(chapterNumber, listNumber);
  if (chapterName) return res.status(200).json(chapterName);
  return res.status(404).json();
}

export async function httpGetOnePopulatedListByListNumber(
  req: Request,
  res: Response
) {
  const listNumber = parseInt(req.params.listNumber);
  const listData = (await getOnePopulatedListByListNumber(
    listNumber
  )) as PopulatedList;

  if (listData) return res.status(200).json(listData);
  return res.status(404).json();
}

export async function httpGetAllListsForLanguage(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getAllListsForLanguage(language));
}
