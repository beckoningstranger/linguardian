import express from "express";
import multer from "multer";
import path from "path";
import {
  httpAddItemToList,
  httpAddUnitToList,
  httpEditListDetails,
  httpGetAllListsForLanguage,
  httpGetAmountOfUnits,
  httpGetFullyPopulatedListByListNumber,
  httpGetList,
  httpGetListDataForMetadata,
  httpGetListName,
  httpGetNextListNumber,
  httpGetPopulatedListByListNumber,
  httpPostCreateNewList,
  httpRemoveItemFromList,
  httpRemoveList,
  httpRemoveUnitFromList,
} from "./lists.controller";

export const listsRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/csvUploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// GET

listsRouter.get("/getAllLists/:language", httpGetAllListsForLanguage);

listsRouter.get("/getList/:listNumber", httpGetList);

listsRouter.get(
  "/getPopulatedList/:listNumber",
  httpGetPopulatedListByListNumber
);

listsRouter.get(
  "/getFullyPopulatedList/:userNative/:listNumber",
  httpGetFullyPopulatedListByListNumber
);
listsRouter.get("/getListName/:listNumber", httpGetListName);

listsRouter.get(
  "/getListDataForMetadata/:listNumber/:unitNumber",
  httpGetListDataForMetadata
);

listsRouter.get("/nextListNumber", httpGetNextListNumber);

listsRouter.get("/amountOfUnits/:listNumber", httpGetAmountOfUnits);

// POST

listsRouter.post(
  "/createNewList",
  upload.single("csvfile"),
  httpPostCreateNewList
);

listsRouter.post("/addUnitToList/:listNumber/:unitName", httpAddUnitToList);

listsRouter.post("/editListDetails", httpEditListDetails);

listsRouter.post(
  "/addItemToList/:listNumber/:unitName/:itemId",
  httpAddItemToList
);

// DELETE

listsRouter.delete(
  "/removeItemFromList/:listNumber/:itemId",
  httpRemoveItemFromList
);

listsRouter.delete(
  "/removeUnitFromList/:listNumber/:unitName",
  httpRemoveUnitFromList
);

listsRouter.delete("/removeList/:listNumber", httpRemoveList);
