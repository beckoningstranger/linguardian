import multer from "multer";
import logger from "@/lib/logger";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "data", "csvUploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fieldSize: 512 * 1024 }, // 500 KB
  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
    if (!isCSV) return cb(new Error("Only CSV files are allowed!"));
    cb(null, true);
  },
});

export const csvUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("csvfile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FIELD_VALUE") {
        logger.error("File upload rejected: file too large", { maxSize: "500KB" });
        return res
          .status(400)
          .json({ error: "File too large. Max 500KB allowed." });
      }
      logger.error("CSV upload error", { error: err.message });
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      if (err.message === "Only CSV files are allowed!") {
        logger.error("File upload rejected: invalid file type", { allowedType: "CSV" });
        return res.status(400).json({ error: err.message });
      }

      logger.error("Unexpected error during CSV upload", { error: err.message });
      return res
        .status(500)
        .json({ error: "Unexpected error: " + err.message });
    }

    next();
  });
};
