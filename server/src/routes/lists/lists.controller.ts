import { Request, Response } from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { parseCSV } from "../../lib/parsecsv.js";
import { FullyPopulatedList, SupportedLanguage } from "../../lib/types.js";
import {
  addItemToList,
  getAllListsForLanguage,
  getAmountOfUnits,
  getChapterNameByNumber,
  getFullyPopulatedListByListNumber,
  getList,
  getListNameAndUnitOrder,
  getNextListNumber,
  getPopulatedListByListNumber,
  removeItemFromList,
  updateUnlockedReviewModes,
} from "../../models/lists.model.js";
import { getLanguageFeaturesForLanguage } from "../../models/settings.model.js";

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
      return res.status(200).json({
        message: { listNumber: newListNumber, listLanguage: req.body.language },
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: `Unable to parse CSV! ${err}`,
    });
  } finally {
    // Remove uploaded file so things don't clog up
    if (req.file)
      fs.unlink(
        join(__dirname + `/../../../data/csvUploads/${req.file.filename}`),
        () => {
          console.log(`Deleting uploaded file.`);
        }
      );
  }
}

export async function httpGetChapterNameByNumber(req: Request, res: Response) {
  const chapterNumber = parseInt(req.params.chapterNumber);
  const listNumber = parseInt(req.params.listNumber);

  const chapterName = await getChapterNameByNumber(chapterNumber, listNumber);
  if (chapterName) return res.status(200).json(chapterName);
  return res.status(404).json();
}

export async function httpGetFullyPopulatedListByListNumber(
  req: Request,
  res: Response
) {
  const userNative = req.params.userNative as SupportedLanguage;
  const listNumber = parseInt(req.params.listNumber);
  const listData = (await getFullyPopulatedListByListNumber(
    userNative,
    listNumber
  )) as FullyPopulatedList;

  if (listData) {
    return res.status(200).json(listData);
  }
  return res.status(404).json();
}

export async function httpGetPopulatedListByListNumber(
  req: Request,
  res: Response
) {
  const listNumber = parseInt(req.params.listNumber);

  return res.status(200).json(await getPopulatedListByListNumber(listNumber));
}

export async function httpGetList(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);

  return res.status(200).json(await getList(listNumber));
}

export async function httpGetAllListsForLanguage(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getAllListsForLanguage(language));
}

export async function httpGetListName(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);
  const response = await getListNameAndUnitOrder(listNumber);
  if (!response) return res.status(404).json();
  return res.status(200).json(response.name);
}

export async function httpGetListDataForMetadata(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);
  const unitNumber = parseInt(req.params.unitNumber);
  const list = await getList(listNumber);
  if (!list) return res.status(404).json();

  const { name, unitOrder, language, description } = list;
  const languageFeatures = await getLanguageFeaturesForLanguage(language);
  if (!languageFeatures) return res.status(404).json();

  return res.status(200).json({
    listName: name,
    unitName: unitOrder[unitNumber - 1],
    langName: languageFeatures.langName,
    description,
  });
}

export async function httpGetNextListNumber(req: Request, res: Response) {
  const response = await getNextListNumber();
  if (!response) res.status(404).json();
  return res.status(200).json(response);
}

export async function httpGetAmountOfUnits(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);
  const response = await getAmountOfUnits(listNumber);
  if (!response) res.status(404).json();
  return res.status(200).json(response);
}

export async function httpAddItemToList(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);
  const unitName = req.params.unitName;
  const itemId = req.params.itemId;

  try {
    const response = await addItemToList(listNumber, unitName, itemId);
    if (!response) {
      return res.status(409).json({
        message: "Duplicate item",
      });
    }
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Error adding item to list" });
  }
}

export async function httpRemoveItemFromList(req: Request, res: Response) {
  const listNumber = parseInt(req.params.listNumber);
  const itemId = req.params.itemId;
  const response = await removeItemFromList(listNumber, itemId);
  if (!response) res.status(404).json();
  return res.status(200).json(response);
}
