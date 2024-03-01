import express from "express";
import { httpPostCSV } from "./courses.controller.js";
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

export const coursesRouter = express.Router();

coursesRouter.post("/uploadCSV", upload.single("csvfile"), httpPostCSV);
