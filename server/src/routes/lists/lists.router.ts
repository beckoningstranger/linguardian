import express from "express";
import multer from "multer";
import path from "path";
import {
  httpAddItemToList,
  httpAddUnitToList,
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
} from "./lists.controller.js";

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

export const listsRouter = express.Router();

listsRouter.post(
  "/createNewList",
  upload.single("csvfile"),
  httpPostCreateNewList
);

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

listsRouter.post(
  "/addItemToList/:listNumber/:unitName/:itemId",
  httpAddItemToList
);

listsRouter.post(
  "/removeItemFromList/:listNumber/:itemId",
  httpRemoveItemFromList
);

listsRouter.post("/addUnitToList/:listNumber/:unitName", httpAddUnitToList);

listsRouter.post(
  "/removeUnitFromList/:listNumber/:unitName",
  httpRemoveUnitFromList
);

listsRouter.post("/removeList/:listNumber", httpRemoveList);
