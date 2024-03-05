import express from "express";
import {
  httpGetAllListsForLanguage,
  httpGetOnePopulatedListByListNumber,
  httpPostCSV,
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

listsRouter.get("/getAll/:language", httpGetAllListsForLanguage);

listsRouter.get("/get/:listNumber", httpGetOnePopulatedListByListNumber);
