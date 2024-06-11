import express from "express";
import {
  httpGetAllListsForLanguage,
  httpGetPopulatedListByListNumber,
  httpGetFullyPopulatedListByListNumber,
  httpPostCSV,
  httpGetList,
  httpGetListName,
  httpGetListDataForMetadata,
} from "./lists.controller.js";
import multer from "multer";
import path from "path";

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

listsRouter.post("/uploadCSV", upload.single("csvfile"), httpPostCSV);

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
